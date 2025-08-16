import SwiftUI

@main
struct FeastFineiOSApp: App {
    @StateObject private var appViewModel: AppViewModel
    @StateObject private var authViewModel: AuthViewModel

    init() {
        let appVM = AppViewModel()
        _appViewModel = StateObject(wrappedValue: appVM)
        _authViewModel = StateObject(wrappedValue: AuthViewModel(appViewModel: appVM))
    }

    var body: some Scene {
        WindowGroup {
            NavigationStack {
                if appViewModel.isAuthenticated {
                    HomeView()
                } else {
                    LoginView()
                }
            }
            .environmentObject(appViewModel)
            .environmentObject(authViewModel)
        }
    }
}
