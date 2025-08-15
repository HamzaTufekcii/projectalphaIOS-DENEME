import Foundation

/// Response returned after verifying a code.
struct VerificationResponse: Decodable {
    let token: String
    let userId: String
}
