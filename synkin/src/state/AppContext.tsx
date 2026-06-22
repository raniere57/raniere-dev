import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { linkedinAccounts, LinkedInAccount, pendingActions as initialActions, PendingAction, ActionStatus } from "../data/mockData";

export type PageId =
  | "dashboard"
  | "profile"
  | "calendar"
  | "engagement"
  | "inbox"
  | "outbound"
  | "accounts"
  | "reports"
  | "settings"
  | "about";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "info" | "warning" | "error";
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;
  // Navigation
  page: PageId;
  setPage: (p: PageId) => void;
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  // Account
  activeAccountId: string;
  setActiveAccountId: (id: string) => void;
  activeAccount: LinkedInAccount;
  // Actions
  actions: PendingAction[];
  updateActionStatus: (id: string, status: ActionStatus) => void;
  // Toasts
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  // Notifications
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [page, setPage] = useState<PageId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeAccountId, setActiveAccountId] = useState<string>(linkedinAccounts[0].id);
  const [actions, setActions] = useState<PendingAction[]>(initialActions);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Hydrate theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("synkin-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("synkin-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const updateActionStatus = useCallback(
    (id: string, status: ActionStatus) => {
      setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      const action = actions.find((a) => a.id === id);
      if (status === "aprovado" && action) {
        pushToast({
          title: "Ação aprovada!",
          description: "Em produção, seria enviada ao LinkedIn.",
          type: "success",
        });
      } else if (status === "rejeitado" && action) {
        pushToast({
          title: "Ação rejeitada",
          description: "Você pode revisar e gerar nova sugestão depois.",
          type: "info",
        });
      }
    },
    [actions, pushToast]
  );

  const activeAccount = linkedinAccounts.find((a) => a.id === activeAccountId) || linkedinAccounts[0];

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        theme,
        toggleTheme,
        page,
        setPage,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        activeAccountId,
        setActiveAccountId,
        activeAccount,
        actions,
        updateActionStatus,
        toasts,
        pushToast,
        dismissToast,
        notificationsOpen,
        setNotificationsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
