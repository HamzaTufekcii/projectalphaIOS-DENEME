import Foundation
import CoreLocation

final class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate, @unchecked Sendable {
    private let manager = CLLocationManager()
    @Published var userLocation: CLLocationCoordinate2D?
    @Published var locationStatus: String?

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.requestWhenInUseAuthorization()
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedWhenInUse, .authorizedAlways:
            manager.startUpdatingLocation()
        case .denied:
            Task { @MainActor in
                locationStatus = "Location access denied"
            }
        case .restricted:
            Task { @MainActor in
                locationStatus = "Location access restricted"
            }
        case .notDetermined:
            break
        @unknown default:
            Task { @MainActor in
                locationStatus = "Unknown authorization status"
            }
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        Task { @MainActor in
            userLocation = location.coordinate
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor in
            locationStatus = error.localizedDescription
        }
    }
}

