import Foundation

// MARK: - DTOs from backend
struct BusinessDTO: Codable, Identifiable {
    let id: String
    let name: String
    let description: String?
    let priceRange: String?
    let avgRating: Double
    let createdAt: String?
    let ownerId: String?
    let address: AddressDTO?
    let tags: [TagDTO]?
    let promotions: [PromotionDTO]?
    let photos: [PhotoDTO]?
    let settings: BusinessSettingsDTO?
    let operatingHours: [OperatingHourDTO]?
    /// Optional distance in meters from the user's location. Some endpoints
    /// such as `/nearby` include this value which can then be used for sorting
    /// purposes on the client side. When not provided by the backend this will
    /// simply be `nil`.
    let distance: Double?
    
    // Backend gönderdiği field names (snake_case) ile iOS field names (camelCase) mapping
    private enum CodingKeys: String, CodingKey {
        case id, name, description, address, tags, promotions, photos, distance, settings, operatingHours
        case priceRange = "price_range"
        case avgRating = "avg_rating"
        case createdAt = "created_at"
        case ownerId = "owner_id1"
        // Alternative camelCase keys for wrapped responses
        case priceRangeCamel = "priceRange"
        case avgRatingCamel = "avgRating"
        case createdAtCamel = "createdAt"
    }
    
    // Custom init to handle both snake_case and camelCase
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decode(String.self, forKey: .id)
        name = try container.decode(String.self, forKey: .name)
        description = try container.decodeIfPresent(String.self, forKey: .description)
        address = try container.decodeIfPresent(AddressDTO.self, forKey: .address)
        tags = try container.decodeIfPresent([TagDTO].self, forKey: .tags)
        promotions = try container.decodeIfPresent([PromotionDTO].self, forKey: .promotions)
        photos = try container.decodeIfPresent([PhotoDTO].self, forKey: .photos)
        distance = try container.decodeIfPresent(Double.self, forKey: .distance)
        settings = try container.decodeIfPresent(BusinessSettingsDTO.self, forKey: .settings)
        operatingHours = try container.decodeIfPresent([OperatingHourDTO].self, forKey: .operatingHours)
        
        // Flexible field parsing - try both snake_case and camelCase
        if let priceRangeSnake = try container.decodeIfPresent(String.self, forKey: .priceRange) {
            priceRange = priceRangeSnake
        } else {
            priceRange = try container.decodeIfPresent(String.self, forKey: .priceRangeCamel)
        }
        
        if let avgRatingSnake = try container.decodeIfPresent(Double.self, forKey: .avgRating) {
            avgRating = avgRatingSnake
        } else {
            avgRating = try container.decodeIfPresent(Double.self, forKey: .avgRatingCamel) ?? 0.0
        }
        
        if let createdAtSnake = try container.decodeIfPresent(String.self, forKey: .createdAt) {
            createdAt = createdAtSnake
        } else {
            createdAt = try container.decodeIfPresent(String.self, forKey: .createdAtCamel)
        }
        
        ownerId = try container.decodeIfPresent(String.self, forKey: .ownerId)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encodeIfPresent(priceRange, forKey: .priceRange)
        try container.encode(avgRating, forKey: .avgRating)
        try container.encodeIfPresent(createdAt, forKey: .createdAt)
        try container.encodeIfPresent(ownerId, forKey: .ownerId)
        try container.encodeIfPresent(address, forKey: .address)
        try container.encodeIfPresent(tags, forKey: .tags)
        try container.encodeIfPresent(promotions, forKey: .promotions)
        try container.encodeIfPresent(photos, forKey: .photos)
        try container.encodeIfPresent(settings, forKey: .settings)
        try container.encodeIfPresent(operatingHours, forKey: .operatingHours)
        try container.encodeIfPresent(distance, forKey: .distance)
    }
}

struct AddressDTO: Codable {
    let id: String?
    let street: String?
    let city: String?
    let district: String?
    let neighborhood: String?
    let businessId: String?
    
    // Backend snake_case mapping
    private enum CodingKeys: String, CodingKey {
        case id, street, city, district, neighborhood
        case businessId = "business_id"
    }
}

struct TagDTO: Codable {
    let id: String
    let name: String
    let icon: TagIconDTO?
    
    struct TagIconDTO: Codable {
        let name: String
        let photo_url: String
        
        private enum CodingKeys: String, CodingKey {
            case name
            case photo_url
        }
    }
}

