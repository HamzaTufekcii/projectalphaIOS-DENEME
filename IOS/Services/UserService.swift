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
final class UserService: @unchecked Sendable {
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
    /// Persists user identifier and token securely using Keychain and updates the in-memory session.
    func saveUserData(_ data: UserData) {
        storage.save(data.userId, for: userIdKey)
        storage.save(data.token, for: tokenKey)
        // Also update the session so that UI layers can access the fresh values immediately.
        UserSession.shared.save(userId: data.userId, token: data.token)
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

        let response = try await api.request("\(base)/\(rolePath)/\(userId)/profile", method: "GET", body: nil, useCache: true, cacheTTL: 600) as UserProfileResponse

        if let favorites = response.dinerLists?.first(where: { $0.name == "Favorilerim" }) {
            saveUserFavoritesId(favorites.id)
        }
    }

    // MARK: - Remote Operations
    /// Requests a password change for the specified user.
    func changePassword(userId: String, newPassword: String) async throws -> EmptyResponse {
        let body = try JSONEncoder().encode(["newPassword": newPassword])
        return try await api.request("\(base)/\(userId)/change-password", method: "PATCH", body: body, useCache: false, cacheTTL: nil) as EmptyResponse
    }

    /// Fetches profile information for the given user identifier.
    func getUserData(userId: String) async throws -> UserProfile {
        return try await api.request("\(base)/diner_user/\(userId)/profile", method: "GET", body: nil, useCache: true, cacheTTL: 600) as UserProfile
    }

    /// Returns the lists liked by the user.
    func getUserLikes(userId: String) async throws -> [UserLike] {
        return try await api.request("\(base)/diner_user/\(userId)/likes", method: "GET", body: nil, useCache: true, cacheTTL: 300) as [UserLike]
    }

    /// Adds a like to a list for the user.
    func addLike(userId: String, listId: String) async throws -> EmptyResponse {
        return try await api.request("\(base)/diner_user/\(userId)/like/\(listId)", method: "POST", body: nil, useCache: false, cacheTTL: nil) as EmptyResponse
    }

    /// Removes a like from a list for the user.
    func removeLike(userId: String, listId: String) async throws -> EmptyResponse {
        return try await api.request("\(base)/diner_user/\(userId)/unlike/\(listId)", method: "DELETE", body: nil, useCache: false, cacheTTL: nil) as EmptyResponse
    }

    /// Creates a new review for a business.
    func newReview(userId: String, businessId: String, review: ReviewRequest) async throws -> EmptyResponse {
        let body = try JSONEncoder().encode(review)
        return try await api.request("\(base)/diner_user/\(userId)/reviews/\(businessId)", method: "POST", body: body, useCache: false, cacheTTL: nil) as EmptyResponse
    }

    /// Retrieves reviews written by the user.
    func getUserReviews(userId: String) async throws -> [UserReview] {
        return try await api.request("\(base)/diner_user/\(userId)/reviews", method: "GET", body: nil, useCache: true, cacheTTL: 300) as [UserReview]
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
        return try await api.request("\(base)/diner_user/\(userId)/profile", method: "PUT", body: body, useCache: false, cacheTTL: nil) as UserProfile
    }
}

private struct UserProfileResponse: Codable {
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
