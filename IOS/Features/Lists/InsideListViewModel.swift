import Foundation

@MainActor
final class InsideListViewModel: ObservableObject {
    @Published var items: [Restaurant] = []
    @Published var errorMessage: String?
    @Published var statusMessage: String?

    private let service = ListService()
    private let session = UserSession.shared

    func loadItems(listId: String) async {
        guard let userId = session.getUserId() else { return }
        do {
            items = try await service.getUserListItems(userId: userId, listId: listId)
            errorMessage = nil
            statusMessage = nil
        } catch {
            errorMessage = error.localizedDescription
            statusMessage = nil
        }
    }

    func removeItem(listId: String, itemId: String) async {
        guard let userId = session.getUserId() else { return }
        do {
            _ = try await service.removeFromList(userId: userId, listId: listId, itemId: itemId)
            await loadItems(listId: listId)
            statusMessage = "Item removed"
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
            statusMessage = nil
        }
    }
}
