import Foundation

struct UserData: Codable {
    let userId: String
    let token: String
}

struct UserProfile: Codable {
    let id: String
    let name: String
    let email: String?
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
    private let api = APIClient.shared
    private let storage = SecureStorage.shared
    private let base = "users"
    private let tokenKey = "authToken"
    private let userIdKey = "userId"

    // MARK: - Secure Storage
    /// Persists user identifier and token securely using Keychain.
    func saveUserData(_ data: UserData) {
        storage.save(data.userId, for: userIdKey)
        storage.save(data.token, for: tokenKey)
    }

    /// Retrieves stored user identifier and token.
    func fetchUserData() -> UserData? {
        guard let userId = storage.read(for: userIdKey),
              let token = storage.read(for: tokenKey) else {
            return nil
        }
        return UserData(userId: userId, token: token)
    }

    // MARK: - Remote Operations
    /// Requests a password change for the specified user.
    func changePassword(userId: String, newPassword: String) async throws {
        let body = try JSONEncoder().encode(["newPassword": newPassword])
        let _: EmptyResponse = try await api.request("\(base)/\(userId)/change-password", method: "PATCH", body: body)
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
    func addLike(userId: String, listId: String) async throws {
        let _: EmptyResponse = try await api.request("\(base)/diner_user/\(userId)/like/\(listId)", method: "POST")
    }

    /// Removes a like from a list for the user.
    func removeLike(userId: String, listId: String) async throws {
        let _: EmptyResponse = try await api.request("\(base)/diner_user/\(userId)/unlike/\(listId)", method: "DELETE")
    }

    /// Creates a new review for a business.
    func newReview(userId: String, businessId: String, review: ReviewRequest) async throws {
        let body = try JSONEncoder().encode(review)
        let _: EmptyResponse = try await api.request("\(base)/diner_user/\(userId)/reviews/\(businessId)", method: "POST", body: body)
    }

    /// Retrieves reviews written by the user.
    func getUserReviews(userId: String) async throws -> [UserReview] {
        return try await api.request("\(base)/diner_user/\(userId)/reviews")
    }

    /// Updates profile information for the given user and returns the updated profile.
    func updateUserData(userId: String, profile: UserProfile) async throws -> UserProfile {
        let body = try JSONEncoder().encode(profile)
        return try await api.request("\(base)/diner_user/\(userId)/profile", method: "PUT", body: body)
    }
}

private struct EmptyResponse: Decodable {}
