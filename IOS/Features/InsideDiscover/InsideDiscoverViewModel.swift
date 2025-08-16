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
            errorMessage = error.localizedDescription
        }
    }
}
