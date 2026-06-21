import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  accent?: string;
  index?: number;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, icon, trend, accent = 'amber', index = 0 }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`relative rounded-2xl p-5 border overflow-hidden group hover:scale-[1.02] transition-transform duration-200 cursor-default ${
        isDark
          ? 'bg-slate-900/60 border-slate-800/60 hover:border-slate-700/80'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        accent === 'amber' ? 'bg-gradient-to-br from-amber-500/5 to-transparent' :
        accent === 'violet' ? 'bg-gradient-to-br from-violet-500/5 to-transparent' :
        accent === 'emerald' ? 'bg-gradient-to-br from-emerald-500/5 to-transparent' :
        'bg-gradient-to-br from-blue-500/5 to-transparent'
      }`} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${
          accent === 'amber' ? 'bg-amber-500/15 text-amber-400' :
          accent === 'violet' ? 'bg-violet-500/15 text-violet-400' :
          accent === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
          accent === 'blue' ? 'bg-blue-500/15 text-blue-400' :
          accent === 'rose' ? 'bg-rose-500/15 text-rose-400' :
          'bg-slate-500/15 text-slate-400'
        }`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};
