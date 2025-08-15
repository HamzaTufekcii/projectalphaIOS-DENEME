import Foundation

@MainActor
final class FavoritesViewModel: ObservableObject {
    @Published var favorites: [Restaurant] = []
    @Published var errorMessage: String?
    @Published var statusMessage: String?

    private let service = ListService()
    private let userService = UserService()
    private let session = UserSession.shared

    func loadFavorites() async {
        guard let userId = session.getUserId(),
              let favoritesId = userService.getUserFavoritesIdFromStorage() else { return }
        do {
            favorites = try await service.getUserListItems(userId: userId, listId: favoritesId)
            errorMessage = nil
            statusMessage = nil
        } catch {
            errorMessage = error.localizedDescription
            statusMessage = nil
        }
    }

    func removeFavorite(_ id: String) async {
        guard let userId = session.getUserId() else { return }
        do {
            favorites = try await service.toggleFavorite(userId: userId, itemId: id)
            statusMessage = "Removed from favorites"
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
            statusMessage = nil
        }
    }
}
