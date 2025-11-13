import Foundation
import UIKit

// MARK: - API Configuration
enum APIConfig {
    static let baseURL = "http://localhost:3001/api"
    static let timeout: TimeInterval = 30
}

// MARK: - API Error
enum APIError: Error {
    case invalidURL
    case invalidResponse
    case networkError(Error)
    case serverError(String)
    case decodingError(Error)
    case unauthorized

    var localizedDescription: String {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid server response"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .serverError(let message):
            return message
        case .decodingError(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        case .unauthorized:
            return "Unauthorized access"
        }
    }
}

// MARK: - API Models
struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct RegisterRequest: Codable {
    let email: String
    let password: String
    let name: String
}

struct AuthResponse: Codable {
    let token: String
    let user: User
}

struct User: Codable {
    let id: String
    let email: String
    let name: String?
    let balance: Double
    let totalEarnings: Double
    let level: String
    let xp: Int
    let streak: Int
    let createdAt: String
}

struct ReceiptUploadResponse: Codable {
    let message: String
    let receipt: ReceiptResponse
}

struct ReceiptResponse: Codable {
    let id: String
    let merchant: String
    let category: String
    let amount: Double
    let earnings: Double
    let status: String
    let imageUrl: String
    let createdAt: String
}

struct ReceiptStatsResponse: Codable {
    let totalEarnings: Double
    let monthlyEarnings: Double
    let totalReceipts: Int
    let monthlyReceipts: Int
    let avgReceiptValue: Double
    let topCategories: [CategoryStat]
}

struct CategoryStat: Codable {
    let category: String
    let count: Int
    let totalEarnings: Double
}

struct WithdrawalRequest: Codable {
    let amount: Double
    let paymentMethod: String
    let paymentEmail: String
}

struct WithdrawalResponse: Codable {
    let message: String
    let withdrawal: Withdrawal
}

struct Withdrawal: Codable {
    let id: String
    let amount: Double
    let paymentMethod: String
    let paymentEmail: String
    let status: String
    let createdAt: String
    let processedAt: String?
}

struct ErrorResponse: Codable {
    let error: String
}

// MARK: - API Service
class APIService {
    static let shared = APIService()

    private var authToken: String? {
        get { UserDefaults.standard.string(forKey: "authToken") }
        set { UserDefaults.standard.set(newValue, forKey: "authToken") }
    }

    private init() {}

    // MARK: - Authentication
    func register(email: String, password: String, name: String) async throws -> AuthResponse {
        let request = RegisterRequest(email: email, password: password, name: name)
        let response: AuthResponse = try await post(endpoint: "/auth/register", body: request)
        authToken = response.token
        return response
    }

    func login(email: String, password: String) async throws -> AuthResponse {
        let request = LoginRequest(email: email, password: password)
        let response: AuthResponse = try await post(endpoint: "/auth/login", body: request)
        authToken = response.token
        return response
    }

    func logout() {
        authToken = nil
    }

    // MARK: - User Profile
    func getProfile() async throws -> User {
        return try await get(endpoint: "/users/profile")
    }

    // MARK: - Receipts
    func uploadReceipt(image: UIImage) async throws -> ReceiptUploadResponse {
        guard let imageData = image.jpegData(compressionQuality: 0.8) else {
            throw APIError.serverError("Failed to convert image")
        }

        let boundary = UUID().uuidString
        var request = try createRequest(endpoint: "/receipts/upload", method: "POST")
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        var body = Data()

        // Add image data
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"receipt\"; filename=\"receipt.jpg\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
        body.append(imageData)
        body.append("\r\n".data(using: .utf8)!)
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)

        request.httpBody = body

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        if httpResponse.statusCode == 200 {
            return try JSONDecoder().decode(ReceiptUploadResponse.self, from: data)
        } else {
            let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data)
            throw APIError.serverError(errorResponse?.error ?? "Upload failed")
        }
    }

    func getReceipts() async throws -> [ReceiptResponse] {
        return try await get(endpoint: "/receipts")
    }

    func getReceiptStats() async throws -> ReceiptStatsResponse {
        return try await get(endpoint: "/receipts/stats")
    }

    // MARK: - Withdrawals
    func requestWithdrawal(amount: Double, paymentMethod: String, paymentEmail: String) async throws -> WithdrawalResponse {
        let request = WithdrawalRequest(amount: amount, paymentMethod: paymentMethod, paymentEmail: paymentEmail)
        return try await post(endpoint: "/withdrawals/request", body: request)
    }

    func getWithdrawals() async throws -> [Withdrawal] {
        return try await get(endpoint: "/withdrawals")
    }

    // MARK: - Generic Network Methods
    private func get<T: Decodable>(endpoint: String) async throws -> T {
        let request = try createRequest(endpoint: endpoint, method: "GET")
        return try await performRequest(request)
    }

    private func post<T: Encodable, R: Decodable>(endpoint: String, body: T) async throws -> R {
        var request = try createRequest(endpoint: endpoint, method: "POST")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)
        return try await performRequest(request)
    }

    private func createRequest(endpoint: String, method: String) throws -> URLRequest {
        guard let url = URL(string: APIConfig.baseURL + endpoint) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.timeoutInterval = APIConfig.timeout

        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        return request
    }

    private func performRequest<T: Decodable>(_ request: URLRequest) async throws -> T {
        do {
            let (data, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }

            switch httpResponse.statusCode {
            case 200...299:
                do {
                    return try JSONDecoder().decode(T.self, from: data)
                } catch {
                    throw APIError.decodingError(error)
                }
            case 401:
                authToken = nil
                throw APIError.unauthorized
            default:
                let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data)
                throw APIError.serverError(errorResponse?.error ?? "Unknown error")
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
}
