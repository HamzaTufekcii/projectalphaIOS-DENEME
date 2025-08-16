import SwiftUI

struct LoadingView: View {
    var body: some View {
        ZStack {
            Color.black.opacity(0.3).ignoresSafeArea()
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(8)
        }
    }
}

#Preview {
    LoadingView()
}
