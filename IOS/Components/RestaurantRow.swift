import SwiftUI

struct RestaurantRow: View {
    let restaurant: Restaurant
    @EnvironmentObject var listViewModel: HomeViewModel

    var body: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Text(restaurant.name)
                    .font(.headline)
                HStack {
                    Text("⭐️ \(String(format: "%.1f", restaurant.rating))")
                    Text(restaurant.priceRange)
                }
                .font(.subheadline)
                .foregroundStyle(.secondary)

                if let address = restaurant.address {
                    Text("\(address.street), \(address.city)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                if !restaurant.tags.isEmpty {
                    Text(restaurant.tags.map { $0.name }.joined(separator: ", "))
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            Spacer()
            Button {
                Task {
                    await listViewModel.toggleFavorite(restaurant.id)
                    await listViewModel.refreshFavorites()
                }
            } label: {
                Image(systemName: listViewModel.favoriteIds.contains(restaurant.id) ? "heart.fill" : "heart")
                    .foregroundStyle(.red)
            }
            .buttonStyle(.plain)
        }
    }
}

#Preview {
    RestaurantRow(
        restaurant: Business(
            id: "1",
            name: "Preview Restaurant",
            description: "",
            priceRange: "$$",
            rating: 4.5,
            distance: 1500,
            address: Address(id: "a1", street: "Main St", city: "City", district: "District", neighborhood: "Neighborhood"),
            tags: [Tag(id: "t1", name: "Fast Food")],
            promotions: []
        )
    )
    .environmentObject(HomeViewModel())
}
