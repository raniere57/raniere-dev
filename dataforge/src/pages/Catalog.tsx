import React, { useState } from "react";
import {
  Search, GitBranch, X,
  Hash, ArrowRight, Bot,
} from "lucide-react";
import { Drawer } from "../components/shared/Drawer";
import { useToast } from "../components/shared/Toast";
import { mockCatalog, mockSchemas } from "../data/mockData";
import { cn } from "../utils/cn";

const domainColors: Record<string, { bg: string; text: string }> = {
  financeiro: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  comercial: { bg: "bg-blue-500/10", text: "text-blue-400" },
  atendimento: { bg: "bg-violet-500/10", text: "text-violet-400" },
  operacional: { bg: "bg-amber-500/10", text: "text-amber-400" },
};



const aiDocumentation = `**Documentação gerada por IA**

Este dataset consolida a visão 360° dos clientes, integrando dados de ERP (cadastro e contratos), CRM (oportunidades e interações) e Atendimento (tickets e SLA).

**Granularidade:** Um registro por cliente ativo.

**Casos de uso sugeridos:**
- Segmentação de clientes para campanhas
- Análise de propensão ao churn
- Dashboard executivo de carteira
- Alimentação de modelos de ML

**Campos calculados incluídos:**
- \`health_score\`: Score 0–100 baseado em inadimplência e reclamações
- \`churn_score\`: Propensão ao churn (0–100)
- \`tma_atendimento\`: Tempo médio de atendimento em horas

**Atualização:** A cada 12 horas (06h e 18h).`;

