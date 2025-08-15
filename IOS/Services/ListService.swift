import Foundation

struct UserList: Identifiable, Decodable {
    let id: String
    let name: String
    var isFavorite: Bool?
    let isPublic: Bool
    let likeCount: Int

    enum CodingKeys: String, CodingKey {
        case id, name
        case isFavorite = "is_favorite"
        case isPublic = "is_public"
        case likeCount = "like_count"
    }
}


/// Service handling list operations through the API client.
final class ListService {
    private let api = APIClient.shared
    private let userService = UserService()
    private let base = "api/users/diner_user"

    func addToList(userId: String, listId: String, itemId: String) async throws {
        let path = "\(base)/\(userId)/lists/\(listId)/items/\(itemId)"
        let _: EmptyResponse = try await api.request(path, method: "POST")
    }

    func addToFavorites(userId: String, itemId: String) async throws {
        guard let favoritesId = userService.getUserFavoritesIdFromStorage() else { return }
        try await addToList(userId: userId, listId: favoritesId, itemId: itemId)
    }

    func removeFromList(userId: String, listId: String, itemId: String) async throws {
        let path = "\(base)/\(userId)/lists/\(listId)/items/\(itemId)"
        let _: EmptyResponse = try await api.request(path, method: "DELETE")
    }

    func createList(userId: String, name: String, isPublic: Bool) async throws -> UserList {
        let body = try JSONEncoder().encode(ListRequest(name: name, isPublic: isPublic))
        let path = "\(base)/\(userId)/lists"
        return try await api.request(path, method: "POST", body: body)
    }

    func removeList(userId: String, listId: String) async throws {
        let path = "\(base)/\(userId)/lists/\(listId)"
        let _: EmptyResponse = try await api.request(path, method: "DELETE")
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

    func getUserListItems(userId: String, listId: String) async throws -> [BusinessDTO] {
        let path = "\(base)/\(userId)/lists/\(listId)/items"
        return try await api.request(path)
    }

    func getPublicLists() async throws -> [UserList] {
        let path = "\(base)/public/lists"
        return try await api.request(path)
    }

    func toggleFavorite(userId: String, itemId: String) async throws -> [BusinessDTO] {
        guard let favoritesId = userService.getUserFavoritesIdFromStorage() else { return [] }
        let favorites = try await getUserListItems(userId: userId, listId: favoritesId)
        let isFavorited = favorites.contains { $0.id == itemId }

        if isFavorited {
            try await removeFromList(userId: userId, listId: favoritesId, itemId: itemId)
        } else {
            try await addToFavorites(userId: userId, itemId: itemId)
        }

        return try await getUserListItems(userId: userId, listId: favoritesId)
    }
}

private struct EmptyResponse: Decodable {}

private struct ListRequest: Encodable {
    let name: String
    let isPublic: Bool

    enum CodingKeys: String, CodingKey {
        case name
        case isPublic = "is_public"
    }
}
