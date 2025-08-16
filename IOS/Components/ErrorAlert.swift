import SwiftUI

struct ErrorAlert: ViewModifier {
    @Binding var message: String?

    func body(content: Content) -> some View {
        content.alert("Error", isPresented: Binding(
            get: { message != nil },
            set: { _ in message = nil }
        )) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(message ?? "")
        }
    }
}

extension View {
    func errorAlert(_ message: Binding<String?>) -> some View {
        modifier(ErrorAlert(message: message))
    }
}

#Preview {
    Text("Preview").modifier(ErrorAlert(message: .constant("Sample error")))
}
