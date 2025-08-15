import SwiftUI

struct RestaurantRow: View {
    let restaurant: Restaurant

    var body: some View {
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
            address: Address(id: "a1", street: "Main St", city: "City", district: "District", neighborhood: "Neighborhood"),
            tags: [Tag(id: "t1", name: "Fast Food")],
            promotions: []
        )
    )
}
