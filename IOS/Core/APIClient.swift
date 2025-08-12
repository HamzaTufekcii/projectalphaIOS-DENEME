import Foundation

enum APIClientError: Error {
    case insecureURL
}

/// Simple API client used by feature services to perform network calls.
final class APIClient {
    static let shared = APIClient()
    private let baseURL: URL
    private let session: URLSession
    private var authData: AuthData?

    init(baseURL: URL = URL(string: "https://example.com/api")!,
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
                               body: Data? = nil,
                               retrying: Bool = false) async throws -> T {
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
            return try JSONDecoder().decode(T.self, from: data)
        case 401 where !retrying && authData?.refreshToken != nil:
            try await refreshAccessToken()
            return try await request(path, method: method, body: body, retrying: true)
        default:
            throw APIError.from(statusCode: http.statusCode, data: data)
        }
    }

    /// Requests a new access token using the stored refresh token.
    private func refreshAccessToken() async throws {
        guard let refreshToken = authData?.refreshToken else {
            throw APIError.unauthorized
        }

        var request = URLRequest(url: baseURL.appendingPathComponent("auth/refresh"))
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["refreshToken": refreshToken])

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse,
              (200..<300).contains(http.statusCode) else {
            throw APIError.unauthorized
        }

        let newAuth = try JSONDecoder().decode(AuthData.self, from: data)
        self.authData = newAuth
    }
}

