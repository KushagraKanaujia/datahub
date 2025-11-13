'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MarketplacePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'trending' | 'categories'>('trending');

  const trendingPackages = [
    {
      id: 1,
      name: 'Grocery Shopping Insights',
      category: 'Grocery',
      icon: '🛒',
      color: '#10b981',
      buyers: ['Kroger Analytics', 'Nielsen', 'P&G Research'],
      description: 'Purchase patterns from major grocery chains including Costco, Walmart, Whole Foods, Trader Joe\'s',
      userEarning: '0.08-0.12',
      companyPays: '0.35-0.50',
      receiptsNeeded: '50K+/month',
      demandLevel: 'Very High',
      totalUsers: 1247,
      stats: {
        avgReceipts: '12/month',
        avgUserEarns: '$8.40/month'
      }
    },
    {
      id: 2,
      name: 'Electronics Purchase Data',
      category: 'Electronics',
      icon: '📱',
      color: '#8b5cf6',
      buyers: ['Best Buy Insights', 'Apple Analytics', 'Samsung Research'],
      description: 'High-value purchases from Apple Store, Best Buy, Target Electronics, Amazon devices',
      userEarning: '1.50-2.50',
      companyPays: '8.00-12.00',
      receiptsNeeded: '10K+/month',
      demandLevel: 'Very High',
      totalUsers: 3421,
      stats: {
        avgReceipts: '2/month',
        avgUserEarns: '$4.20/month'
      }
    },
    {
      id: 3,
      name: 'Restaurant & Fast Food',
      category: 'Restaurant',
      icon: '🍔',
      color: '#f59e0b',
      buyers: ['McDonald\'s Corp', 'Yum Brands', 'Restaurant Analytics Group'],
      description: 'Dining patterns from McDonald\'s, Chipotle, Wingstop, local restaurants',
      userEarning: '0.02-0.08',
      companyPays: '0.15-0.30',
      receiptsNeeded: '100K+/month',
      demandLevel: 'High',
      totalUsers: 2156,
      stats: {
        avgReceipts: '20/month',
        avgUserEarns: '$5.60/month'
      }
    },
    {
      id: 4,
      name: 'Pharmacy & Healthcare',
      category: 'Pharmacy',
      icon: '💊',
      color: '#ec4899',
      buyers: ['CVS Health Analytics', 'Walgreens Insights', 'Healthcare Research Inc'],
      description: 'Purchase data from CVS, Walgreens, Rite Aid for consumer health trends',
      userEarning: '0.15-0.30',
      companyPays: '1.00-2.00',
      receiptsNeeded: '20K+/month',
      demandLevel: 'Very High',
      totalUsers: 892,
      stats: {
        avgReceipts: '4/month',
        avgUserEarns: '$2.40/month'
      }
    },
    {
      id: 5,
      name: 'Coffee & Beverages',
      category: 'Coffee',
      icon: '☕',
      color: '#78350f',
      buyers: ['Starbucks Analytics', 'Dunkin Analytics', 'Beverage Industry Group'],
      description: 'Daily beverage purchases from Starbucks, Dunkin, local coffee shops',
      userEarning: '0.02-0.05',
      companyPays: '0.10-0.20',
      receiptsNeeded: '150K+/month',
      demandLevel: 'Medium',
      totalUsers: 4567,
      stats: {
        avgReceipts: '15/month',
        avgUserEarns: '$3.00/month'
      }
    },
    {
      id: 6,
      name: 'Big Box Retail',
      category: 'Retail',
      icon: '🎯',
      color: '#3b82f6',
      buyers: ['Target Analytics', 'Walmart Research', 'Retail Market Intelligence'],
      description: 'General merchandise from Target, Walmart, Kohl\'s, department stores',
      userEarning: '0.08-0.15',
      companyPays: '0.40-0.75',
      receiptsNeeded: '75K+/month',
      demandLevel: 'Very High',
      totalUsers: 2893,
      stats: {
        avgReceipts: '8/month',
        avgUserEarns: '$6.40/month'
      }
    }
  ];

  const categories = [
    { name: 'Grocery', icon: '🛒', count: 1247, avgEarning: '8.40', color: '#10b981' },
    { name: 'Electronics', icon: '📱', count: 3421, avgEarning: '4.20', color: '#8b5cf6' },
    { name: 'Restaurant', icon: '🍔', count: 2156, avgEarning: '5.60', color: '#f59e0b' },
    { name: 'Pharmacy', icon: '💊', count: 892, avgEarning: '2.40', color: '#ec4899' },
    { name: 'Coffee', icon: '☕', count: 4567, avgEarning: '3.00', color: '#78350f' },
    { name: 'Retail', icon: '🎯', count: 2893, avgEarning: '6.40', color: '#3b82f6' },
    { name: 'Gas Stations', icon: '⛽', count: 1654, avgEarning: '1.80', color: '#6b7280' },
    { name: 'Home Improvement', icon: '🔨', count: 743, avgEarning: '3.20', color: '#059669' }
  ];

  const getDemandColor = (level: string) => {
    if (level === 'Very High') return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' };
    if (level === 'High') return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' };
    return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"
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
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Data Marketplace
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 backdrop-blur-xl bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-xs text-gray-400">Active Buyers</p>
                  <p className="text-lg font-bold text-purple-400">127 Companies</p>
                </div>
                <div className="px-4 py-2 backdrop-blur-xl bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-xs text-gray-400">Your Potential</p>
                  <p className="text-lg font-bold text-green-400">$20-40/mo</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">💡</div>
              <div className="flex-1">
                <h3 className="text-purple-400 font-semibold mb-1">How It Works</h3>
                <p className="text-gray-400 text-sm">
                  Companies pay premium prices for anonymized receipt data. You upload receipts → We aggregate and anonymize →
                  Companies buy insights → You earn money. Your personal info is never shared.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Platform Transparency</p>
                <p className="text-sm text-white"><span className="text-green-400 font-semibold">You earn 20-30%</span> of what companies pay</p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'trending'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/30'
              }`}
            >
              🔥 Trending Data Packages
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'categories'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/30'
              }`}
            >
              📊 All Categories
            </button>
          </div>

          {/* Trending Packages */}
          {activeTab === 'trending' && (
            <div className="space-y-4">
              {trendingPackages.map((pkg, index) => {
                const demandColors = getDemandColor(pkg.demandLevel);
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all"
                  >
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ backgroundColor: `${pkg.color}20`, border: `2px solid ${pkg.color}40` }}
                      >
                        {pkg.icon}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${demandColors.bg} ${demandColors.border} ${demandColors.text}`}>
                                {pkg.demandLevel === 'Very High' && '🔥 '}
                                {pkg.demandLevel} Demand
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{pkg.description}</p>
                          </div>
                        </div>

                        {/* Buyers */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Companies Buying This Data:</p>
                          <div className="flex flex-wrap gap-2">
                            {pkg.buyers.map((buyer) => (
                              <span key={buyer} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-gray-300">
                                🏢 {buyer}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">You Earn</p>
                            <p className="text-lg font-bold text-green-400">${pkg.userEarning}</p>
                            <p className="text-xs text-gray-500">per receipt</p>
                          </div>
                          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Companies Pay</p>
                            <p className="text-lg font-bold text-purple-400">${pkg.companyPays}</p>
                            <p className="text-xs text-gray-500">per data point</p>
                          </div>
                          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Active Users</p>
                            <p className="text-lg font-bold text-cyan-400">{pkg.totalUsers.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">earning now</p>
                          </div>
                          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Avg Monthly</p>
                            <p className="text-lg font-bold text-yellow-400">${pkg.stats.avgUserEarns}</p>
                            <p className="text-xs text-gray-500">{pkg.stats.avgReceipts} receipts</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-400/30 transition-all cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}10, transparent)`
                  }}
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Active Users:</span>
                      <span className="text-white font-semibold">{category.count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Avg Earnings:</span>
                      <span className="text-green-400 font-semibold">${category.avgEarning}/mo</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:border-purple-400/50 transition-all"
                  >
                    View Details
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-8 backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl text-center"
          >
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Earning?</h3>
            <p className="text-gray-400 mb-6">Upload your receipts and start making money from data companies are paying premium prices for.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg text-white font-semibold hover:from-green-400 hover:to-cyan-400 transition-all"
            >
              Upload Your First Receipt
            </motion.button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
