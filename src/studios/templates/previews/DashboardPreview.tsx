import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  Search,
  Settings,
  Menu,
} from 'lucide-react';

const DashboardPreview = () => {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      icon: DollarSign,
      positive: true,
    },
    { label: 'Active Users', value: '2,350', change: '+180', icon: Users, positive: true },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: '-0.4%',
      icon: TrendingUp,
      positive: false,
    },
    {
      label: 'Avg. Order Value',
      value: '$89.00',
      change: '+4.75%',
      icon: BarChart3,
      positive: true,
    },
  ];

  return (
    <div className="min-h-[600px] bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Menu className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
            />
          </div>
          <Bell className="w-5 h-5 text-muted-foreground" />
          <Settings className="w-5 h-5 text-muted-foreground" />
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">JD</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-[536px] border-r border-border/50 p-4">
          <nav className="space-y-1">
            {['Overview', 'Analytics', 'Reports', 'Users', 'Settings'].map((item, i) => (
              <div
                key={item}
                className={`px-3 py-2 rounded-lg text-sm ${
                  i === 0
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg border border-border/50 bg-card/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-xs ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change} from last month
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg border border-border/50 bg-card/50"
          >
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <div className="h-48 flex items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t"
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              {[
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPreview;
