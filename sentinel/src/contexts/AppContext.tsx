import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Page, Theme, Toast, Atendimento, Agente, ModeloAvaliacao } from '../types';

interface AppContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
  theme: Theme;
  toggleTheme: () => void;
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  selectedAtendimento: Atendimento | null;
  setSelectedAtendimento: (a: Atendimento | null) => void;
  selectedAgente: Agente | null;
  setSelectedAgente: (a: Agente | null) => void;
  selectedModelo: ModeloAvaliacao | null;
  setSelectedModelo: (m: ModeloAvaliacao | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [theme, setTheme] = useState<Theme>('dark');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);
  const [selectedAgente, setSelectedAgente] = useState<Agente | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<ModeloAvaliacao | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.className = newTheme;
      return newTheme;
    });
  }, []);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <AppContext.Provider value={{
      currentPage, navigate, theme, toggleTheme,
      toasts, addToast, removeToast,
      selectedAtendimento, setSelectedAtendimento,
      selectedAgente, setSelectedAgente,
      selectedModelo, setSelectedModelo,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
