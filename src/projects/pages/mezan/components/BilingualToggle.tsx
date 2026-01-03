import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

interface BilingualToggleProps {
  language: 'ar' | 'en';
  onToggle: () => void;
}

const BilingualToggle = ({ language, onToggle }: BilingualToggleProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="outline"
        onClick={onToggle}
        className="relative overflow-hidden gap-2 border-border/50 bg-card/50 backdrop-blur"
      >
        <Languages className="h-4 w-4" />
        <div className="relative w-12 h-6 rounded-full bg-muted/50 border border-border/50">
          <motion.div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground"
            animate={{
              left: language === 'ar' ? '1px' : 'calc(100% - 21px)',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {language === 'ar' ? 'ع' : 'E'}
          </motion.div>
        </div>
        <span className="text-sm font-medium">{language === 'ar' ? 'عربي' : 'English'}</span>
      </Button>
    </motion.div>
  );
};

export default BilingualToggle;
