import Foundation

@MainActor
final class InsideDiscoverViewModel: ObservableObject {
    @Published var businesses: [Restaurant] = []
    @Published var errorMessage: String?

    private let service = BusinessService()

    func loadTopRated() async {
        do {
            businesses = try await service.getTopRated()
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
