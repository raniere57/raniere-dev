import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Sidebar, type Page } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Inbox } from './pages/Inbox';
import { Telefonia } from './pages/Telefonia';
import { AgenteIA } from './pages/AgenteIA';
import { Disparos } from './pages/Disparos';
import { Canais } from './pages/Canais';
import { Contatos } from './pages/Contatos';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';
import { Sobre } from './pages/Sobre';

const AppInner: React.FC = () => {
  const { isDark } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'inbox': return <Inbox />;
      case 'telefonia': return <Telefonia />;
      case 'agente-ia': return <AgenteIA />;
      case 'disparos': return <Disparos />;
      case 'canais': return <Canais />;
      case 'contatos': return <Contatos />;
      case 'relatorios': return <Relatorios />;
      case 'configuracoes': return <Configuracoes />;
      case 'sobre': return <Sobre />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentPage={currentPage} onMenuClick={() => setMobileMenuOpen(v => !v)} />

        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Demo pill */}
      <a
        href="https://raniere.dev"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold shadow-xl border transition-all hover:scale-105 ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white backdrop-blur-xl'
            : 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900 backdrop-blur-xl shadow-lg'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        ← raniere.dev · demo
      </a>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#0f172a',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#f59e0b', secondary: isDark ? '#1e293b' : '#ffffff' },
          },
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
};

export default App;
