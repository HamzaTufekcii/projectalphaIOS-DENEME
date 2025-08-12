import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = AuthViewModel()
    @EnvironmentObject var appViewModel: AppViewModel

    var body: some View {
        VStack(spacing: 16) {
            TextField("Email", text: $viewModel.email)
                .textFieldStyle(.roundedBorder)
            SecureField("Password", text: $viewModel.password)
                .textFieldStyle(.roundedBorder)
            if let message = viewModel.errorMessage {
                Text(message).foregroundColor(.red)
            }
            Button("Login") {
                Task {
                    await viewModel.login()
                    if viewModel.isAuthenticated {
                        appViewModel.isAuthenticated = true
                    }
                }
            }
        }
        .padding()
    }
}

#Preview {
    LoginView()
}

