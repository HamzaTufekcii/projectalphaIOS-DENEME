import SwiftUI
import CoreLocation

struct HomeView: View {
    @EnvironmentObject var appViewModel: AppViewModel
    @StateObject private var viewModel = BusinessViewModel()
    @StateObject private var locationManager = LocationManager()
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
                                ForEach(FilterType.allCases, id: \.self) { filter in
                                    Button {
                                        viewModel.selectedFilter = filter
                                        Task { await viewModel.applyFilter() }
                                    } label: {
                                        Image(systemName: filter.icon)
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
                    if viewModel.searchResults.isEmpty {
                        Text("Sonuç bulunamadı")
                    } else {
                        ForEach(viewModel.searchResults) { business in
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
                await viewModel.fetchTopRated()
                await viewModel.search()
            }
            .onReceive(locationManager.$userLocation.compactMap { $0 }) { location in
                viewModel.userLocation = location
                Task { await viewModel.fetchNearby() }
            }
            .alert("Error", isPresented: Binding(
                get: { viewModel.errorMessage != nil },
                set: { _ in viewModel.errorMessage = nil }
            )) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
            .alert("Location Error", isPresented: Binding(
                get: { locationManager.locationStatus != nil },
                set: { _ in locationManager.locationStatus = nil }
            )) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(locationManager.locationStatus ?? "")
            }
        }
    }
}

#Preview {
    HomeView()
        .environmentObject(AppViewModel())
}

