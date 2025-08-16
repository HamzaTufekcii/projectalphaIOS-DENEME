import SwiftUI

struct InsideDiscoverView: View {
    let listId: String
    @StateObject private var viewModel = InsideDiscoverViewModel()
    @StateObject private var homeViewModel = HomeViewModel()

    var body: some View {
        List(viewModel.businesses) { business in
            RestaurantRow(restaurant: business)
                .environmentObject(homeViewModel)
        }
        .navigationTitle("Discover")
        .task {
            await viewModel.loadListItems(listId: listId)
        }
        .overlay {
            if viewModel.isLoading { LoadingView() }
        }
        .errorAlert($viewModel.errorMessage)
    }
}

#Preview {
    InsideDiscoverView(listId: "1")
}
