import SwiftUI
import CoreLocation

struct HomeView: View {
    @EnvironmentObject var appViewModel: AppViewModel
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var viewModel = HomeViewModel()
    @StateObject private var locationManager = LocationManager()
    @State private var showLogin = false
    @State private var showProfile = false
    @State private var showAddressSheet = false

    var body: some View {
        VStack {
            Text("Debug: topRated: \(viewModel.topRated.count), searchResults: \(viewModel.searchResults.count)")
                .font(.caption)
                .foregroundColor(.gray)
            
            List {
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            TextField("Ara", text: $viewModel.searchTerm)
                                .textFieldStyle(.roundedBorder)

                            Menu {
                                Section("Fiyat") {
                                    Button("$") { viewModel.priceRangeFilter = "$"; viewModel.applyFiltersAndSort() }
                                    Button("$$") { viewModel.priceRangeFilter = "$$"; viewModel.applyFiltersAndSort() }
                                    Button("$$$") { viewModel.priceRangeFilter = "$$$"; viewModel.applyFiltersAndSort() }
                                }
                                Section("Promosyon") {
                                    Button("Var") { viewModel.hasActivePromoFilter = true; viewModel.applyFiltersAndSort() }
                                    Button("Yok") { viewModel.hasActivePromoFilter = false; viewModel.applyFiltersAndSort() }
                                }
                                Section {
                                    Button("Adres") { showAddressSheet = true }
                                    Button("Temizle") { viewModel.clearFilters() }
                                }
                            } label: {
                                Image(systemName: "line.3.horizontal.decrease.circle")
                                    .padding(8)
                            }

                            Menu {
                                ForEach(SortOption.allCases, id: \.self) { option in
                                    Button(option.rawValue.capitalized) {
                                        viewModel.sortOption = option
                                        viewModel.applyFiltersAndSort()
                                    }
                                }
                            } label: {
                                Image(systemName: "arrow.up.arrow.down")
                                    .padding(8)
                            }

                            Button("Ara") {
                                Task { await viewModel.search() }
                            }

                            Button("Temizle") {
                                Task { await viewModel.reset() }
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
                                            .environmentObject(viewModel)
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
                                    .environmentObject(viewModel)
                            }
                        }
                    }
                }
            }
            .listStyle(.plain)
            .navigationTitle("Home")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        if authViewModel.isAuthenticated {
                            showProfile = true
                        } else {
                            showLogin = true
                        }
                    } label: {
                        if authViewModel.isAuthenticated {
                            Image(systemName: "person.crop.circle")
                        } else {
                            Text("Giriş")
                        }
                    }
                }
            }
            .sheet(isPresented: $showLogin) {
                LoginView()
            }
            .sheet(isPresented: $showProfile) {
                ProfileView()
            }
            .sheet(isPresented: $showAddressSheet) {
                NavigationStack {
                    Form {
                        Section("Adres") {
                            TextField("City", text: $viewModel.addressFilter.city)
                            TextField("District", text: $viewModel.addressFilter.district)
                            TextField("Neighborhood", text: $viewModel.addressFilter.neighborhood)
                            TextField("Street", text: $viewModel.addressFilter.street)
                        }
                    }
                    .navigationTitle("Adres Filtrele")
                    .toolbar {
                        ToolbarItem(placement: .confirmationAction) {
                            Button("Done") {
                                showAddressSheet = false
                                viewModel.applyFiltersAndSort()
                            }
                        }
                        ToolbarItem(placement: .cancellationAction) {
                            Button("Cancel") { showAddressSheet = false }
                        }
                    }
                }
            }
        }
        .task {
                let totalStartTime = Date()
                print("🚀 Starting parallel API calls...")
                print("🔍 Debug: HomeView.task started")
                
                // Paralel API çağrıları - 3 işlem aynı anda başlar
                async let topRated = viewModel.fetchTopRated()
                async let search = viewModel.search()
                async let favorites = viewModel.refreshFavorites()
                
                print("🔍 Debug: API calls initiated")
                
                // Hepsinin tamamlanmasını bekle
                await topRated
                await search
                await favorites
                
                let totalDuration = Date().timeIntervalSince(totalStartTime)
                print("✅ All API calls completed in: \(String(format: "%.2f", totalDuration))s")
                print("🔍 Debug: topRated count: \(viewModel.topRated.count)")
                print("🔍 Debug: searchResults count: \(viewModel.searchResults.count)")
            }
            .overlay {
                if viewModel.isLoading { LoadingView() }
            }
            .onReceive(locationManager.$userLocation.compactMap { $0 }) { location in
                viewModel.userLocation = location
                Task { await viewModel.fetchNearby() }
            }
            .errorAlert($viewModel.errorMessage)
            .alert("Location Error", isPresented: Binding(
                get: { locationManager.locationStatus != nil },
                set: { _ in locationManager.locationStatus = nil }
            )) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(locationManager.locationStatus ?? "")
            }
            .onChange(of: authViewModel.isAuthenticated) { isAuth in
                if isAuth { showLogin = false }
            }
    }
}

#Preview {
    let appVM = AppViewModel()
    return HomeView()
        .environmentObject(appVM)
        .environmentObject(AuthViewModel(appViewModel: appVM))
}

