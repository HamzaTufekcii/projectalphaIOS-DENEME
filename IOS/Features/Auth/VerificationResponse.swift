import Foundation

/// Response returned after verifying a code.
struct VerificationResponse: Codable {
    let token: String
    let userId: String
}
