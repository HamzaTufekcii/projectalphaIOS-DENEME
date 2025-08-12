import SwiftUI

struct InsideListView: View {
    @StateObject private var viewModel = InsideListViewModel()

    var body: some View {
        Text("Inside List")
            .navigationTitle("List")
    }
}

#Preview {
    InsideListView()
}
