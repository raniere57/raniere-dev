import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ToastContainer } from './components/SharedComponents';
import Dashboard from './pages/Dashboard';
import Atendimentos from './pages/Atendimentos';
import MonitoriasIA from './pages/MonitoriasIA';
import ModelosAvaliacao from './pages/ModelosAvaliacao';
import Criterios from './pages/Criterios';
import Agentes from './pages/Agentes';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import About from './pages/About';

function AppContent() {
  const { currentPage, theme } = useApp();
  const isDark = theme === 'dark';

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'atendimentos': case 'atendimento-detail': return <Atendimentos />;
      case 'monitorias': return <MonitoriasIA />;
      case 'modelos': case 'modelo-editor': return <ModelosAvaliacao />;
      case 'criterios': return <Criterios />;
      case 'agentes': case 'agente-profile': return <Agentes />;
      case 'relatorios': return <Relatorios />;
      case 'configuracoes': return <Configuracoes />;
      case 'about': return <About />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen grid-bg transition-colors duration-300 ${isDark ? 'bg-navy-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {renderPage()}
        </main>
      </div>
      <ToastContainer />
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
