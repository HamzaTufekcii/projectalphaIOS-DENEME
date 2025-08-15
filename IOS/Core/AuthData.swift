import Foundation

/// Authentication tokens returned by backend.
public struct AuthData: Codable {
    public let accessToken: String
    public let refreshToken: String
    public let user: User?

    public init(accessToken: String, refreshToken: String, user: User? = nil) {
        self.accessToken = accessToken
        self.refreshToken = refreshToken
        self.user = user
    }

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case user
    }
}

public struct User: Codable {
    public let id: String?
    public let email: String?
    public let emailConfirmedAt: String?
    public let appMetadata: AppMetadata?

    enum CodingKeys: String, CodingKey {
        case id
        case email
        case emailConfirmedAt = "email_confirmed_at"
        case appMetadata = "app_metadata"
    }
}

public struct AppMetadata: Codable {
    public let role: String?
}
