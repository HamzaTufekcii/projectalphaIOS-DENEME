import Foundation

/// Represents errors returned from the server based on HTTP status codes.
public enum APIError: Error, Equatable {
    case badRequest(String?)
    case unauthorized
    case forbidden
    case notFound
    case serverError
    case unknown(statusCode: Int, message: String?)
}

extension APIError {
    /// Creates an `APIError` from an HTTP status code and optional data.
    static func from(statusCode: Int, data: Data?) -> APIError {
        let message = data.flatMap { try? JSONDecoder().decode(ErrorMessage.self, from: $0).message }
        switch statusCode {
        case 400: return .badRequest(message)
        case 401: return .unauthorized
        case 403: return .forbidden
        case 404: return .notFound
        case 500...599: return .serverError
        default: return .unknown(statusCode: statusCode, message: message)
        }
    }
}

private struct ErrorMessage: Decodable {
    let message: String?
}
