import SwiftUI

struct HomeView: View {
    @EnvironmentObject var appViewModel: AppViewModel
    @StateObject private var viewModel = BusinessViewModel()
    @State private var showLogin = false

    var body: some View {
        NavigationView {
            List {
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            TextField("Ara", text: $viewModel.searchTerm)
                                .textFieldStyle(.roundedBorder)
                            Button("Ara") {
                                Task { await viewModel.search() }
                            }
                        }
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                ForEach(Category.allCases, id: \.self) { category in
                                    Button {
                                        viewModel.searchTerm = category.rawValue
                                        Task { await viewModel.search() }
                                    } label: {
                                        Image(systemName: category.icon)
                                            .padding(8)
                                    }
                                }
                            }
                        }
                    }
                }

                if !viewModel.topRated.isEmpty {
                    Section("Top Rated") {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                ForEach(viewModel.topRated) { business in
                                    NavigationLink(destination: RestaurantDetailView(businessId: business.id)) {
                                        RestaurantRow(restaurant: business)
                                            .frame(width: 200)
                                    }
                                }
                            }
                        }
                    }
                }

                Section {
                    if viewModel.businesses.isEmpty {
                        Text("Sonuç bulunamadı")
                    } else {
                        ForEach(viewModel.businesses) { business in
                            NavigationLink(destination: RestaurantDetailView(businessId: business.id)) {
                                RestaurantRow(restaurant: business)
                            }
                        }
                    }
                }
            }
            .listStyle(.plain)
            .navigationTitle("Home")
            .toolbar {
                if !appViewModel.isAuthenticated {
                    Button("Giriş yap") { showLogin = true }
                }
            }
            .sheet(isPresented: $showLogin) {
                LoginView(appViewModel: appViewModel)
            }
            .task {
                await viewModel.fetchAll()
                await viewModel.fetchTopRated()
            }
        }
    }
}

enum Category: String, CaseIterable {
    case wine = "Wine"
    case pizza = "Pizza"
    case coffee = "Coffee"
    case burger = "Burger"
    case cafe = "Cafe"
    case promo = "Promo"

    var icon: String {
        switch self {
        case .wine: return "wineglass"
        case .pizza: return "takeoutbag.and.cup.and.straw"
        case .coffee: return "cup.and.saucer"
        case .burger: return "fork.knife"
        case .cafe: return "building.2"
        case .promo: return "tag"
        }
    }
}

#Preview {
    HomeView()
        .environmentObject(AppViewModel())
}

