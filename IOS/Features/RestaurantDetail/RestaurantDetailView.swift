import SwiftUI

struct RestaurantDetailView: View {
    let businessId: String
    @StateObject private var viewModel = BusinessViewModel()

    var body: some View {
        List {
            if let business = viewModel.selectedBusiness {
                VStack(alignment: .leading, spacing: 8) {
                    Text(business.name)
                        .font(.title)
                    Text(business.description)
                    HStack {
                        Text("⭐️ \(String(format: "%.1f", business.rating))")
                        Text(business.priceRange)
                    }
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    if let address = business.address {
                        Text("Address: \(address.street), \(address.city)")
                            .font(.subheadline)
                    }
                    if !business.tags.isEmpty {
                        Text("Tags: \(business.tags.map { $0.name }.joined(separator: ", "))")
                            .font(.subheadline)
                    }
                }
            } else {
                Text("Loading...")
            }

            if !viewModel.promotions.isEmpty {
                Section("Promotions") {
                    ForEach(viewModel.promotions) { promo in
                        VStack(alignment: .leading) {
                            Text(promo.title).bold()
                            Text(promo.description)
                        }
                    }
                }
            }

            if !viewModel.reviews.isEmpty {
                Section("Reviews") {
                    ForEach(viewModel.reviews) { review in
                        VStack(alignment: .leading) {
                            Text(review.reviewerName).bold()
                            Text(review.comment)
                        }
                    }
                }
            }
        }
        .task {
            await viewModel.fetchBusiness(id: businessId)
            await viewModel.fetchPromotions(businessId: businessId)
            await viewModel.fetchReviews(businessId: businessId)
        }
    }
}

#Preview {
    RestaurantDetailView(businessId: "1")
}
