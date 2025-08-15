import SwiftUI

struct RegisterEmailView: View {
    @EnvironmentObject private var viewModel: AuthViewModel
    @State private var email: String = ""
    @State private var navigateToVerify = false

    var body: some View {
        VStack(spacing: 16) {
            TextField("Email", text: $email)
                .textFieldStyle(.roundedBorder)
            if let message = viewModel.errorMessage {
                Text(message).foregroundColor(.red)
            }
            Button("Send Code") {
                Task {
                    await viewModel.sendVerificationCode(email: email)
                    if viewModel.errorMessage == nil {
                        navigateToVerify = true
                    }
                }
            }
            NavigationLink(
                destination: VerifyCodeView(email: email),
                isActive: $navigateToVerify
            ) { EmptyView() }
        }
        .padding()
        .navigationTitle("Register Email")
    }
}

#Preview {
    let appVM = AppViewModel()
    let authVM = AuthViewModel(appViewModel: appVM)
    return RegisterEmailView()
        .environmentObject(appVM)
        .environmentObject(authVM)
}
