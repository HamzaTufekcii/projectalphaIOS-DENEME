import Foundation

@MainActor
final class ProfileViewModel: ObservableObject {
    @Published var profile: UserProfile?
    @Published var errorMessage: String?
    @Published var isLoading = false

    private let service: UserService
    private let session: UserSession

    init(service: UserService = UserService(), session: UserSession = .shared) {
        self.service = service
        self.session = session
    }

    func loadProfile() async {
        guard let userId = session.getUserId() else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            profile = try await service.getUserData(userId: userId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func updateProfile(name: String, surname: String?, phoneNumber: String?, email: String?) async {
        guard let userId = session.getUserId() else { return }
        let updated = UserProfile(id: userId, name: name, email: email, surname: surname, phoneNumber: phoneNumber)
        isLoading = true
        defer { isLoading = false }
        do {
            profile = try await service.updateUserData(userId: userId, profile: updated)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func changePassword(newPassword: String) async {
        guard let userId = session.getUserId() else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            _ = try await service.changePassword(userId: userId, newPassword: newPassword)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
