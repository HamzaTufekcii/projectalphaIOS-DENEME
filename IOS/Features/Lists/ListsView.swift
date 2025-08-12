import SwiftUI

struct ListsView: View {
    @StateObject private var viewModel = ListsViewModel()
    @State private var newListName: String = ""

    var body: some View {
        NavigationView {
            VStack {
                List {
                    ForEach(viewModel.lists) { list in
                        HStack {
                            Text(list.name)
                            Spacer()
                            if list.isFavorite == true {
                                Image(systemName: "star.fill").foregroundColor(.yellow)
                            }
                        }
                        .onTapGesture {
                            Task { await viewModel.toggleFavorite(list.id) }
                        }
                    }
                    .onDelete { indexSet in
                        for index in indexSet {
                            let id = viewModel.lists[index].id
                            Task { await viewModel.removeList(id) }
                        }
                    }
                }
                HStack {
                    TextField("New list", text: $newListName)
                        .textFieldStyle(.roundedBorder)
                    Button("Add") {
                        let name = newListName
                        newListName = ""
                        Task { await viewModel.createList(name: name) }
                    }
                }
                .padding()
                if let message = viewModel.errorMessage {
                    Text(message).foregroundColor(.red)
                }
            }
            .navigationTitle("Lists")
            .task { await viewModel.loadLists() }
        }
    }
}

#Preview {
    ListsView()
}
