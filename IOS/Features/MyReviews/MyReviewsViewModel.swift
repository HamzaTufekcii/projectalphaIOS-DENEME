import Foundation

@MainActor
final class MyReviewsViewModel: ObservableObject {
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
}
