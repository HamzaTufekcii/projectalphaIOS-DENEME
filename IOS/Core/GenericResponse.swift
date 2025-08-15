import Foundation

struct GenericResponse<T: Decodable>: Decodable {
    let success: Bool
    let code: String?
    let message: String?
    let data: T?
}
