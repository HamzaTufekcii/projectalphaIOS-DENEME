import SwiftUI

struct UserListsView: View {
    @StateObject private var viewModel = UserListsViewModel()

    var body: some View {
        List(viewModel.likedLists) { like in
            Text(like.name ?? "Unnamed")
        }
        .navigationTitle("User Lists")
        .task {
            await viewModel.loadLikes()
        }
        .overlay {
            if let error = viewModel.errorMessage {
                Text(error).foregroundColor(.red)
            }
        }
    }
}

#Preview {
    UserListsView()
}
