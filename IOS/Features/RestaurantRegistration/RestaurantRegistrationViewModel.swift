import Foundation

@MainActor
final class RestaurantRegistrationViewModel: ObservableObject {
    @Published var restaurants: [Restaurant] = []
    @Published var errorMessage: String?
    @Published var isLoading = false

    private let service: BusinessService
    private let session: UserSession

    init(service: BusinessService = BusinessService(), session: UserSession = .shared) {
        self.service = service
        self.session = session
    }

    func loadOwnedBusinesses() async {
        guard let ownerId = session.getUserId() else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            restaurants = try await service.getBusinessesByOwner(ownerId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
