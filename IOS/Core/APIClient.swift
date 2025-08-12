import Foundation

enum APIClientError: Error {
    case insecureURL
}

/// Simple API client used by feature services to perform network calls.
final class APIClient {
    static let shared = APIClient()
    private let baseURL: URL
    private let session: URLSession

    init(baseURL: URL = URL(string: "https://example.com/api")!,
         session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    /// Performs a request and decodes the response into the expected type.
    func request<T: Decodable>(_ path: String,
                               method: String = "GET",
                               body: Data? = nil) async throws -> T {
        let url = baseURL.appendingPathComponent(path)
        guard url.scheme?.lowercased() == "https" else {
            throw APIClientError.insecureURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method

        if let body = body {
            request.httpBody = body
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        }

        let (data, _) = try await session.data(for: request)
        return try JSONDecoder().decode(T.self, from: data)
    }
}

