import Foundation

@MainActor
final class InsideListViewModel: ObservableObject {
    @Published var items: [Restaurant] = []
    @Published var errorMessage: String?

    private let service = ListService()
    private let session = UserSession.shared

    func loadItems(listId: String) async {
        guard let userId = session.getUserId() else { return }
        do {
            items = try await service.getUserListItems(userId: userId, listId: listId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
