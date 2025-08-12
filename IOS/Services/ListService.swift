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
    private let base = "lists"

    func addToList(listId: String, itemId: String) async throws {
        let body = try JSONEncoder().encode(["itemId": itemId])
        let _: EmptyResponse = try await api.request("\(base)/\(listId)/items", method: "POST", body: body)
    }

    func addToFavorites(itemId: String) async throws {
        try await addToList(listId: "favorites", itemId: itemId)
    }

    func removeFromList(listId: String, itemId: String) async throws {
        let _: EmptyResponse = try await api.request("\(base)/\(listId)/items/\(itemId)", method: "DELETE")
    }

    func createList(name: String) async throws -> UserList {
        let body = try JSONEncoder().encode(["name": name])
        return try await api.request(base, method: "POST", body: body)
    }

    func removeList(listId: String) async throws {
        let _: EmptyResponse = try await api.request("\(base)/\(listId)", method: "DELETE")
    }

    func updateList(listId: String, name: String) async throws -> UserList {
        let body = try JSONEncoder().encode(["name": name])
        return try await api.request("\(base)/\(listId)", method: "PATCH", body: body)
    }

    func getUserLists(userId: String) async throws -> [UserList] {
        return try await api.request("users/\(userId)/\(base)")
    }

    func getUserListItems(listId: String) async throws -> [ListItem] {
        return try await api.request("\(base)/\(listId)/items")
    }

    func getPublicLists() async throws -> [UserList] {
        return try await api.request("\(base)/public")
    }

    func toggleFavorite(listId: String) async throws -> UserList {
        return try await api.request("\(base)/\(listId)/favorite", method: "POST")
    }
}

private struct EmptyResponse: Decodable {}
