import Foundation

@MainActor
final class BusinessViewModel: ObservableObject {
    @Published var topRated: [Restaurant] = []
    @Published var searchResults: [Restaurant] = []
    @Published var selectedBusiness: Restaurant?
    @Published var promotions: [Promotion] = []
    @Published var reviews: [Review] = []
    @Published var errorMessage: String?
    @Published var searchTerm: String = ""
    @Published var selectedFilter: FilterType?

    private let service = BusinessService()

    func fetchTopRated(limit: Int = 5) async {
        do {
            topRated = try await service.getTopRated(limit: limit)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func search() async {
        do {
            if searchTerm.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                searchResults = try await service.getAllBusinesses()
            } else {
                searchResults = try await service.searchBusinesses(searchTerm)
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func applyFilter() async {
        guard let filter = selectedFilter else {
            await search()
            return
        }
        do {
            if filter == .all {
                await search()
            } else if let tag = filter.tagId {
                searchResults = try await service.getByTag(tag)
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchBusiness(id: String) async {
        do {
            selectedBusiness = try await service.getBusinessById(id)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchPromotions(businessId: String) async {
        do {
            promotions = try await service.getBusinessPromotions(businessId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchReviews(businessId: String) async {
        do {
            reviews = try await service.getBusinessReviews(businessId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

enum FilterType: String, CaseIterable {
    case all
    case wine
    case pizza
    case coffee
    case burger
    case cafe
    case promo

    var icon: String {
        switch self {
        case .all: return "line.3.horizontal.decrease.circle"
        case .wine: return "wineglass"
        case .pizza: return "takeoutbag.and.cup.and.straw"
        case .coffee: return "cup.and.saucer"
        case .burger: return "fork.knife"
        case .cafe: return "building.2"
        case .promo: return "tag"
        }
    }

    var tagId: String? {
        switch self {
        case .all:
            return nil
        case .wine:
            return "wine"
        case .pizza:
            return "pizza"
        case .coffee:
            return "coffee"
        case .burger:
            return "burgers"
        case .cafe:
            return "cafe"
        case .promo:
            return "promo"
        }
    }
}
