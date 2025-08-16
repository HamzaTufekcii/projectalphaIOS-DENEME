import Foundation

@MainActor
final class AppViewModel: ObservableObject {
    @Published var isAuthenticated: Bool = false

    private let authService = AuthService()

    init() {
        if authService.getAuthData() != nil {
            isAuthenticated = true
        }
    }
}
