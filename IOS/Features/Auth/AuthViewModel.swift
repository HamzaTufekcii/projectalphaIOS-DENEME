import Foundation

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var role: String = "user"
    @Published var isAuthenticated: Bool = false
    @Published var errorMessage: String?
    
    private let service = AuthService()
    
    // MARK: - Actions
    func login() async {
        do {
            let data = try await service.login(email: email, password: password, role: role)
            service.saveAuthData(data)
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
            let data = try await service.verifyCode(email: email, token: token)
            service.saveAuthData(data)
            isAuthenticated = true
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

