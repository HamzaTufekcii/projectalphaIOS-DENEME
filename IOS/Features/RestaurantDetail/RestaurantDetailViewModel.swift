import Foundation

@MainActor
final class RestaurantDetailViewModel: ObservableObject {
    @Published var selectedBusiness: Restaurant?
    @Published var promotions: [Promotion] = []
    @Published var reviews: [Review] = []
    @Published var errorMessage: String?
    @Published var isLoading = false
    
    private let service: BusinessService

    init(service: BusinessService = BusinessService()) {
        self.service = service
    }

    func fetchBusiness(id: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            selectedBusiness = try await service.getBusinessById(id)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchPromotions(businessId: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            promotions = try await service.getBusinessPromotions(businessId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchReviews(businessId: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            reviews = try await service.getBusinessReviews(businessId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func markReviewViewed(_ reviewId: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            _ = try await service.setViewed(reviewId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
