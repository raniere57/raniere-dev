import { useApp } from '../contexts/AppContext';
import type { Page } from '../types';
import {
  LayoutDashboard, Headphones, Bot, FileCheck, ListChecks, Users,
  BarChart3, Settings, ExternalLink, X, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { page: 'atendimentos', label: 'Atendimentos', icon: <Headphones size={20} /> },
  { page: 'monitorias', label: 'Monitorias IA', icon: <Bot size={20} /> },
  { page: 'modelos', label: 'Modelos de Avaliação', icon: <FileCheck size={20} /> },
  { page: 'criterios', label: 'Critérios', icon: <ListChecks size={20} /> },
  { page: 'agentes', label: 'Agentes', icon: <Users size={20} /> },
  { page: 'relatorios', label: 'Relatórios', icon: <BarChart3 size={20} /> },
  { page: 'configuracoes', label: 'Configurações', icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const { currentPage, navigate, sidebarOpen, setSidebarOpen, theme } = useApp();

  const handleNav = (page: Page) => {
    navigate(page);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 sidebar-gradient transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          w-[260px] flex flex-col border-r ${theme === 'dark' ? 'border-white/[0.06]' : 'border-slate-200/60'}`}
      >
        {/* Logo */}
        <div className={`px-5 py-5 flex items-center justify-between border-b ${theme === 'dark' ? 'border-white/[0.06]' : 'border-slate-200/60'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center glow-cyan">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className={`text-base font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Sentinel <span className="text-cyan-500">QA</span>
              </h1>
              <p className={`text-[10px] font-medium tracking-widest uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Monitoria Inteligente
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-1 rounded-md ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = currentPage === item.page || 
              (item.page === 'atendimentos' && currentPage === 'atendimento-detail') ||
              (item.page === 'agentes' && currentPage === 'agente-profile') ||
              (item.page === 'modelos' && currentPage === 'modelo-editor');
            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? theme === 'dark'
                      ? 'bg-cyan-500/10 text-cyan-400 border-glow'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                <span className={isActive ? 'text-cyan-500' : ''}>{item.icon}</span>
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className={`px-3 py-4 space-y-2 border-t ${theme === 'dark' ? 'border-white/[0.06]' : 'border-slate-200/60'}`}>
          <button
            onClick={() => navigate('about')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${currentPage === 'about'
                ? 'text-cyan-500 bg-cyan-500/10'
                : theme === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Shield size={20} />
            Sobre o Sentinel QA
          </button>
          <a
            href="https://raniere.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <ExternalLink size={20} />
            Voltar para Raniere.dev
          </a>
        </div>

        {/* Demo notice */}
        <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-white/[0.06]' : 'border-slate-200/60'}`}>
          <p className={`text-[10px] leading-relaxed ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
            ⚠ Ambiente demonstrativo com dados fictícios.
          </p>
        </div>
      </aside>
    </>
  );
}
