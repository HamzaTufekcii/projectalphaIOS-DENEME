import XCTest
@testable import IOS

final class AuthServiceTests: XCTestCase {
    func testLoginSuccess() async throws {
        let mock = MockAPIClient()
        mock.result = AuthData(accessToken: "abc", refreshToken: "def")
        let service = AuthService(api: mock)
        let auth = try await service.login(email: "e", password: "p", role: "user")
        XCTAssertEqual(auth.accessToken, "abc")
    }

    func testLoginFailure() async {
        let mock = MockAPIClient()
        mock.error = APIError.notFound
        let service = AuthService(api: mock)
        await XCTAssertThrowsError(try await service.login(email: "e", password: "p", role: "user")) { error in
            XCTAssertEqual(error as? APIError, .notFound)
        }
    }
}
