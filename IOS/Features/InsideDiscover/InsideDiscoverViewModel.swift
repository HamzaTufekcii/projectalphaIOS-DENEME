import Foundation

@MainActor
final class InsideDiscoverViewModel: ObservableObject {
    @Published var businesses: [Restaurant] = []
    @Published var errorMessage: String?
    @Published var isLoading = false

    private let service: BusinessService
    private let listService: ListService
    private let session: UserSession

    init(service: BusinessService = BusinessService(),
         listService: ListService = ListService(),
         session: UserSession = .shared) {
        self.service = service
        self.listService = listService
        self.session = session
    }

    func loadTopRated() async {
        isLoading = true
        defer { isLoading = false }
        do {
            businesses = try await service.getTopRated()
            errorMessage = nil
        } catch {
            // Temporarily disable error popup for top rated
            print("⚠️ Top rated fetch failed: \(error.localizedDescription)")
            // errorMessage = error.localizedDescription
        }
    }

    func loadListItems(listId: String) async {
        guard let userId = session.getUserId() else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            businesses = try await listService.getUserListItems(userId: userId, listId: listId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
