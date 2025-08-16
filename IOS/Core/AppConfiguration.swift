import Foundation

enum AppConfiguration {
    private nonisolated(unsafe) static let info: [String: Any] = {
        var config: [String: Any] = [:]

        if let url = Bundle.module.url(forResource: "Configuration", withExtension: "plist"),
           let data = try? Data(contentsOf: url),
           let dict = try? PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any] {
            config = dict
        }

        let env = ProcessInfo.processInfo.environment
        if let envBaseURL = env["API_BASE_URL"] {
            config["API_BASE_URL"] = envBaseURL
        }
        if let envSupabaseURL = env["SUPABASE_URL"] {
            config["SUPABASE_URL"] = envSupabaseURL
        }
        if let envSupabaseKey = env["SUPABASE_ANON_KEY"] {
            config["SUPABASE_ANON_KEY"] = envSupabaseKey
        }

        return config
    }()

    static var apiBaseURL: URL {
        guard
            let urlString = info["API_BASE_URL"] as? String,
            let url = URL(string: urlString),
            url.scheme?.lowercased() == "https"
        else {
            fatalError("API_BASE_URL must be a valid https URL")
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
