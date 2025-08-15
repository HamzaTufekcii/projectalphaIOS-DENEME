import Foundation

// MARK: - DTOs from backend
struct BusinessDTO: Decodable, Identifiable {
    let id: String
    let name: String
    let description: String?
    let priceRange: String?
    let avgRating: Double
    let address: AddressDTO?
    let tags: [TagDTO]
    let promotions: [PromotionDTO]
    /// Optional distance in meters from the user's location. Some endpoints
    /// such as `/nearby` include this value which can then be used for sorting
    /// purposes on the client side. When not provided by the backend this will
    /// simply be `nil`.
    let distance: Double?
}

struct AddressDTO: Decodable {
    let id: String?
    let street: String?
    let city: String?
    let district: String?
    let neighborhood: String?
}

struct TagDTO: Decodable {
    let id: String
    let name: String
}

struct PromotionDTO: Decodable {
    let id: String
    let title: String
    let description: String?
    let startDate: String?
    let endDate: String?
    /// Backend now returns promotion amounts as integers. Support decoding either
    /// an integer or a double value to maintain backwards compatibility.
    let amount: Int?
    let active: Bool
    let createdAt: String?

    private enum CodingKeys: String, CodingKey {
        case id, title, description, startDate, endDate, amount, active, createdAt
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        title = try container.decode(String.self, forKey: .title)
        description = try container.decodeIfPresent(String.self, forKey: .description)
        startDate = try container.decodeIfPresent(String.self, forKey: .startDate)
        endDate = try container.decodeIfPresent(String.self, forKey: .endDate)
        if let intAmount = try container.decodeIfPresent(Int.self, forKey: .amount) {
            amount = intAmount
        } else if let doubleAmount = try container.decodeIfPresent(Double.self, forKey: .amount) {
            amount = Int(doubleAmount)
        } else {
            amount = nil
        }
        active = try container.decode(Bool.self, forKey: .active)
        createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
    }
}

struct ReviewDTO: Decodable {
    let id: String
    let reviewerName: String?
    let rating: Double
    let comment: String?
}

struct ReviewInfoForBusinessDTO: Decodable {
    let review: InnerReview
    let reviewerName: String?

    struct InnerReview: Decodable {
        let id: String
        let comment: String?
        let rating: Double
    }
}

// MARK: - Domain models
struct Business: Identifiable {
    let id: String
    let name: String
    let description: String
    let priceRange: String
    let rating: Double
    /// Distance in meters from the user's location if available.
    let distance: Double?
    let address: Address?
    let tags: [Tag]
    let promotions: [Promotion]
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

// MARK: - Mappers
enum BusinessMapper {
    static func map(_ dto: BusinessDTO) -> Business {
        Business(
            id: dto.id,
            name: dto.name,
            description: dto.description ?? "",
            priceRange: dto.priceRange ?? "",
            rating: dto.avgRating,
            distance: dto.distance,
            address: AddressMapper.map(dto.address),
            tags: dto.tags.map(TagMapper.map),
            promotions: dto.promotions.map(PromotionMapper.map)
        )
    }
}

enum PromotionMapper {
    static func map(_ dto: PromotionDTO) -> Promotion {
        Promotion(
            id: dto.id,
            title: dto.title,
            description: dto.description ?? "",
            startDate: dto.startDate,
            endDate: dto.endDate,
            amount: dto.amount,
            isActive: dto.active,
            createdAt: dto.createdAt
        )
    }
}

enum ReviewMapper {
    static func map(_ dto: ReviewDTO) -> Review {
        Review(
            id: dto.id,
            reviewerName: dto.reviewerName ?? "",
            rating: dto.rating,
            comment: dto.comment ?? ""
        )
    }
}

enum ReviewInfoMapper {
    static func map(_ dto: ReviewInfoForBusinessDTO) -> Review {
        Review(
            id: dto.review.id,
            reviewerName: dto.reviewerName ?? "",
            rating: dto.review.rating,
            comment: dto.review.comment ?? ""
        )
    }
}

enum AddressMapper {
    static func map(_ dto: AddressDTO?) -> Address? {
        guard let dto = dto else { return nil }
        return Address(
            id: dto.id ?? "",
            street: dto.street ?? "",
            city: dto.city ?? "",
            district: dto.district ?? "",
            neighborhood: dto.neighborhood ?? ""
        )
    }
}

enum TagMapper {
    static func map(_ dto: TagDTO) -> Tag {
        Tag(id: dto.id, name: dto.name)
    }
}
