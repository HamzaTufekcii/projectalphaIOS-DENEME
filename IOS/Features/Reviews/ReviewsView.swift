import SwiftUI

struct ReviewsView: View {
    @StateObject private var viewModel = ReviewsViewModel()
    @State private var showAlert = false
    @State private var alertMessage = ""

    var body: some View {
        List {
            ForEach(viewModel.reviews) { review in
                VStack(alignment: .leading) {
                    Text("Rating: \(review.rating)")
                    if let comment = review.comment {
                        Text(comment)
                    }
                }
            }
        }
        .task { await viewModel.loadReviews() }
        .navigationTitle("Reviews")
        .alert("Bilgi", isPresented: $showAlert) {
            Button("Tamam", role: .cancel) {}
        } message: {
            Text(alertMessage)
        }
        .onChange(of: viewModel.errorMessage) { newValue in
            if let newValue {
                alertMessage = newValue
                showAlert = true
                viewModel.errorMessage = nil
            }
        }
        .onChange(of: viewModel.successMessage) { newValue in
            if let newValue {
                alertMessage = newValue
                showAlert = true
                viewModel.successMessage = nil
            }
        }
    }
}

#Preview {
    ReviewsView()
}
