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

    /// Performs a request and decodes the response into the expected type.
    func request<T: Decodable>(_ path: String,
                               method: String = "GET",
                               body: Data? = nil) async throws -> T {
        message = nil
        let url = baseURL.appendingPathComponent(path)
        guard url.scheme?.lowercased() == "https" else {
            throw APIClientError.insecureURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method

        if let token = authData?.accessToken {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body = body {
            request.httpBody = body
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
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
            throw APIError.unauthorized
        default:
            throw APIError.from(statusCode: http.statusCode, data: data)
        }
    }

    // TODO: When a refresh endpoint becomes available, coordinate with the
    // backend team to determine the proper path and request body before
    // reintroducing refresh logic.
}

