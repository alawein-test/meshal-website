import { motion } from 'framer-motion';
import {
  Users,
  Settings,
  Shield,
  Activity,
  Database,
  Bell,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const AdminDashboardPreview = () => {
  const stats = [
    { label: 'Total Users', value: '12,847', change: '+12.5%', trend: 'up', icon: Users },
    { label: 'Active Sessions', value: '1,429', change: '+8.2%', trend: 'up', icon: Activity },
    { label: 'System Health', value: '99.9%', change: '+0.1%', trend: 'up', icon: Shield },
    { label: 'DB Queries/s', value: '2,341', change: '-3.1%', trend: 'down', icon: Database },
  ];

  const recentUsers = [
    { name: 'Sarah Chen', email: 'sarah@example.com', role: 'Admin', status: 'active' },
    { name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'active' },
    { name: 'Emma Wilson', email: 'emma@example.com', role: 'Viewer', status: 'pending' },
  ];

  const systemLogs = [
    { time: '2 min ago', event: 'User login', level: 'info' },
    { time: '5 min ago', event: 'Database backup completed', level: 'success' },
    { time: '12 min ago', event: 'Rate limit warning', level: 'warning' },
    { time: '1 hour ago', event: 'New user registered', level: 'info' },
  ];

  return (
    <div className="h-full bg-slate-900 text-slate-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg" />
        <div className="flex-1 flex flex-col gap-2 mt-4">
          {[Activity, Users, Database, Shield, Settings, Bell].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                i === 0
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold">Admin Dashboard</h1>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
              Pro
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-slate-400">System Online</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-4 h-4 text-slate-400" />
                  <div
                    className={`flex items-center gap-1 text-[10px] ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-[10px] text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/30 rounded-lg border border-slate-700/50"
            >
              <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-xs font-semibold">Recent Users</h3>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-2">
                {recentUsers.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium truncate">{user.name}</div>
                      <div className="text-[9px] text-slate-500 truncate">{user.email}</div>
                    </div>
                    <span className="text-[9px] bg-slate-700 px-1.5 py-0.5 rounded">
                      {user.role}
                    </span>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* System Logs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/30 rounded-lg border border-slate-700/50"
            >
              <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-xs font-semibold">System Logs</h3>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-2 space-y-1">
                {systemLogs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/30 transition-colors"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        log.level === 'success'
                          ? 'bg-green-500'
                          : log.level === 'warning'
                            ? 'bg-yellow-500'
                            : log.level === 'error'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-[10px] text-slate-500 w-16">{log.time}</span>
                    <span className="text-[11px] flex-1">{log.event}</span>
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

export default AdminDashboardPreview;
