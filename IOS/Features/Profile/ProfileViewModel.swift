import Foundation

@MainActor
final class ProfileViewModel: ObservableObject {
    @Published var profile: UserProfile?
    @Published var errorMessage: String?

    private let service = UserService()
    private let session = UserSession.shared

    func loadProfile() async {
        guard let userId = session.getUserId() else { return }
        do {
            profile = try await service.getUserData(userId: userId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func updateProfile(name: String, email: String?) async {
        guard let userId = session.getUserId() else { return }
        let updated = UserProfile(id: userId, name: name, email: email)
        do {
            profile = try await service.updateUserData(userId: userId, profile: updated)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
