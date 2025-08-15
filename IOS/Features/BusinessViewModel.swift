import Foundation

@MainActor
final class BusinessViewModel: ObservableObject {
    @Published var businesses: [Restaurant] = []
    @Published var selectedBusiness: Restaurant?
    @Published var promotions: [Promotion] = []
    @Published var reviews: [Review] = []
    @Published var errorMessage: String?

    private let service = BusinessService()

    func fetchAll() async {
        do {
            businesses = try await service.getAllBusinesses()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchBusiness(id: String) async {
        do {
            selectedBusiness = try await service.getBusinessById(id)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchPromotions(businessId: String) async {
        do {
            promotions = try await service.getBusinessPromotions(businessId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchReviews(businessId: String) async {
        do {
            reviews = try await service.getBusinessReviews(businessId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
