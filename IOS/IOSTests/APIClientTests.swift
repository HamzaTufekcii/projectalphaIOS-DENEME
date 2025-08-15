import XCTest
@testable import IOS

private struct EmptyResponse: Decodable {}

final class APIClientTests: XCTestCase {
    func testRequestToInsecureURLThrows() async {
        let client = APIClient(baseURL: URL(string: "http://example.com/api")!)
        await XCTAssertThrowsError(try await client.request("test") as EmptyResponse) { error in
            XCTAssertEqual(error as? APIClientError, .insecureURL)
        }
    }

    func testNotFoundReturnsAPIError() async {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: config)
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 404, httpVersion: nil, headerFields: nil)!
            return (response, Data("{\"message\":\"not found\"}".utf8))
        }

        let client = APIClient(baseURL: URL(string: "https://example.com/api")!, session: session)
        await XCTAssertThrowsError(try await client.request("missing") as EmptyResponse) { error in
            XCTAssertEqual(error as? APIError, .notFound)
        }
    }

    func testDecodesWrappedResponse() async throws {
        struct Sample: Decodable { let value: String }

        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: config)
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            let body = "{""success"":true,""data"":{""value"":""test""}}"
            return (response, Data(body.utf8))
        }

        let client = APIClient(baseURL: URL(string: "https://example.com/api")!, session: session)
        let sample: Sample = try await client.request("wrapped")
        XCTAssertEqual(sample.value, "test")
    }

    func testEmptyBodyReturnsEmptyResponse() async throws {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: config)
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            return (response, Data())
        }

        let client = APIClient(baseURL: URL(string: "https://example.com/api")!, session: session)
        _ = try await client.request("empty") as EmptyResponse
    }

    func testWrappedFailureThrowsAPIError() async {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: config)
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            let body = "{""success"":false,""message"":""bad""}"
            return (response, Data(body.utf8))
        }

        let client = APIClient(baseURL: URL(string: "https://example.com/api")!, session: session)
        await XCTAssertThrowsError(try await client.request("fail") as EmptyResponse) { error in
            XCTAssertEqual(error as? APIError, .badRequest("bad"))
        }
    }
}
