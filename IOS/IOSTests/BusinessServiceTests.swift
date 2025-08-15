import XCTest
@testable import IOS

final class BusinessServiceTests: XCTestCase {
    override func setUp() {
        super.setUp()
        URLProtocol.registerClass(MockURLProtocol.self)
    }

    override func tearDown() {
        URLProtocol.unregisterClass(MockURLProtocol.self)
        MockURLProtocol.requestHandler = nil
        super.tearDown()
    }

    func testGetAllBusinessesReturnsData() async throws {
        MockURLProtocol.requestHandler = { request in
            XCTAssertEqual(request.url?.path, "/api/business")
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            let data = Data("[{\"id\":\"1\",\"name\":\"Test\",\"description\":null,\"priceRange\":null,\"avgRating\":4.5,\"address\":null,\"tags\":[],\"promotions\":[]}]".utf8)
            return (response, data)
        }
        let service = BusinessService()
        let businesses = try await service.getAllBusinesses()
        XCTAssertEqual(businesses.count, 1)
        XCTAssertEqual(businesses.first?.id, "1")
        XCTAssertEqual(businesses.first?.name, "Test")
    }
}
