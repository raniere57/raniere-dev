import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../state/AppContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastContainer } from "../ui/Toasts";
import { DashboardPage } from "../../pages/Dashboard";
import { ProfilePage } from "../../pages/Profile";
import { CalendarPage } from "../../pages/Calendar";
import { EngagementPage } from "../../pages/Engagement";
import { InboxPage } from "../../pages/Inbox";
import { OutboundPage } from "../../pages/Outbound";
import { AccountsPage } from "../../pages/Accounts";
import { ReportsPage } from "../../pages/Reports";
import { SettingsPage } from "../../pages/Settings";
import { AboutPage } from "../../pages/About";
import { ArrowLeft } from "lucide-react";
import { cn } from "../../utils/cn";

export function AppShell() {
  const { page, sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 light:bg-slate-50 light:text-slate-900">
      <Sidebar />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[260px]"
        )}
      >
        <Header />
        <main className="relative min-h-[calc(100vh-4rem)] bg-navy-950 light:bg-slate-50">
          {/* Subtle grid + glow background */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-50 light:bg-grid-light" />
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {page === "dashboard" && <DashboardPage />}
                {page === "profile" && <ProfilePage />}
                {page === "calendar" && <CalendarPage />}
                {page === "engagement" && <EngagementPage />}
                {page === "inbox" && <InboxPage />}
                {page === "outbound" && <OutboundPage />}
                {page === "accounts" && <AccountsPage />}
                {page === "reports" && <ReportsPage />}
                {page === "settings" && <SettingsPage />}
                {page === "about" && <AboutPage />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer pill: back to portfolio */}
          <div className="sticky bottom-4 z-30 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
              <a
                href="https://raniere.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-slate-800/80 light:border-slate-200 light:bg-white/80 light:text-slate-700"
              >
                <ArrowLeft className="h-3 w-3" /> raniere.dev · demo
              </a>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-300 backdrop-blur-md light:bg-amber-50 light:text-amber-700 light:border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 pulse-dot" />
                Ambiente demonstrativo · dados fictícios
              </span>
            </div>
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
