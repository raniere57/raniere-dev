import { useApp } from '../contexts/AppContext';
import type { Risco, StatusAnalise, StatusMonitoria, Severidade } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

// GlassCard
export function GlassCard({ children, className = '', hover = false, glow = false }: {
  children: React.ReactNode; className?: string; hover?: boolean; glow?: boolean;
}) {
  const { theme } = useApp();
  return (
    <div className={`rounded-xl transition-all duration-300
      ${theme === 'dark' 
        ? `bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl ${hover ? 'hover:bg-white/[0.07] hover:border-cyan-500/20' : ''} ${glow ? 'glow-cyan' : ''}`
        : `bg-white/70 border border-slate-200/60 backdrop-blur-xl shadow-sm ${hover ? 'hover:bg-white/90 hover:border-cyan-300/40 hover:shadow-md' : ''} ${glow ? 'glow-cyan' : ''}`
      } ${className}`}>
      {children}
    </div>
  );
}

// MetricCard
export function MetricCard({ title, value, subtitle, icon, trend, color = 'cyan' }: {
  title: string; value: string | number; subtitle?: string; icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral'; color?: 'cyan' | 'green' | 'red' | 'yellow' | 'purple';
}) {
  const { theme } = useApp();
  const colorMap = {
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', glow: 'shadow-red-500/10' },
    yellow: { bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/10' },
    purple: { bg: 'bg-violet-500/10', text: 'text-violet-400', glow: 'shadow-violet-500/10' },
  };
  const c = colorMap[color];

  return (
    <GlassCard hover className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center shadow-lg ${c.glow}`}>
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

// StatusBadge
export function StatusBadge({ status }: { status: StatusAnalise | StatusMonitoria }) {
  const { theme } = useApp();
  const styles: Record<string, string> = {
    'concluída': theme === 'dark' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'em análise': theme === 'dark' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'pendente': theme === 'dark' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200',
    'erro': theme === 'dark' ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200',
    'em execução': theme === 'dark' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'agendada': theme === 'dark' ? 'bg-violet-500/15 text-violet-400 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200',
    'pausada': theme === 'dark' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
      {status}
    </span>
  );
}

// RiskBadge
export function RiskBadge({ risk }: { risk: Risco }) {
  const { theme } = useApp();
  const styles: Record<string, string> = {
    'crítico': theme === 'dark' ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200',
    'alto': theme === 'dark' ? 'bg-orange-500/15 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200',
    'médio': theme === 'dark' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200',
    'baixo': theme === 'dark' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[risk]}`}>
      {risk === 'crítico' && <AlertCircle size={10} />}
      {risk}
    </span>
  );
}

// SeverityBadge
export function SeverityBadge({ severity }: { severity: Severidade }) {
  const { theme } = useApp();
  const styles: Record<string, string> = {
    'crítica': theme === 'dark' ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-700',
    'alta': theme === 'dark' ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-700',
    'média': theme === 'dark' ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-700',
    'baixa': theme === 'dark' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[severity]}`}>
      {severity}
    </span>
  );
}

// ScoreBar
export function ScoreBar({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const { theme } = useApp();
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className={`w-full rounded-full ${height} ${theme === 'dark' ? 'bg-white/[0.06]' : 'bg-slate-200'}`}>
      <div className={`${height} rounded-full ${color} transition-all duration-500`} style={{ width: `${Math.max(score, 2)}%` }} />
    </div>
  );
}

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }: {
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const { theme } = useApp();
  const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none`}
          >
            <div className={`w-full ${sizeMap[size]} rounded-xl overflow-hidden pointer-events-auto
              ${theme === 'dark' ? 'bg-navy-800 border border-white/[0.08]' : 'bg-white border border-slate-200 shadow-2xl'}`}>
              <div className={`flex items-center justify-between px-6 py-4 border-b ${theme === 'dark' ? 'border-white/[0.06]' : 'border-slate-200'}`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                  <X size={18} />
                </button>
              </div>
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Toast Container
export function ToastContainer() {
  const { toasts, removeToast, theme } = useApp();
  const iconMap = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
  };
  const colorMap = {
    success: theme === 'dark' ? 'border-emerald-500/30 text-emerald-400' : 'border-emerald-200 text-emerald-700',
    error: theme === 'dark' ? 'border-red-500/30 text-red-400' : 'border-red-200 text-red-700',
    warning: theme === 'dark' ? 'border-amber-500/30 text-amber-400' : 'border-amber-200 text-amber-700',
    info: theme === 'dark' ? 'border-cyan-500/30 text-cyan-400' : 'border-cyan-200 text-cyan-700',
  };

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-xl shadow-lg
              ${theme === 'dark' ? 'bg-navy-800/95' : 'bg-white/95'}
              ${colorMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <span className={`text-sm flex-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// EmptyState
export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode; title: string; description: string; action?: React.ReactNode;
}) {
  const { theme } = useApp();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4
        ${theme === 'dark' ? 'bg-white/[0.04] text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <h3 className={`text-base font-semibold mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{title}</h3>
      <p className={`text-sm max-w-xs ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// GlowButton
export function GlowButton({ children, onClick, variant = 'primary', size = 'md', className = '', type = 'button' as const }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; className?: string; type?: 'button' | 'submit' | 'reset';
}) {
  const { theme } = useApp();
  const sizeMap = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const variantMap = {
    primary: theme === 'dark'
      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30'
      : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-md shadow-cyan-200',
    secondary: theme === 'dark'
      ? 'bg-white/[0.06] text-slate-300 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white'
      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm',
    ghost: theme === 'dark'
      ? 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ${sizeMap[size]} ${variantMap[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// PageWrapper with animation
export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
