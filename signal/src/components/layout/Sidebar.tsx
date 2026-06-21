import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Phone, Bot, Send, Radio, Users, BarChart3, Settings, Zap, X, Info,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export type Page =
  | 'dashboard'
  | 'inbox'
  | 'telefonia'
  | 'agente-ia'
  | 'disparos'
  | 'canais'
  | 'contatos'
  | 'relatorios'
  | 'configuracoes'
  | 'sobre';

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'inbox', label: 'Conversas', icon: <MessageSquare size={18} /> },
  { id: 'telefonia', label: 'Telefonia', icon: <Phone size={18} /> },
  { id: 'agente-ia', label: 'Agente de IA', icon: <Bot size={18} /> },
  { id: 'disparos', label: 'Disparos', icon: <Send size={18} /> },
  { id: 'canais', label: 'Canais', icon: <Radio size={18} /> },
  { id: 'contatos', label: 'Contatos', icon: <Users size={18} /> },
  { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 size={18} /> },
  { id: 'configuracoes', label: 'Configurações', icon: <Settings size={18} /> },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const SidebarContent: React.FC<SidebarProps> = ({ currentPage, onNavigate, onMobileClose }) => {
  const { isDark } = useTheme();

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 flex-shrink-0">
          <Zap size={18} className="text-slate-950" fill="currentColor" />
        </div>
        <div>
          <h1 className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Signal</h1>
          <p className={`text-[10px] leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Omnichannel</p>
        </div>
        <button
          onClick={onMobileClose}
          className={`ml-auto lg:hidden p-1 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onMobileClose(); }}
              className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? isDark
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-amber-50 text-amber-600'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-amber-400"
                />
              )}
              <span className={`transition-colors ${isActive ? 'text-amber-400' : isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-700'}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* About / Demo link */}
      <div className={`px-3 pb-3 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'} pt-3`}>
        <button
          onClick={() => { onNavigate('sobre'); onMobileClose(); }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            currentPage === 'sobre'
              ? isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
              : isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Info size={18} />
          Sobre o Signal
        </button>

        {/* Demo badge */}
        <div className={`mt-3 mx-1 px-3 py-2.5 rounded-xl ${isDark ? 'bg-slate-900 border border-slate-800/60' : 'bg-slate-50 border border-slate-200'}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider">Demo</span>
          </div>
          <p className={`text-[10px] leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Dados fictícios · Ambiente demonstrativo
          </p>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { isDark } = useTheme();

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col w-56 flex-shrink-0 border-r ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
        <SidebarContent {...props} />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {props.mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={props.onMobileClose}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed left-0 top-0 bottom-0 w-56 z-50 lg:hidden border-r ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}
            >
              <SidebarContent {...props} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
