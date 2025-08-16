import SwiftUI

struct FavoritesView: View {
    @StateObject private var viewModel = FavoritesViewModel()

    var body: some View {
        List(viewModel.favorites) { restaurant in
            HStack {
                Text(restaurant.name)
                Spacer()
                Button {
                    Task { await viewModel.removeFavorite(restaurant.id) }
                } label: {
                    Image(systemName: "heart.slash")
                        .foregroundColor(.red)
                }
            }
        }
        .navigationTitle("Favorites")
        .task {
            await viewModel.loadFavorites()
        }
        .overlay {
            if viewModel.isLoading { LoadingView() }
        }
        .overlay(alignment: .bottom) {
            if let status = viewModel.statusMessage {
                Text(status).foregroundColor(.green)
            }
        }
        .errorAlert($viewModel.errorMessage)
    }
}

#Preview {
    FavoritesView()
}
