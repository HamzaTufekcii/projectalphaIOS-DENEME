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
    dependencies: [],
    targets: [
        .target(
            name: "IOS",
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
