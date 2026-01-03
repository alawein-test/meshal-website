import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Clock, MessageSquare, Paperclip, User } from 'lucide-react';

const KanbanPreview = () => {
  const columns = [
    {
      id: 'backlog',
      title: 'Backlog',
      color: 'bg-slate-500',
      cards: [
        {
          id: 1,
          title: 'Research competitor analysis',
          priority: 'low',
          comments: 2,
          attachments: 0,
        },
        {
          id: 2,
          title: 'Update brand guidelines',
          priority: 'medium',
          comments: 5,
          attachments: 2,
        },
      ],
    },
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-blue-500',
      cards: [
        { id: 3, title: 'Design new landing page', priority: 'high', comments: 8, attachments: 3 },
        {
          id: 4,
          title: 'API integration planning',
          priority: 'medium',
          comments: 3,
          attachments: 1,
        },
        { id: 5, title: 'User interviews', priority: 'low', comments: 0, attachments: 0 },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-amber-500',
      cards: [
        { id: 6, title: 'Implement auth flow', priority: 'high', comments: 12, attachments: 4 },
        { id: 7, title: 'Dashboard redesign', priority: 'medium', comments: 6, attachments: 2 },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-green-500',
      cards: [
        { id: 8, title: 'Setup CI/CD pipeline', priority: 'high', comments: 4, attachments: 1 },
        { id: 9, title: 'Database migration', priority: 'medium', comments: 2, attachments: 0 },
      ],
    },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-600 border-red-200',
    medium: 'bg-amber-100 text-amber-600 border-amber-200',
    low: 'bg-green-100 text-green-600 border-green-200',
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Product Sprint</h1>
            <p className="text-[9px] text-slate-500">12 tasks • 4 in progress</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {['bg-blue-500', 'bg-green-500', 'bg-orange-500'].map((color, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full ${color} border-2 border-white flex items-center justify-center`}
              >
                <User className="w-3 h-3 text-white" />
              </div>
            ))}
          </div>
          <button className="text-[10px] px-2 py-1 bg-violet-500 text-white rounded-lg hover:bg-violet-600">
            + Invite
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 p-3 overflow-x-auto">
        <div className="flex gap-3 h-full min-w-max">
          {columns.map((column, colIdx) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIdx * 0.1 }}
              className="w-56 bg-slate-50 rounded-xl flex flex-col"
            >
              {/* Column Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <span className="text-xs font-semibold text-slate-700">{column.title}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded-full">
                    {column.cards.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center">
                    <Plus className="w-3 h-3 text-slate-500" />
                  </button>
                  <button className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center">
                    <MoreHorizontal className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 pt-0 space-y-2 overflow-auto">
                {column.cards.map((card, cardIdx) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: colIdx * 0.1 + cardIdx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm hover:shadow-md cursor-grab transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[11px] font-medium text-slate-800 leading-tight">
                        {card.title}
                      </h3>
                      <button className="shrink-0 opacity-0 hover:opacity-100">
                        <MoreHorizontal className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[8px] px-1.5 py-0.5 rounded border ${priorityColors[card.priority as keyof typeof priorityColors]}`}
                      >
                        {card.priority}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400">
                        {card.comments > 0 && (
                          <div className="flex items-center gap-0.5">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-[9px]">{card.comments}</span>
                          </div>
                        )}
                        {card.attachments > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Paperclip className="w-3 h-3" />
                            <span className="text-[9px]">{card.attachments}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add Card Button */}
                <button className="w-full py-2 rounded-lg border border-dashed border-slate-300 text-slate-400 hover:border-violet-400 hover:text-violet-500 hover:bg-violet-50 transition-all flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span className="text-[10px]">Add Card</span>
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add Column */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-56 h-12 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-violet-400 hover:text-violet-500 hover:bg-white/50 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Add Column</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default KanbanPreview;
