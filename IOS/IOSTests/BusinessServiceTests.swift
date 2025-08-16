import XCTest
@testable import IOS

final class BusinessServiceTests: XCTestCase {
    func testGetAllBusinessesSuccess() async throws {
        let dto = BusinessDTO(
            id: "1",
            name: "T",
            description: nil,
            priceRange: nil,
            avgRating: 4.0,
            address: nil,
            tags: [],
            promotions: [],
            photos: nil,
            distance: nil
        )
        let mock = MockAPIClient()
        mock.result = [dto]
        let service = BusinessService(api: mock)
        let businesses = try await service.getAllBusinesses()
        XCTAssertEqual(businesses.count, 1)
        XCTAssertEqual(businesses.first?.id, "1")
    }

    func testGetAllBusinessesFailure() async {
        let mock = MockAPIClient()
        mock.error = APIError.serverError
        let service = BusinessService(api: mock)
        await XCTAssertThrowsError(try await service.getAllBusinesses()) { error in
            XCTAssertEqual(error as? APIError, .serverError)
        }
    }
}
