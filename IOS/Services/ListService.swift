import Foundation

struct UserList: Identifiable, Decodable {
    let id: String
    let name: String
    var isFavorite: Bool?
}

struct ListItem: Identifiable, Decodable {
    let id: String
    let name: String
}

/// Service handling list operations through the API client.
final class ListService {
    private let api = APIClient.shared
    private let base = "api/users/diner_user"

    func addToList(userId: String, listId: String, itemId: String) async throws {
        let path = "\(base)/\(userId)/lists/\(listId)/items/\(itemId)"
        let _: EmptyResponse = try await api.request(path, method: "POST")
    }

    func addToFavorites(userId: String, itemId: String) async throws {
        try await addToList(userId: userId, listId: "favorites", itemId: itemId)
    }

    func removeFromList(userId: String, listId: String, itemId: String) async throws {
        let path = "\(base)/\(userId)/lists/\(listId)/items/\(itemId)"
        let _: EmptyResponse = try await api.request(path, method: "DELETE")
    }

    func createList(userId: String, name: String) async throws -> UserList {
        let body = try JSONEncoder().encode(["name": name])
        let path = "\(base)/\(userId)/lists"
        return try await api.request(path, method: "POST", body: body)
    }

    func removeList(userId: String, listId: String) async throws {
        let path = "\(base)/\(userId)/lists/\(listId)"
        let _: EmptyResponse = try await api.request(path, method: "DELETE")
    }

    func updateList(userId: String, listId: String, name: String) async throws -> UserList {
        let body = try JSONEncoder().encode(["name": name])
        let path = "\(base)/\(userId)/lists/\(listId)"
        return try await api.request(path, method: "PATCH", body: body)
    }

    func getUserLists(userId: String) async throws -> [UserList] {
        let path = "\(base)/\(userId)/lists"
        return try await api.request(path)
    }

    func getUserListItems(userId: String, listId: String) async throws -> [ListItem] {
        let path = "\(base)/\(userId)/lists/\(listId)/items"
        return try await api.request(path)
    }

    func getPublicLists(userId: String) async throws -> [UserList] {
        let path = "\(base)/\(userId)/public/lists"
        return try await api.request(path)
    }

    func toggleFavorite(userId: String, itemId: String) async throws -> [ListItem] {
        let favorites = try await getUserListItems(userId: userId, listId: "favorites")
        let isFavorited = favorites.contains { $0.id == itemId }

        if (isFavorited) {
            try await removeFromList(userId: userId, listId: "favorites", itemId: itemId)
        } else {
            try await addToFavorites(userId: userId, itemId: itemId)
        }

        return try await getUserListItems(userId: userId, listId: "favorites")
    }
}

private struct EmptyResponse: Decodable {}
