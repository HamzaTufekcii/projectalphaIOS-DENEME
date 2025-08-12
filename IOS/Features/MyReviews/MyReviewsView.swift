import SwiftUI

struct MyReviewsView: View {
    @StateObject private var viewModel = MyReviewsViewModel()

    var body: some View {
        Text("My Reviews")
            .navigationTitle("My Reviews")
    }
}

#Preview {
    MyReviewsView()
}
