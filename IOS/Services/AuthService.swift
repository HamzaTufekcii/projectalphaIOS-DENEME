import Foundation

/// Backend login response format
private struct LoginResponse: Codable {
    let success: Bool
    let accessToken: String
    let refreshToken: String
    let user: User?
    
    enum CodingKeys: String, CodingKey {
        case success
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case user
    }
}

/// Handles authentication related network operations.
final class AuthService: @unchecked Sendable {
    private let api: APIClientProtocol
    private let storage: SecureStorage
    private let userIdKey = "userId"
    private let accessTokenKey = "access_token"
    private let refreshTokenKey = "refresh_token"

    init(api: APIClientProtocol = APIClient.shared, storage: SecureStorage = .shared) {
        self.api = api
        self.storage = storage
    }

    // MARK: - Networking
    func sendVerificationCode(email: String) async throws -> EmptyResponse {
        let body = try JSONEncoder().encode(["email": email])
        let response: EmptyResponse = try await api.request(
            "api/auth/send-verification-code",
            method: "POST",
            body: body
        )
        return response
    }

    func verifyCode(email: String, token: String) async throws -> VerificationResponse {
        let body = try JSONEncoder().encode(["email": email, "token": token])
        let response: VerificationResponse = try await api.request(
            "api/auth/verify-verification-code",
            method: "POST",
            body: body
        )
        return response
    }

    func updateUser(email: String, password: String, role: String) async throws -> EmptyResponse {
        let body = try JSONEncoder().encode(["email": email, "password": password, "role": role])
        let response: EmptyResponse = try await api.request("api/auth/update-user", method: "POST", body: body)
        return response
    }

    func login(email: String, password: String, role: String) async throws -> AuthData {
        let body = try JSONEncoder().encode([
            "email": email.trimmingCharacters(in: .whitespacesAndNewlines),
            "password": password.trimmingCharacters(in: .whitespacesAndNewlines),
            "role": role
        ])
        let response: LoginResponse = try await api.request(
            "api/auth/login",
            method: "POST",
            body: body
        )
        let auth = AuthData(
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user
        )
        saveAuthData(auth)
        return auth
    }

    func checkPassword(email: String, password: String) async throws -> AuthData {
        let body = try JSONEncoder().encode([
            "email": email,
            "password": password,
            "role": "user"
        ])
        let response: LoginResponse = try await api.request(
            "api/auth/login",
            method: "POST",
            body: body
        )
        let auth = AuthData(
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user
        )
        return auth
    }

    // MARK: - Auth Storage
    func saveAuthData(_ data: AuthData) {
        if let id = data.user?.id {
            storage.save(id, for: userIdKey)
        }
        storage.save(data.accessToken, for: accessTokenKey)
        storage.save(data.refreshToken, for: refreshTokenKey)
        api.setAuthData(data)
    }

    func getAuthData() -> AuthData? {
        guard
            let access = storage.read(for: accessTokenKey),
            let refresh = storage.read(for: refreshTokenKey)
        else { return nil }
        let userId = storage.read(for: userIdKey)
        let user: User? = {
            if let id = userId { return User(id: id, email: nil, emailConfirmedAt: nil, appMetadata: nil) }
            return nil
        }()
        let auth = AuthData(accessToken: access, refreshToken: refresh, user: user)
        api.setAuthData(auth)
        return auth
    }

    func logout() {
        storage.delete(key: userIdKey)
        storage.delete(key: accessTokenKey)
        storage.delete(key: refreshTokenKey)
        api.setAuthData(nil)
    }
}


