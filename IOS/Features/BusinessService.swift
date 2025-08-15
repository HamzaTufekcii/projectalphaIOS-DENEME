import Foundation

/// Service responsible for fetching business related data from backend.
final class BusinessService {
    private let api = APIClient.shared
    private let base = "business"

    func getAllBusinesses() async throws -> [Restaurant] {
        let dtos: [BusinessDTO] = try await api.request(base)
        return dtos.map(BusinessMapper.map)
    }

    func getBusinessById(_ id: String) async throws -> Restaurant {
        let dto: BusinessDTO = try await api.request("\(base)/\(id)")
        return BusinessMapper.map(dto)
    }

    func searchBusinesses(_ name: String) async throws -> [Restaurant] {
        let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? name
        let dtos: [BusinessDTO] = try await api.request("\(base)/search?name=\(encoded)")
        return dtos.map(BusinessMapper.map)
    }

    func getBusinessesByOwner(_ ownerId: String) async throws -> [Restaurant] {
        let dtos: [BusinessDTO] = try await api.request("\(base)/owner/\(ownerId)")
        return dtos.map(BusinessMapper.map)
    }

    func getTopRated(limit: Int = 5) async throws -> [Restaurant] {
        let dtos: [BusinessDTO] = try await api.request("\(base)/top?limit=\(limit)")
        return dtos.map(BusinessMapper.map)
    }

    func getByTag(_ tagId: String) async throws -> [Restaurant] {
        let dtos: [BusinessDTO] = try await api.request("\(base)/tag/\(tagId)")
        return dtos.map(BusinessMapper.map)
    }

    func getBusinessReviews(_ businessId: String) async throws -> [Review] {
        let dtos: [ReviewDTO] = try await api.request("\(base)/reviews/\(businessId)")
        return dtos.map(ReviewMapper.map)
    }

    func getBusinessPromotions(_ businessId: String) async throws -> [Promotion] {
        let dtos: [PromotionDTO] = try await api.request("\(base)/promotions/\(businessId)")
        return dtos.map(PromotionMapper.map)
    }

    func newPromotion(_ businessId: String, promotion: PromotionRequest) async throws -> Promotion {
        let body = try JSONEncoder().encode(promotion)
        let dto: PromotionDTO = try await api.request("\(base)/promotions/\(businessId)", method: "POST", body: body)
        return PromotionMapper.map(dto)
    }

    func updatePromotion(_ businessId: String, promotionId: String, promotion: PromotionRequest) async throws -> Promotion {
        let body = try JSONEncoder().encode(promotion)
        let dto: PromotionDTO = try await api.request("\(base)/promotions/\(businessId)/\(promotionId)", method: "PATCH", body: body)
        return PromotionMapper.map(dto)
    }

    func deletePromotion(_ businessId: String, promotionId: String) async throws {
        let _: EmptyResponse = try await api.request("\(base)/promotions/\(businessId)/\(promotionId)", method: "DELETE")
    }

    func setViewed(_ reviewId: String) async throws {
        let _: EmptyResponse = try await api.request("\(base)/reviews/\(reviewId)", method: "PATCH")
    }
}

struct PromotionRequest: Encodable {
    let title: String
    let description: String?
    let startDate: String?
    let endDate: String?
    let amount: Int?
    let isActive: Bool
}

private struct EmptyResponse: Decodable {}
