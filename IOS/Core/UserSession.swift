import Foundation
#if canImport(Security)
import Security
#endif

/// Manages access to the persisted user identifier.
final class UserSession {
    static let shared = UserSession()
    private let userIdKey = "userId"
    private init() {}

    /// Returns the stored user identifier from UserDefaults or Keychain.
    func getUserId() -> String? {
        if let id = UserDefaults.standard.string(forKey: userIdKey) {
            return id
        }
        return KeychainHelper.read(service: "com.example.app", account: userIdKey)
    }
}

enum KeychainHelper {
    static func read(service: String, account: String) -> String? {
#if canImport(Security)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecReturnData as String: true
        ]
        var item: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status == errSecSuccess, let data = item as? Data,
              let value = String(data: data, encoding: .utf8) else {
            return nil
        }
        return value
#else
        return nil
#endif
    }
}
