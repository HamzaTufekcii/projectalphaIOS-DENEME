import Foundation

// MARK: - DTOs from backend
struct BusinessDTO: Decodable {
    let id: String
    let name: String
    let description: String?
    let priceRange: String?
    let avgRating: Double
    let promotions: [PromotionDTO]
}

struct PromotionDTO: Decodable {
    let id: String
    let title: String
    let description: String?
    let startDate: String?
    let endDate: String?
    let amount: Double?
    let active: Bool
    let createdAt: String?
}

struct ReviewDTO: Decodable {
    let id: String
    let reviewerName: String?
    let rating: Double
    let comment: String?
}

// MARK: - Domain models
struct Business: Identifiable {
    let id: String
    let name: String
    let description: String
    let priceRange: String
    let rating: Double
    let promotions: [Promotion]
}

struct Promotion: Identifiable {
    let id: String
    let title: String
    let description: String
    let startDate: String?
    let endDate: String?
    let amount: Double?
    let isActive: Bool
    let createdAt: String?
}

struct Review: Identifiable {
    let id: String
    let reviewerName: String
    let rating: Double
    let comment: String
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
