import XCTest
@testable import IOS

final class RestaurantDetailViewModelTests: XCTestCase {
    private func makeService(statusCode: Int = 200, body: String) -> BusinessService {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: config)
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: statusCode, httpVersion: nil, headerFields: nil)!
            return (response, Data(body.utf8))
        }
        let api = APIClient(baseURL: URL(string: "https://example.com")!, session: session)
        return BusinessService(api: api)
    }

    func testFetchBusinessSuccess() async throws {
        let json = """
        {"id":"r1","name":"R1","description":"","price_range":"$","avg_rating":4.5}
        """
        let vm = RestaurantDetailViewModel(service: makeService(body: json))
        await vm.fetchBusiness(id: "r1")
        XCTAssertEqual(vm.selectedBusiness?.id, "r1")
        XCTAssertNil(vm.toast)
    }

    func testFetchBusinessFailure() async {
        let json = """
        {"message":"error"}
        """
        let vm = RestaurantDetailViewModel(service: makeService(statusCode: 500, body: json))
        await vm.fetchBusiness(id: "r1")
        XCTAssertNil(vm.selectedBusiness)
        XCTAssertNotNil(vm.toast)
    }

    func testFetchPromotionsSuccess() async throws {
        let json = """
        [{"id":"p1","title":"Promo","description":null,"start_date":null,"end_date":null,"amount":10,"active":true,"created_at":null,"business_id":null}]
        """
        let vm = RestaurantDetailViewModel(service: makeService(body: json))
        await vm.fetchPromotions(businessId: "r1")
        XCTAssertEqual(vm.promotions.first?.id, "p1")
        XCTAssertNil(vm.toast)
    }

    func testFetchPromotionsFailure() async {
        let json = """
        {"message":"fail"}
        """
        let vm = RestaurantDetailViewModel(service: makeService(statusCode: 404, body: json))
        await vm.fetchPromotions(businessId: "r1")
        XCTAssertTrue(vm.promotions.isEmpty)
        XCTAssertNotNil(vm.toast)
    }
}

