import Foundation

/// A simple token store backed by UserDefaults.
/// TODO: Replace UserDefaults with secure storage using KeychainAccess or the Security framework.
struct TokenStore {
    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    /// Saves a token for the specified key.
    func saveToken(_ token: String, for key: String) throws {
        // TODO: Persist the token securely using KeychainAccess or the Security framework.
        defaults.set(token, forKey: key)
    }

    /// Fetches a token for the specified key.
    func fetchToken(for key: String) throws -> String? {
        // TODO: Fetch the token securely using KeychainAccess or the Security framework.
        return defaults.string(forKey: key)
    }

    /// Deletes the token associated with the specified key.
    func deleteToken(for key: String) throws {
        // TODO: Delete the token securely using KeychainAccess or the Security framework.
        defaults.removeObject(forKey: key)
    }
}
