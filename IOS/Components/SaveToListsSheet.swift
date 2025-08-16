import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

struct SaveToListsSheet: View {
    let businessId: String
    @StateObject private var viewModel = SaveToListsViewModel()
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Group {
                if viewModel.isLoading {
                    ProgressView("Yükleniyor...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    listsView
                }
            }
            .navigationTitle("Listelerine Ekle")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Kaydet") {
                        Task {
                            await viewModel.save(for: businessId)
                            if viewModel.errorMessage == nil {
                                #if canImport(UIKit)
                                let notification = UINotificationFeedbackGenerator()
                                notification.notificationOccurred(.success)
                                #endif
                                dismiss()
                            } else {
                                #if canImport(UIKit)
                                let notification = UINotificationFeedbackGenerator()
                                notification.notificationOccurred(.error)
                                #endif
                            }
                        }
                    }
                    .disabled(viewModel.isSaving)
                }
                ToolbarItem(placement: .cancellationAction) {
                    Button("İptal") {
                        dismiss()
                    }
                    .disabled(viewModel.isSaving)
                }
            }
        }
        .presentationDetents([.medium])
        .task {
            await viewModel.loadLists(for: businessId)
        }
        .errorAlert($viewModel.errorMessage)
    }

    private var listsView: some View {
        List(viewModel.lists) { list in
            listRow(for: list)
        }
    }

    private func listRow(for list: UserList) -> some View {
        let listBinding = binding(for: list.id)
        return Toggle(list.name, isOn: listBinding)
            .toggleStyle(SwitchToggleStyle(tint: .red))
            .onChange(of: listBinding.wrappedValue) { _ in
                #if canImport(UIKit)
                let impact = UIImpactFeedbackGenerator(style: .light)
                impact.impactOccurred()
                #endif
            }
    }

    private func binding(for listId: String) -> Binding<Bool> {
        Binding(
            get: { viewModel.selectedListIds.contains(listId) },
            set: { _ in
                viewModel.toggleSelection(for: listId)
            }
        )
    }
}

#Preview {
    SaveToListsSheet(businessId: "1")
}
