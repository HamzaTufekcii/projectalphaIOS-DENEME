import Foundation

@MainActor
final class UserListsViewModel: ObservableObject {
    @Published var likedLists: [UserLike] = []
    @Published var errorMessage: String?
    @Published var isLoading = false

    private let service: UserService
    private let session: UserSession

    init(service: UserService = UserService(), session: UserSession = .shared) {
        self.service = service
        self.session = session
    }

    func loadLikes() async {
        guard let userId = session.getUserId() else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            likedLists = try await service.getUserLikes(userId: userId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
