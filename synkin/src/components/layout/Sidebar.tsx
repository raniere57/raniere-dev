import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { useApp, PageId } from "../../state/AppContext";
import { SynkinLogo } from "../ui/Logo";
import { StatusBadge } from "../ui/Badges";
import { linkedinAccounts } from "../../data/mockData";
import {
  LayoutDashboard,
  UserCircle2,
  CalendarDays,
  Sparkles,
  Inbox,
  Send,
  Users2,
  BarChart3,
  Settings,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { LinkedinIcon } from "./LinkedinIcon";

const navItems: { id: PageId; label: string; icon: React.ElementType; group: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "principal" },
  { id: "profile", label: "Análise de perfil", icon: UserCircle2, group: "estratégia" },
  { id: "calendar", label: "Calendário de conteúdo", icon: CalendarDays, group: "estratégia" },
  { id: "engagement", label: "Copiloto de engajamento", icon: Sparkles, group: "relacionamento" },
  { id: "inbox", label: "Inbox / CRM", icon: Inbox, group: "relacionamento" },
  { id: "outbound", label: "Outbound", icon: Send, group: "relacionamento" },
  { id: "accounts", label: "Contas LinkedIn", icon: Users2, group: "conta" },
  { id: "reports", label: "Relatórios", icon: BarChart3, group: "conta" },
  { id: "settings", label: "Configurações", icon: Settings, group: "conta" },
  { id: "about", label: "Sobre (demo)", icon: Info, group: "conta" },
];

const groups: { id: string; label: string }[] = [
  { id: "principal", label: "Principal" },
  { id: "estratégia", label: "Estratégia & Conteúdo" },
  { id: "relacionamento", label: "Relacionamento" },
  { id: "conta", label: "Conta" },
];

export function Sidebar() {
  const { page, setPage, sidebarOpen, setSidebarOpen, activeAccountId, setActiveAccountId, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const activeAccount = linkedinAccounts.find((a) => a.id === activeAccountId)!;
  const pendingCount = useApp().actions.filter((a) => a.status === "pendente_aprovacao").length;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300",
          "bg-navy-900/95 backdrop-blur-xl border-white/[0.06]",
          "light:bg-white/95 light:border-slate-200/60",
          sidebarCollapsed ? "w-[76px]" : "w-[260px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo + close (mobile) */}
        <div className={cn("flex items-center justify-between border-b border-white/[0.06] px-4 py-4 light:border-slate-200/60", sidebarCollapsed && "justify-center px-2")}>
          {!sidebarCollapsed ? (
            <SynkinLogo size={32} />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 glow-blue">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                <circle cx="6.5" cy="5.5" r="1.8" />
                <rect x="5" y="9" width="3" height="10" rx="0.5" />
                <path d="M11 5h3v2.2c.6-1.1 2-2.5 4-2.5 3 0 4 2 4 4.5V19h-3v-4.5c0-1.4-.5-2.4-2-2.4s-2.5 1-2.5 2.5V19h-3.5V5z" />
              </svg>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-200"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Account selector */}
        {!sidebarCollapsed ? (
          <div className="border-b border-white/[0.06] px-3 py-3 light:border-slate-200/60">
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Conta LinkedIn ativa</p>
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen((v) => !v)}
                className="flex w-full items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-left transition-colors hover:bg-white/[0.06] light:border-slate-200 light:bg-slate-50 light:hover:bg-slate-100"
              >
                <div className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white", activeAccount.avatarColor)}>
                  {activeAccount.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-100 light:text-slate-900">{activeAccount.name}</p>
                  <p className="truncate text-[10px] text-slate-500">{activeAccount.type === "pessoal" ? "Conta pessoal" : "Página empresa"}</p>
                </div>
                <LinkedinIcon className="h-3.5 w-3.5 text-blue-400" />
              </button>

              <AnimatePresence>
                {accountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute left-0 right-0 top-full z-10 mt-1.5 overflow-hidden rounded-lg border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl light:bg-white light:border-slate-200"
                  >
                    {linkedinAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setActiveAccountId(acc.id);
                          setAccountMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/5 light:hover:bg-slate-100"
                      >
                        <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white", acc.avatarColor)}>
                          {acc.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-slate-100 light:text-slate-900">{acc.name}</p>
                          <p className="truncate text-[10px] text-slate-500">{acc.type}</p>
                        </div>
                        {acc.id === activeAccountId ? (
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                        ) : acc.status === "conectada" ? (
                          <Circle className="h-2.5 w-2.5 flex-shrink-0 text-emerald-400" />
                        ) : (
                          <StatusBadge variant="warning">pendente</StatusBadge>
                        )}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setPage("accounts");
                        setSidebarOpen(false);
                      }}
                      className="flex w-full items-center gap-2 border-t border-white/5 px-3 py-2.5 text-left text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/10 light:border-slate-200"
                    >
                      <Plus className="h-3.5 w-3.5" /> Conectar nova conta
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex justify-center border-b border-white/[0.06] py-3 light:border-slate-200/60">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white", activeAccount.avatarColor)}>
              {activeAccount.initials}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className={cn("flex-1 overflow-y-auto py-3", sidebarCollapsed ? "px-2" : "px-3")}>
          {groups.map((g) => {
            const items = navItems.filter((n) => n.group === g.id);
            return (
              <div key={g.id} className="mb-4">
                {!sidebarCollapsed && (
                  <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{g.label}</p>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = page === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPage(item.id);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        "group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                        sidebarCollapsed && "justify-center",
                        isActive
                          ? "bg-blue-500/10 text-blue-300 light:bg-blue-50 light:text-blue-700"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-900"
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeNav"
                          className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-400 to-blue-600 glow-blue"
                        />
                      )}
                      <Icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-blue-400")} />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      {!sidebarCollapsed && item.id === "dashboard" && pendingCount > 0 && (
                        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500/20 px-1.5 text-[10px] font-semibold text-rose-300">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="border-t border-white/[0.06] p-3 light:border-slate-200/60">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300 light:hover:bg-slate-100 light:hover:text-slate-700"
          >
            {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            {!sidebarCollapsed && <span>Recolher</span>}
          </button>
          <p className="mt-1 text-center text-[10px] text-slate-600">Synkin v0.9 · demo</p>
        </div>
      </aside>
    </>
  );
}
