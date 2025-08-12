import Foundation

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var isAuthenticated: Bool = false
    @Published var errorMessage: String?
    
    private let service = AuthService()
    
    // MARK: - Actions
    func login() async {
        do {
            let data = try await service.login(email: email, password: password)
            service.saveAuthData(data)
            isAuthenticated = true
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func sendVerificationCode(to phone: String) async {
        do {
            try await service.sendVerificationCode(to: phone)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func verifyCode(phone: String, code: String) async {
        do {
            let data = try await service.verifyCode(phone: phone, code: code)
            service.saveAuthData(data)
            isAuthenticated = true
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func updateUser(name: String, email: String) async {
        do {
            try await service.updateUser(name: name, email: email)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func checkPassword(_ password: String) async -> Bool {
        do {
            return try await service.checkPassword(password)
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
    
    func logout() {
        service.logout()
        isAuthenticated = false
    }
}