struct PromotionDTO: Codable {
    let id: String
    let title: String
    let description: String?
    let startDate: String?
    let endDate: String?
    /// Promotion discount amount represented as an optional integer to avoid
    /// floating point precision issues. Old backend versions might return a
    /// double which is coerced to `Int` during decoding.
    let amount: Int?
    let active: Bool
    let createdAt: String?
    let businessId: String?

    private enum CodingKeys: String, CodingKey {
        case id, title, description, amount, active
        case startDate = "start_date"
        case endDate = "end_date"
        case createdAt = "created_at"
        case businessId = "business_id"
        // Backend ayrıca startat/endat da gönderiyor
        case startAtAlt = "startat"
        case endAtAlt = "endat"
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        title = try container.decode(String.self, forKey: .title)
        description = try container.decodeIfPresent(String.self, forKey: .description)
        
        // startDate - önce start_date sonra startat dene
        if let startDateValue = try container.decodeIfPresent(String.self, forKey: .startDate) {
            startDate = startDateValue
        } else {
            startDate = try container.decodeIfPresent(String.self, forKey: .startAtAlt)
        }
        
        // endDate - önce end_date sonra endat dene
        if let endDateValue = try container.decodeIfPresent(String.self, forKey: .endDate) {
            endDate = endDateValue
        } else {
            endDate = try container.decodeIfPresent(String.self, forKey: .endAtAlt)
        }
        
        if let intAmount = try container.decodeIfPresent(Int.self, forKey: .amount) {
            amount = intAmount
        } else if let doubleAmount = try container.decodeIfPresent(Double.self, forKey: .amount) {
            amount = Int(doubleAmount)
        } else {
            amount = nil
        }
        active = try container.decode(Bool.self, forKey: .active)
        createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
        businessId = try container.decodeIfPresent(String.self, forKey: .businessId)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(title, forKey: .title)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encodeIfPresent(startDate, forKey: .startDate)
        try container.encodeIfPresent(endDate, forKey: .endDate)
        try container.encodeIfPresent(amount, forKey: .amount)
        try container.encode(active, forKey: .active)
        try container.encodeIfPresent(createdAt, forKey: .createdAt)
        try container.encodeIfPresent(businessId, forKey: .businessId)
    }
}

struct PhotoDTO: Codable {
    let id: String
    let url: String
    let caption: String?
    let cover: Bool
}

struct BusinessSettingsDTO: Codable {
    let id: String?
    let businessId: String?
    let petFriendly: Bool?
    let outdoor: Bool?
    let vegan: Bool?
    let parking: Bool?
    let smoking: Bool?
    let selfService: Bool?
    let wifi: Bool?
    
    private enum CodingKeys: String, CodingKey {
        case id
        case businessId = "business_id"
        case petFriendly, outdoor, vegan, parking, smoking, selfService, wifi
    }
}

struct OperatingHourDTO: Codable {
    let id: String?
    let businessId: String?
    let weekday: String?
    let openingTime: String?
    let closingTime: String?
    let oc: Bool?
    
    private enum CodingKeys: String, CodingKey {
        case id, weekday
        case businessId = "business_id"
        case openingTime = "opening_time"
        case closingTime = "closing_time"
        case oc = "o_c"
    }
}

struct ReviewDTO: Codable {
    let id: String
    let reviewerName: String?
    let rating: Double
    let comment: String?
}

struct ReviewInfoForBusinessDTO: Codable {
    let review: InnerReview
    let reviewerName: String?

    struct InnerReview: Codable {
        let id: String
        let comment: String?
        let rating: Double
    }
}

// MARK: - Mappers
enum BusinessMapper {
    /// Converts a backend `BusinessDTO` into the app's `Business` model.
    static func map(_ dto: BusinessDTO) -> Business {
        let coverPhoto = dto.photos?.first(where: { $0.cover }) ?? dto.photos?.first
        return Business(
            id: dto.id,
            name: dto.name,
            description: dto.description ?? "",
            priceRange: dto.priceRange ?? "",
            rating: dto.avgRating,
            distance: dto.distance,
            imageURL: coverPhoto?.url ?? "",
            photos: dto.photos?.map { $0.url } ?? [],
            address: AddressMapper.map(dto.address),
            tags: dto.tags?.map(TagMapper.map) ?? [],
            promotions: dto.promotions?.map(PromotionMapper.map) ?? []
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
