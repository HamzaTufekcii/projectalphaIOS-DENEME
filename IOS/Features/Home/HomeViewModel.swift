import Foundation
import CoreLocation

@MainActor
final class HomeViewModel: ObservableObject {
    @Published var topRated: [Restaurant] = []
    /// Results after applying filters and sorting
    @Published var searchResults: [Restaurant] = []
    @Published var errorMessage: String?
    @Published var searchTerm: String = ""
    @Published var selectedFilter: FilterType?
    @Published var userLocation: CLLocationCoordinate2D?
    @Published var favoriteIds: Set<String> = []
    /// Selected price range filter (`$`, `$$`, `$$$`)
    @Published var priceRangeFilter: String?
    /// Filter businesses that have an active promotion (`true`) or not (`false`).
    @Published var hasActivePromoFilter: Bool?
    /// Address based filtering. Leaving a field empty means it won't be used.
    @Published var addressFilter = AddressFilter()
    /// Currently selected sorting option
    @Published var sortOption: SortOption = .rating

    /// Internal storage for the raw results before applying filtering & sorting
    private var allResults: [Restaurant] = []

    private let service = BusinessService()
    private let listService = ListService()
    private let userService = UserService()
    private let session = UserSession.shared

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
                allResults = try await service.getAllBusinesses()
            } else {
                allResults = try await service.searchBusinesses(searchTerm)
            }
            applyFiltersAndSort()
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
            } else if filter == .promo {
                allResults = try await service.getAllBusinesses()
                applyFiltersAndSort()
                searchResults = searchResults.filter { $0.hasActivePromo }
            } else if let tag = filter.tagId {
                allResults = try await service.getByTag(tag)
                applyFiltersAndSort()
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func fetchNearby() async {
        guard let location = userLocation else { return }
        do {
            allResults = try await service.getNearby(latitude: location.latitude, longitude: location.longitude)
            applyFiltersAndSort()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func toggleFavorite(_ id: String) async {
        guard let userId = session.getUserId() else { return }
        do {
            _ = try await listService.toggleFavorite(userId: userId, itemId: id)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func refreshFavorites() async {
        guard let userId = session.getUserId(),
              let favoritesId = userService.getUserFavoritesIdFromStorage() else { return }
        do {
            let favorites = try await listService.getUserListItems(userId: userId, listId: favoritesId)
            favoriteIds = Set(favorites.map { $0.id })
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    /// Apply address, price and promotion filters and then sort the results
    func applyFiltersAndSort() {
        var filtered = allResults

        if let price = priceRangeFilter {
            filtered = filtered.filter { $0.priceRange == price }
        }

        if let hasPromo = hasActivePromoFilter {
            filtered = filtered.filter { $0.hasActivePromo == hasPromo }
        }

        if !addressFilter.city.isEmpty {
            filtered = filtered.filter { $0.address?.city == addressFilter.city }
        }
        if !addressFilter.district.isEmpty {
            filtered = filtered.filter { $0.address?.district == addressFilter.district }
        }
        if !addressFilter.neighborhood.isEmpty {
            filtered = filtered.filter { $0.address?.neighborhood == addressFilter.neighborhood }
        }
        if !addressFilter.street.isEmpty {
            filtered = filtered.filter { $0.address?.street == addressFilter.street }
        }

        switch sortOption {
        case .rating:
            filtered.sort { $0.rating > $1.rating }
        case .distance:
            filtered.sort { ($0.distance ?? .infinity) < ($1.distance ?? .infinity) }
        case .name:
            filtered.sort { $0.name.localizedCaseInsensitiveCompare($1.name) == .orderedAscending }
        case .promo:
            filtered.sort {
                let a = $0.hasActivePromo
                let b = $1.hasActivePromo
                if a == b { return $0.name < $1.name }
                return a && !b
            }
        }

        searchResults = filtered
    }

    /// Reset all filter fields
    func clearFilters() {
        priceRangeFilter = nil
        hasActivePromoFilter = nil
        addressFilter = AddressFilter()
        applyFiltersAndSort()
    }

    /// Restore default state and fetch businesses again
    func reset() async {
        // Reset search and selection state
        searchTerm = ""
        selectedFilter = nil
        sortOption = .rating

        // Reset advanced filters
        priceRangeFilter = nil
        hasActivePromoFilter = nil
        addressFilter = AddressFilter()

        // Reload businesses with the cleared criteria
        await search()
    }
}

// MARK: - Supporting Types
struct AddressFilter {
    var city: String = ""
    var district: String = ""
    var neighborhood: String = ""
    var street: String = ""
}

enum SortOption: String, CaseIterable {
    case rating
    case distance
    case name
    case promo
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

