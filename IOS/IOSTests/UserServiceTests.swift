import XCTest
@testable import IOS

final class UserServiceTests: XCTestCase {
    func testGetUserDataSuccess() async throws {
        let profile = UserProfile(id: "1", name: "Test", email: nil, surname: nil, phoneNumber: nil)
        let mock = MockAPIClient()
        mock.result = profile
        let service = UserService(api: mock)
        let result = try await service.getUserData(userId: "1")
        XCTAssertEqual(result.id, "1")
    }

    func testGetUserDataFailure() async {
        let mock = MockAPIClient()
        mock.error = APIError.unauthorized
        let service = UserService(api: mock)
        await XCTAssertThrowsError(try await service.getUserData(userId: "1")) { error in
            XCTAssertEqual(error as? APIError, .unauthorized)
        }
    }
}
