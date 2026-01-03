import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Eye,
  MousePointer,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AnalyticsPreview = () => {
  const trafficData = [
    { name: '00', value: 120 },
    { name: '04', value: 80 },
    { name: '08', value: 250 },
    { name: '12', value: 420 },
    { name: '16', value: 380 },
    { name: '20', value: 280 },
    { name: '24', value: 150 },
  ];

  const conversionData = [
    { name: 'Mon', visits: 1200, conversions: 120 },
    { name: 'Tue', visits: 1400, conversions: 150 },
    { name: 'Wed', visits: 1100, conversions: 95 },
    { name: 'Thu', visits: 1600, conversions: 180 },
    { name: 'Fri', visits: 1800, conversions: 210 },
    { name: 'Sat', visits: 900, conversions: 80 },
    { name: 'Sun', visits: 700, conversions: 60 },
  ];

  const sourceData = [
    { name: 'Organic', value: 45, color: '#3b82f6' },
    { name: 'Direct', value: 25, color: '#8b5cf6' },
    { name: 'Social', value: 20, color: '#ec4899' },
    { name: 'Referral', value: 10, color: '#f59e0b' },
  ];

  const metrics = [
    { label: 'Total Visitors', value: '48.2K', change: '+12.5%', trend: 'up', icon: Users },
    { label: 'Page Views', value: '156K', change: '+8.3%', trend: 'up', icon: Eye },
    { label: 'Avg. Session', value: '4m 32s', change: '-2.1%', trend: 'down', icon: Clock },
    { label: 'Bounce Rate', value: '42.3%', change: '-5.2%', trend: 'up', icon: MousePointer },
  ];

  const topPages = [
    { page: '/landing', views: '24.5K', time: '3:42' },
    { page: '/pricing', views: '18.2K', time: '2:18' },
    { page: '/features', views: '12.8K', time: '4:05' },
    { page: '/blog/guide', views: '9.4K', time: '5:32' },
  ];

  return (
    <div className="h-full bg-slate-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-14 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
          <Zap className="w-4 h-4" />
        </div>
        <div className="flex-1 flex flex-col gap-1 mt-4">
          {[BarChart3, Users, Globe, TrendingUp, Clock].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                i === 0
                  ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-400 shadow-lg shadow-violet-500/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold">Analytics Dashboard</h1>
            <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>142 users online</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 rounded-xl p-3 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-4 h-4 text-slate-500" />
                  <div
                    className={`flex items-center gap-0.5 text-[10px] ${
                      metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <div className="text-xl font-bold">{metric.value}</div>
                <div className="text-[10px] text-slate-500">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Traffic Chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-2 bg-slate-900/50 rounded-xl p-4 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold">Traffic Overview</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Today</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#trafficGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Traffic Sources */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-800"
            >
              <h3 className="text-xs font-semibold mb-3">Traffic Sources</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={80} height={80}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      innerRadius={25}
                      outerRadius={35}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                {sourceData.map((source, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: source.color }} />
                      <span className="text-slate-400">{source.name}</span>
                    </div>
                    <span className="text-slate-300">{source.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Conversion Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-800"
            >
              <h3 className="text-xs font-semibold mb-3">Weekly Conversions</h3>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={conversionData}>
                  <Bar dataKey="conversions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Pages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-800"
            >
              <h3 className="text-xs font-semibold mb-3">Top Pages</h3>
              <div className="space-y-2">
                {topPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono">{page.page}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300">{page.views}</span>
                      <span className="text-slate-500 w-10 text-right">{page.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPreview;
