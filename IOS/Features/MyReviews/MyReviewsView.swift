import SwiftUI

struct MyReviewsView: View {
    @StateObject private var viewModel = MyReviewsViewModel()

    var body: some View {
        List(viewModel.reviews) { review in
            VStack(alignment: .leading) {
                Text("Rating: \(review.rating)")
                if let comment = review.comment {
                    Text(comment)
                }
            }
        }
        .navigationTitle("My Reviews")
        .task {
            await viewModel.loadReviews()
        }
        .overlay {
            if let error = viewModel.errorMessage {
                Text(error).foregroundColor(.red)
            }
        }
    }
}

#Preview {
    MyReviewsView()
}
