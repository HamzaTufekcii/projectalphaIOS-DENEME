import Foundation

/// Manages access to the persisted user identifier and authentication token.
final class UserSession: @unchecked Sendable {
    static let shared = UserSession()
    private let storage = SecureStorage.shared
    private let userIdKey = "userId"
    private let tokenKey = "authToken"
    private init() {}

    /// Stores the user identifier and optional token securely.
    func save(userId: String?, token: String? = nil) {
        if let userId {
            storage.save(userId, for: userIdKey)
        }
        if let token {
            storage.save(token, for: tokenKey)
        }
    }

    /// Returns the stored user identifier from UserDefaults or Keychain.
    func getUserId() -> String? {
        if let id = UserDefaults.standard.string(forKey: userIdKey) {
            return id
        }
        return storage.read(for: userIdKey)
    }

    /// Retrieves the stored authentication token, if available.
    func getToken() -> String? {
        return storage.read(for: tokenKey)
    }
}
