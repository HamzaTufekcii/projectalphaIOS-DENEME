import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var viewModel: AuthViewModel
    
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
    let appVM = AppViewModel()
    let authVM = AuthViewModel(appViewModel: appVM)
    return LoginView()
        .environmentObject(appVM)
        .environmentObject(authVM)
}
