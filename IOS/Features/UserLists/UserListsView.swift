import SwiftUI

struct UserListsView: View {
    @StateObject private var viewModel = UserListsViewModel()

    var body: some View {
        Text("User Lists")
            .navigationTitle("User Lists")
    }
}

#Preview {
    UserListsView()
}
