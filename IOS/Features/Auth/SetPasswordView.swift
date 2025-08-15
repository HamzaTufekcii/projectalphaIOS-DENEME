import SwiftUI

struct SetPasswordView: View {
    @EnvironmentObject private var viewModel: AuthViewModel
    let email: String
    @State private var password: String = ""

    var body: some View {
        VStack(spacing: 16) {
            SecureField("Password", text: $password)
                .textFieldStyle(.roundedBorder)
            if let message = viewModel.errorMessage {
                Text(message).foregroundColor(.red)
            }
            Button("Set Password") {
                Task {
                    await viewModel.updateUser(email: email, password: password, role: viewModel.role)
                    if viewModel.errorMessage == nil {
                        viewModel.email = email
                        viewModel.password = password
                        await viewModel.login()
                    }
                }
            }
        }
        .padding()
        .navigationTitle("Set Password")
    }
}

#Preview {
    let appVM = AppViewModel()
    let authVM = AuthViewModel(appViewModel: appVM)
    return SetPasswordView(email: "test@example.com")
        .environmentObject(appVM)
        .environmentObject(authVM)
}
