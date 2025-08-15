import SwiftUI

@main
struct FeastFineiOSApp: App {
    @StateObject private var appViewModel = AppViewModel()

    var body: some Scene {
        WindowGroup {
            HomeView()
                .environmentObject(appViewModel)
        }
    }
}
