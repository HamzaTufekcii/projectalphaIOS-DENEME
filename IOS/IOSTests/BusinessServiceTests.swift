import XCTest
@testable import IOS

final class BusinessServiceTests: XCTestCase {
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

    func testGetAllBusinessesSuccess() async throws {
        let json = """
        [{"id":"1","name":"T","description":null,"priceRange":null,"avgRating":4.0,"address":null,"tags":[],"promotions":[],"photos":null,"distance":null}]
        """
        let service = BusinessService(api: makeClient(body: json))
        let businesses = try await service.getAllBusinesses()
        XCTAssertEqual(businesses.count, 1)
        XCTAssertEqual(businesses.first?.id, "1")
    }

    func testGetAllBusinessesFailure() async {
        let json = """
        {"message":"error"}
        """
        let service = BusinessService(api: makeClient(statusCode: 500, body: json))
        await XCTAssertThrowsError(try await service.getAllBusinesses()) { error in
            XCTAssertEqual(error as? APIError, .serverError)
        }
    }
}
