import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { useApp, PageId } from "../../state/AppContext";
import { Search, Bell, Sun, Moon, Menu, Sparkles, CheckCircle2, X } from "lucide-react";
import { initialNotifications } from "../../data/mockData";
import { LinkedinIcon } from "./LinkedinIcon";

const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Ações recomendadas do dia" },
  profile: { title: "Análise de perfil", subtitle: "Score de autoridade e sugestões" },
  calendar: { title: "Calendário de conteúdo", subtitle: "Planejamento, criação e aprovação" },
  engagement: { title: "Copiloto de engajamento", subtitle: "Oportunidades de visibilidade no nicho" },
  inbox: { title: "Inbox / CRM", subtitle: "Conversas, leads e relacionamento" },
  outbound: { title: "Outbound", subtitle: "Prospecção assistida com IA" },
  accounts: { title: "Contas LinkedIn", subtitle: "Conexões e permissões" },
  reports: { title: "Relatórios", subtitle: "Métricas, funil e crescimento" },
  settings: { title: "Configurações", subtitle: "Perfil, notificações e IA" },
  about: { title: "Sobre a demo", subtitle: "Synkin · portfólio raniere.dev" },
};

function NotificationIcon({ type }: { type: string }) {
  if (type === "aprovacao") return <Sparkles className="h-3.5 w-3.5" />;
  if (type === "mensagem") return <LinkedinIcon className="h-3.5 w-3.5" />;
  if (type === "agendamento") return <Bell className="h-3.5 w-3.5" />;
  return <CheckCircle2 className="h-3.5 w-3.5" />;
}

export function Header() {
  const { page, setSidebarOpen, theme, toggleTheme, activeAccount, actions, setNotificationsOpen, notificationsOpen } = useApp();
  const { title, subtitle } = pageTitles[page];
  const pendingCount = actions.filter((a) => a.status === "pendente_aprovacao").length;
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-navy-950/80 px-4 backdrop-blur-xl sm:px-6 light:bg-white/80 light:border-slate-200/60">
      {/* Mobile menu */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="rounded-lg p-1.5 text-slate-300 hover:bg-white/5 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-slate-50 sm:text-lg light:text-slate-900">{title}</h1>
        <p className="hidden truncate text-xs text-slate-500 sm:block">{subtitle}</p>
      </div>

      {/* Account pill */}
      <div className="hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 md:flex light:border-slate-200 light:bg-slate-50">
        <div className={cn("flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br text-[10px] font-bold text-white", activeAccount.avatarColor)}>
          {activeAccount.initials}
        </div>
        <div className="text-left">
          <p className="text-xs font-medium leading-none text-slate-200 light:text-slate-900">{activeAccount.name.split(" ")[0]}</p>
          <p className="mt-0.5 text-[10px] leading-none text-slate-500">{activeAccount.type}</p>
        </div>
        <LinkedinIcon className="h-3 w-3 text-blue-400" />
      </div>

      {/* Search */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {searchOpen ? (
            <motion.input
              key="search"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              autoFocus
              onBlur={() => setSearchOpen(false)}
              placeholder="Buscar leads, posts, ações..."
              className="h-9 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/40 light:border-slate-200 light:bg-white"
            />
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200 light:hover:bg-slate-100"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="relative rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200 light:hover:bg-slate-100"
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
          {pendingCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
              {pendingCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl light:bg-white light:border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 light:border-slate-200">
                <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Notificações</h3>
                <button onClick={() => setNotificationsOpen(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {initialNotifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5 light:border-slate-100 light:hover:bg-slate-50">
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
                        n.type === "aprovacao" && "bg-amber-500/15 text-amber-400",
                        n.type === "mensagem" && "bg-blue-500/15 text-blue-400",
                        n.type === "agendamento" && "bg-violet-500/15 text-violet-400",
                        n.type === "perfil" && "bg-emerald-500/15 text-emerald-400"
                      )}
                    >
                      <NotificationIcon type={n.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-200 light:text-slate-800">{n.text}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="block w-full px-4 py-2.5 text-center text-xs font-medium text-blue-400 hover:bg-blue-500/10">
                Ver todas as notificações
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200 light:hover:bg-slate-100"
        aria-label="Alternar tema"
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sun className="h-4 w-4" />
            </motion.span>
          ) : (
            <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Moon className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* User avatar */}
      <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white sm:flex">
        RR
      </div>
    </header>
  );
}
