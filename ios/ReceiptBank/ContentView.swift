import SwiftUI

// MARK: - App State
class AppState: ObservableObject {
    @Published var isAuthenticated = false
    @Published var user: User?
    @Published var balance: Double = 0.0
    @Published var receipts: [ReceiptResponse] = []
    @Published var stats: ReceiptStatsResponse?
    @Published var isLoading = false
    @Published var errorMessage: String?

    func loadProfile() async {
        isLoading = true
        do {
            user = try await APIService.shared.getProfile()
            balance = user?.balance ?? 0.0
            isLoading = false
        } catch {
            errorMessage = error.localizedDescription
            isLoading = false
        }
    }

    func loadReceipts() async {
        do {
            receipts = try await APIService.shared.getReceipts()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func loadStats() async {
        do {
            stats = try await APIService.shared.getReceiptStats()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func logout() {
        APIService.shared.logout()
        isAuthenticated = false
        user = nil
        balance = 0.0
        receipts = []
        stats = nil
    }
}

// MARK: - Main Content View
struct ContentView: View {
    @StateObject private var appState = AppState()
    @State private var showCamera = false
    @State private var capturedImage: UIImage?
    @State private var showingUploadAlert = false
    @State private var uploadMessage = ""

    var body: some View {
        Group {
            if appState.isAuthenticated {
                MainTabView(
                    appState: appState,
                    showCamera: $showCamera,
                    capturedImage: $capturedImage,
                    showingUploadAlert: $showingUploadAlert,
                    uploadMessage: $uploadMessage
                )
            } else {
                AuthView(appState: appState)
            }
        }
        .sheet(isPresented: $showCamera) {
            CameraView(showCamera: $showCamera) { image in
                capturedImage = image
                showCamera = false
                uploadReceipt(image)
            }
        }
        .alert("Receipt Upload", isPresented: $showingUploadAlert) {
            Button("OK") {}
        } message: {
            Text(uploadMessage)
        }
    }

    private func uploadReceipt(_ image: UIImage) {
        Task {
            appState.isLoading = true
            do {
                let response = try await APIService.shared.uploadReceipt(image: image)
                uploadMessage = "Receipt uploaded! Earned $\(String(format: "%.2f", response.receipt.earnings))"
                showingUploadAlert = true

                await appState.loadProfile()
                await appState.loadReceipts()
                await appState.loadStats()
            } catch {
                uploadMessage = "Upload failed: \(error.localizedDescription)"
                showingUploadAlert = true
            }
            appState.isLoading = false
        }
    }
}

// MARK: - Auth View
struct AuthView: View {
    @ObservedObject var appState: AppState
    @State private var isLogin = true
    @State private var email = ""
    @State private var password = ""
    @State private var name = ""

    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                Spacer()

                // Logo
                VStack(spacing: 8) {
                    Image(systemName: "doc.text.fill")
                        .font(.system(size: 80))
                        .foregroundColor(.green)
                    Text("ReceiptBank")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    Text("Turn receipts into cash")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                Spacer()

                // Form
                VStack(spacing: 16) {
                    if !isLogin {
                        TextField("Name", text: $name)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .autocapitalization(.words)
                    }

                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)

                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())

                    if let error = appState.errorMessage {
                        Text(error)
                            .font(.caption)
                            .foregroundColor(.red)
                    }

                    Button(action: handleAuth) {
                        if appState.isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text(isLogin ? "Sign In" : "Create Account")
                                .fontWeight(.semibold)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                    .disabled(appState.isLoading)

                    Button(action: { isLogin.toggle() }) {
                        Text(isLogin ? "Need an account? Sign up" : "Have an account? Sign in")
                            .font(.subheadline)
                            .foregroundColor(.green)
                    }
                }
                .padding(.horizontal, 32)

                Spacer()
            }
            .navigationBarHidden(true)
        }
    }

    private func handleAuth() {
        Task {
            appState.isLoading = true
            appState.errorMessage = nil

            do {
                if isLogin {
                    _ = try await APIService.shared.login(email: email, password: password)
                } else {
                    _ = try await APIService.shared.register(email: email, password: password, name: name)
                }

                appState.isAuthenticated = true
                await appState.loadProfile()
                await appState.loadReceipts()
                await appState.loadStats()
            } catch {
                appState.errorMessage = error.localizedDescription
            }

            appState.isLoading = false
        }
    }
}

// MARK: - Main Tab View
struct MainTabView: View {
    @ObservedObject var appState: AppState
    @Binding var showCamera: Bool
    @Binding var capturedImage: UIImage?
    @Binding var showingUploadAlert: Bool
    @Binding var uploadMessage: String

