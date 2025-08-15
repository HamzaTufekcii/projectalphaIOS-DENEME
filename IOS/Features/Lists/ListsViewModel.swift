import Foundation

@MainActor
final class ListsViewModel: ObservableObject {
    @Published var lists: [UserList] = []
    @Published var errorMessage: String?

    private let service = ListService()
    private let session = UserSession.shared

    func loadLists() async {
        guard let userId = session.getUserId() else { return }
        do {
            lists = try await service.getUserLists(userId: userId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func createList(name: String) async {
        guard let userId = session.getUserId() else { return }
        do {
            let newList = try await service.createList(userId: userId, name: name)
            lists.append(newList)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func removeList(_ id: String) async {
        guard let userId = session.getUserId() else { return }
        do {
            try await service.removeList(userId: userId, listId: id)
            lists.removeAll { $0.id == id }
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
