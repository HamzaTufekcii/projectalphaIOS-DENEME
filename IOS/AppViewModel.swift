import Foundation

@MainActor
final class AppViewModel: ObservableObject {
    @Published var isAuthenticated: Bool = false
}