    var body: some View {
        TabView {
            HomeView(appState: appState, showCamera: $showCamera)
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }

            ReceiptsListView(appState: appState)
                .tabItem {
                    Label("Receipts", systemImage: "doc.text.fill")
                }

            WithdrawView(appState: appState)
                .tabItem {
                    Label("Withdraw", systemImage: "dollarsign.circle.fill")
                }

            ProfileView(appState: appState)
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
        }
        .accentColor(.green)
        .onAppear {
            Task {
                await appState.loadProfile()
                await appState.loadReceipts()
                await appState.loadStats()
            }
        }
    }
}

// MARK: - Home View
struct HomeView: View {
    @ObservedObject var appState: AppState
    @Binding var showCamera: Bool

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Balance Card
                    VStack(spacing: 12) {
                        Text("Available Balance")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        Text("$\(appState.balance, specifier: "%.2f")")
                            .font(.system(size: 48, weight: .bold))
                            .foregroundColor(.green)
                    }
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color(.systemBackground))
                    .cornerRadius(16)
                    .shadow(color: .black.opacity(0.1), radius: 10)

                    // Scan Receipt Button
                    Button(action: { showCamera = true }) {
                        HStack {
                            Image(systemName: "camera.fill")
                                .font(.title2)
                            Text("Scan Receipt")
                                .font(.title3)
                                .fontWeight(.semibold)
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 20)
                        .background(
                            LinearGradient(
                                colors: [.blue, .purple],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                    }

                    // Stats Grid
                    LazyVGrid(columns: [
                        GridItem(.flexible()),
                        GridItem(.flexible())
                    ], spacing: 16) {
                        StatCard(
                            title: "This Month",
                            value: "$\(appState.stats?.monthlyEarnings ?? 0.0, specifier: "%.2f")",
                            icon: "calendar"
                        )
                        StatCard(
                            title: "Total Earned",
                            value: "$\(appState.stats?.totalEarnings ?? 0.0, specifier: "%.2f")",
                            icon: "chart.bar.fill"
                        )
                        StatCard(
                            title: "Receipts",
                            value: "\(appState.stats?.totalReceipts ?? 0)",
                            icon: "doc.fill"
                        )
                        StatCard(
                            title: "Streak",
                            value: "\(appState.user?.streak ?? 0) days",
                            icon: "flame.fill"
                        )
                    }

                    // How It Works
                    VStack(alignment: .leading, spacing: 16) {
                        Text("How It Works")
                            .font(.title2)
                            .fontWeight(.bold)

                        HowItWorksStep(
                            number: 1,
                            title: "Scan Your Receipt",
                            description: "Take a photo of any receipt"
                        )

                        HowItWorksStep(
                            number: 2,
                            title: "Earn Cash",
                            description: "Get $0.05-$2.00 per receipt"
                        )

                        HowItWorksStep(
                            number: 3,
                            title: "Cash Out",
                            description: "$10 minimum to PayPal/Venmo"
                        )
                    }
                }
                .padding()
            }
            .navigationTitle("ReceiptBank")
            .refreshable {
                await appState.loadProfile()
                await appState.loadStats()
            }
        }
    }
}

// MARK: - Receipts List View
struct ReceiptsListView: View {
    @ObservedObject var appState: AppState

    var body: some View {
        NavigationView {
            List {
                if appState.receipts.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "doc.text")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("No receipts yet")
                            .font(.headline)
                            .foregroundColor(.secondary)
                        Text("Scan your first receipt to start earning")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                } else {
                    ForEach(appState.receipts, id: \.id) { receipt in
                        ReceiptRow(receipt: receipt)
                    }
                }
            }
            .navigationTitle("Receipts")
            .refreshable {
                await appState.loadReceipts()
            }
        }
    }
}

// MARK: - Withdraw View
struct WithdrawView: View {
    @ObservedObject var appState: AppState
    @State private var paypalEmail = ""
    @State private var withdrawAmount = ""
    @State private var showingAlert = false
    @State private var alertMessage = ""

