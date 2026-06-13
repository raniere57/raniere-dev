import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Database, GitBranch, Code2, Bot, BookTemplate,
  PlayCircle, Share2, BookOpen, ShieldCheck, Settings, ExternalLink,
  Zap, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "../../utils/cn";

export type PageId =
  | "dashboard" | "sources" | "pipeline" | "workspace"
  | "agent" | "templates" | "jobs" | "publications"
  | "catalog" | "quality" | "settings";

const navItems: { id: PageId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sources", label: "Fontes de Dados", icon: Database },
  { id: "pipeline", label: "Pipeline Builder", icon: GitBranch },
  { id: "workspace", label: "Workspace SQL", icon: Code2 },
  { id: "agent", label: "Agente IA", icon: Bot },
  { id: "templates", label: "Modelos de Transformação", icon: BookTemplate },
  { id: "jobs", label: "Jobs e Execuções", icon: PlayCircle },
  { id: "publications", label: "Publicações", icon: Share2 },
  { id: "catalog", label: "Catálogo de Dados", icon: BookOpen },
  { id: "quality", label: "Qualidade dos Dados", icon: ShieldCheck },
  { id: "settings", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  current: PageId;
  onChange: (id: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  current, onChange, collapsed, onToggleCollapse
}) => {
  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex-shrink-0 flex flex-col h-full overflow-hidden relative z-10"
      style={{
        background: "rgba(2, 8, 23, 0.95)",
        borderRight: "1px solid rgba(30,80,160,0.18)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-3.5 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(30,80,160,0.12)" }}
      >
        <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-bold text-slate-100 tracking-tight"
          >
            Data<span className="gradient-text">Forge</span>
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "nav-item w-full flex items-center rounded-lg text-left transition-colors",
                collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2",
                active
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
              )}
            >
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-[13px] font-medium truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className="flex-shrink-0 px-1.5 py-2 space-y-1"
        style={{ borderTop: "1px solid rgba(30,80,160,0.12)" }}
      >
        <a
          href="https://raniere.dev"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? "Voltar para Raniere.dev" : undefined}
          className={cn(
            "nav-item w-full flex items-center rounded-lg text-slate-500 hover:text-slate-300 transition-colors",
            collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
          )}
          style={{ borderLeft: "2px solid transparent" }}
        >
          <ExternalLink size={15} className="flex-shrink-0" />
          {!collapsed && (
            <span className="text-[13px] font-medium truncate">raniere.dev</span>
          )}
        </a>

        <button
          onClick={onToggleCollapse}
          className={cn(
            "nav-item w-full flex items-center rounded-lg text-slate-600 hover:text-slate-400 transition-colors",
            collapsed ? "justify-center px-0 py-2" : "gap-2.5 px-3 py-1.5"
          )}
          style={{ borderLeft: "2px solid transparent" }}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span className="text-[12px]">Recolher sidebar</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};
