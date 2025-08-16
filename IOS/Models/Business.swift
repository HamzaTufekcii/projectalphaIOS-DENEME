import Foundation

// MARK: - Domain models
struct Business: Identifiable {
    let id: String
    let name: String
    let description: String
    let priceRange: String
    let rating: Double
    /// Distance in meters from the user's location if available.
    let distance: Double?
    /// URL of the cover image associated with the business.
    let imageURL: String
    let address: Address?
    let tags: [Tag]
    let promotions: [Promotion]

    /// Convenience flag to check if any promotion is currently active.
    var hasActivePromo: Bool {
        promotions.contains { $0.isActive }
    }
}

struct Promotion: Identifiable {
    let id: String
    let title: String
    let description: String
    let startDate: String?
    let endDate: String?
    let amount: Int?
    let isActive: Bool
    let createdAt: String?
}

struct Review: Identifiable {
    let id: String
    let reviewerName: String
    let rating: Double
    let comment: String
}

struct Address: Identifiable {
    let id: String
    let street: String
    let city: String
    let district: String
    let neighborhood: String
}

struct Tag: Identifiable {
    let id: String
    let name: String
}
