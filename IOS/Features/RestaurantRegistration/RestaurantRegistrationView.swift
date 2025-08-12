import SwiftUI

struct RestaurantRegistrationView: View {
    @StateObject private var viewModel = RestaurantRegistrationViewModel()

    var body: some View {
        Text("Restaurant Registration")
            .navigationTitle("Register")
    }
}

#Preview {
    RestaurantRegistrationView()
}
