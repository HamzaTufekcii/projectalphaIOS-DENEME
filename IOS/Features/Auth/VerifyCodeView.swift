import SwiftUI

struct VerifyCodeView: View {
    @EnvironmentObject private var viewModel: AuthViewModel
    let email: String
    @State private var code: String = ""
    @State private var navigateToPassword = false

    var body: some View {
        VStack(spacing: 16) {
            TextField("Verification Code", text: $code)
                .textFieldStyle(.roundedBorder)
            if let message = viewModel.errorMessage {
                Text(message).foregroundColor(.red)
            }
            Button("Verify") {
                Task {
                    await viewModel.verifyCode(email: email, token: code)
                    if viewModel.errorMessage == nil {
                        navigateToPassword = true
                    }
                }
            }
            NavigationLink(value: navigateToPassword ? email : nil) {
                EmptyView()
            }
            .navigationDestination(for: String.self) { email in
                SetPasswordView(email: email)
            }
        }
        .padding()
        .navigationTitle("Verify Code")
    }
}

#Preview {
    let appVM = AppViewModel()
    let authVM = AuthViewModel(appViewModel: appVM)
    return VerifyCodeView(email: "test@example.com")
        .environmentObject(appVM)
        .environmentObject(authVM)
}
