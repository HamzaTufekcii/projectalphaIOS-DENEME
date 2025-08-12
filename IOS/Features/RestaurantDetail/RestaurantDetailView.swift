import SwiftUI

struct RestaurantDetailView: View {
    let businessId: String
    @StateObject private var viewModel = BusinessViewModel()

    var body: some View {
        List {
            if let business = viewModel.selectedBusiness {
                Text(business.name)
                    .font(.title)
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
