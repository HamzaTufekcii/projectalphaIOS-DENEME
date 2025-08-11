import Foundation

/// Represents the backend environment the app is running against.
enum Environment {
    case dev
    case prod
}

/// Central place for application wide configuration values.
struct AppConfig {
    /// Currently selected build environment.
    static let environment: Environment = {
        #if DEBUG
        return .dev
        #else
        return .prod
        #endif
    }()

    /// Base URL for network requests, read from `Info.plist`.
    static var baseURL: URL {
        guard let urlString = Bundle.main.object(forInfoDictionaryKey: "BASE_URL") as? String,
              let url = URL(string: urlString) else {
            fatalError("BASE_URL is not configured correctly")
        }
        return url
    }
}

