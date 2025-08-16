import Foundation

@MainActor
final class MyReviewsViewModel: ObservableObject {
    @Published var reviews: [UserReview] = []
    @Published var errorMessage: String?
    @Published var isLoading = false

    private let service: UserService
    private let session: UserSession

    init(service: UserService = UserService(), session: UserSession = .shared) {
        self.service = service
        self.session = session
    }

    func loadReviews() async {
        guard let userId = session.getUserId() else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            reviews = try await service.getUserReviews(userId: userId)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
