import SwiftUI

struct StarRatingView: View {
    let rating: Double
    private let maxRating = 5

    var body: some View {
        HStack(spacing: 2) {
            ForEach(0..<maxRating, id: \.self) { index in
                let threshold = Double(index) + 1
                let systemName: String
                if rating >= threshold {
                    systemName = "star.fill"
                } else if rating + 0.5 >= threshold {
                    systemName = "star.leadinghalf.filled"
                } else {
                    systemName = "star"
                }
                Image(systemName: systemName)
                    .foregroundColor(.yellow)
            }
        }
    }
}

#Preview {
    StarRatingView(rating: 3.5)
}
