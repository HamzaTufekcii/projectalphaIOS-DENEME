import Foundation

struct AuthData: Codable {
    let accessToken: String
    let refreshToken: String
}

final class AuthService {
    private let baseURL = URL(string: "https://example.com/api")!
    private let session: URLSession
    private let authStorageKey = "authData"
    
    init(session: URLSession = .shared) {
        self.session = session
    }
    
    // MARK: - Networking
    func sendVerificationCode(to phone: String) async throws {
        let url = baseURL.appendingPathComponent("auth/send-code")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["phone": phone])
        _ = try await session.data(for: request)
    }
    
    func verifyCode(phone: String, code: String) async throws -> AuthData {
        let url = baseURL.appendingPathComponent("auth/verify-code")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["phone": phone, "code": code])
        let (data, _) = try await session.data(for: request)
        return try JSONDecoder().decode(AuthData.self, from: data)
    }
    
    func updateUser(name: String, email: String) async throws {
        let url = baseURL.appendingPathComponent("user")
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["name": name, "email": email])
        _ = try await session.data(for: request)
    }
    
    func login(email: String, password: String) async throws -> AuthData {
        let url = baseURL.appendingPathComponent("auth/login")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["email": email, "password": password])
        let (data, _) = try await session.data(for: request)
        return try JSONDecoder().decode(AuthData.self, from: data)
    }
    
    func checkPassword(_ password: String) async throws -> Bool {
        let url = baseURL.appendingPathComponent("auth/check-password")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["password": password])
        let (data, _) = try await session.data(for: request)
        return (try? JSONDecoder().decode([String: Bool].self, from: data)["valid"]) ?? false
    }
    
    // MARK: - Auth Storage
    func saveAuthData(_ data: AuthData) {
        if let encoded = try? JSONEncoder().encode(data) {
            UserDefaults.standard.set(encoded, forKey: authStorageKey)
        }
    }
    
    func getAuthData() -> AuthData? {
        guard let data = UserDefaults.standard.data(forKey: authStorageKey) else { return nil }
        return try? JSONDecoder().decode(AuthData.self, from: data)
    }
    
    func logout() {
        UserDefaults.standard.removeObject(forKey: authStorageKey)
    }
}

