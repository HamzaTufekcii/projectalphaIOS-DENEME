import Supabase

/// Service handling authentication directly with Supabase.
final class SupabaseAuthService: @unchecked Sendable {
    private let client: SupabaseClient

    /// Creates a new service with an injectable Supabase client.
    init(client: SupabaseClient = SupabaseClientFactory.shared) {
        self.client = client
    }

    /// Signs in a user with email and password using Supabase Auth.
    func signIn(email: String, password: String) async throws -> Supabase.Session {
        let session = try await client.auth.signIn(email: email, password: password)
        return session
    }

    /// Signs out the current user.
    func signOut() async throws {
        try await client.auth.signOut()
    }
}