    var body: some View {
        NavigationView {
            Form {
                Section {
                    HStack {
                        Text("Available Balance")
                        Spacer()
                        Text("$\(appState.balance, specifier: "%.2f")")
                            .fontWeight(.bold)
                            .foregroundColor(.green)
                    }
                }

                Section(header: Text("Withdrawal Details")) {
                    TextField("PayPal Email", text: $paypalEmail)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)

                    TextField("Amount", text: $withdrawAmount)
                        .keyboardType(.decimalPad)
                }

                Section {
                    Text("Minimum withdrawal: $10.00")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text("Payments processed instantly via PayPal")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Section {
                    Button(action: requestWithdrawal) {
                        if appState.isLoading {
                            ProgressView()
                        } else {
                            Text("Request Withdrawal")
                                .fontWeight(.semibold)
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .disabled(appState.balance < 10.0 || appState.isLoading)
                }
            }
            .navigationTitle("Withdraw")
            .alert("Withdrawal", isPresented: $showingAlert) {
                Button("OK") {}
            } message: {
                Text(alertMessage)
            }
        }
    }

    private func requestWithdrawal() {
        guard let amount = Double(withdrawAmount), amount >= 10.0 else {
            alertMessage = "Please enter a valid amount (minimum $10.00)"
            showingAlert = true
            return
        }

        guard amount <= appState.balance else {
            alertMessage = "Insufficient balance"
            showingAlert = true
            return
        }

        guard !paypalEmail.isEmpty else {
            alertMessage = "Please enter your PayPal email"
            showingAlert = true
            return
        }

        Task {
            appState.isLoading = true
            do {
                _ = try await APIService.shared.requestWithdrawal(
                    amount: amount,
                    paymentMethod: "paypal",
                    paymentEmail: paypalEmail
                )
                alertMessage = "Withdrawal request submitted successfully!"
                showingAlert = true

                paypalEmail = ""
                withdrawAmount = ""
                await appState.loadProfile()
            } catch {
                alertMessage = "Withdrawal failed: \(error.localizedDescription)"
                showingAlert = true
            }
            appState.isLoading = false
        }
    }
}

// MARK: - Profile View
struct ProfileView: View {
    @ObservedObject var appState: AppState

    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.green)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(appState.user?.name ?? appState.user?.email ?? "User")
                                .font(.title2)
                                .fontWeight(.bold)
                            Text(appState.user?.email ?? "")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                            HStack {
                                Text("Level: \(appState.user?.level ?? "Bronze")")
                                    .font(.caption)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.green.opacity(0.2))
                                    .cornerRadius(8)
                                Text("XP: \(appState.user?.xp ?? 0)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .padding(.vertical)
                }

                Section(header: Text("Stats")) {
                    HStack {
                        Label("Total Balance", systemImage: "dollarsign.circle")
                        Spacer()
                        Text("$\(appState.balance, specifier: "%.2f")")
                            .fontWeight(.bold)
                    }
                    HStack {
                        Label("Total Receipts", systemImage: "doc.text")
                        Spacer()
                        Text("\(appState.stats?.totalReceipts ?? 0)")
                            .fontWeight(.bold)
                    }
                    HStack {
                        Label("Current Streak", systemImage: "flame")
                        Spacer()
                        Text("\(appState.user?.streak ?? 0) days")
                            .fontWeight(.bold)
                    }
                }

                Section(header: Text("Support")) {
                    NavigationLink(destination: Text("Help & FAQ")) {
                        Label("Help & FAQ", systemImage: "questionmark.circle")
                    }
                    NavigationLink(destination: Text("Contact Us")) {
                        Label("Contact Us", systemImage: "envelope")
                    }
                }

                Section {
                    Button(action: { appState.logout() }) {
                        Text("Sign Out")
                            .foregroundColor(.red)
                    }
                }
            }
            .navigationTitle("Profile")
        }
    }
}

// MARK: - Supporting Views
struct StatCard: View {
    let title: String
    let value: String
    let icon: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(.blue)
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            Text(value)
                .font(.title3)
                .fontWeight(.semibold)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 5)
    }
}

struct HowItWorksStep: View {
    let number: Int
    let title: String
    let description: String

    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.2))
                    .frame(width: 40, height: 40)
                Text("\(number)")
                    .font(.headline)
                    .foregroundColor(.blue)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
    }
}

struct ReceiptRow: View {
    let receipt: ReceiptResponse

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(receipt.merchant)
                    .font(.headline)
                HStack {
                    Text(receipt.category)
                        .font(.caption)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.blue.opacity(0.1))
                        .cornerRadius(4)
                    Text(formatDate(receipt.createdAt))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 4) {
                Text("+$\(receipt.earnings, specifier: "%.2f")")
                    .font(.headline)
                    .foregroundColor(.green)
                Text(receipt.status.capitalized)
                    .font(.caption)
                    .foregroundColor(receipt.status == "approved" ? .green : .orange)
            }
        }
        .padding(.vertical, 4)
    }

    private func formatDate(_ isoDate: String) -> String {
        let formatter = ISO8601DateFormatter()
        guard let date = formatter.date(from: isoDate) else { return isoDate }

        let displayFormatter = DateFormatter()
        displayFormatter.dateStyle = .short
        displayFormatter.timeStyle = .none
        return displayFormatter.string(from: date)
    }
}

#Preview {
    ContentView()
}
