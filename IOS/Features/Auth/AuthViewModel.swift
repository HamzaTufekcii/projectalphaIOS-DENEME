import Foundation

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var role: String = "user"
    @Published var isAuthenticated: Bool = false
    @Published var errorMessage: String?

    private let service = AuthService()
    private let session = UserSession.shared
    private let userService = UserService()

    // MARK: - Actions
    func login() async {
        do {
            let data = try await service.login(email: email, password: password, role: role)
            session.save(userId: data.user?.id, token: data.accessToken)
            service.saveAuthData(data)
            if let id = data.user?.id {
                try await userService.fetchUserData(userId: id, role: role)
            }
            isAuthenticated = true
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func sendVerificationCode(email: String) async {
        do {
            try await service.sendVerificationCode(email: email)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func verifyCode(email: String, token: String) async {
        do {
            _ = try await service.verifyCode(email: email, token: token)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func updateUser(email: String, password: String, role: String) async {
        do {
            try await service.updateUser(email: email, password: password, role: role)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func logout() {
        service.logout()
        isAuthenticated = false
    }
}

