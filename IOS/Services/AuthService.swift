import Foundation

/// Handles authentication related network operations.
final class AuthService {
    private let api: APIClientProtocol
    private let authStorageKey = "authData"

    init(api: APIClientProtocol = APIClient.shared) {
        self.api = api
    }

    // MARK: - Networking
    func sendVerificationCode(email: String) async throws -> EmptyResponse {
        let body = try JSONEncoder().encode(["email": email])
        let response: EmptyResponse = try await api.request("api/auth/send-verification-code", method: "POST", body: body)
        return response
    }

    func verifyCode(email: String, token: String) async throws -> VerificationResponse {
        let body = try JSONEncoder().encode(["email": email, "token": token])
        let response: VerificationResponse = try await api.request("api/auth/verify-verification-code", method: "POST", body: body)
        return response
    }

    func updateUser(email: String, password: String, role: String) async throws -> EmptyResponse {
        let body = try JSONEncoder().encode(["email": email, "password": password, "role": role])
        let response: EmptyResponse = try await api.request("api/auth/update-user", method: "POST", body: body)
        return response
    }

    func login(email: String, password: String, role: String) async throws -> AuthData {
        let body = try JSONEncoder().encode(["email": email, "password": password, "role": role])
        let auth: AuthData = try await api.request("api/auth/login", method: "POST", body: body)
        api.setAuthData(auth)
        return auth
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


