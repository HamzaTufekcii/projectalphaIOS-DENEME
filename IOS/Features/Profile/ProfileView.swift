import SwiftUI

struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()
    @State private var name: String = ""
    @State private var surname: String = ""
    @State private var phoneNumber: String = ""
    @State private var email: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let profile = viewModel.profile {
                TextField("Name", text: $name)
                    .textFieldStyle(.roundedBorder)
                TextField("Surname", text: $surname)
                    .textFieldStyle(.roundedBorder)
                TextField("Phone Number", text: $phoneNumber)
                    .textFieldStyle(.roundedBorder)
                TextField("Email", text: $email)
                    .textFieldStyle(.roundedBorder)
                Button("Save") {
                    Task { await viewModel.updateProfile(name: name, surname: surname, phoneNumber: phoneNumber, email: email) }
                }
            } else if let error = viewModel.errorMessage {
                Text(error)
                    .foregroundColor(.red)
            } else {
                ProgressView()
            }
        }
        .padding()
        .task {
            await viewModel.loadProfile()
            if let profile = viewModel.profile {
                name = profile.name
                surname = profile.surname ?? ""
                phoneNumber = profile.phoneNumber ?? ""
                email = profile.email ?? ""
            }
        }
    }
}

#Preview {
    ProfileView()
}
