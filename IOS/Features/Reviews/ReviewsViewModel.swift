import Foundation

@MainActor
final class ReviewsViewModel: ObservableObject {
    @Published var reviews: [UserReview] = []
    @Published var errorMessage: String?

    private let service = UserService()
    private let session = UserSession.shared

    func loadReviews() async {
        guard let userId = session.getUserId() else { return }
        do {
            reviews = try await service.getUserReviews(userId: userId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func addReview(for businessId: String, rating: Int, comment: String?) async {
        guard let userId = session.getUserId() else { return }
        let request = ReviewRequest(rating: rating, comment: comment)
        do {
            try await service.newReview(userId: userId, businessId: businessId, review: request)
            await loadReviews()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
