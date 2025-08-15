import SwiftUI

struct RestaurantRegistrationView: View {
    @StateObject private var viewModel = RestaurantRegistrationViewModel()

    var body: some View {
        List(viewModel.restaurants) { restaurant in
            Text(restaurant.name)
        }
        .navigationTitle("Register")
        .task {
            await viewModel.loadOwnedBusinesses()
        }
        .overlay {
            if let error = viewModel.errorMessage {
                Text(error).foregroundColor(.red)
            }
        }
    }
}

#Preview {
    RestaurantRegistrationView()
}
