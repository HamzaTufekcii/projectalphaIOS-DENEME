import SwiftUI

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
                    List(viewModel.lists) { list in
                        Toggle(list.name, isOn: binding(for: list.id))
                            .toggleStyle(SwitchToggleStyle(tint: .red))
                            .onChange(of: viewModel.selectedListIds.contains(list.id)) { _ in
                                // Haptic feedback
                                let impact = UIImpactFeedbackGenerator(style: .light)
                                impact.impactOccurred()
                            }
                    }
                }
            }
            .navigationTitle("Listelerine Ekle")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Kaydet") {
                        Task {
                            await viewModel.save(for: businessId)
                            if viewModel.errorMessage == nil {
                                // Success haptic
                                let notification = UINotificationFeedbackGenerator()
                                notification.notificationOccurred(.success)
                                dismiss()
                            } else {
                                // Error haptic
                                let notification = UINotificationFeedbackGenerator()
                                notification.notificationOccurred(.error)
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
