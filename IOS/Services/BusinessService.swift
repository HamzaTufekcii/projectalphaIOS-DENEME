import Foundation

/// Service responsible for fetching business related data from backend via `APIClient`.
final class BusinessService: @unchecked Sendable {
    private let api: APIClientProtocol
    private let base = "api/business"

    init(api: APIClientProtocol = APIClient.shared) {
        self.api = api
    }

    func getAllBusinesses() async throws -> [Restaurant] {
        // Cache for 10 minutes - business list changes rarely
        let dtos: [BusinessDTO] = try await api.request(base, method: "GET", body: nil, useCache: true, cacheTTL: 600)
        return dtos.map(BusinessMapper.map)
    }

    func getBusinessById(_ id: String) async throws -> Restaurant {
        // Cache for 15 minutes - individual business details change rarely
        let dto: BusinessDTO = try await api.request("\(base)/\(id)", method: "GET", body: nil, useCache: true, cacheTTL: 900)
        return BusinessMapper.map(dto)
    }

    func searchBusinesses(_ name: String) async throws -> [Restaurant] {
        let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? name
        // Cache search results for 5 minutes - users often repeat searches
        let dtos: [BusinessDTO] = try await api.request("\(base)/search?name=\(encoded)", method: "GET", body: nil, useCache: true, cacheTTL: 300)
        return dtos.map(BusinessMapper.map)
    }

    func getBusinessesByOwner(_ ownerId: String) async throws -> [Restaurant] {
        // Cache for 10 minutes - owner's businesses don't change often
        let dtos: [BusinessDTO] = try await api.request("\(base)/owner/\(ownerId)", method: "GET", body: nil, useCache: true, cacheTTL: 600)
        return dtos.map(BusinessMapper.map)
    }

    func getTopRated(limit: Int = 5) async throws -> [Restaurant] {
        // Cache for 5 minutes - top rated should be relatively fresh
        let dtos: [BusinessDTO] = try await api.request("\(base)/top?limit=\(limit)", method: "GET", body: nil, useCache: true, cacheTTL: 300)
        return dtos.map(BusinessMapper.map)
    }

    func getByTag(_ tagId: String) async throws -> [Restaurant] {
        // Cache for 10 minutes - tag-based results change rarely
        let dtos: [BusinessDTO] = try await api.request("\(base)/tag/\(tagId)", method: "GET", body: nil, useCache: true, cacheTTL: 600)
        return dtos.map(BusinessMapper.map)
    }

    func getBusinessReviews(_ businessId: String) async throws -> [Review] {
        // Cache for 5 minutes - reviews might change more frequently
        let dtos: [ReviewInfoForBusinessDTO] = try await api.request("\(base)/reviews/\(businessId)", method: "GET", body: nil, useCache: true, cacheTTL: 300)
        return dtos.map(ReviewInfoMapper.map)
    }

    func getBusinessPromotions(_ businessId: String) async throws -> [Promotion] {
        // Cache for 5 minutes - promotions might change frequently
        let dtos: [PromotionDTO] = try await api.request("\(base)/promotions/\(businessId)", method: "GET", body: nil, useCache: true, cacheTTL: 300)
        return dtos.map(PromotionMapper.map)
    }

    func getNearby(latitude: Double, longitude: Double) async throws -> [Restaurant] {
        // Cache for 2 minutes - location-based results should be fresh
        let dtos: [BusinessDTO] = try await api.request("\(base)/nearby?lat=\(latitude)&lng=\(longitude)", method: "GET", body: nil, useCache: true, cacheTTL: 120)
        return dtos.map(BusinessMapper.map)
    }

    func newPromotion(_ businessId: String, promotion: PromotionRequest) async throws -> Promotion {
        let body = try encodePromotionRequest(promotion)
        // POST requests should not use cache
        let dto: PromotionDTO = try await api.request("\(base)/promotions/\(businessId)", method: "POST", body: body, useCache: false, cacheTTL: nil)
        return PromotionMapper.map(dto)
    }

    func updatePromotion(_ businessId: String, promotionId: String, promotion: PromotionRequest) async throws {
        let body = try encodePromotionRequest(promotion)
        // PATCH requests should not use cache
        let _: EmptyResponse = try await api.request(
            "\(base)/promotions/\(businessId)/\(promotionId)",
            method: "PATCH",
            body: body,
            useCache: false,
            cacheTTL: nil
        )
        if let message = api.message {
            print(message)
        }
    }

    func deletePromotion(_ businessId: String, promotionId: String) async throws {
        // DELETE requests should not use cache
        let _: EmptyResponse = try await api.request(
            "\(base)/promotions/\(businessId)/\(promotionId)",
            method: "DELETE",
            body: nil,
            useCache: false,
            cacheTTL: nil
        )
        if let message = api.message {
            print(message)
        }
    }

    func setViewed(_ reviewId: String) async throws -> EmptyResponse {
        // PATCH requests should not use cache
        return try await api.request("\(base)/reviews/\(reviewId)", method: "PATCH", body: nil, useCache: false, cacheTTL: nil) as EmptyResponse
    }
}

struct PromotionRequest: Encodable {
    let title: String
    let description: String?
    let startDate: String?
    let endDate: String?
    /// Amount is now an optional integer. Encode as `Int` to avoid floating point
    /// representations.
    let amount: Int?
    let isActive: Bool

    private enum CodingKeys: String, CodingKey {
        case title, description, startDate, endDate, amount, isActive
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(title, forKey: .title)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encodeIfPresent(startDate, forKey: .startDate)
        try container.encodeIfPresent(endDate, forKey: .endDate)
        if let amount = amount {
            try container.encode(Int(amount), forKey: .amount)
        }
        try container.encode(isActive, forKey: .isActive)
    }
}

private func encodePromotionRequest(_ promotion: PromotionRequest) throws -> Data {
    let request = PromotionRequest(
        title: promotion.title,
        description: promotion.description,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        amount: promotion.amount,
        isActive: promotion.isActive
    )
    return try JSONEncoder().encode(request)
}