export const Catalog: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<typeof mockCatalog[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"schema" | "preview" | "lineage" | "docs">("schema");

  const filtered = mockCatalog.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()) || d.tags.some((t) => t.includes(search.toLowerCase()));
    const matchDomain = !domainFilter || d.domain === domainFilter;
    return matchSearch && matchDomain;
  });

  const domains = ["financeiro", "comercial", "atendimento"];

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-200">Catálogo de Dados</h2>
        <p className="text-xs text-slate-500 mt-0.5">{mockCatalog.length} datasets publicados · Busca semântica disponível</p>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar datasets, colunas, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="df-input w-full pl-8 pr-3 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setDomainFilter(null)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all", !domainFilter ? "border-blue-500/40 bg-blue-500/10 text-blue-300" : "border-slate-700/40 text-slate-500 hover:border-slate-600")}>
            Todos
          </button>
          {domains.map((d) => {
            const cfg = domainColors[d] ?? { bg: "bg-slate-500/10", text: "text-slate-400" };
            return (
              <button key={d} onClick={() => setDomainFilter(domainFilter === d ? null : d)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize", domainFilter === d ? `${cfg.bg} ${cfg.text} border-current/30` : "border-slate-700/40 text-slate-500 hover:border-slate-600")}>
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dataset table */}
      <div
        className="glass-card rounded-xl overflow-hidden"
        style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs data-table">
            <thead style={{ background: "rgba(5,14,31,0.8)" }}>
              <tr>
                {["Dataset", "Descrição", "Fonte", "Domínio", "Colunas", "Linhas", "Atualização", "Qualidade", "Tags"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap border-b border-blue-500/8">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((dataset) => {
                const domainCfg = domainColors[dataset.domain] ?? { bg: "bg-slate-500/10", text: "text-slate-400" };
                const qColor = dataset.quality >= 90 ? "text-emerald-400" : dataset.quality >= 75 ? "text-amber-400" : "text-red-400";
                return (
                  <tr
                    key={dataset.id}
                    className="border-b border-slate-800/40 hover:bg-white/2 transition-colors cursor-pointer"
                    onClick={() => { setSelectedDataset(dataset); setActiveTab("schema"); }}
                  >
                    <td className="px-4 py-3">
                      <p className="text-slate-200 font-mono font-medium">{dataset.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{dataset.format}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs">
                      <p className="truncate">{dataset.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{dataset.source}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium capitalize", domainCfg.bg, domainCfg.text)}>
                        {dataset.domain}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{dataset.columns}</td>
                    <td className="px-4 py-3 text-slate-400">{dataset.rows.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">{dataset.updatedAt}</td>
                    <td className="px-4 py-3">
                      <span className={cn("font-bold text-sm", qColor)}>{dataset.quality}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {dataset.tags.slice(0, 2).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800/50 text-[10px] text-slate-500">#{t}</span>
                        ))}
                        {dataset.tags.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800/50 text-[10px] text-slate-600">+{dataset.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Detail Drawer */}
      <Drawer
        open={!!selectedDataset}
        onClose={() => setSelectedDataset(null)}
        title={selectedDataset?.name}
        subtitle={selectedDataset?.description}
        width="520px"
      >
        {selectedDataset && (
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 py-2.5 border-b border-blue-500/10 flex-shrink-0 flex-wrap gap-y-1">
              {(["schema", "preview", "lineage", "docs"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize", activeTab === tab ? "bg-blue-500/15 text-blue-400" : "text-slate-500 hover:text-slate-300")}
                >
                  {tab === "docs" ? "Documentação IA" : tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "schema" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-[10px] text-slate-500">Colunas</p>
                      <p className="text-sm font-bold text-slate-200">{selectedDataset.columns}</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-[10px] text-slate-500">Linhas</p>
                      <p className="text-sm font-bold text-slate-200">{selectedDataset.rows.toLocaleString()}</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-[10px] text-slate-500">Qualidade</p>
                      <p className="text-sm font-bold text-emerald-400">{selectedDataset.quality}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold mb-2">Schema</p>
                    <div className="space-y-1">
                      {(mockSchemas["clientes"]).map((col) => (
                        <div key={col.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/20">
                          <div className="flex items-center gap-2">
                            <Hash size={10} className="text-slate-500" />
                            <span className="text-xs text-slate-300 font-mono">{col.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-blue-400">{col.type}</span>
                            {!col.nullable && <span className="text-[10px] text-amber-400">NOT NULL</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preview" && (
                <div className="rounded-xl overflow-auto border border-slate-700/30" style={{ background: "rgba(3,11,24,0.8)" }}>
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
                        {["id_cliente", "nome", "segmento", "status"].map((col) => (
                          <th key={col} className="px-3 py-2 text-left text-[10px] uppercase tracking-wide text-slate-500 font-semibold whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[["C-1042","Alpha Ltda","Enterprise","ativo"],["C-0887","Beta SA","SMB","ativo"],["C-2310","Gama ME","Startup","ativo"]].map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(59,130,246,0.05)" }}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 text-slate-400 font-mono whitespace-nowrap">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "lineage" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Linhagem simplificada do dataset:</p>
                  <div className="flex flex-col gap-2">
                    {["PostgreSQL ERP → clientes", "MariaDB Atendimento → atendimentos", "API CRM → oportunidades"].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                        <span className="text-xs text-slate-300 font-mono">{step}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pl-4">
                      <ArrowRight size={12} className="text-blue-500/40" />
                      <span className="text-xs text-slate-400">Pipeline: Base Clientes 360</span>
                    </div>
                    <div className="flex items-center gap-2 pl-8">
                      <ArrowRight size={12} className="text-cyan-500/40" />
                      <span className="text-xs text-cyan-400 font-mono">{selectedDataset.name}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-slate-500">Pipelines relacionados:</p>
                    <div className="mt-1.5 space-y-1">
                      {["Base Clientes 360", "Score de Churn"].map((p) => (
                        <div key={p} className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-slate-800/30 border border-slate-700/20">
                          <GitBranch size={10} className="text-blue-400" />
                          <span className="text-xs text-slate-300">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "docs" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot size={14} className="text-violet-400" />
                    <span className="text-xs font-medium text-violet-300">Gerado pelo DataForge Agent</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                    {aiDocumentation.split("\n\n").map((para, i) => {
                      const parsed = para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100">$1</strong>');
                      const parsedCode = parsed.replace(/`(.*?)`/g, '<code class="bg-slate-700/50 text-cyan-300 px-1 rounded font-mono text-[10px]">$1</code>');
                      return <p key={i} dangerouslySetInnerHTML={{ __html: parsedCode }} />;
                    })}
                  </div>
                  <button
                    onClick={() => toast("info", "Atualizando documentação", "Agente IA gerando nova documentação...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-violet-400 border border-violet-500/20 hover:bg-violet-500/8 transition-colors"
                  >
                    <Bot size={11} />
                    Regenerar documentação
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
