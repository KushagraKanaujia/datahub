'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function EnterprisePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 499,
      receipts: '10K receipts/month',
      features: [
        'Access to grocery & restaurant data',
        'Monthly data exports (CSV)',
        'Basic category filtering',
        'Email support',
        'Standard SLA (99% uptime)',
       '3-month historical data',
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 1999,
      receipts: '100K receipts/month',
      popular: true,
      features: [
        'Access to all receipt categories',
        'Real-time API access',
        'Advanced filtering & segmentation',
        'Geographic & demographic insights',
        'Dedicated account manager',
        'Priority SLA (99.9% uptime)',
        '12-month historical data',
        'Custom data packages',
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      receipts: 'Unlimited receipts',
      features: [
        'Full database access',
        'Custom API endpoints & webhooks',
        'Dedicated infrastructure',
        'White-label solutions',
        'Premium SLA (99.99% uptime)',
        'Unlimited historical data',
        'On-premise deployment options',
        'Custom analytics & reporting',
        'Direct partnership opportunities',
      ]
    }
  ];

  const useCases = [
    {
      icon: '🏪',
      title: 'CPG & Retail Brands',
      description: 'Track competitive pricing, market share, and purchase patterns across major retailers',
      examples: ['P&G', 'Unilever', 'Coca-Cola']
    },
    {
      icon: '🏢',
      title: 'Market Research Firms',
      description: 'Access real-time consumer behavior data for client reports and trend analysis',
      examples: ['Nielsen', 'Kantar', 'IRI/Circana']
    },
    {
      icon: '💹',
      title: 'Investment Firms',
      description: 'Alternative data for retail performance analysis and investment decisions',
      examples: ['Hedge Funds', 'Private Equity', 'Analysts']
    },
    {
      icon: '🛒',
      title: 'Retailers',
      description: 'Competitive intelligence and basket analysis to optimize pricing and inventory',
      examples: ['Target', 'Walmart', 'Kroger']
    }
  ];

  const stats = [
    { label: 'Active Users', value: '15,000+', icon: '👥' },
    { label: 'Receipts/Month', value: '450K+', icon: '🧾' },
    { label: 'Data Accuracy', value: '99.2%', icon: '✓' },
    { label: 'Categories', value: '12+', icon: '📦' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Enterprise Solutions
              </h1>
            </div>
          </div>
        </motion.header>

        <main className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Premium Receipt Data for Enterprise
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Access 450K+ monthly receipts from real consumers. Real-time insights into purchase behavior,
              competitive pricing, and market trends across all major retailers.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-white text-center mb-8">Who Uses Receipt Data?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (0.1 * index) }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="text-4xl mb-3">{useCase.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-2">{useCase.title}</h4>
                  <p className="text-gray-400 mb-3">{useCase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.examples.map((example) => (
                      <span key={example} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-gray-300">
                        {example}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-white text-center mb-8">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5 }}
                  className={`backdrop-blur-xl bg-white/5 border rounded-2xl p-8 ${
                    plan.popular ? 'border-blue-500/50' : 'border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400 font-semibold mb-4">
                      Most Popular
                    </div>
                  )}
                  <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {typeof plan.price === 'number' ? `$${plan.price.toLocaleString()}` : plan.price}
                    </span>
                    {typeof plan.price === 'number' && <span className="text-gray-400">/month</span>}
                  </div>
                  <p className="text-cyan-400 font-medium mb-6">{plan.receipts}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-gray-300">
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white/5 border border-white/10 text-white hover:border-blue-500/50'
                    }`}
                  >
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 p-8 backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join 127+ companies already using ReceiptBank data to make better business decisions.
              Schedule a demo to see how our platform can help your business.
            </p>
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold"
              >
                Schedule Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-semibold hover:border-blue-500/50 transition-all"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
