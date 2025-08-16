import Foundation

/// Represents a user-created list of restaurants.
struct UserList: Identifiable, Codable {
    let id: String
    let name: String
    /// Indicates whether this list is the user's favorites list.
    var isFavorite: Bool?
    /// Whether the list is visible to other users.
    let isPublic: Bool
    /// Total number of likes on this list.
    let likeCount: Int

    enum CodingKeys: String, CodingKey {
        case id, name
        case isFavorite = "is_favorite"
        case isPublic = "is_public"
        case likeCount = "like_counter"
    }
}
