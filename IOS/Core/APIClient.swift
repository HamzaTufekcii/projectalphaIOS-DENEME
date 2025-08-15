import Foundation

protocol APIClientProtocol {
    var message: String? { get }
    func setAuthData(_ data: AuthData?)
    func request<T: Decodable>(_ path: String,
                               method: String,
                               body: Data?) async throws -> T
}

enum APIClientError: Error {
    case insecureURL
}

/// Simple API client used by feature services to perform network calls.
final class APIClient: APIClientProtocol {
    static let shared = APIClient()
    private let baseURL: URL
    private let session: URLSession
    private var authData: AuthData?
    private(set) var message: String?

    init(baseURL: URL = AppConfiguration.apiBaseURL,
         session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    /// Updates tokens used for authenticated requests.
    func setAuthData(_ data: AuthData?) {
        self.authData = data
    }

    /// Performs a request for the given path and HTTP method.
    func request<T: Decodable>(_ path: String,
                               method: String = "GET",
                               body: Data? = nil) async throws -> T {
        message = nil
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = method

        if let body = body {
            request.httpBody = body
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        }

        return try await performRequest(request)
    }

    /// Executes the URLRequest and decodes the response into either `T`
    /// directly or a `GenericResponse<T>` wrapper.
    private func performRequest<T: Decodable>(_ request: URLRequest,
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
            if let direct = try? decoder.decode(T.self, from: data) {
                return direct
            }

            let wrapped = try decoder.decode(GenericResponse<T>.self, from: data)
            message = wrapped.message
            guard wrapped.success else {
                throw APIError.badRequest(wrapped.message)
            }

            if let payload = wrapped.data {
                return payload
            }

            if T.self == EmptyResponse.self {
                return EmptyResponse() as! T
            }

            throw APIError.unknown(statusCode: http.statusCode, message: wrapped.message)

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
        var url = baseURL.appendingPathComponent("api/auth/refresh")
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

