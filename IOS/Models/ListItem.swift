import Foundation

/// Represents an individual item within a user list.
struct ListItem: Identifiable, Decodable {
    let id: String
    let name: String
    /// Whether the list item is part of a public list.
    let isPublic: Bool
    /// Number of likes associated with the list containing this item.
    let likeCount: Int

    enum CodingKeys: String, CodingKey {
        case id, name
        case isPublic = "is_public"
        case likeCount = "like_counter"
    }
}
