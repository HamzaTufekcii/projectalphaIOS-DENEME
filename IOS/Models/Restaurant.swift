import Foundation

/// `Restaurant` is currently represented by the `Business` model.
/// This alias allows views to refer to restaurants while using the
/// underlying `Business` data structure which includes description,
/// price range, rating, address, promotions and tags.
typealias Restaurant = Business
