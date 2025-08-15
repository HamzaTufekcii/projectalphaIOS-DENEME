import XCTest
@testable import IOS

final class ListServiceTests: XCTestCase {
    func testGetUserListsSuccess() async throws {
        let mock = MockAPIClient()
        mock.result = [UserList(id: "1", name: "Favorites", isFavorite: nil, isPublic: true, likeCount: 0)]
        let service = ListService(api: mock)
        let lists = try await service.getUserLists(userId: "u1")
        XCTAssertEqual(lists.count, 1)
        XCTAssertEqual(lists.first?.id, "1")
    }

    func testGetUserListsFailure() async {
        let mock = MockAPIClient()
        mock.error = APIError.forbidden
        let service = ListService(api: mock)
        await XCTAssertThrowsError(try await service.getUserLists(userId: "u1")) { error in
            XCTAssertEqual(error as? APIError, .forbidden)
        }
    }
}
