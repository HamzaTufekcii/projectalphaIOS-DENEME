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
}

/// Simple URLProtocol to mock network responses in tests.
private final class MockURLProtocol: URLProtocol {
    static var requestHandler: ((URLRequest) -> (HTTPURLResponse, Data))?

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

    override func startLoading() {
        guard let handler = MockURLProtocol.requestHandler else {
            client?.urlProtocol(self, didFailWithError: URLError(.badServerResponse))
            return
        }
        let (response, data) = handler(request)
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: data)
        client?.urlProtocolDidFinishLoading(self)
    }

    override func stopLoading() {}
}
