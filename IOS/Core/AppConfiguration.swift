import Foundation

enum AppConfiguration {
    private static let info: [String: Any] = {
        if let envBaseURL = ProcessInfo.processInfo.environment["API_BASE_URL"],
           let envSupabaseURL = ProcessInfo.processInfo.environment["SUPABASE_URL"],
           let envSupabaseKey = ProcessInfo.processInfo.environment["SUPABASE_ANON_KEY"] {
            return [
                "API_BASE_URL": envBaseURL,
                "SUPABASE_URL": envSupabaseURL,
                "SUPABASE_ANON_KEY": envSupabaseKey
            ]
        }
        guard let url = Bundle.module.url(forResource: "Configuration", withExtension: "plist"),
              let data = try? Data(contentsOf: url),
              let dict = try? PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any] else {
            return [:]
        }
        return dict
    }()

    static var apiBaseURL: URL {
        guard let urlString = info["API_BASE_URL"] as? String,
              let url = URL(string: urlString) else {
            fatalError("API_BASE_URL not set")
        }
        return url
    }

    static var supabaseURL: URL {
        guard let urlString = info["SUPABASE_URL"] as? String,
              let url = URL(string: urlString) else {
            fatalError("SUPABASE_URL not set")
        }
        return url
    }

    static var supabaseAnonKey: String {
        guard let key = info["SUPABASE_ANON_KEY"] as? String else {
            fatalError("SUPABASE_ANON_KEY not set")
        }
        return key
    }
}
