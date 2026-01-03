import { LucideIcon } from 'lucide-react';
import { StatCard } from './StatCard';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

export const StatsGrid = ({ stats, columns = 4 }: StatsGridProps) => {
  const colClasses = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${colClasses[columns]} gap-4`}>
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  );
};
