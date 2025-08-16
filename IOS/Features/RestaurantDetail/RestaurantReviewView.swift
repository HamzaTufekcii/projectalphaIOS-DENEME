import SwiftUI

struct RestaurantReviewView: View {
    let reviews: [Review]
    @State private var selectedRating: Int?

    private var filteredReviews: [Review] {
        if let rating = selectedRating {
            return reviews.filter { Int($0.rating.rounded()) == rating }
        } else {
            return reviews
        }
    }

    var body: some View {
        VStack {
            Picker("Rating", selection: $selectedRating) {
                Text("All").tag(Int?.none)
                ForEach((1...5).reversed(), id: \.self) { value in
                    Text("\(value)★").tag(Optional(value))
                }
            }
            .pickerStyle(.segmented)
            .padding()

            List(filteredReviews) { review in
                VStack(alignment: .leading) {
                    HStack(spacing: 2) {
                        ForEach(1...5, id: \.self) { star in
                            Image(systemName: star <= Int(review.rating.rounded()) ? "star.fill" : "star")
                                .foregroundColor(.yellow)
                        }
                        Text(review.reviewerName)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    if !review.comment.isEmpty {
                        Text(review.comment)
                    }
                }
                .padding(.vertical, 4)
            }
            .listStyle(.plain)
        }
    }
}

#Preview {
    RestaurantReviewView(reviews: [Review(id: "1", reviewerName: "A", rating: 4, comment: "Good")])
}
