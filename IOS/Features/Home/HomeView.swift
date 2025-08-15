import SwiftUI
import CoreLocation

struct HomeView: View {
    @EnvironmentObject var appViewModel: AppViewModel
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var viewModel = BusinessViewModel()
    @StateObject private var locationManager = LocationManager()
    @State private var showLogin = false
    @State private var showProfile = false

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
                ToolbarItem(placement: .navigationBarTrailing) {
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
            .onChange(of: authViewModel.isAuthenticated) { isAuth in
                if isAuth { showLogin = false }
            }
        }
    }
}

#Preview {
    let appVM = AppViewModel()
    return HomeView()
        .environmentObject(appVM)
        .environmentObject(AuthViewModel(appViewModel: appVM))
}

