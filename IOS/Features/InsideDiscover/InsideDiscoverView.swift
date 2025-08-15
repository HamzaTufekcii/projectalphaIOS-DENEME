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
            if let error = viewModel.errorMessage {
                Text(error).foregroundColor(.red)
            }
        }
    }
}

#Preview {
    InsideDiscoverView()
}
