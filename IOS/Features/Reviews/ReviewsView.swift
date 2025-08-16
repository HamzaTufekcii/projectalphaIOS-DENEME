import SwiftUI

struct ReviewsView: View {
    @StateObject private var viewModel = ReviewsViewModel()

    var body: some View {
        List {
            ForEach(viewModel.reviews) { review in
                VStack(alignment: .leading) {
                    Text("Rating: \(review.rating)")
                    if let comment = review.comment {
                        Text(comment)
                    }
                }
            }
        }
        .task { await viewModel.loadReviews() }
        .navigationTitle("Reviews")
        .toast($viewModel.toast)
    }
}

#Preview {
    ReviewsView()
}
