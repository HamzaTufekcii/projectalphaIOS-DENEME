import XCTest
@testable import IOS

final class AuthServiceTests: XCTestCase {
    private let storage = SecureStorage.shared

    override func tearDown() {
        storage.delete(key: "userId")
        storage.delete(key: "access_token")
        storage.delete(key: "refresh_token")
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

    func testLoginStoresAuthData() async throws {
        let json = """
        {"access_token":"abc","refresh_token":"def","user":{"id":"u1"}}
        """
        let service = AuthService(api: makeClient(body: json), storage: storage)
        let auth = try await service.login(email: "e", password: "p", role: "user")
        XCTAssertEqual(auth.accessToken, "abc")

        let saved = service.getAuthData()
        XCTAssertEqual(saved?.accessToken, "abc")
        XCTAssertEqual(saved?.refreshToken, "def")
        XCTAssertEqual(saved?.user?.id, "u1")
    }

    func testLoginFailureDoesNotStoreAuthData() async {
        let json = """
        {"message":"not found"}
        """
        let service = AuthService(api: makeClient(statusCode: 404, body: json), storage: storage)
        await XCTAssertThrowsError(try await service.login(email: "e", password: "p", role: "user")) { error in
            XCTAssertEqual(error as? APIError, .notFound)
        }
        XCTAssertNil(service.getAuthData())
    }

    func testSaveAuthDataStoresTokens() {
        let service = AuthService(api: makeClient(body: "{}"), storage: storage)
        let auth = AuthData(accessToken: "a", refreshToken: "r", user: User(id: "u1", email: nil, emailConfirmedAt: nil, appMetadata: nil))
        service.saveAuthData(auth)
        let saved = service.getAuthData()
        XCTAssertEqual(saved?.accessToken, "a")
        XCTAssertEqual(saved?.refreshToken, "r")
        XCTAssertEqual(saved?.user?.id, "u1")
    }
}
