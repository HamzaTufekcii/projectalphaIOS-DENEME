import Foundation

/// Service responsible for fetching business related data from backend via `APIClient`.
final class BusinessService: @unchecked Sendable {
    private let api: APIClientProtocol
    private let base = "api/business"

    init(api: APIClientProtocol = APIClient.shared) {
        self.api = api
    }

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
        // Backend GenericResponse wrapper kullanıyor, APIClient otomatik unwrap yapacak
        let dtos: [BusinessDTO] = try await api.request("\(base)/top?limit=\(limit)")
        return dtos.map(BusinessMapper.map)
    }

    func getByTag(_ tagId: String) async throws -> [Restaurant] {
        let dtos: [BusinessDTO] = try await api.request("\(base)/tag/\(tagId)")
        return dtos.map(BusinessMapper.map)
    }

    func getBusinessReviews(_ businessId: String) async throws -> [Review] {
        let dtos: [ReviewInfoForBusinessDTO] = try await api.request("\(base)/reviews/\(businessId)")
        return dtos.map(ReviewInfoMapper.map)
    }

    func getBusinessPromotions(_ businessId: String) async throws -> [Promotion] {
        let dtos: [PromotionDTO] = try await api.request("\(base)/promotions/\(businessId)")
        return dtos.map(PromotionMapper.map)
    }

    func getNearby(latitude: Double, longitude: Double) async throws -> [Restaurant] {
        let dtos: [BusinessDTO] = try await api.request("\(base)/nearby?lat=\(latitude)&lng=\(longitude)")
        return dtos.map(BusinessMapper.map)
    }

    func newPromotion(_ businessId: String, promotion: PromotionRequest) async throws -> Promotion {
        let body = try encodePromotionRequest(promotion)
        let dto: PromotionDTO = try await api.request("\(base)/promotions/\(businessId)", method: "POST", body: body)
        return PromotionMapper.map(dto)
    }

    func updatePromotion(_ businessId: String, promotionId: String, promotion: PromotionRequest) async throws {
        let body = try encodePromotionRequest(promotion)
        try await api.request(
            "\(base)/promotions/\(businessId)/\(promotionId)",
            method: "PATCH",
            body: body
        ) as EmptyResponse
        if let message = api.message {
            print(message)
        }
    }

    func deletePromotion(_ businessId: String, promotionId: String) async throws {
        try await api.request(
            "\(base)/promotions/\(businessId)/\(promotionId)",
            method: "DELETE",
            body: nil
        ) as EmptyResponse
        if let message = api.message {
            print(message)
        }
    }

    func setViewed(_ reviewId: String) async throws -> EmptyResponse {
        return try await api.request("\(base)/reviews/\(reviewId)", method: "PATCH", body: nil)
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

