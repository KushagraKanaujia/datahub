'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const router = useRouter();

  const earningsData = [
    { month: 'Jan', earnings: 18.40, receipts: 32 },
    { month: 'Feb', earnings: 22.10, receipts: 41 },
    { month: 'Mar', earnings: 19.80, receipts: 38 },
    { month: 'Apr', earnings: 25.50, receipts: 47 },
    { month: 'May', earnings: 21.30, receipts: 39 },
    { month: 'Jun', earnings: 23.80, receipts: 45 }
  ];

  const categoryBreakdown = [
    { name: 'Grocery', value: 35, earnings: 8.40, color: '#10b981' },
    { name: 'Retail', value: 25, earnings: 6.40, color: '#3b82f6' },
    { name: 'Restaurant', value: 20, earnings: 5.60, color: '#f59e0b' },
    { name: 'Electronics', value: 10, earnings: 4.20, color: '#8b5cf6' },
    { name: 'Coffee', value: 10, earnings: 3.00, color: '#78350f' }
  ];

  const weeklyData = [
    { day: 'Mon', receipts: 2, earnings: 0.24 },
    { day: 'Tue', receipts: 3, earnings: 0.41 },
    { day: 'Wed', receipts: 4, earnings: 0.56 },
    { day: 'Thu', receipts: 2, earnings: 0.28 },
    { day: 'Fri', receipts: 5, earnings: 0.72 },
    { day: 'Sat', receipts: 6, earnings: 0.89 },
    { day: 'Sun', receipts: 4, earnings: 0.61 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a] relative overflow-hidden">
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

      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative z-10">
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="backdrop-blur-xl bg-white/5 border-b border-white/10"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                Earnings Analytics
              </h1>
            </div>
          </div>
        </motion.header>

        <main className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
              <p className="text-4xl font-bold text-green-400">$147.50</p>
              <p className="text-cyan-400 text-sm mt-2">All time</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <p className="text-gray-400 text-sm mb-1">This Month</p>
              <p className="text-4xl font-bold text-white">$23.80</p>
              <p className="text-green-400 text-sm mt-2">+15.3% vs last month</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <p className="text-gray-400 text-sm mb-1">Total Receipts</p>
              <p className="text-4xl font-bold text-white">234</p>
              <p className="text-purple-400 text-sm mt-2">45 this month</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <p className="text-gray-400 text-sm mb-1">Avg/Receipt</p>
              <p className="text-4xl font-bold text-white">$0.63</p>
              <p className="text-yellow-400 text-sm mt-2">Above avg $0.45</p>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Earnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Monthly Earnings</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Earnings by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">This Week's Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="receipts" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Top Earning Categories</h3>
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">${category.earnings}/mo</p>
                      <p className="text-gray-500 text-xs">{category.value}% of receipts</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Insights Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💡</span> AI-Powered Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg">
                <div className="text-2xl mb-2">📈</div>
                <h4 className="text-green-400 font-semibold mb-1">Earnings Opportunity</h4>
                <p className="text-gray-400 text-sm">Upload electronics receipts! They earn 4x more ($1.50-2.50 vs $0.08-0.15 average)</p>
              </div>
              <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="text-cyan-400 font-semibold mb-1">Upload Pattern</h4>
                <p className="text-gray-400 text-sm">You're most active on weekends. Upload Friday-Sunday for consistent earnings!</p>
              </div>
              <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="text-yellow-400 font-semibold mb-1">Top Performer</h4>
                <p className="text-gray-400 text-sm">You're in the top 15% of users! Average user earns $12/mo, you earn $23.80/mo</p>
              </div>
            </div>
          </motion.div>

          {/* Payout Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 p-6 backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Ready to Cash Out?</h3>
                <p className="text-gray-400 text-sm">Minimum payout is $10. You're ready to withdraw!</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Available Balance</p>
                  <p className="text-3xl font-bold text-green-400">$147.50</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg text-white font-semibold hover:from-green-400 hover:to-cyan-400 transition-all"
                >
                  Withdraw Funds
                </motion.button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
