import XCTest
@testable import IOS

final class AuthServiceTests: XCTestCase {
    override func setUp() {
        super.setUp()
        URLProtocol.registerClass(MockURLProtocol.self)
    }

    override func tearDown() {
        URLProtocol.unregisterClass(MockURLProtocol.self)
        MockURLProtocol.requestHandler = nil
        super.tearDown()
    }

    func testLoginParsesAuthData() async throws {
        MockURLProtocol.requestHandler = { request in
            XCTAssertEqual(request.url?.path, "/api/auth/login")
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            let json = "{" +
                "\"access_token\":\"abc\"," +
                "\"refresh_token\":\"def\"," +
                "\"user\":{\"id\":\"1\",\"email\":\"test@example.com\",\"app_metadata\":{\"role\":\"user\"}}}" 
            let data = Data(json.utf8)
            return (response, data)
        }
        let service = AuthService()
        let auth = try await service.login(email: "test@example.com", password: "secret", role: "user")
        XCTAssertEqual(auth.accessToken, "abc")
        XCTAssertEqual(auth.refreshToken, "def")
        XCTAssertEqual(auth.user?.id, "1")
    }

    func testVerifyCodeParsesVerificationResponse() async throws {
        MockURLProtocol.requestHandler = { request in
            XCTAssertEqual(request.url?.path, "/api/auth/verify-verification-code")
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            let json = "{" +
                "\"token\":\"abc\"," +
                "\"userId\":\"1\"}"
            let data = Data(json.utf8)
            return (response, data)
        }
        let service = AuthService()
        let verification = try await service.verifyCode(email: "test@example.com", token: "123456")
        XCTAssertEqual(verification.token, "abc")
        XCTAssertEqual(verification.userId, "1")
    }
}
