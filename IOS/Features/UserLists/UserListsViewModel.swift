import Foundation

@MainActor
final class UserListsViewModel: ObservableObject {
    @Published var likedLists: [UserLike] = []
    @Published var errorMessage: String?

    private let service = UserService()
    private let session = UserSession.shared

    func loadLikes() async {
        guard let userId = session.getUserId() else { return }
        do {
            likedLists = try await service.getUserLikes(userId: userId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
