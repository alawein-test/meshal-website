import { motion } from 'framer-motion';
import { BookOpen, Clock, User, ArrowRight, Tag, MessageCircle, Heart } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'Building Modern Web Apps',
    excerpt: 'Learn the latest techniques for building scalable applications...',
    author: 'Alex Chen',
    date: 'Dec 5, 2024',
    readTime: '5 min',
    likes: 124,
    comments: 18,
    tag: 'Development',
  },
  {
    id: 2,
    title: 'Design Systems 101',
    excerpt: 'A comprehensive guide to creating consistent design systems...',
    author: 'Maya Lee',
    date: 'Dec 3, 2024',
    readTime: '8 min',
    likes: 89,
    comments: 12,
    tag: 'Design',
  },
  {
    id: 3,
    title: 'AI in Frontend Dev',
    excerpt: 'How artificial intelligence is transforming the way we build UIs...',
    author: 'Sam Wilson',
    date: 'Dec 1, 2024',
    readTime: '6 min',
    likes: 256,
    comments: 34,
    tag: 'AI',
  },
];

const BlogPreview = () => {
  return (
    <div className="min-h-[400px] bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-slate-200 dark:border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-slate-900 dark:text-white">DevBlog</span>
          </div>
          <div className="flex items-center gap-3">
            {['Home', 'Articles', 'About'].map((item, i) => (
              <span
                key={item}
                className={`text-xs ${i === 1 ? 'text-indigo-500 font-medium' : 'text-slate-500'}`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="m-4 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-3 h-3" />
          <span className="text-xs opacity-80">Featured</span>
        </div>
        <h2 className="text-lg font-bold mb-1">The Future of Web Development</h2>
        <p className="text-xs opacity-80 mb-3">
          Exploring emerging trends and technologies shaping the web...
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs opacity-70">
            <Clock className="w-3 h-3" />
            <span>10 min read</span>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center gap-1 text-xs font-medium"
          >
            Read more <ArrowRight className="w-3 h-3" />
          </motion.button>
        </div>
      </motion.div>

      {/* Posts List */}
      <div className="px-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Latest Articles</h3>
        {posts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/30 transition-all cursor-pointer group"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-slate-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-500 rounded">
                    {post.tag}
                  </span>
                  <span className="text-[10px] text-slate-400">{post.date}</span>
                </div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Load More */}
      <div className="p-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full py-2 text-sm text-indigo-500 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/10 transition-colors"
        >
          Load More Articles
        </motion.button>
      </div>
    </div>
  );
};

export default BlogPreview;
