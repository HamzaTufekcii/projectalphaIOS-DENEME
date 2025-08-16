import XCTest
@testable import IOS

final class UserServiceTests: XCTestCase {
    private let storage = SecureStorage.shared

    override func tearDown() {
        storage.delete(key: "userId")
        storage.delete(key: "authToken")
        super.tearDown()
    }

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

    func testGetUserDataSuccess() async throws {
        let json = """
        {"id":"1","name":"Test","email":null,"surname":null,"phone_numb":null}
        """
        let service = UserService(api: makeClient(body: json), storage: storage)
        let result = try await service.getUserData(userId: "1")
        XCTAssertEqual(result.id, "1")
    }

    func testGetUserDataFailure() async {
        let json = """
        {"message":"unauthorized"}
        """
        let service = UserService(api: makeClient(statusCode: 401, body: json), storage: storage)
        await XCTAssertThrowsError(try await service.getUserData(userId: "1")) { error in
            XCTAssertEqual(error as? APIError, .unauthorized)
        }
    }

    func testSaveAndFetchUserData() {
        let service = UserService(api: makeClient(body: "{}"), storage: storage)
        let data = UserData(userId: "u1", token: "tok")
        service.saveUserData(data)
        let fetched = service.fetchUserData()
        XCTAssertEqual(fetched?.userId, "u1")
        XCTAssertEqual(fetched?.token, "tok")
    }
}
