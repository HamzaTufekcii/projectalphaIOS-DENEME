import XCTest
@testable import IOS

final class ListServiceTests: XCTestCase {
    private func makeClient(statusCode: Int = 200, body: String) -> APIClient {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: config)
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: statusCode, httpVersion: nil, headerFields: nil)!
            return (response, Data(body.utf8))
        }
        return APIClient(baseURL: URL(string: "https://example.com")!, session: session)
    }

    func testGetUserListsSuccess() async throws {
        let json = """
        [{"id":"1","name":"Favorites","is_favorite":true,"is_public":true,"like_counter":0}]
        """
        let service = ListService(api: makeClient(body: json))
        let lists = try await service.getUserLists(userId: "u1")
        XCTAssertEqual(lists.count, 1)
        XCTAssertEqual(lists.first?.id, "1")
    }

    func testGetUserListsFailure() async {
        let json = """
        {"message":"forbidden"}
        """
        let service = ListService(api: makeClient(statusCode: 403, body: json))
        await XCTAssertThrowsError(try await service.getUserLists(userId: "u1")) { error in
            XCTAssertEqual(error as? APIError, .forbidden)
        }
    }
}
