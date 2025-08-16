import Foundation

/// URLSessionDelegate that allows self-signed certificates for development
private class DevelopmentURLSessionDelegate: NSObject, URLSessionDelegate {
    func urlSession(_ session: URLSession, 
                   didReceive challenge: URLAuthenticationChallenge,
                   completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        print("🔒 SSL Challenge received for host: \(challenge.protectionSpace.host)")
        print("🔒 Authentication method: \(challenge.protectionSpace.authenticationMethod)")
        
        // WARNING: This bypasses SSL certificate validation - only use in development!
        #if DEBUG
        if challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust {
            if let serverTrust = challenge.protectionSpace.serverTrust {
                print("🔒 Accepting self-signed certificate for development")
                let credential = URLCredential(trust: serverTrust)
                completionHandler(.useCredential, credential)
                return
            }
        }
        #endif
        print("🔒 Using default SSL handling")
        completionHandler(.performDefaultHandling, nil)
    }
}

protocol APIClientProtocol {
    var message: String? { get }
    func setAuthData(_ data: AuthData?)
    func request<T: Codable>(_ path: String,
                               method: String,
                               body: Data?,
                               useCache: Bool,
                               cacheTTL: TimeInterval?) async throws -> T
    func request<T: Codable>(_ path: String) async throws -> T
}

enum APIClientError: Error {
    case insecureURL
}

/// Simple API client used by feature services to perform network calls.
final class APIClient: APIClientProtocol, @unchecked Sendable {
    static let shared = APIClient()
    private let baseURL: URL
    private let session: URLSession
    private var authData: AuthData?
    private(set) var message: String?

    init(baseURL: URL = AppConfiguration.apiBaseURL,
         session: URLSession = APIClient.createDevelopmentSession()) {
        self.baseURL = baseURL
        self.session = session
    }
    
    /// Creates a URLSession that allows self-signed certificates for development
    private static func createDevelopmentSession() -> URLSession {
        let delegate = DevelopmentURLSessionDelegate()
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        print("🔧 Creating development URLSession with SSL bypass delegate")
        return URLSession(configuration: configuration, delegate: delegate, delegateQueue: nil)
    }

    /// Updates tokens used for authenticated requests.
    func setAuthData(_ data: AuthData?) {
        self.authData = data
    }

    /// Performs a request for the given path and HTTP method.
    func request<T: Codable>(_ path: String,
                               method: String = "GET",
                               body: Data? = nil,
                               useCache: Bool = true,
                               cacheTTL: TimeInterval? = nil) async throws -> T {
        message = nil
        
        // Generate cache key for GET requests
        let cacheKey = ResponseCache.key(for: path)
        
        // Try cache first for GET requests
        if method == "GET" && useCache {
            if let cachedData: T = ResponseCache.shared.get(cacheKey, type: T.self) {
                print("📦 Using cached response for: \(path)")
                return cachedData
            }
        }
        
        // Handle URLs with query parameters correctly
        let url: URL
        if path.contains("?") {
            // For paths with query parameters, construct URL manually
            url = URL(string: "\(baseURL.absoluteString)/\(path)")!
        } else {
            // For simple paths, use appendingPathComponent
            url = baseURL.appendingPathComponent(path)
        }
        var request = URLRequest(url: url)
        request.httpMethod = method

        // Debug logging
        print("🌐 API Request: \(method) \(url)")
        
        if let body = body {
            request.httpBody = body
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            if let bodyString = String(data: body, encoding: .utf8) {
                print("📤 Request Body: \(bodyString)")
            }
        }

        let result: T = try await performRequest(request)
        
        // Cache successful GET responses
        if method == "GET" && useCache {
            ResponseCache.shared.set(cacheKey, value: result, memoryTTL: cacheTTL)
            print("💾 Cached response for: \(path)")
        }
        
        return result
    }
    
    /// Convenience method for GET requests without method and body parameters.
    func request<T: Codable>(_ path: String) async throws -> T {
        return try await request(path, method: "GET", body: nil, useCache: true, cacheTTL: nil)
    }

    /// Executes the URLRequest and decodes the response into either `T`
    /// directly or a `GenericResponse<T>` wrapper.
    private func performRequest<T: Codable>(_ request: URLRequest,
                                              includeToken: Bool = true,
                                              allowRefresh: Bool = true) async throws -> T {
        guard request.url?.scheme?.lowercased() == "https" else {
            throw APIClientError.insecureURL
        }

        var request = request
        if includeToken, let token = authData?.accessToken {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw APIError.unknown(statusCode: 0, message: nil)
        }

        // Debug logging
        print("📥 API Response: \(http.statusCode) from \(request.url?.absoluteString ?? "unknown")")
        if let responseString = String(data: data, encoding: .utf8) {
            print("📄 Response Body: \(responseString)")
        }

        switch http.statusCode {
        case 200..<300:
            if data.isEmpty {
                if T.self == EmptyResponse.self {
                    return EmptyResponse() as! T
                } else {
                    throw APIError.unknown(statusCode: http.statusCode, message: nil)
                }
            }

            let decoder = JSONDecoder()
            
            // Önce direct decode dene
            if let direct = try? decoder.decode(T.self, from: data) {
                print("🔍 Direct decode successful for type: \(T.self)")
                return direct
            }
            
            print("🔍 Direct decode failed, trying GenericResponse for type: \(T.self)")
            
            // GenericResponse ile decode dene
            do {
                let wrapped = try decoder.decode(GenericResponse<T>.self, from: data)
                print("🔍 GenericResponse decode successful, success: \(wrapped.success)")
                message = wrapped.message
                guard wrapped.success else {
                    throw APIError.badRequest(wrapped.message)
                }

                if let payload = wrapped.data {
                    print("🔍 GenericResponse payload found, type: \(type(of: payload))")
                    return payload
                }
            } catch {
                print("🔍 GenericResponse decode failed: \(error)")
                throw error
            }

            if T.self == EmptyResponse.self {
                return EmptyResponse() as! T
            }

            throw APIError.unknown(statusCode: http.statusCode, message: "JSON decode failed")

        case 401:
            if allowRefresh, await refreshTokens() {
                return try await performRequest(request, includeToken: includeToken, allowRefresh: false)
            }
            throw APIError.unauthorized

        default:
            throw APIError.from(statusCode: http.statusCode, data: data)
        }
    }

    /// Attempts to refresh the authentication tokens using the stored refresh token.
    private func refreshTokens() async -> Bool {
        guard let refresh = authData?.refreshToken else { return false }
        let url = baseURL.appendingPathComponent("api/auth/refresh")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = try? JSONEncoder().encode(["refresh_token": refresh])
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            let newAuth: AuthData = try await performRequest(request,
                                                             includeToken: false,
                                                             allowRefresh: false)
            setAuthData(newAuth)
            return true
        } catch {
            return false
        }
    }
}

