import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Search, Filter, Package } from 'lucide-react';

const products = [
  { id: 1, name: 'Premium Headphones', price: '$299', rating: 4.8, reviews: 128 },
  { id: 2, name: 'Wireless Keyboard', price: '$149', rating: 4.6, reviews: 89 },
  { id: 3, name: 'Smart Watch Pro', price: '$399', rating: 4.9, reviews: 256 },
  { id: 4, name: 'USB-C Hub', price: '$79', rating: 4.5, reviews: 67 },
];

const EcommercePreview = () => {
  return (
    <div className="min-h-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">TechStore</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Search products...</span>
            </div>
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] flex items-center justify-center text-black font-bold">
                3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filter</span>
        </div>
        <div className="flex gap-2">
          {['All', 'Audio', 'Tech', 'Accessories'].map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                i === 0
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 hover:border-amber-500/30 transition-all group cursor-pointer"
          >
            {/* Product Image Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-slate-700/50 to-slate-600/30 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
              <Package className="w-8 h-8 text-slate-500" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 p-1.5 bg-slate-800/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="w-3 h-3 text-slate-400" />
              </motion.button>
            </div>

            {/* Product Info */}
            <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-amber-400">{product.rating}</span>
              <span className="text-xs text-slate-500">({product.reviews})</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-amber-400">{product.price}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 bg-amber-500/20 rounded-lg hover:bg-amber-500/30 transition-colors"
              >
                <ShoppingCart className="w-3 h-3 text-amber-400" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Cart Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-8 pb-4 px-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold text-slate-900 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          View Cart (3 items)
        </motion.button>
      </div>
    </div>
  );
};

export default EcommercePreview;
