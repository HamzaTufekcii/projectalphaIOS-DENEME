import Foundation

@MainActor
final class InsideDiscoverViewModel: ObservableObject {
    @Published var businesses: [Restaurant] = []
    @Published var errorMessage: String?
    @Published var isLoading = false
    
    private let service: BusinessService

    init(service: BusinessService = BusinessService()) {
        self.service = service
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
}
