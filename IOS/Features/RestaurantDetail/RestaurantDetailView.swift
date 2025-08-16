import SwiftUI

struct RestaurantDetailView: View {
    let businessId: String
    @StateObject private var viewModel = RestaurantDetailViewModel()
    @State private var showSaveToListsSheet = false

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
            
            // Save to Lists Section
            Section {
                Button(action: {
                    showSaveToListsSheet = true
                }) {
                    HStack {
                        Image(systemName: "heart.fill")
                            .foregroundColor(.red)
                        Text("Listelerime Ekle")
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundColor(.secondary)
                    }
                }
                .foregroundColor(.primary)
            }
        }
        .task {
            await viewModel.fetchBusiness(id: businessId)
            await viewModel.fetchPromotions(businessId: businessId)
        }
        .onAppear {
            Task {
                await viewModel.fetchReviews(businessId: businessId)
            }
        }
        .overlay {
            if viewModel.isLoading { LoadingView() }
        }
        .sheet(isPresented: $showSaveToListsSheet) {
            SaveToListsSheet(businessId: businessId)
        }
        .errorAlert($viewModel.errorMessage)
    }
}

#Preview {
    RestaurantDetailView(businessId: "1")
}
