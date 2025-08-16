import SwiftUI

struct InsideDiscoverView: View {
    @StateObject private var viewModel = InsideDiscoverViewModel()

    var body: some View {
        List(viewModel.businesses) { business in
            Text(business.name)
        }
        .navigationTitle("Discover")
        .task {
            await viewModel.loadTopRated()
        }
        .overlay {
            if viewModel.isLoading { LoadingView() }
        }
        .errorAlert($viewModel.errorMessage)
    }
}

#Preview {
    InsideDiscoverView()
}
