import XCTest

final class HTTPSRequirementTests: XCTestCase {
    func testInfoPlistContainsNoHTTP() throws {
        let testsDir = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
        let iosDir = testsDir.deletingLastPathComponent()
        let plist = try String(contentsOf: iosDir.appendingPathComponent("Info.plist"))
        let insecure = "http" + "://"
        XCTAssertFalse(plist.contains(insecure), "Info.plist contains insecure URLs")
    }

    func testTestSourcesContainNoHTTP() throws {
        let testsDir = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
        let fm = FileManager.default
        let enumerator = fm.enumerator(at: testsDir, includingPropertiesForKeys: nil)!
        for case let url as URL in enumerator {
            guard url.pathExtension == "swift",
                  url.lastPathComponent != "HTTPSRequirementTests.swift" else { continue }
            let contents = try String(contentsOf: url)
            let insecure = "http" + "://"
            XCTAssertFalse(contents.contains(insecure), "Found insecure URL in \(url.lastPathComponent)")
        }
    }
}
