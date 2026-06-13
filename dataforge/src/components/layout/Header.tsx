import React, { useState } from "react";
import { Search, Sun, Moon, Bell } from "lucide-react";
import { PageId } from "./Sidebar";

interface HeaderProps {
  page: PageId;
  darkMode: boolean;
  onToggleDark: () => void;
}

const pageTitles: Record<PageId, string> = {
  dashboard: "Dashboard",
  sources: "Fontes de Dados",
  pipeline: "Pipeline Builder",
  workspace: "Workspace SQL",
  agent: "Agente IA",
  templates: "Modelos de Transformação",
  jobs: "Jobs e Execuções",
  publications: "Publicações",
  catalog: "Catálogo de Dados",
  quality: "Qualidade dos Dados",
  settings: "Configurações",
};

export const Header: React.FC<HeaderProps> = ({ page, darkMode, onToggleDark }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [hasNotif] = useState(true);

  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-5 py-3 z-10 relative"
      style={{
        background: "rgba(2, 8, 23, 0.92)",
        borderBottom: "1px solid rgba(30,80,160,0.15)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Page title */}
      <div className="flex-shrink-0">
        <h1 className="text-sm font-semibold text-slate-200">{pageTitles[page]}</h1>
        <p className="text-[11px] text-slate-500 hidden sm:block">
          DataForge <span className="text-slate-600">·</span> raniere.dev
        </p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-auto hidden md:block">
        <div
          className="relative flex items-center"
          style={{
            background: "rgba(10,25,50,0.6)",
            border: `1px solid ${searchFocused ? "rgba(59,130,246,0.4)" : "rgba(30,80,160,0.2)"}`,
            borderRadius: 8,
            transition: "border-color 0.2s",
            boxShadow: searchFocused ? "0 0 0 3px rgba(59,130,246,0.08)" : "none",
          }}
        >
          <Search size={13} className="absolute left-3 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar fontes, pipelines, queries..."
            className="w-full bg-transparent pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="absolute right-2.5 text-[10px] text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Status pill */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
            color: "#34d399",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 status-running" />
          DuckDB Online
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
          <Bell size={15} />
          {hasNotif && (
            <span
              className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-400"
              style={{ boxShadow: "0 0 6px rgba(59,130,246,0.6)" }}
            />
          )}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          title={darkMode ? "Modo claro" : "Modo escuro"}
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* User avatar */}
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          style={{ border: "1px solid rgba(59,130,246,0.12)" }}
        >
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">R</span>
          </div>
          <span className="text-xs text-slate-300 font-medium hidden sm:block">Raniere</span>
        </button>
      </div>
    </header>
  );
};
