import { cn } from '../../utils/cn';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className, glow, onClick, hover }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-xl p-5',
        glow && 'glow-blue',
        hover && 'hover:border-blue-500/30 hover:bg-slate-800/70 transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: 'blue' | 'cyan' | 'green' | 'yellow' | 'red' | 'purple';
  className?: string;
}

const colorMap = {
  blue: {
    icon: 'bg-blue-500/20 text-blue-400',
    trend: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  cyan: {
    icon: 'bg-cyan-500/20 text-cyan-400',
    trend: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  green: {
    icon: 'bg-emerald-500/20 text-emerald-400',
    trend: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  yellow: {
    icon: 'bg-amber-500/20 text-amber-400',
    trend: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  red: {
    icon: 'bg-red-500/20 text-red-400',
    trend: 'text-red-400',
    border: 'border-red-500/20',
  },
  purple: {
    icon: 'bg-purple-500/20 text-purple-400',
    trend: 'text-purple-400',
    border: 'border-purple-500/20',
  },
};

export function MetricCard({ title, value, subtitle, icon, trend, color = 'blue', className }: MetricCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn(
      'glass-card rounded-xl p-5 border transition-all duration-200 hover:border-opacity-40',
      c.border,
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', c.icon)}>
          {icon}
        </div>
        {trend && (
          <span className={cn('text-xs font-medium flex items-center gap-1', trend.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  );
}
