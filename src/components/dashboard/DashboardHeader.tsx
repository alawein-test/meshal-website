import { ReactNode } from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export const DashboardHeader = ({ title, subtitle, actions }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {actions && <div className="flex gap-3 items-center flex-wrap">{actions}</div>}
    </div>
  );
};
