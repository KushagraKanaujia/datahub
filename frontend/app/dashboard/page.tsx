'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Receipt Card Component
const ReceiptCard = ({ receipt, onView }: any) => {
  const getReceiptIcon = (merchant: string) => {
    const icons: any = {
      'Target': '🎯',
      'Costco': '🏪',
      'Wingstop': '🍗',
      'Walmart': '🛒',
      'Whole Foods': '🥬',
      'Starbucks': '☕',
      'Apple Store': '🍎',
      'CVS': '💊',
      'Trader Joe\'s': '🛍️',
      'McDonald\'s': '🍔'
    };
    return icons[merchant] || '🧾';
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'Grocery': '#10b981',
      'Restaurant': '#f59e0b',
      'Retail': '#3b82f6',
      'Electronics': '#8b5cf6',
      'Pharmacy': '#ec4899',
      'Coffee': '#78350f'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all cursor-pointer group"
      onClick={() => onView(receipt)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl">{getReceiptIcon(receipt.merchant)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-white">{receipt.merchant}</h4>
              {receipt.verified && (
                <span className="text-green-400 text-xs">✓</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-2">{receipt.date} • {receipt.location}</p>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: `${getCategoryColor(receipt.category)}20`,
                  borderColor: `${getCategoryColor(receipt.category)}40`,
                  color: getCategoryColor(receipt.category)
                }}
              >
                {receipt.category}
              </span>
              <span className="text-xs text-gray-500">${receipt.total}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-green-400">${receipt.earnings}</span>
            {receipt.multiplier > 1 && (
              <span className="text-xs text-yellow-400">×{receipt.multiplier}</span>
            )}
          </div>
          <p className="text-xs text-gray-500">{receipt.status}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Card
const StatsCard = ({ label, value, icon, color, subtitle }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 overflow-hidden group"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="text-4xl opacity-50" style={{ color }}>
          {icon}
        </div>
      </div>

      <motion.div
        className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `${color}30` }}
      />
    </motion.div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [stats, setStats] = useState({
    totalEarnings: 147.50,
    thisMonth: 23.80,
    receiptsUploaded: 234,
    pendingReview: 3,
    avgPerReceipt: 0.63
  });

  const [recentReceipts, setRecentReceipts] = useState([
    {
      id: 1,
      merchant: 'Target',
      category: 'Retail',
      total: '89.47',
      earnings: '0.15',
      date: 'Today, 2:34 PM',
      location: 'San Francisco, CA',
      status: 'Verified',
      verified: true,
      multiplier: 1
    },
    {
      id: 2,
      merchant: 'Whole Foods',
      category: 'Grocery',
      total: '156.23',
      earnings: '0.08',
      date: 'Today, 11:20 AM',
      location: 'San Francisco, CA',
      status: 'Verified',
      verified: true,
      multiplier: 1
    },
    {
      id: 3,
      merchant: 'Apple Store',
      category: 'Electronics',
      total: '1,299.00',
      earnings: '2.50',
      date: 'Yesterday',
      location: 'San Francisco, CA',
      status: 'Verified',
      verified: true,
      multiplier: 2
    },
    {
      id: 4,
      merchant: 'Starbucks',
      category: 'Coffee',
      total: '12.45',
      earnings: '0.03',
      date: 'Yesterday',
      location: 'San Francisco, CA',
      status: 'Verified',
      verified: true,
      multiplier: 1
    },
    {
      id: 5,
      merchant: 'Costco',
      category: 'Grocery',
      total: '234.67',
      earnings: '0.12',
      date: '2 days ago',
      location: 'San Francisco, CA',
      status: 'Processing',
      verified: false,
      multiplier: 1
    }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setUser({ email: 'demo@datahub.com', name: 'Demo User' });
    setLoading(false);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    // Simulate upload
    setTimeout(() => {
      const file = files[0];
      const newReceipt = {
        id: recentReceipts.length + 1,
        merchant: 'Trader Joe\'s',
        category: 'Grocery',
        total: '67.89',
        earnings: '0.09',
        date: 'Just now',
        location: 'San Francisco, CA',
        status: 'Processing',
        verified: false,
        multiplier: 1
      };

      setRecentReceipts([newReceipt, ...recentReceipts]);
      setStats({
        ...stats,
        receiptsUploaded: stats.receiptsUploaded + 1,
        pendingReview: stats.pendingReview + 1
      });
      setUploading(false);
    }, 1500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleLogout = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="backdrop-blur-xl bg-white/5 border-b border-white/10"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                  ReceiptBank
                </h1>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 backdrop-blur-xl bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-xs text-gray-400">Total Earnings</p>
                    <p className="text-lg font-bold text-green-400">${stats.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-cyan-400/50 transition-all duration-300"
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                dragActive ? 'border-green-400 bg-green-500/20' : 'border-green-500/30 hover:border-green-400/50'
              }`}
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: uploading ? [0, -10, 0] : 0 }}
                  transition={{ duration: 0.6, repeat: uploading ? Infinity : 0 }}
                  className="text-6xl mb-4"
                >
                  {uploading ? '⏳' : '📸'}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {uploading ? 'Processing Receipt...' : 'Upload Your Receipts'}
                </h3>
                <p className="text-gray-400 mb-6">
                  Take a photo or upload receipt images • Earn $0.02-$2.50 per receipt
                </p>

                <div className="flex items-center justify-center gap-4">
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg text-white font-semibold cursor-pointer hover:from-green-400 hover:to-cyan-400 transition-all"
                  >
                    📱 Take Photo / Upload
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      disabled={uploading}
                    />
                  </motion.label>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-semibold hover:border-cyan-400/50 transition-all"
                  >
                    📂 Bulk Upload
                  </motion.button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-400">Any Store</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-400">Instant Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-400">Secure & Private</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            <StatsCard
              label="Total Earnings"
              value={`$${stats.totalEarnings.toFixed(2)}`}
              icon="💰"
              color="#10b981"
              subtitle="All time"
            />
            <StatsCard
              label="This Month"
              value={`$${stats.thisMonth.toFixed(2)}`}
              icon="📅"
              color="#0ea5e9"
              subtitle="+15.3% vs last month"
            />
            <StatsCard
              label="Receipts"
              value={stats.receiptsUploaded}
              icon="🧾"
              color="#8b5cf6"
              subtitle="Total uploaded"
            />
            <StatsCard
              label="Avg/Receipt"
              value={`$${stats.avgPerReceipt.toFixed(2)}`}
              icon="📊"
              color="#f59e0b"
              subtitle="Your average"
            />
            <StatsCard
              label="Pending"
              value={stats.pendingReview}
              icon="⏳"
              color="#6b7280"
              subtitle="Being processed"
            />
          </motion.div>

          {/* Recent Receipts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Recent Receipts</h2>
                <p className="text-gray-400 text-sm">Your latest uploads and earnings</p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/analytics')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
                >
                  📈 View All
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              {recentReceipts.map((receipt, index) => (
                <motion.div
                  key={receipt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <ReceiptCard
                    receipt={receipt}
                    onView={(r: any) => console.log('View receipt', r)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/marketplace')}
              className="p-6 backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl text-left group hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="text-2xl mb-2">🛒</div>
              <h3 className="text-purple-400 font-semibold mb-1 group-hover:text-purple-300 transition-colors">Data Marketplace</h3>
              <p className="text-gray-400 text-sm">See what companies are buying</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/analytics')}
              className="p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-left group hover:border-cyan-400/30 transition-all duration-300"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">Earnings Analytics</h3>
              <p className="text-gray-400 text-sm">Track your income trends</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/enterprise')}
              className="p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-left group hover:border-cyan-400/30 transition-all duration-300"
            >
              <div className="text-2xl mb-2">🏢</div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">For Businesses</h3>
              <p className="text-gray-400 text-sm">Buy receipt data</p>
            </motion.button>
          </motion.div>

          {/* Value Indicator Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-6 backdrop-blur-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💡</div>
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-1">Receipt Value Guide</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>📱 Electronics (Apple, Best Buy): $1.50-2.50 • 🛒 Retail (Target, Walmart): $0.08-0.15</p>
                    <p>🥬 Grocery (Whole Foods, Costco): $0.08-0.12 • ☕ Coffee/Fast Food: $0.02-0.05</p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 font-semibold hover:from-yellow-500/30 hover:to-orange-500/30 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
