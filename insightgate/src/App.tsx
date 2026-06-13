import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/ui/Toast';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Publish } from './pages/Publish';
import { Catalog } from './pages/Catalog';
import { Users } from './pages/Users';
import { History } from './pages/History';
import { PowerBI } from './pages/PowerBI';
import { Exports } from './pages/Exports';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { DemoBackPill } from './components/DemoBackPill';
import { cn } from './utils/cn';

function AppContent() {
  const { isLoggedIn, currentPage, theme } = useApp();
  const isDark = theme === 'dark';

  // Apply theme class to document element
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }

  if (!isLoggedIn) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );
  }

  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    reports: <Reports />,
    publish: <Publish />,
    catalog: <Catalog />,
    users: <Users />,
    history: <History />,
    powerbi: <PowerBI />,
    exports: <Exports />,
    alerts: <Alerts />,
    settings: <Settings />,
    about: <About />,
  };

  return (
    <div className={cn(
      'flex h-screen overflow-hidden',
      isDark ? 'bg-[#050d1a]' : 'bg-slate-50'
    )}>
      {/* Background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      {isDark && (
        <>
          <div className="absolute top-0 left-64 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className={cn(
          'flex-1 overflow-y-auto p-6',
          isDark ? 'text-white' : 'text-slate-900'
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {pages[currentPage]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ToastContainer />
      <DemoBackPill />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
