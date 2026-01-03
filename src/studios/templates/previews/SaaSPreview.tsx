import { motion } from 'framer-motion';
import { Zap, Check, ArrowRight, Sparkles, Shield, Clock, Users, BarChart3 } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: '99.9% uptime' },
  { icon: Shield, title: 'Secure', desc: 'Enterprise-grade' },
  { icon: Clock, title: '24/7 Support', desc: 'Always available' },
  { icon: Users, title: 'Team Ready', desc: 'Unlimited seats' },
];

const pricingPlans = [
  { name: 'Starter', price: '$29', features: ['5 Projects', '10GB Storage', 'Basic Analytics'] },
  {
    name: 'Pro',
    price: '$79',
    features: ['Unlimited Projects', '100GB Storage', 'Advanced Analytics', 'Priority Support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Everything in Pro', 'SSO', 'Dedicated Account', 'SLA'],
  },
];

const SaaSPreview = () => {
  return (
    <div className="min-h-[400px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 rounded-lg overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">SaaSify</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium"
          >
            Get Started
          </motion.button>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-xl font-bold text-white mb-2">
            Build Faster. Scale{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Smarter.
            </span>
          </h1>
          <p className="text-xs text-slate-400 mb-4">The all-in-one platform for modern teams.</p>
          <div className="flex justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium flex items-center gap-1"
            >
              Start Free Trial <ArrowRight className="w-3 h-3" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 text-xs bg-white/10 text-white rounded-lg font-medium border border-white/20"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-2 bg-white/5 rounded-lg border border-white/10 text-center"
            >
              <feature.icon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <p className="text-[10px] font-medium text-white">{feature.title}</p>
              <p className="text-[8px] text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Preview */}
        <div className="grid grid-cols-3 gap-2">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`p-3 rounded-xl border ${
                plan.popular
                  ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {plan.popular && (
                <span className="text-[8px] px-1.5 py-0.5 bg-indigo-500 text-white rounded-full mb-2 inline-block">
                  Popular
                </span>
              )}
              <h4 className="text-sm font-medium text-white">{plan.name}</h4>
              <p className="text-lg font-bold text-white mt-1">{plan.price}</p>
              <p className="text-[8px] text-slate-400 mb-2">/month</p>
              <div className="space-y-1">
                {plan.features.slice(0, 2).map((feature) => (
                  <div key={feature} className="flex items-center gap-1 text-[9px] text-slate-300">
                    <Check className="w-2 h-2 text-indigo-400" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex justify-center gap-6 text-center"
        >
          <div>
            <p className="text-lg font-bold text-white">10K+</p>
            <p className="text-[10px] text-slate-400">Users</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">99.9%</p>
            <p className="text-[10px] text-slate-400">Uptime</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">4.9★</p>
            <p className="text-[10px] text-slate-400">Rating</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SaaSPreview;
