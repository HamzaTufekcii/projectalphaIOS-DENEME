import Foundation

@MainActor
final class ListsViewModel: ObservableObject {
    @Published var lists: [UserList] = []
    @Published var errorMessage: String?
    @Published var statusMessage: String?

    private let service = ListService()
    private let session = UserSession.shared

    func loadLists() async {
        guard let userId = session.getUserId() else { return }
        do {
            lists = try await service.getUserLists(userId: userId)
            errorMessage = nil
            statusMessage = nil
        } catch {
            errorMessage = error.localizedDescription
            statusMessage = nil
        }
    }

    func createList(name: String, isPublic: Bool = false) async {
        guard let userId = session.getUserId() else { return }
        do {
            _ = try await service.createList(userId: userId, name: name, isPublic: isPublic)
            await loadLists()
            statusMessage = "List created"
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
            statusMessage = nil
        }
    }

    func removeList(_ id: String) async {
        guard let userId = session.getUserId() else { return }
        do {
            _ = try await service.removeList(userId: userId, listId: id)
            await loadLists()
            statusMessage = "List removed"
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
            statusMessage = nil
        }
    }
}
