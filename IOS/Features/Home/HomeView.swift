import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel = BusinessViewModel()

    var body: some View {
        NavigationView {
            List(viewModel.businesses) { business in
                NavigationLink(destination: RestaurantDetailView(businessId: business.id)) {
                    Text(business.name)
                }
            }
            .navigationTitle("Home")
            .task {
                await viewModel.fetchAll()
            }
        }
    }
}

#Preview {
    HomeView()
}
