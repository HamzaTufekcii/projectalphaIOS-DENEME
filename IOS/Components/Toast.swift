import SwiftUI
import UIKit

struct Toast: Equatable {
    enum Style {
        case success
        case error
    }
    let style: Style
    let message: String
}

struct ToastModifier: ViewModifier {
    @Binding var toast: Toast?

    func body(content: Content) -> some View {
        ZStack {
            content
            if let toast = toast {
                VStack {
                    Spacer()
                    HStack(spacing: 8) {
                        Image(systemName: iconName(for: toast.style))
                        Text(toast.message)
                    }
                    .padding()
                    .background(backgroundColor(for: toast.style))
                    .foregroundColor(.white)
                    .cornerRadius(8)
                    .padding()
                    .onAppear {
                        UINotificationFeedbackGenerator().notificationOccurred(feedback(for: toast.style))
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                            withAnimation {
                                toast = nil
                            }
                        }
                    }
                }
                .transition(.move(edge: .bottom).combined(with: .opacity))
                .animation(.easeInOut, value: toast)
            }
        }
    }

    private func backgroundColor(for style: Toast.Style) -> Color {
        switch style {
        case .success: return Color.green.opacity(0.8)
        case .error: return Color.red.opacity(0.8)
        }
    }

    private func iconName(for style: Toast.Style) -> String {
        switch style {
        case .success: return "checkmark.circle"
        case .error: return "xmark.octagon"
        }
    }

    private func feedback(for style: Toast.Style) -> UINotificationFeedbackGenerator.FeedbackType {
        switch style {
        case .success: return .success
        case .error: return .error
        }
    }
}

extension View {
    func toast(_ toast: Binding<Toast?>) -> some View {
        modifier(ToastModifier(toast: toast))
    }

    func errorAlert(_ message: Binding<String?>) -> some View {
        let toastBinding = Binding<Toast?>(
            get: {
                if let msg = message.wrappedValue {
                    return Toast(style: .error, message: msg)
                } else {
                    return nil
                }
            },
            set: { newValue in
                if newValue == nil {
                    message.wrappedValue = nil
                }
            }
        )
        return self.toast(toastBinding)
    }
}

#Preview {
    VStack {
        Button("Show Success") {}
    }
    .toast(.constant(Toast(style: .success, message: "Done")))
}
