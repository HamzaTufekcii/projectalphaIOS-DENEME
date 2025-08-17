import XCTest
@testable import IOS

final class HomeAuthIntegrationTests: XCTestCase {
    override func setUp() {
        super.setUp()
        URLProtocol.registerClass(MockURLProtocol.self)
    }

    override func tearDown() {
        URLProtocol.unregisterClass(MockURLProtocol.self)
        super.tearDown()
    }

    func testLoginListFavoriteFlow() async throws {
        var favoritesCalls = 0
        MockURLProtocol.requestHandler = { request in
            let url = request.url!
            let path = url.path
            let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: nil, headerFields: nil)!
            switch path {
            case "/api/auth/login":
                let body = """
                {"success":true,"access_token":"tok","refresh_token":"ref","user":{"id":"u1"}}
                """
                return (response, Data(body.utf8))
            case "/api/users/diner_user/u1/profile":
                let body = """
                {"profile":{"id":"u1","name":"Test","email":null,"surname":null,"phone_numb":null},"dinerLists":[{"id":"fav1","name":"Favorilerim","is_favorite":true,"is_public":true,"like_counter":0}]}
                """
                return (response, Data(body.utf8))
            case "/api/business":
                let body = """
                [{"id":"r1","name":"R1","description":"","price_range":"$","avg_rating":4.5}]
                """
                return (response, Data(body.utf8))
            case "/api/users/diner_user/u1/lists/fav1/items":
                if request.httpMethod == "GET" {
                    favoritesCalls += 1
                    if favoritesCalls == 1 {
                        return (response, Data("[]".utf8))
                    } else {
                        let body = """
                        [{"id":"r1","name":"R1","description":"","price_range":"$","avg_rating":4.5}]
                        """
                        return (response, Data(body.utf8))
                    }
                } else {
                    return (response, Data("{}".utf8))
                }
            default:
                return (response, Data("{}".utf8))
            }
        }

        let appVM = AppViewModel()
        let authVM = AuthViewModel(appViewModel: appVM)
        authVM.email = "test@example.com"
        authVM.password = "pass"

        await authVM.login()
        XCTAssertTrue(authVM.isAuthenticated)

        let homeVM = HomeViewModel()
        await homeVM.search()
        XCTAssertEqual(homeVM.searchResults.count, 1)

        await homeVM.toggleFavorite("r1")
        await homeVM.refreshFavorites()
        XCTAssertTrue(homeVM.favoriteIds.contains("r1"))
    }
}

