import Foundation

@MainActor
final class UserListsViewModel: ObservableObject {
    enum Mode { case myLists, explore }

    @Published var mode: Mode = .myLists
    @Published var lists: [UserList] = []
    @Published var likedListIds: Set<String> = []
    @Published var errorMessage: String?
    @Published var isLoading = false

    private let listService: ListService
    private let userService: UserService
    private let session: UserSession

    init(listService: ListService = ListService(),
         userService: UserService = UserService(),
         session: UserSession = .shared) {
        self.listService = listService
        self.userService = userService
        self.session = session
    }

    func load() async {
        await loadLists()
        await loadLikes()
    }

    func loadLists() async {
        isLoading = true
        defer { isLoading = false }
        do {
            switch mode {
            case .myLists:
                guard let userId = session.getUserId() else { return }
                lists = try await listService.getUserLists(userId: userId)
            case .explore:
                lists = try await fetchPublicLists()
            }
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchPublicLists() async throws -> [UserList] {
        let publicLists = try await listService.getPublicLists()
        return publicLists.sorted { $0.likeCount > $1.likeCount }
    }

    func loadLikes() async {
        guard let userId = session.getUserId() else { return }
        do {
            let likes = try await userService.getUserLikes(userId: userId)
            likedListIds = Set(likes.map { $0.listId })
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func toggleLike(_ list: UserList) async {
        guard let userId = session.getUserId() else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            if likedListIds.contains(list.id) {
                _ = try await userService.removeLike(userId: userId, listId: list.id)
                likedListIds.remove(list.id)
            } else {
                _ = try await userService.addLike(userId: userId, listId: list.id)
                likedListIds.insert(list.id)
            }
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
