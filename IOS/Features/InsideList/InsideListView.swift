import SwiftUI

struct InsideListView: View {
    let list: UserList
    @StateObject private var viewModel = InsideListViewModel()

    var body: some View {
        List(viewModel.items) { restaurant in
            Text(restaurant.name)
        }
        .navigationTitle(list.name)
        .task {
            await viewModel.loadItems(listId: list.id)
        }
        .overlay {
            if let error = viewModel.errorMessage {
                Text(error).foregroundColor(.red)
            }
        }
    }
}

#Preview {
    InsideListView(list: .init(id: "1", name: "Sample", isFavorite: false, isPublic: true, likeCount: 0))
}
