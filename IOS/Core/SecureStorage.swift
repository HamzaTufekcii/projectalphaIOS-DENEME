import Foundation
#if canImport(Security)
import Security
#endif

/// Simple helper around Keychain for securely storing small pieces of data such as
/// authentication tokens or identifiers. Fallbacks to `UserDefaults` when the
/// Security framework is not available (e.g. on Linux for testing).
final class SecureStorage: @unchecked Sendable {
    static let shared = SecureStorage()
    private let service = "com.example.app"
    private init() {}

    /// Stores a string value in the Keychain for the provided key.
    func save(_ value: String, for key: String) {
#if canImport(Security)
        let data = Data(value.utf8)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
#else
        UserDefaults.standard.set(value, forKey: key)
#endif
    }

    /// Reads a string value from the Keychain for the given key.
    func read(for key: String) -> String? {
#if canImport(Security)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var item: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status == errSecSuccess,
              let data = item as? Data,
              let value = String(data: data, encoding: .utf8) else {
            return nil
        }
        return value
#else
        return UserDefaults.standard.string(forKey: key)
#endif
    }

    /// Removes a stored value for the specified key.
    func delete(key: String) {
#if canImport(Security)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]
        SecItemDelete(query as CFDictionary)
#else
        UserDefaults.standard.removeObject(forKey: key)
#endif
    }
}
