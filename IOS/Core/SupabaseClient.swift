import Foundation
import Supabase

/// Factory and shared access point for the Supabase client.
enum SupabaseClientFactory {
    /// Shared Supabase client instance used across the app.
    static let shared: SupabaseClient = createClient(
        url: URL(string: "https://your-project.supabase.co")!,
        anonKey: "public-anon-key"
    )
}

/// Creates a new Supabase client with the given URL and anon key.
func createClient(url: URL, anonKey: String) -> SupabaseClient {
    SupabaseClient(supabaseURL: url, supabaseKey: anonKey)
}

