import { motion } from 'framer-motion';
import {
  Users,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Target,
  ChevronRight,
  Star,
  MoreHorizontal,
} from 'lucide-react';

const CRMPreview = () => {
  const pipeline = [
    { stage: 'Lead', count: 24, value: '$48K', color: 'bg-slate-500' },
    { stage: 'Qualified', count: 18, value: '$126K', color: 'bg-blue-500' },
    { stage: 'Proposal', count: 12, value: '$89K', color: 'bg-purple-500' },
    { stage: 'Negotiation', count: 6, value: '$234K', color: 'bg-orange-500' },
    { stage: 'Closed Won', count: 8, value: '$312K', color: 'bg-green-500' },
  ];

  const contacts = [
    {
      name: 'Alex Rivera',
      company: 'TechCorp Inc',
      value: '$45,000',
      status: 'hot',
      lastContact: '2h ago',
    },
    {
      name: 'Jordan Lee',
      company: 'StartupXYZ',
      value: '$28,000',
      status: 'warm',
      lastContact: '1d ago',
    },
    {
      name: 'Casey Morgan',
      company: 'Enterprise Co',
      value: '$120,000',
      status: 'hot',
      lastContact: '3h ago',
    },
    {
      name: 'Taylor Kim',
      company: 'Digital Agency',
      value: '$15,000',
      status: 'cold',
      lastContact: '1w ago',
    },
  ];

  const activities = [
    { type: 'call', contact: 'Alex Rivera', time: '10:00 AM', duration: '15 min' },
    { type: 'email', contact: 'Jordan Lee', time: '11:30 AM', subject: 'Follow-up' },
    { type: 'meeting', contact: 'Casey Morgan', time: '2:00 PM', location: 'Zoom' },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-800">SalesCRM</span>
          </div>
        </div>
        <nav className="flex-1 p-2">
          {[
            { icon: Target, label: 'Pipeline', active: true },
            { icon: Users, label: 'Contacts' },
            { icon: Mail, label: 'Emails' },
            { icon: Calendar, label: 'Calendar' },
            { icon: DollarSign, label: 'Deals' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-1 cursor-pointer transition-colors text-xs ${
                item.active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <h1 className="text-sm font-semibold text-slate-800">Sales Pipeline</h1>
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-slate-500">Total Value:</div>
            <div className="text-sm font-bold text-green-600">$809K</div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {/* Pipeline Stages */}
          <div className="flex gap-2 mb-4">
            {pipeline.map((stage, i) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-white rounded-lg p-3 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-[11px] font-medium text-slate-700">{stage.stage}</span>
                </div>
                <div className="text-lg font-bold text-slate-800">{stage.count}</div>
                <div className="text-[10px] text-slate-500">{stage.value}</div>
                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.count / 24) * 100}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                    className={`h-full ${stage.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Contacts List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm"
            >
              <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-800">Active Deals</h3>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="divide-y divide-slate-100">
                {contacts.map((contact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {contact.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-slate-800">
                          {contact.name}
                        </span>
                        {contact.status === 'hot' && (
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{contact.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-slate-800">
                        {contact.value}
                      </div>
                      <div className="text-[9px] text-slate-400">{contact.lastContact}</div>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        contact.status === 'hot'
                          ? 'bg-red-500'
                          : contact.status === 'warm'
                            ? 'bg-orange-500'
                            : 'bg-blue-300'
                      }`}
                    />
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Today's Activities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg border border-slate-200 shadow-sm"
            >
              <div className="p-3 border-b border-slate-200">
                <h3 className="text-xs font-semibold text-slate-800">Today's Activities</h3>
              </div>
              <div className="p-2 space-y-2">
                {activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        activity.type === 'call'
                          ? 'bg-green-100 text-green-600'
                          : activity.type === 'email'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {activity.type === 'call' ? (
                        <Phone className="w-3 h-3" />
                      ) : activity.type === 'email' ? (
                        <Mail className="w-3 h-3" />
                      ) : (
                        <Calendar className="w-3 h-3" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-medium text-slate-800">
                        {activity.contact}
                      </div>
                      <div className="text-[9px] text-slate-500">{activity.time}</div>
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

export default CRMPreview;
