import SwiftUI

struct RestaurantDetailView: View {
    let businessId: String
    @StateObject private var viewModel = RestaurantDetailViewModel()
    @State private var showSaveToListsSheet = false
    @State private var isFavorite = false
    @State private var selectedTab: DetailTab = .overview

    enum DetailTab: String, CaseIterable, Identifiable {
        case overview, reviews, photos
        var id: Self { self }
        var title: String {
            switch self {
            case .overview: return "Overview"
            case .reviews: return "Reviews"
            case .photos: return "Photos"
            }
        }
    }

    var body: some View {
        VStack {
            Picker("Tab", selection: $selectedTab) {
                ForEach(DetailTab.allCases) { tab in
                    Text(tab.title).tag(tab)
                }
            }
            .pickerStyle(.segmented)
            .padding([.horizontal, .top])

            content
        }
        .navigationTitle(viewModel.selectedBusiness?.name ?? "")
        .toolbar {
            Button(action: {
                isFavorite.toggle()
                if isFavorite {
                    showSaveToListsSheet = true
                }
            }) {
                Image(systemName: isFavorite ? "heart.fill" : "heart")
                    .foregroundColor(.red)
            }
        }
        .task {
            // Paralel API çağrıları - tüm veriler aynı anda yüklenir
            async let business = viewModel.fetchBusiness(id: businessId)
            async let promotions = viewModel.fetchPromotions(businessId: businessId)
            async let reviews = viewModel.fetchReviews(businessId: businessId)

            // Hepsinin tamamlanmasını bekle
            await business
            await promotions
            await reviews
        }
        .overlay {
            if viewModel.isLoading { LoadingView() }
        }
        .sheet(isPresented: $showSaveToListsSheet) {
            SaveToListsSheet(businessId: businessId)
        }
        .toast($viewModel.toast)
    }

    @ViewBuilder
    private var content: some View {
        switch selectedTab {
        case .overview:
            overview
        case .reviews:
            RestaurantReviewView(reviews: viewModel.reviews)
        case .photos:
            PhotoGalleryView(imageURLs: viewModel.selectedBusiness?.photos ?? [])
        }
    }

    private var overview: some View {
        List {
            if let business = viewModel.selectedBusiness {
                VStack(alignment: .leading, spacing: 8) {
                    Text(business.name)
                        .font(.title)
                    Text(business.description)
                    HStack(spacing: 4) {
                        StarRatingView(rating: business.rating)
                        Text(String(format: "%.1f", business.rating))
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
        }
    }
}

struct PhotoGalleryView: View {
    let imageURLs: [String]

    var body: some View {
        TabView {
            ForEach(imageURLs, id: \.self) { url in
                ZoomableAsyncImage(urlString: url)
            }
        }
        .tabViewStyle(.page)
        .frame(height: 250)
    }
}

private struct ZoomableAsyncImage: View {
    let urlString: String
    @State private var scale: CGFloat = 1.0

    var body: some View {
        GeometryReader { _ in
            ScrollView([.horizontal, .vertical], showsIndicators: false) {
                AsyncImage(url: URL(string: urlString)) { phase in
                    if let image = phase.image {
                        image
                            .resizable()
                            .scaledToFit()
                            .scaleEffect(scale)
                            .gesture(
                                MagnificationGesture()
                                    .onChanged { value in
                                        scale = value
                                    }
                                    .onEnded { value in
                                        withAnimation {
                                            scale = max(1.0, value)
                                        }
                                    }
                            )
                    } else if phase.error != nil {
                        Color.red
                    } else {
                        ProgressView()
                    }
                }
            }
        }
    }
}

#Preview {
    RestaurantDetailView(businessId: "1")
}
