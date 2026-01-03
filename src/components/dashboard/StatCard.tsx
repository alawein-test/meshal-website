import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
  index?: number;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  color = 'text-primary',
  trend,
  index = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden">
        {trend && (
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M0,0 L100,0 L100,100 Q50,50 0,0" fill="currentColor" />
            </svg>
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
              {trend && <p className="text-xs text-green-400 mt-1">{trend}</p>}
            </div>
            <div className={`p-3 rounded-xl bg-muted/50 ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
