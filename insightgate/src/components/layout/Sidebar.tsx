import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileBarChart2, PlusCircle, BookOpen, Users,
  History, RefreshCw, Download, Bell, Settings, ExternalLink,
  ChevronLeft, ChevronRight, Shield, Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavPage } from '../../types';
import { cn } from '../../utils/cn';

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'reports', label: 'Relatórios', icon: <FileBarChart2 size={18} /> },
  { id: 'publish', label: 'Publicar relatório', icon: <PlusCircle size={18} /> },
  { id: 'catalog', label: 'Catálogo', icon: <BookOpen size={18} /> },
  { id: 'users', label: 'Usuários e grupos', icon: <Users size={18} /> },
  { id: 'history', label: 'Histórico de uso', icon: <History size={18} /> },
  { id: 'powerbi', label: 'Atualizações Power BI', icon: <RefreshCw size={18} />, badge: '2' },
  { id: 'exports', label: 'Exportações e envios', icon: <Download size={18} /> },
  { id: 'alerts', label: 'Alertas', icon: <Bell size={18} />, badge: '5' },
  { id: 'settings', label: 'Configurações', icon: <Settings size={18} /> },
  { id: 'about', label: 'Sobre InsightGate', icon: <Info size={18} /> },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarCollapsed, setSidebarCollapsed, theme } = useApp();

  const isDark = theme === 'dark';

  return (
    <motion.div
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={cn(
        'h-screen flex-shrink-0 flex flex-col border-r z-30',
        isDark
          ? 'bg-[#070d1a] border-blue-500/10'
          : 'bg-slate-50 border-slate-200'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center px-4 py-5 border-b',
        isDark ? 'border-blue-500/10' : 'border-slate-200'
      )}>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ml-3 overflow-hidden"
          >
            <div className={cn('font-bold text-base tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
              InsightGate
            </div>
            <div className="text-xs text-slate-500 font-medium">Portal de Governança BI</div>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hidden">
        <div className="px-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 relative group',
                  isActive
                    ? isDark
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                    : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className={cn('flex-shrink-0', isActive && (isDark ? 'text-blue-400' : 'text-blue-600'))}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge && (
                  <span className="ml-auto bg-red-500/80 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className={cn('mx-4 my-3 border-t', isDark ? 'border-slate-700/50' : 'border-slate-200')} />

        {/* Back to raniere.dev */}
        <div className="px-2">
          <a
            href="https://raniere.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 border border-transparent',
              isDark
                ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            )}
            title={sidebarCollapsed ? 'Voltar para raniere.dev' : undefined}
          >
            <ExternalLink size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>Voltar para raniere.dev</span>}
          </a>
        </div>
      </nav>

      {/* Collapse button */}
      <div className={cn(
        'p-4 border-t',
        isDark ? 'border-blue-500/10' : 'border-slate-200'
      )}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all',
            isDark
              ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          )}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Recolher</span></>}
        </button>
      </div>
    </motion.div>
  );
}
