import React, { useState } from 'react';
import { Menu, Search, Bell, Sun, Moon, ChevronDown, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import type { Page } from './Sidebar';

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  inbox: 'Conversas',
  telefonia: 'Telefonia / PBX',
  'agente-ia': 'Agente de IA',
  disparos: 'Disparos',
  canais: 'Canais',
  contatos: 'Contatos',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações',
  sobre: 'Sobre o Signal',
};

type OperatorStatus = 'disponivel' | 'ocupado' | 'ausente';

const statusConfig: Record<OperatorStatus, { label: string; color: string }> = {
  disponivel: { label: 'Disponível', color: 'text-emerald-400' },
  ocupado: { label: 'Ocupado', color: 'text-amber-400' },
  ausente: { label: 'Ausente', color: 'text-slate-400' },
};

interface HeaderProps {
  currentPage: Page;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const [statusOpen, setStatusOpen] = useState(false);
  const [operatorStatus, setOperatorStatus] = useState<OperatorStatus>('disponivel');
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Ana Costa: SLA estourado (45 min)', time: 'agora', urgent: true },
    { id: 2, text: 'João Pedro aguardando há 28 min', time: '2 min', urgent: true },
    { id: 3, text: 'Campanha "Janeiro 2025" concluída', time: '15 min', urgent: false },
    { id: 4, text: 'Nova conversa via Instagram', time: '18 min', urgent: false },
  ];

  return (
    <header className={`h-14 flex items-center px-4 gap-3 border-b flex-shrink-0 ${
      isDark ? 'bg-slate-950/80 border-slate-800/60 backdrop-blur-xl' : 'bg-white/90 border-slate-200 backdrop-blur-xl'
    }`}>
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className={`lg:hidden p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {pageTitles[currentPage]}
      </h2>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-auto hidden sm:flex">
        <div className={`relative w-full`}>
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Buscar conversas, contatos..."
            className={`w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border transition-all ${
              isDark
                ? 'bg-slate-800/60 border-slate-700/60 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
                : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20'
            } focus:outline-none`}
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setStatusOpen(false); }}
            className={`relative p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-50 overflow-hidden ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notificações</span>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">{notifications.filter(n => n.urgent).length} urgentes</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-slate-800/30 cursor-pointer transition-colors`}>
                      <div className="flex items-start gap-2">
                        {n.urgent && <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{n.text}</p>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{n.time} atrás</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Operator status */}
        <div className="relative">
          <button
            onClick={() => { setStatusOpen(v => !v); setNotifOpen(false); }}
            className={`flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg transition-colors text-sm ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Circle size={10} className={`${statusConfig[operatorStatus].color} fill-current`} />
            <span className="hidden sm:block font-medium">{statusConfig[operatorStatus].label}</span>
            <span className="hidden sm:block text-xs font-medium text-slate-500">· Raniere</span>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          <AnimatePresence>
            {statusOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-full mt-2 w-44 rounded-xl border shadow-xl z-50 overflow-hidden ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {(Object.keys(statusConfig) as OperatorStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => { setOperatorStatus(s); setStatusOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-slate-800/50 ${
                      operatorStatus === s ? 'text-amber-400' : isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <Circle size={10} className={`${statusConfig[s].color} fill-current`} />
                    {statusConfig[s].label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
