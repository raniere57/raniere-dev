import { useApp } from '../contexts/AppContext';
import { Search, Sun, Moon, Bell, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { theme, toggleTheme, currentPage, setSidebarOpen } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    atendimentos: 'Atendimentos',
    'atendimento-detail': 'Detalhe do Atendimento',
    monitorias: 'Monitorias IA',
    modelos: 'Modelos de Avaliação',
    'modelo-editor': 'Editor de Modelo',
    criterios: 'Critérios',
    agentes: 'Agentes',
    'agente-profile': 'Perfil do Agente',
    relatorios: 'Relatórios',
    configuracoes: 'Configurações',
    about: 'Sobre o Sentinel QA',
  };

  return (
    <header className={`sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center gap-4 border-b transition-colors
      ${theme === 'dark' 
        ? 'bg-navy-900/80 backdrop-blur-xl border-white/[0.06]' 
        : 'bg-white/80 backdrop-blur-xl border-slate-200/60'}`}
    >
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`lg:hidden p-2 rounded-lg transition-colors
          ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h2 className={`text-lg font-semibold hidden sm:block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
        {pageTitles[currentPage] || 'Dashboard'}
      </h2>

      {/* Search */}
      <div className={`flex-1 max-w-md mx-auto relative`}>
        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
        <input
          type="text"
          placeholder="Buscar atendimentos, agentes, modelos..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm transition-all duration-200 outline-none
            ${searchFocused
              ? theme === 'dark'
                ? 'bg-white/[0.08] border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'bg-white border-cyan-300 shadow-md shadow-cyan-100'
              : theme === 'dark'
                ? 'bg-white/[0.04] border-transparent'
                : 'bg-slate-100 border-transparent'
            }
            border ${theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all duration-200
            ${theme === 'dark' 
              ? 'text-slate-400 hover:text-yellow-400 hover:bg-white/[0.06]' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className={`p-2 rounded-lg relative transition-all
          ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer
          ${theme === 'dark' ? 'ring-2 ring-white/10' : 'ring-2 ring-slate-200'}`}>
          R
        </div>
      </div>
    </header>
  );
}
