// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "projectalphaIOS",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "IOS",
            targets: ["IOS"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/supabase-community/supabase-swift.git", from: "1.0.0")
    ],
    targets: [
        .target(
            name: "IOS",
            dependencies: ["Supabase"],
            path: "IOS",
            exclude: [
                "IOS.xcodeproj",
                "IOSUITests",
                "IOSTests",
                "Assets.xcassets"
            ]
        ),
        .testTarget(
            name: "IOSTests",
            dependencies: ["IOS"],
            path: "IOS/IOSTests"
        )
    ]
)
