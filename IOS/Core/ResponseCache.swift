import Foundation

/// High-performance hybrid cache system for API responses
/// Memory cache for instant access, disk cache for persistence
class ResponseCache {
    static let shared = ResponseCache()
    
    // MARK: - Cache Configuration
    private let memoryCache = NSCache<NSString, CachedResponse>()
    private let diskCacheDirectory: URL
    private let jsonEncoder = JSONEncoder()
    private let jsonDecoder = JSONDecoder()
    
    // MARK: - Cache Settings
    private let defaultMemoryTTL: TimeInterval = 300 // 5 minutes
    private let defaultDiskTTL: TimeInterval = 3600 // 1 hour
    private let maxMemoryItems = 100
    
    // MARK: - Initialization
    private init() {
        // Setup memory cache
        memoryCache.countLimit = maxMemoryItems
        memoryCache.totalCostLimit = 50 * 1024 * 1024 // 50MB
        
        // Setup disk cache directory
        let cacheDir = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        diskCacheDirectory = cacheDir.appendingPathComponent("APIResponseCache")
        
        // Create cache directory if needed
        try? FileManager.default.createDirectory(at: diskCacheDirectory, withIntermediateDirectories: true)
        
        print("📦 ResponseCache initialized - Memory limit: \(maxMemoryItems) items")
    }
    
    // MARK: - Cache Operations
    
    /// Get cached response with automatic fallback: Memory → Disk → nil
    func get<T: Codable>(_ key: String, type: T.Type) -> T? {
        let cacheKey = NSString(string: key)
        
        // 1. Try memory cache first (fastest)
        if let memoryResponse = memoryCache.object(forKey: cacheKey) {
            if memoryResponse.isValid {
                print("💨 Cache HIT (Memory): \(key)")
                return memoryResponse.data as? T
            } else {
                // Remove expired memory cache
                memoryCache.removeObject(forKey: cacheKey)
            }
        }
        
        // 2. Try disk cache (slower but persistent)
        if let diskResponse = getDiskCache(key: key, type: type) {
            print("💽 Cache HIT (Disk): \(key)")
            // Promote to memory cache for future access
            let cachedResponse = CachedResponse(data: diskResponse, expiryDate: Date().addingTimeInterval(defaultMemoryTTL))
            memoryCache.setObject(cachedResponse, forKey: cacheKey)
            return diskResponse
        }
        
        print("❌ Cache MISS: \(key)")
        return nil
    }
    
    /// Set cache with automatic memory + disk storage
    func set<T: Codable>(_ key: String, value: T, memoryTTL: TimeInterval? = nil, diskTTL: TimeInterval? = nil) {
        let memoryExpiry = Date().addingTimeInterval(memoryTTL ?? defaultMemoryTTL)
        let diskExpiry = Date().addingTimeInterval(diskTTL ?? defaultDiskTTL)
        
        // Store in memory cache
        let cachedResponse = CachedResponse(data: value, expiryDate: memoryExpiry)
        let cacheKey = NSString(string: key)
        memoryCache.setObject(cachedResponse, forKey: cacheKey)
        
        // Store in disk cache (background queue for performance)
        DispatchQueue.global(qos: .utility).async { [weak self] in
            self?.setDiskCache(key: key, value: value, expiryDate: diskExpiry)
        }
        
        print("💾 Cache SET: \(key) (Memory: \(Int(memoryTTL ?? self.defaultMemoryTTL))s, Disk: \(Int(diskTTL ?? self.defaultDiskTTL))s)")
    }
    
    /// Clear all caches
    func clearAll() {
        memoryCache.removeAllObjects()
        try? FileManager.default.removeItem(at: diskCacheDirectory)
        try? FileManager.default.createDirectory(at: diskCacheDirectory, withIntermediateDirectories: true)
        print("🗑️ Cache cleared completely")
    }
    
    /// Clear expired entries only
    func clearExpired() {
        // Memory cache auto-manages expiry
        // Clean disk cache
        DispatchQueue.global(qos: .utility).async { [weak self] in
            self?.cleanExpiredDiskCache()
        }
    }
    
    // MARK: - Cache Key Generation
    
    /// Generate consistent cache key for API endpoints
    static func key(for endpoint: String, parameters: [String: Any]? = nil) -> String {
        var key = endpoint
        
        if let params = parameters, !params.isEmpty {
            let sortedParams = params.sorted { $0.key < $1.key }
            let paramString = sortedParams.map { "\($0.key)=\($0.value)" }.joined(separator: "&")
            key += "?\(paramString)"
        }
        
        return key.replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "?", with: "_")
            .replacingOccurrences(of: "&", with: "_")
    }
    
    // MARK: - Private Disk Cache Methods
    
    private func getDiskCache<T: Codable>(key: String, type: T.Type) -> T? {
        let fileURL = diskCacheURL(for: key)
        
        guard FileManager.default.fileExists(atPath: fileURL.path),
              let data = try? Data(contentsOf: fileURL),
              let diskCacheItem = try? jsonDecoder.decode(DiskCacheItem<T>.self, from: data) else {
            return nil
        }
        
        // Check if expired
        if Date() > diskCacheItem.expiryDate {
            try? FileManager.default.removeItem(at: fileURL)
            return nil
        }
        
        return diskCacheItem.data
    }
    
    private func setDiskCache<T: Codable>(key: String, value: T, expiryDate: Date) {
        let fileURL = diskCacheURL(for: key)
        let diskCacheItem = DiskCacheItem(data: value, expiryDate: expiryDate)
        
        do {
            let data = try jsonEncoder.encode(diskCacheItem)
            try data.write(to: fileURL)
        } catch {
            print("⚠️ Disk cache write failed for \(key): \(error)")
        }
    }
    
    private func diskCacheURL(for key: String) -> URL {
        return diskCacheDirectory.appendingPathComponent("\(key).cache")
    }
    
    private func cleanExpiredDiskCache() {
        guard let files = try? FileManager.default.contentsOfDirectory(at: diskCacheDirectory, includingPropertiesForKeys: nil) else {
            return
        }
        
        let currentDate = Date()
        var cleanedCount = 0
        
        for fileURL in files {
            guard let data = try? Data(contentsOf: fileURL),
                  let cacheItem = try? jsonDecoder.decode(DiskCacheItemBase.self, from: data) else {
                continue
            }
            
            if currentDate > cacheItem.expiryDate {
                try? FileManager.default.removeItem(at: fileURL)
                cleanedCount += 1
            }
        }
        
        if cleanedCount > 0 {
            print("🧹 Cleaned \(cleanedCount) expired disk cache items")
        }
    }
}

// MARK: - Cache Data Models

private class CachedResponse {
    let data: Any
    let expiryDate: Date
    
    init(data: Any, expiryDate: Date) {
        self.data = data
        self.expiryDate = expiryDate
    }
    
    var isValid: Bool {
        return Date() < expiryDate
    }
}

private struct DiskCacheItem<T: Codable>: Codable {
    let data: T
    let expiryDate: Date
}

private struct DiskCacheItemBase: Codable {
    let expiryDate: Date
}
