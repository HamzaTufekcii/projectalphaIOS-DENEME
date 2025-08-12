# Project Alpha iOS

## Testing Environment

### Swift Package
- Requires macOS and Xcode with SwiftUI.
- Run `swift test` from the project root on a Mac.
- Running on Linux fails because the SwiftUI module is unavailable.

### Node Scripts
- Requires Node.js 18+ and npm.
- No test script is defined; running `npm test` results in an error.
- Add a testing framework and `test` script in `package.json` to enable JavaScript tests.
