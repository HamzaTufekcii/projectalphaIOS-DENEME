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
        case accessTokenCamel = "accessToken"
        case refreshTokenCamel = "refreshToken"
        case user
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        if let token = try? container.decode(String.self, forKey: .accessToken) {
            accessToken = token
        } else {
            accessToken = try container.decode(String.self, forKey: .accessTokenCamel)
        }
        if let token = try? container.decode(String.self, forKey: .refreshToken) {
            refreshToken = token
        } else {
            refreshToken = try container.decode(String.self, forKey: .refreshTokenCamel)
        }
        user = try container.decodeIfPresent(User.self, forKey: .user)
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
