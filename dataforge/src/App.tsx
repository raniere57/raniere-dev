import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastProvider } from "./components/shared/Toast";
import { Sidebar, PageId } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./pages/Dashboard";
import { Sources } from "./pages/Sources";
import { PipelineBuilder } from "./pages/PipelineBuilder";
import { Workspace } from "./pages/Workspace";
import { AIAgent } from "./pages/AIAgent";
import { Templates } from "./pages/Templates";
import { Jobs } from "./pages/Jobs";
import { Publications } from "./pages/Publications";
import { Catalog } from "./pages/Catalog";
import { Quality } from "./pages/Quality";
import { Settings } from "./pages/Settings";



function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("df-theme");
    return stored !== "light";
  });
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
    localStorage.setItem("df-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={(p) => setCurrentPage(p as PageId)} />;
      case "sources":
        return <Sources />;
      case "pipeline":
        return <PipelineBuilder />;
      case "workspace":
        return <Workspace />;
      case "agent":
        return <AIAgent />;
      case "templates":
        return <Templates />;
      case "jobs":
        return <Jobs />;
      case "publications":
        return <Publications />;
      case "catalog":
        return <Catalog />;
      case "quality":
        return <Quality />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onNavigate={(p) => setCurrentPage(p as PageId)} />;
    }
  };

  return (
    <ToastProvider>
      <div
        className={`h-screen flex overflow-hidden tech-grid ${darkMode ? "" : "light"}`}
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #020817 0%, #050e1f 50%, #020817 100%)"
            : "linear-gradient(135deg, #f1f5f9 0%, #e8eef5 50%, #f1f5f9 100%)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: darkMode
              ? "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(59,130,246,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(139,92,246,0.03) 0%, transparent 60%)"
              : "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(59,130,246,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Sidebar */}
        <Sidebar
          current={currentPage}
          onChange={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header
            page={currentPage}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(!darkMode)}
          />

          {/* Page content */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex-1 overflow-hidden flex flex-col"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
