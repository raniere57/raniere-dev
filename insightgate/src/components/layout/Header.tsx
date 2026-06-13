import { useState } from 'react';
import { Search, Sun, Moon, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export function Header() {
  const { theme, toggleTheme, setCurrentPage, setIsLoggedIn, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const isDark = theme === 'dark';

  const handleLogout = () => {
    setIsLoggedIn(false);
    addToast('Sessão encerrada com sucesso.', 'info');
  };

  return (
    <header className={cn(
      'h-16 flex-shrink-0 flex items-center justify-between px-6 border-b z-20',
      isDark
        ? 'bg-[#070d1a]/80 backdrop-blur-sm border-blue-500/10'
        : 'bg-white/80 backdrop-blur-sm border-slate-200'
    )}>
      {/* Search */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-lg border w-80 transition-all',
        isDark
          ? 'bg-slate-800/50 border-slate-700/50 focus-within:border-blue-500/50'
          : 'bg-slate-50 border-slate-200 focus-within:border-blue-400'
      )}>
        <Search size={16} className="text-slate-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar relatórios, usuários..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (searchQuery.trim()) {
                setCurrentPage('catalog');
              }
            }
          }}
          className={cn(
            'bg-transparent text-sm outline-none w-full',
            isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          )}
        />
        <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-slate-600 text-slate-500 hidden sm:block">⏎</kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
            isDark
              ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 border border-transparent hover:border-amber-500/30'
              : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200'
          )}
          title={isDark ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setCurrentPage('alerts')}
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center relative transition-all',
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          )}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all border',
              isDark
                ? 'hover:bg-white/5 border-transparent hover:border-slate-700'
                : 'hover:bg-slate-100 border-transparent hover:border-slate-200'
            )}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              RC
            </div>
            <div className="hidden sm:block text-left">
              <div className={cn('text-sm font-medium leading-tight', isDark ? 'text-white' : 'text-slate-900')}>
                Raniere Costa
              </div>
              <div className="text-[11px] text-slate-500">Admin</div>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {showProfile && (
            <div className={cn(
              'absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-xl z-50',
              isDark ? 'glass-card border-slate-700' : 'bg-white border-slate-200'
            )}>
              <div className={cn('px-4 py-3 border-b', isDark ? 'border-slate-700' : 'border-slate-100')}>
                <div className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>Raniere Costa</div>
                <div className="text-xs text-slate-500">raniere@empresa.com</div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { setCurrentPage('settings'); setShowProfile(false); }}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-all',
                    isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  Configurações
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg transition-all text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <LogOut size={14} /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
