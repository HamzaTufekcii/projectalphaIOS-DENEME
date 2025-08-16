import SwiftUI

struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()
    @EnvironmentObject private var authViewModel: AuthViewModel
    @EnvironmentObject private var appViewModel: AppViewModel
    @State private var name: String = ""
    @State private var surname: String = ""
    @State private var phoneNumber: String = ""
    @State private var email: String = ""
    @State private var newPassword: String = ""
    @State private var confirmPassword: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if viewModel.profile != nil {
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
                SecureField("New Password", text: $newPassword)
                    .textFieldStyle(.roundedBorder)
                SecureField("Confirm Password", text: $confirmPassword)
                    .textFieldStyle(.roundedBorder)
                Button("Change Password") {
                    guard newPassword == confirmPassword else {
                        viewModel.errorMessage = "Passwords do not match"
                        return
                    }
                    Task {
                        await viewModel.changePassword(newPassword: newPassword)
                        newPassword = ""
                        confirmPassword = ""
                    }
                }
                Button("Logout") {
                    authViewModel.logout()
                    appViewModel.isAuthenticated = false
                }
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
        .overlay {
            if viewModel.isLoading { LoadingView() }
        }
        .errorAlert($viewModel.errorMessage)
    }
}

#Preview {
    ProfileView()
}
