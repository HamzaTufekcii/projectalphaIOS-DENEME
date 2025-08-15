import Foundation

@MainActor
final class FavoritesViewModel: ObservableObject {
    @Published var favorites: [Restaurant] = []
    @Published var errorMessage: String?

    private let service = ListService()
    private let userService = UserService()
    private let session = UserSession.shared

    func loadFavorites() async {
        guard let userId = session.getUserId(),
              let favoritesId = userService.getUserFavoritesIdFromStorage() else { return }
        do {
            favorites = try await service.getUserListItems(userId: userId, listId: favoritesId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
