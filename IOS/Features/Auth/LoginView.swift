import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel: AuthViewModel

    init(appViewModel: AppViewModel) {
        _viewModel = StateObject(wrappedValue: AuthViewModel(appViewModel: appViewModel))
    }

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
                }
            }
        }
        .padding()
    }
}

#Preview {
    LoginView(appViewModel: AppViewModel())
}

