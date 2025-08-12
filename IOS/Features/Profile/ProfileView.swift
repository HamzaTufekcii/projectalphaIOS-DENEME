import SwiftUI

struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()
    @State private var name: String = ""
    @State private var email: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let profile = viewModel.profile {
                TextField("Name", text: $name)
                    .textFieldStyle(.roundedBorder)
                TextField("Email", text: $email)
                    .textFieldStyle(.roundedBorder)
                Button("Save") {
                    Task { await viewModel.updateProfile(name: name, email: email) }
                }
            } else {
                Text(viewModel.errorMessage ?? "Loading...")
                    .foregroundColor(viewModel.errorMessage == nil ? .primary : .red)
            }
        }
        .padding()
        .task {
            await viewModel.loadProfile()
            if let profile = viewModel.profile {
                name = profile.name
                email = profile.email ?? ""
            }
        }
    }
}

#Preview {
    ProfileView()
}
