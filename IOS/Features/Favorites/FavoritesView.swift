import SwiftUI

struct FavoritesView: View {
    @StateObject private var viewModel = FavoritesViewModel()

    var body: some View {
        List(viewModel.favorites) { restaurant in
            Text(restaurant.name)
        }
        .navigationTitle("Favorites")
        .task {
            await viewModel.loadFavorites()
        }
        .overlay {
            if let error = viewModel.errorMessage {
                Text(error).foregroundColor(.red)
            }
        }
    }
}

#Preview {
    FavoritesView()
}
