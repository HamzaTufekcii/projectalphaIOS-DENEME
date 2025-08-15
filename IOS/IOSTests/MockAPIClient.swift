import Foundation
@testable import IOS

final class MockAPIClient: APIClientProtocol {
    var result: Any?
    var error: Error?
    var message: String?

    func setAuthData(_ data: AuthData?) {}

    func request<T: Decodable>(_ path: String, method: String = "GET", body: Data? = nil) async throws -> T {
        if let error { throw error }
        if let result = result as? T {
            return result
        }
        throw APIError.unknown(statusCode: 0, message: nil)
    }
}
