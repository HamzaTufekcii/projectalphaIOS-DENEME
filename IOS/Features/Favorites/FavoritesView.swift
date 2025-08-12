import SwiftUI

struct FavoritesView: View {
    @StateObject private var viewModel = FavoritesViewModel()

    var body: some View {
        Text("Favorites")
            .navigationTitle("Favorites")
    }
}

#Preview {
    FavoritesView()
}
