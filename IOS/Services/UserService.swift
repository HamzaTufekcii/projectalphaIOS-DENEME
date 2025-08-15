import Foundation

struct UserData: Codable {
    let userId: String
    let token: String
}

struct UserProfile: Codable {
    let id: String
    let name: String
    let email: String?
    let surname: String?
    let phoneNumber: String?

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case email
        case surname
        case phoneNumber = "phone_numb"
    }
}

struct UserLike: Identifiable, Codable {
    let id: String
    let listId: String
    let name: String?
}

struct ReviewRequest: Codable {
    let rating: Int
    let comment: String?
}

struct UserReview: Identifiable, Codable {
    let id: String
    let rating: Int
    let comment: String?
}

/// Service responsible for user related operations such as profile
/// management, likes and reviews.
final class UserService {
    private let api: APIClientProtocol
    private let storage: SecureStorage
    private let base = "api/users"
    private let tokenKey = "authToken"
    private let userIdKey = "userId"
    private let userRoleKey = "userRole"
    private let favoritesIdKey = "favoritesListId"

    init(api: APIClientProtocol = APIClient.shared, storage: SecureStorage = .shared) {
        self.api = api
        self.storage = storage
    }

    // MARK: - Secure Storage
    /// Persists user identifier and token securely using Keychain.
    func saveUserData(_ data: UserData) {
        storage.save(data.userId, for: userIdKey)
        storage.save(data.token, for: tokenKey)
    }

    func saveUserRole(_ role: String) {
        storage.save(role, for: userRoleKey)
    }

    func saveUserFavoritesId(_ id: String) {
        storage.save(id, for: favoritesIdKey)
    }

    /// Retrieves stored user identifier and token.
    func fetchUserData() -> UserData? {
        guard let userId = storage.read(for: userIdKey),
              let token = storage.read(for: tokenKey) else {
            return nil
        }
        return UserData(userId: userId, token: token)
    }

    func getUserRoleFromStorage() -> String? {
        return storage.read(for: userRoleKey)
    }

    func getUserFavoritesIdFromStorage() -> String? {
        return storage.read(for: favoritesIdKey)
    }

    /// Retrieves profile and list data for the user and persists role and favorites list id.
    func fetchUserData(userId: String, role: String) async throws {
        let rolePath = role == "owner" ? "owner_user" : "diner_user"
        saveUserRole(rolePath)

        let response: UserProfileResponse = try await api.request("\(base)/\(rolePath)/\(userId)/profile")

        if let favorites = response.dinerLists?.first(where: { $0.name == "Favorilerim" }) {
            saveUserFavoritesId(favorites.id)
        }
    }

    // MARK: - Remote Operations
    /// Requests a password change for the specified user.
    func changePassword(userId: String, newPassword: String) async throws -> EmptyResponse {
        let body = try JSONEncoder().encode(["newPassword": newPassword])
        return try await api.request("\(base)/\(userId)/change-password", method: "PATCH", body: body)
    }

    /// Fetches profile information for the given user identifier.
    func getUserData(userId: String) async throws -> UserProfile {
        return try await api.request("\(base)/diner_user/\(userId)/profile")
    }

    /// Returns the lists liked by the user.
    func getUserLikes(userId: String) async throws -> [UserLike] {
        return try await api.request("\(base)/diner_user/\(userId)/likes")
    }

    /// Adds a like to a list for the user.
    func addLike(userId: String, listId: String) async throws -> EmptyResponse {
        return try await api.request("\(base)/diner_user/\(userId)/like/\(listId)", method: "POST")
    }

    /// Removes a like from a list for the user.
    func removeLike(userId: String, listId: String) async throws -> EmptyResponse {
        return try await api.request("\(base)/diner_user/\(userId)/unlike/\(listId)", method: "DELETE")
    }

    /// Creates a new review for a business.
    func newReview(userId: String, businessId: String, review: ReviewRequest) async throws -> EmptyResponse {
        let body = try JSONEncoder().encode(review)
        return try await api.request("\(base)/diner_user/\(userId)/reviews/\(businessId)", method: "POST", body: body)
    }

    /// Retrieves reviews written by the user.
    func getUserReviews(userId: String) async throws -> [UserReview] {
        return try await api.request("\(base)/diner_user/\(userId)/reviews")
    }

    /// Updates profile information for the given user and returns the updated profile.
    func updateUserData(userId: String, profile: UserProfile) async throws -> UserProfile {
        let role = getUserRoleFromStorage()
        let request = DinerUpdateRequest(
            email: profile.email,
            role: role,
            requestDiner: .init(
                name: profile.name,
                surname: profile.surname,
                phoneNumber: profile.phoneNumber
            )
        )
        let body = try JSONEncoder().encode(request)
        return try await api.request("\(base)/diner_user/\(userId)/profile", method: "PUT", body: body)
    }
}

private struct UserProfileResponse: Decodable {
    let profile: UserProfile
    let dinerLists: [UserList]?
}


private struct DinerUpdateRequest: Codable {
    let email: String?
    let role: String?
    let requestDiner: DinerUserProfile

    struct DinerUserProfile: Codable {
        let name: String
        let surname: String?
        let phoneNumber: String?

        enum CodingKeys: String, CodingKey {
            case name
            case surname
            case phoneNumber = "phone_numb"
        }
    }
}
