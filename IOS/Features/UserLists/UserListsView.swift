import SwiftUI

struct UserListsView: View {
    @StateObject private var viewModel = UserListsViewModel()

    var body: some View {
        VStack {
            Picker("Mode", selection: $viewModel.mode) {
                Text("Listelerim").tag(UserListsViewModel.Mode.myLists)
                Text("Keşfet").tag(UserListsViewModel.Mode.explore)
            }
            .pickerStyle(.segmented)

            List(viewModel.lists) { list in
                HStack {
                    Text(list.name)
                    Spacer()
                    Text("\(list.likeCount)")
                        .foregroundColor(.secondary)
                    Button {
                        Task { await viewModel.toggleLike(list) }
                    } label: {
                        Image(systemName: viewModel.likedListIds.contains(list.id) ? "heart.fill" : "heart")
                            .foregroundColor(.red)
                    }
                }
            }
        }
        .navigationTitle("Listeler")
        .task {
            await viewModel.load()
        }
        .onChange(of: viewModel.mode) { _ in
            Task { await viewModel.loadLists() }
        }
        .overlay {
            if viewModel.isLoading { LoadingView() }
        }
        .errorAlert($viewModel.errorMessage)
    }
}

#Preview {
    UserListsView()
}
