import React, { useState } from "react";
import {
  Play, Code2, Save, Eye, Download, Sparkles, ChevronRight,
  ChevronDown, Database, Table2, Clock, Layers, Hash,
  BarChart3, FileText,
} from "lucide-react";
import { SqlEditor } from "../components/shared/SqlEditor";
import { useToast } from "../components/shared/Toast";
import { mockSqlQuery, mockQueryResults, mockSchemas } from "../data/mockData";
import { cn } from "../utils/cn";

const sidebarTrees = [
  {
    label: "PostgreSQL ERP",
    icon: <Database size={12} className="text-blue-400" />,
    tables: ["clientes", "contratos", "produtos", "agentes", "cidades"],
  },
  {
    label: "MariaDB Atendimento",
    icon: <Database size={12} className="text-orange-400" />,
    tables: ["atendimentos", "categorias", "agentes"],
  },
  {
    label: "CSV Financeiro",
    icon: <FileText size={12} className="text-amber-400" />,
    tables: ["cobranças", "recebimentos"],
  },
  {
    label: "Views DuckDB",
    icon: <Layers size={12} className="text-violet-400" />,
    tables: ["vw_clientes_ativos", "vw_recebiveis", "vw_performance_comercial"],
  },
];

const queryHistory = [
  { label: "Score de churn por cliente", time: "08:45", lines: "87.240" },
  { label: "Recebíveis vencidos por aging", time: "07:30", lines: "22.400" },
  { label: "Performance comercial mensal", time: "06:15", lines: "142.800" },
  { label: "Atendimentos por SLA", time: "05:00", lines: "215.000" },
];

const typeColors: Record<string, string> = {
  VARCHAR: "text-emerald-400",
  INT: "text-blue-400",
  DECIMAL: "text-amber-400",
  DATE: "text-violet-400",
  TIMESTAMP: "text-cyan-400",
  FLOAT: "text-rose-400",
};

