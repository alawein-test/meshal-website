import { motion } from 'framer-motion';
import {
  Folder,
  File,
  Image,
  FileText,
  Music,
  Video,
  Upload,
  Download,
  Trash2,
  MoreVertical,
  Grid,
  List,
  Search,
  ChevronRight,
  HardDrive,
} from 'lucide-react';

const FileManagerPreview = () => {
  const folders = [
    { name: 'Documents', items: 24, color: 'from-blue-500 to-blue-600' },
    { name: 'Images', items: 156, color: 'from-green-500 to-emerald-600' },
    { name: 'Projects', items: 12, color: 'from-purple-500 to-violet-600' },
    { name: 'Archives', items: 8, color: 'from-amber-500 to-orange-600' },
  ];

  const files = [
    { name: 'presentation.pptx', type: 'doc', size: '2.4 MB', modified: '2 hours ago' },
    { name: 'hero-image.png', type: 'image', size: '4.8 MB', modified: '1 day ago' },
    { name: 'project-brief.pdf', type: 'doc', size: '1.2 MB', modified: '3 days ago' },
    { name: 'background-music.mp3', type: 'audio', size: '8.1 MB', modified: '1 week ago' },
    { name: 'demo-video.mp4', type: 'video', size: '124 MB', modified: '2 weeks ago' },
  ];

  const fileIcons = {
    doc: FileText,
    image: Image,
    audio: Music,
    video: Video,
  };

  const fileColors = {
    doc: 'text-blue-500 bg-blue-100',
    image: 'text-green-500 bg-green-100',
    audio: 'text-purple-500 bg-purple-100',
    video: 'text-red-500 bg-red-100',
  };

  return (
    <div className="h-full bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-44 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-slate-800">FileCloud</span>
          </div>
        </div>

        <div className="flex-1 p-2">
          <div className="space-y-1">
            {[
              { icon: Folder, label: 'All Files', active: true },
              { icon: Image, label: 'Photos' },
              { icon: FileText, label: 'Documents' },
              { icon: Video, label: 'Videos' },
              { icon: Trash2, label: 'Trash' },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  item.active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Storage Info */}
        <div className="p-3 border-t border-slate-200">
          <div className="text-[10px] text-slate-500 mb-1.5">Storage Used</div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '68%' }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>
          <div className="text-[9px] text-slate-400 mt-1">6.8 GB of 10 GB</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-11 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-slate-800 font-medium">My Files</span>
            <ChevronRight className="w-3 h-3" />
            <span>Documents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg">
              <Search className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-400">Search...</span>
            </div>
            <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100">
              <Grid className="w-4 h-4 text-slate-500" />
            </button>
            <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100">
              <List className="w-4 h-4 text-slate-400" />
            </button>
            <button className="text-[10px] px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1">
              <Upload className="w-3 h-3" />
              Upload
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {/* Folders */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-slate-700 mb-2">Folders</h3>
            <div className="grid grid-cols-4 gap-2">
              {folders.map((folder, i) => (
                <motion.div
                  key={folder.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-3 border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${folder.color} flex items-center justify-center mb-2`}
                  >
                    <Folder className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-[11px] font-medium text-slate-800 truncate">
                    {folder.name}
                  </div>
                  <div className="text-[9px] text-slate-400">{folder.items} items</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Files */}
          <div>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">Recent Files</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {files.map((file, i) => {
                const Icon = fileIcons[file.type as keyof typeof fileIcons];
                const colorClass = fileColors[file.type as keyof typeof fileColors];

                return (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-3 p-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-slate-800 truncate">
                        {file.name}
                      </div>
                      <div className="text-[9px] text-slate-400">{file.size}</div>
                    </div>
                    <div className="text-[9px] text-slate-400">{file.modified}</div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center">
                        <Download className="w-3 h-3 text-slate-500" />
                      </button>
                      <button className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center">
                        <MoreVertical className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagerPreview;
