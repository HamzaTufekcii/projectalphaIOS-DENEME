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
}
