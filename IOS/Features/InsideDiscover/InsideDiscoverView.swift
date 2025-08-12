import SwiftUI

struct InsideDiscoverView: View {
    @StateObject private var viewModel = InsideDiscoverViewModel()

    var body: some View {
        Text("Inside Discover")
            .navigationTitle("Discover")
    }
}

#Preview {
    InsideDiscoverView()
}
