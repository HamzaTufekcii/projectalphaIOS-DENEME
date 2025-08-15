import Foundation

@MainActor
final class RestaurantRegistrationViewModel: ObservableObject {
    @Published var restaurants: [Restaurant] = []
    @Published var errorMessage: String?

    private let service = BusinessService()
    private let session = UserSession.shared

    func loadOwnedBusinesses() async {
        guard let ownerId = session.getUserId() else { return }
        do {
            restaurants = try await service.getBusinessesByOwner(ownerId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
