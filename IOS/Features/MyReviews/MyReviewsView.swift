import SwiftUI

struct MyReviewsView: View {
    @StateObject private var viewModel = MyReviewsViewModel()

    var body: some View {
        Group {
            if viewModel.reviews.isEmpty {
                Text("No reviews yet")
                    .foregroundColor(.secondary)
            } else {
                List(viewModel.reviews) { review in
                    VStack(alignment: .leading) {
                        Text("Rating: \(review.rating)")
                        if let comment = review.comment {
                            Text(comment)
                        }
                    }
                }
            }
        }
        .navigationTitle("My Reviews")
        .task {
            await viewModel.loadReviews()
        }
        .overlay {
            if viewModel.isLoading { LoadingView() }
        }
        .errorAlert($viewModel.errorMessage)
    }
}

#Preview {
    MyReviewsView()
}
