import SwiftUI

struct InsideListView: View {
    let list: UserList
    @StateObject private var viewModel = InsideListViewModel()

    var body: some View {
        List(viewModel.items) { restaurant in
            HStack {
                Text(restaurant.name)
                Spacer()
                Button {
                    Task { await viewModel.removeItem(listId: list.id, itemId: restaurant.id) }
                } label: {
                    Image(systemName: "trash")
                        .foregroundColor(.red)
                }
            }
        }
        .navigationTitle(list.name)
        .task {
            await viewModel.loadItems(listId: list.id)
        }
        .overlay {
            VStack {
                if let status = viewModel.statusMessage {
                    Text(status).foregroundColor(.green)
                }
                if let error = viewModel.errorMessage {
                    Text(error).foregroundColor(.red)
                }
            }
        }
    }
}

#Preview {
    InsideListView(list: .init(id: "1", name: "Sample", isFavorite: false, isPublic: true, likeCount: 0))
}
