import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

struct LoadingView: View {
    private var backgroundView: some View {
        #if canImport(UIKit)
        Color(UIKit.UIColor.systemBackground)
        #else
        Color.white
        #endif
    }
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.3).ignoresSafeArea()
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
                .padding()
                .background(backgroundView)
                .cornerRadius(8)
        }
    }
}

#Preview {
    LoadingView()
}
