import Foundation

/// Handles authentication related network operations.
final class AuthService {
    private let api = APIClient.shared
    private let authStorageKey = "authData"

    // MARK: - Networking
    func sendVerificationCode(to phone: String) async throws {
        let body = try JSONEncoder().encode(["phone": phone])
        let _: EmptyResponse = try await api.request("auth/send-code", method: "POST", body: body)
    }

    func verifyCode(phone: String, code: String) async throws -> AuthData {
        let body = try JSONEncoder().encode(["phone": phone, "code": code])
        let auth: AuthData = try await api.request("auth/verify-code", method: "POST", body: body)
        api.setAuthData(auth)
        return auth
    }

    func updateUser(name: String, email: String) async throws {
        let body = try JSONEncoder().encode(["name": name, "email": email])
        let _: EmptyResponse = try await api.request("user", method: "PUT", body: body)
    }

    func login(email: String, password: String) async throws -> AuthData {
        let body = try JSONEncoder().encode(["email": email, "password": password])
        let auth: AuthData = try await api.request("auth/login", method: "POST", body: body)
        api.setAuthData(auth)
        return auth
    }

    func checkPassword(_ password: String) async throws -> Bool {
        let body = try JSONEncoder().encode(["password": password])
        let response: [String: Bool] = try await api.request("auth/check-password", method: "POST", body: body)
        return response["valid"] ?? false
    }

    // MARK: - Auth Storage
    func saveAuthData(_ data: AuthData) {
        if let encoded = try? JSONEncoder().encode(data) {
            UserDefaults.standard.set(encoded, forKey: authStorageKey)
        }
        api.setAuthData(data)
    }

    func getAuthData() -> AuthData? {
        guard let data = UserDefaults.standard.data(forKey: authStorageKey) else { return nil }
        let auth = try? JSONDecoder().decode(AuthData.self, from: data)
        if let auth { api.setAuthData(auth) }
        return auth
    }

    func logout() {
        UserDefaults.standard.removeObject(forKey: authStorageKey)
        api.setAuthData(nil)
    }
}

private struct EmptyResponse: Decodable {}