export const Workspace: React.FC = () => {
  const { toast } = useToast();
  const [sql, setSql] = useState(mockSqlQuery);
  const [executing, setExecuting] = useState(false);
  const [hasResults, setHasResults] = useState(true);
  const [expandedSources, setExpandedSources] = useState<string[]>(["PostgreSQL ERP"]);
  const [expandedTable, setExpandedTable] = useState<string | null>("clientes");
  const [activeResultTab, setActiveResultTab] = useState<"data" | "explain">("data");

  const toggleSource = (label: string) => {
    setExpandedSources((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setHasResults(true);
      toast("success", "Query executada", "7 linhas retornadas em 0.42s · 84 MB estimados");
    }, 1200);
  };

  const handleFormat = () => {
    toast("success", "SQL formatado", "Indentação e capitalização aplicadas.");
  };

  const handleAI = () => {
    toast("info", "Agente IA", "Analisando a query e sugerindo otimizações...");
  };



  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Left sidebar: schema browser */}
      <div
        className="w-52 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ borderRight: "1px solid rgba(59,130,246,0.1)", background: "rgba(2,8,23,0.8)" }}
      >
        <div className="px-3 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(59,130,246,0.08)" }}>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Fontes & Schemas</p>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {sidebarTrees.map((src) => (
            <div key={src.label}>
              <button
                onClick={() => toggleSource(src.label)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-left hover:bg-white/3 transition-colors"
              >
                {expandedSources.includes(src.label) ? <ChevronDown size={10} className="text-slate-500" /> : <ChevronRight size={10} className="text-slate-500" />}
                {src.icon}
                <span className="text-[11px] text-slate-300 font-medium truncate">{src.label}</span>
              </button>
              {expandedSources.includes(src.label) && (
                <div className="ml-4">
                  {src.tables.map((tbl) => (
                    <div key={tbl}>
                      <button
                        onClick={() => setExpandedTable(expandedTable === tbl ? null : tbl)}
                        className="w-full flex items-center gap-1.5 px-3 py-1.5 text-left hover:bg-white/3 transition-colors"
                      >
                        <Table2 size={10} className="text-slate-500 flex-shrink-0" />
                        <span className="text-[11px] text-slate-400 truncate">{tbl}</span>
                      </button>
                      {expandedTable === tbl && mockSchemas[tbl as keyof typeof mockSchemas] && (
                        <div className="ml-4 border-l border-slate-700/30 py-0.5">
                          {mockSchemas[tbl as keyof typeof mockSchemas].map((col) => (
                            <div key={col.name} className="flex items-center gap-1.5 px-2 py-0.5">
                              <Hash size={8} className="text-slate-600 flex-shrink-0" />
                              <span className="text-[10px] text-slate-500 truncate font-mono">{col.name}</span>
                              <span className={cn("text-[9px] ml-auto flex-shrink-0", typeColors[col.type] || "text-slate-600")}>{col.type}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        {/* Toolbar */}
        <div
          className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}
        >
          <button
            onClick={handleExecute}
            disabled={executing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-60 transition-all"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 3px 10px rgba(59,130,246,0.25)" }}
          >
            <Play size={11} className={executing ? "animate-pulse" : ""} />
            {executing ? "Executando..." : "Executar"}
          </button>

          {[
            { label: "Formatar", icon: <Code2 size={11} />, action: handleFormat },
            { label: "Salvar query", icon: <Save size={11} />, action: () => toast("success", "Query salva", "Disponível no histórico.") },
            { label: "Criar view", icon: <Eye size={11} />, action: () => toast("info", "View criada", "vw_churn_score adicionada ao catálogo.") },
            { label: "Exportar", icon: <Download size={11} />, action: () => toast("success", "Exportando", "CSV gerado — 7 linhas.") },
            { label: "Pedir à IA", icon: <Sparkles size={11} />, action: handleAI },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 border border-slate-700/40 hover:border-slate-600 hover:text-slate-200 transition-colors"
            >
              {btn.icon}
              <span className="hidden sm:inline">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Editor + Results */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* SQL Editor */}
          <div className="flex-shrink-0 p-3" style={{ height: "58%" }}>
            <SqlEditor value={sql} onChange={setSql} height="100%" />
          </div>

          {/* Results panel */}
          <div
            className="flex-1 overflow-hidden flex flex-col"
            style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }}
          >
            {/* Result tabs */}
            <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(59,130,246,0.08)" }}>
              <div className="flex items-center gap-3">
                {["data", "explain"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveResultTab(tab as "data" | "explain")}
                    className={cn("text-xs font-medium transition-colors", activeResultTab === tab ? "text-blue-400" : "text-slate-500 hover:text-slate-300")}
                  >
                    {tab === "data" ? "Resultado" : "Explain Plan"}
                  </button>
                ))}
              </div>
              {hasResults && (
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Hash size={10} /> 7 linhas</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> 0.42s</span>
                  <span className="flex items-center gap-1"><BarChart3 size={10} /> ~84 MB</span>
                  <button onClick={() => toast("success", "Exportando", "Gerando arquivo CSV...")} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    <Download size={10} />
                    Exportar
                  </button>
                </div>
              )}
            </div>

            {/* Results table */}
            <div className="flex-1 overflow-auto">
              {hasResults ? (
                <table className="w-full text-[11px] data-table">
                  <thead className="sticky top-0" style={{ background: "rgba(5,14,31,0.95)" }}>
                    <tr>
                      {["id_cliente", "nome", "segmento", "total_cobranças", "valor_total", "cobranças_vencidas", "atraso_medio_dias", "total_atendimentos", "reclamações", "churn_score", "risco_churn"].map((col) => (
                        <th key={col} className="px-3 py-2 text-left font-mono whitespace-nowrap border-b border-blue-500/8">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockQueryResults.map((row, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-white/2 transition-colors">
                        <td className="px-3 py-2 font-mono text-blue-400 whitespace-nowrap">{row.id_cliente}</td>
                        <td className="px-3 py-2 text-slate-300 whitespace-nowrap">{row.nome}</td>
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{row.segmento}</td>
                        <td className="px-3 py-2 text-slate-300 text-right">{row.total_cobranças}</td>
                        <td className="px-3 py-2 text-emerald-400 whitespace-nowrap">{row.valor_total}</td>
                        <td className="px-3 py-2 text-amber-400 text-right">{row.cobranças_vencidas}</td>
                        <td className="px-3 py-2 text-slate-300 text-right">{row.atraso_medio_dias}</td>
                        <td className="px-3 py-2 text-slate-300 text-right">{row.total_atendimentos}</td>
                        <td className="px-3 py-2 text-slate-300 text-right">{row.reclamações}</td>
                        <td className="px-3 py-2 text-right">
                          <span className={cn("font-bold", row.churn_score >= 70 ? "text-red-400" : row.churn_score >= 40 ? "text-amber-400" : "text-emerald-400")}>
                            {row.churn_score}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", row.risco_churn === "alto" ? "bg-red-500/15 text-red-400" : row.risco_churn === "médio" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400")}>
                            {row.risco_churn}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <Play size={24} className="mb-2 opacity-30" />
                  <p className="text-sm">Execute uma query para ver os resultados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar: query history */}
      <div
        className="w-44 flex-shrink-0 overflow-hidden flex flex-col hidden xl:flex"
        style={{ borderLeft: "1px solid rgba(59,130,246,0.1)", background: "rgba(2,8,23,0.8)" }}
      >
        <div className="px-3 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(59,130,246,0.08)" }}>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Histórico</p>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {queryHistory.map((q, i) => (
            <button
              key={i}
              onClick={() => toast("info", "Query carregada", q.label)}
              className="w-full px-3 py-2.5 text-left hover:bg-white/3 transition-colors border-b border-slate-800/40"
            >
              <p className="text-[11px] text-slate-300 leading-relaxed">{q.label}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock size={9} className="text-slate-600" />
                <span className="text-[10px] text-slate-600">{q.time}</span>
                <span className="text-[10px] text-slate-600">·</span>
                <span className="text-[10px] text-slate-600">{q.lines}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
