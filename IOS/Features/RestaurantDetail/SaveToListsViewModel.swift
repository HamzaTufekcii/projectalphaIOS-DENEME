import Foundation

@MainActor
final class SaveToListsViewModel: ObservableObject {
    @Published var lists: [UserList] = []
    @Published var selectedListIds = Set<String>()
    @Published var isLoading = false
    @Published var isSaving = false
    @Published var toast: Toast?
    
    private var initiallySelectedIds = Set<String>()
    private let listService: ListService
    private let userSession: UserSession
    
    init(listService: ListService = ListService(), userSession: UserSession = .shared) {
        self.listService = listService
        self.userSession = userSession
    }
    
    func loadLists(for businessId: String) async {
        guard let userId = userSession.getUserId() else { return }
        
        isLoading = true
        defer { isLoading = false }
        
        do {
            let fetchedLists = try await listService.getUserLists(userId: userId)
            
            // "Favorilerim" önce gelsin
            let sortedLists = fetchedLists.sorted { first, second in
                if first.name == "Favorilerim" { return true }
                if second.name == "Favorilerim" { return false }
                return first.name < second.name
            }
            
            // Her liste için mevcut durumu kontrol et
            var currentSelections = Set<String>()
            
            for list in sortedLists {
                do {
                    let items = try await listService.getUserListItems(userId: userId, listId: list.id)
                    if items.contains(where: { $0.id == businessId }) {
                        currentSelections.insert(list.id)
                    }
                } catch {
                    print("Error checking list \(list.name): \(error)")
                }
            }
            
            self.lists = sortedLists
            self.selectedListIds = currentSelections
            self.initiallySelectedIds = currentSelections
            
        } catch {
            self.toast = Toast(style: .error, message: error.localizedDescription)
        }
    }
    
    func toggleSelection(for listId: String) {
        if selectedListIds.contains(listId) {
            selectedListIds.remove(listId)
        } else {
            selectedListIds.insert(listId)
        }
    }
    
    func save(for businessId: String) async {
        guard let userId = userSession.getUserId() else { return }
        
        isSaving = true
        defer { isSaving = false }
        
        do {
            // Değişiklikleri tespit et ve uygula
            for list in lists {
                let wasSelected = initiallySelectedIds.contains(list.id)
                let isSelected = selectedListIds.contains(list.id)

                if wasSelected && !isSelected {
                    _ = try await listService.removeFromList(userId: userId, listId: list.id, itemId: businessId)
                } else if !wasSelected && isSelected {
                    if list.name == "Favorilerim" {
                        _ = try await listService.addToFavorites(userId: userId, itemId: businessId)
                    } else {
                        _ = try await listService.addToList(userId: userId, listId: list.id, itemId: businessId)
                    }
                }
            }
            toast = Toast(style: .success, message: "Listeler güncellendi")
        } catch {
            self.toast = Toast(style: .error, message: error.localizedDescription)
        }
    }
}
