import Foundation

/// Service handling list operations through the API client.
final class ListService {
    private let api: APIClientProtocol
    private let userService: UserService

    init(api: APIClientProtocol = APIClient.shared, userService: UserService = UserService()) {
        self.api = api
        self.userService = userService
    }

    private let base = "api/users/diner_user"

    func addToList(userId: String, listId: String, itemId: String) async throws -> EmptyResponse {
        let path = "\(base)/\(userId)/lists/\(listId)/items/\(itemId)"
        return try await api.request(path, method: "POST")
    }

    func addToFavorites(userId: String, itemId: String) async throws -> EmptyResponse {
        guard let favoritesId = userService.getUserFavoritesIdFromStorage() else { return EmptyResponse() }
        return try await addToList(userId: userId, listId: favoritesId, itemId: itemId)
    }

    func removeFromList(userId: String, listId: String, itemId: String) async throws -> EmptyResponse {
        let path = "\(base)/\(userId)/lists/\(listId)/items/\(itemId)"
        return try await api.request(path, method: "DELETE")
    }

    func createList(userId: String, name: String, isPublic: Bool) async throws -> UserList {
        let body = try JSONEncoder().encode(ListRequest(name: name, isPublic: isPublic))
        let path = "\(base)/\(userId)/lists"
        return try await api.request(path, method: "POST", body: body)
    }

    func removeList(userId: String, listId: String) async throws -> EmptyResponse {
        let path = "\(base)/\(userId)/lists/\(listId)"
        return try await api.request(path, method: "DELETE")
    }

    func updateList(userId: String, listId: String, name: String, isPublic: Bool) async throws -> UserList {
        let body = try JSONEncoder().encode(ListRequest(name: name, isPublic: isPublic))
        let path = "\(base)/\(userId)/lists/\(listId)"
        return try await api.request(path, method: "PATCH", body: body)
    }

    func getUserLists(userId: String) async throws -> [UserList] {
        let path = "\(base)/\(userId)/lists"
        return try await api.request(path)
    }

    func getUserListItems(userId: String, listId: String) async throws -> [Restaurant] {
        let path = "\(base)/\(userId)/lists/\(listId)/items"
        let dtos: [BusinessDTO] = try await api.request(path)
        return dtos.map(BusinessMapper.map)
    }

    func getPublicLists() async throws -> [UserList] {
        let path = "\(base)/public/lists"
        return try await api.request(path)
    }

    func toggleFavorite(userId: String, itemId: String) async throws -> [Restaurant] {
        guard let favoritesId = userService.getUserFavoritesIdFromStorage() else { return [] }
        let favorites = try await getUserListItems(userId: userId, listId: favoritesId)
        let isFavorited = favorites.contains { $0.id == itemId }

        if isFavorited {
            _ = try await removeFromList(userId: userId, listId: favoritesId, itemId: itemId)
        } else {
            _ = try await addToFavorites(userId: userId, itemId: itemId)
        }

        return try await getUserListItems(userId: userId, listId: favoritesId)
    }
}


private struct ListRequest: Encodable {
    let name: String
    let isPublic: Bool

    enum CodingKeys: String, CodingKey {
        case name
        case isPublic = "is_public"
    }
}
