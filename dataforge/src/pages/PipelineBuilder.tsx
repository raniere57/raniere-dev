import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, GitMerge, Filter, Code2, ShieldCheck, Share2,
  Columns, Play, Sparkles, X, Plus, Save,
  Settings2, ArrowRight,
} from "lucide-react";
import { SqlEditor } from "../components/shared/SqlEditor";
import { Badge } from "../components/shared/Badge";
import { useToast } from "../components/shared/Toast";
import { cn } from "../utils/cn";

type NodeType = "source" | "select" | "join" | "filter" | "sql" | "quality" | "output";

interface PipelineNode {
  id: string;
  type: NodeType;
  label: string;
  subtitle?: string;
  status?: string;
  x: number;
  y: number;
}

const nodeConfig: Record<NodeType, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  source: { icon: Database, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  select: { icon: Columns, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  join: { icon: GitMerge, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  filter: { icon: Filter, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  sql: { icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  quality: { icon: ShieldCheck, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
  output: { icon: Share2, color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30" },
};

const exampleNodes: PipelineNode[] = [
  { id: "n1", type: "source", label: "PostgreSQL ERP", subtitle: "tabela: clientes", x: 0, y: 0 },
  { id: "n2", type: "source", label: "Planilha Comercial", subtitle: "aba: metas", x: 0, y: 1 },
  { id: "n3", type: "source", label: "CSV Financeiro", subtitle: "arquivo: recebíveis", x: 0, y: 2 },
  { id: "n4", type: "join", label: "Join por cliente", subtitle: "id_cliente (LEFT JOIN)", x: 1, y: 1 },
  { id: "n5", type: "sql", label: "Transformação SQL", subtitle: "score_churn + campos calculados", x: 2, y: 1 },
  { id: "n6", type: "quality", label: "Validação de qualidade", subtitle: "8 regras ativas", x: 3, y: 1 },
  { id: "n7", type: "output", label: "Publicação", subtitle: "Parquet + DuckDB", x: 4, y: 1 },
];

const sqlTransformExample = `SELECT
  c.id_cliente,
  c.nome,
  c.segmento,
  m.meta_valor,
  SUM(r.valor) AS receita_total,
  COUNT(r.id) AS num_cobranças,
  ROUND(
    (SUM(CASE WHEN r.status='vencida' THEN 1 ELSE 0 END)
     / COUNT(r.id)::FLOAT) * 100, 2
  ) AS pct_inadimplencia,
  -- Score de churn calculado
  LEAST(100, ROUND(
    AVG(COALESCE(r.atraso_dias, 0)) * 2
  )) AS churn_score
FROM clientes c
LEFT JOIN recebíveis r USING (id_cliente)
LEFT JOIN metas m USING (id_cliente)
GROUP BY
  c.id_cliente, c.nome, c.segmento, m.meta_valor;`;

const NodePanel: React.FC<{ node: PipelineNode | null; onClose: () => void }> = ({ node, onClose }) => {
  const { toast } = useToast();
  const [sqlVal, setSqlVal] = useState(sqlTransformExample);

  if (!node) return null;
  const cfg = nodeConfig[node.type];

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute right-0 top-0 bottom-0 w-80 xl:w-96 overflow-y-auto flex flex-col"
        style={{
          background: "rgba(5,14,31,0.98)",
          borderLeft: "1px solid rgba(59,130,246,0.15)",
          zIndex: 20,
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/10">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-lg", cfg.bg)}>
              <cfg.icon size={14} className={cfg.color} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">{node.label}</p>
              <p className="text-[11px] text-slate-500">{node.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5">
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {node.type === "source" && (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Fonte</label>
                <div className="df-input px-3 py-2 rounded-lg text-sm text-slate-300">{node.label}</div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Tabela / Arquivo</label>
                <div className="df-input px-3 py-2 rounded-lg text-sm text-slate-300">{node.subtitle?.replace("tabela: ", "").replace("aba: ", "").replace("arquivo: ", "")}</div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Colunas detectadas</label>
                <div className="space-y-1">
                  {["id_cliente", "nome", "documento", "email", "segmento", "status", "dt_cadastro"].map((col) => (
                    <div key={col} className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-800/40 border border-slate-700/30">
                      <span className="text-xs text-slate-300 font-mono">{col}</span>
                      <span className="text-[10px] text-slate-500">VARCHAR</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Preview (5 linhas)</label>
                <div className="rounded-lg overflow-hidden border border-slate-700/30">
                  <div className="px-2.5 py-1.5 bg-slate-800/60 text-[10px] text-slate-400 font-mono">id_cliente | nome | segmento</div>
                  {["C-1042 | Alpha Ltda | Enterprise", "C-0887 | Beta SA | SMB", "C-2310 | Gama ME | Startup"].map((row, i) => (
                    <div key={i} className="px-2.5 py-1 text-[10px] text-slate-400 font-mono border-t border-slate-700/20 hover:bg-slate-800/20">{row}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          {node.type === "join" && (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Tabela esquerda</label>
                <select className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                  <option>clientes (PostgreSQL ERP)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Tabela direita</label>
                <select className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                  <option>metas (Planilha Comercial)</option>
                  <option>recebíveis (CSV Financeiro)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Chave de junção</label>
                <input type="text" defaultValue="id_cliente" className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Tipo de join</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "FULL JOIN"].map((j) => (
                    <button key={j} className={cn("px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-colors", j === "LEFT JOIN" ? "border-blue-500/40 bg-blue-500/10 text-blue-300" : "border-slate-700/40 text-slate-500 hover:border-slate-600/60")}>
                      {j}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {node.type === "sql" && (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">SQL da transformação</label>
                <SqlEditor value={sqlVal} onChange={setSqlVal} height="220px" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => toast("info", "Agente IA ativado", "Analisando a query e o contexto das fontes...")}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-violet-400 border border-violet-500/20 hover:bg-violet-500/8 transition-colors"
                >
                  <Sparkles size={12} />
                  Pedir ajuda à IA
                </button>
                <button
                  onClick={() => toast("success", "SQL válido", "A query não possui erros de sintaxe.")}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/8 transition-colors"
                >
                  <ShieldCheck size={12} />
                  Validar SQL
                </button>
                <button
                  onClick={() => toast("success", "Preview gerado", "142.800 linhas · 2.1s · 380 MB")}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-blue-400 border border-blue-500/20 hover:bg-blue-500/8 transition-colors"
                >
                  <Play size={12} />
                  Executar preview
                </button>
              </div>
            </>
          )}

          {node.type === "quality" && (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Regras ativas</label>
                <div className="space-y-1.5">
                  {["CPF/CNPJ válido", "Valor > 0", "Status permitido", "id_cliente único", "Email válido", "Data não nula", "Segmento definido", "Contrato ativo"].map((r) => (
                    <div key={r} className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-slate-800/40 border border-slate-700/30">
                      <ShieldCheck size={10} className="text-emerald-400" />
                      <span className="text-[11px] text-slate-300">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {node.type === "output" && (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Formato de saída</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Parquet", "DuckDB", "CSV", "XLSX"].map((fmt) => (
                    <button key={fmt} className={cn("px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors", ["Parquet", "DuckDB"].includes(fmt) ? "border-blue-500/40 bg-blue-500/10 text-blue-300" : "border-slate-700/40 text-slate-500 hover:border-slate-600/60")}>
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Nome do artefato</label>
                <input type="text" defaultValue="consolidado_comercial" className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 font-mono" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1.5">Agendamento</label>
                <select className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                  <option>Diário às 08:00</option>
                  <option>Manual</option>
                  <option>Semanal</option>
                  <option>Mensal</option>
                </select>
              </div>
              <div className="space-y-2">
                {[["Compressão Snappy", true], ["Particionar por data", true], ["Gerar manifesto", false]].map(([label, checked]) => (
                  <label key={String(label)} className="flex items-center gap-2.5 cursor-pointer">
                    <div className={cn("h-4 w-4 rounded border flex items-center justify-center", checked ? "border-blue-500/60 bg-blue-500/20" : "border-slate-600")}>
                      {checked && <div className="h-2 w-2 rounded-sm bg-blue-400" />}
                    </div>
                    <span className="text-xs text-slate-400">{String(label)}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              onClick={() => toast("success", "Nó salvo", `Configuração de "${node.label}" aplicada.`)}
              className="w-full py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
            >
              <Save size={13} className="inline mr-1.5" />
              Salvar configuração
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PipelineBuilder: React.FC = () => {
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    toast("info", "Pipeline iniciado", "Consolidado Comercial — execução #89");
    setTimeout(() => {
      setRunning(false);
      toast("success", "Pipeline concluído", "142.800 linhas processadas em 2m 18s");
    }, 3000);
  };

  // Column layout: group nodes by x position
  const cols: PipelineNode[][] = [];
  exampleNodes.forEach((n) => {
    if (!cols[n.x]) cols[n.x] = [];
    cols[n.x].push(n);
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Consolidado Comercial</h2>
            <p className="text-[11px] text-slate-500">Pipeline · 3 fontes · 7 nós · Agendado diariamente</p>
          </div>
          <Badge variant="success">Ativo</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast("info", "Nó adicionado", "Configure o novo nó no painel lateral.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 hover:text-slate-200 transition-colors"
          >
            <Plus size={12} />
            Adicionar nó
          </button>
          <button
            onClick={() => toast("success", "Pipeline salvo", "Configurações salvas com sucesso.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 hover:text-slate-200 transition-colors"
          >
            <Save size={12} />
            Salvar
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-70 transition-all"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}
          >
            <Play size={12} className={running ? "animate-pulse" : ""} />
            {running ? "Executando..." : "Executar pipeline"}
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="absolute inset-0 overflow-auto pipeline-canvas"
          style={{ background: "rgba(2,8,23,0.98)" }}
        >
          {/* Pipeline flow */}
          <div className="flex items-start gap-0 p-8 min-w-max min-h-full">
            {cols.map((colNodes, colIdx) => (
              <React.Fragment key={colIdx}>
                {colIdx > 0 && (
                  <div className="flex items-center self-center mx-2 flex-shrink-0" style={{ height: 40, paddingTop: colIdx === 1 && cols[0].length > 1 ? `${(cols[0].length - 1) * 64}px` : 0 }}>
                    <ArrowRight size={16} className="text-blue-500/40" />
                  </div>
                )}
                <div className={cn("flex flex-col gap-4", colIdx === 0 ? "justify-start" : "justify-center")}>
                  {colNodes.map((node) => {
                    const cfg = nodeConfig[node.type];
                    const Icon = cfg.icon;
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: node.x * 0.08 + node.y * 0.04 }}
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        className={cn(
                          "pipeline-node glass-card rounded-xl border p-4 w-52 cursor-pointer",
                          cfg.border,
                          isSelected && "pipeline-node selected"
                        )}
                        style={{ background: "rgba(5,14,31,0.85)" }}
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className={cn("p-1.5 rounded-lg flex-shrink-0", cfg.bg)}>
                            <Icon size={13} className={cfg.color} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-100 truncate">{node.label}</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-8 leading-relaxed">{node.subtitle}</p>
                        {isSelected && (
                          <div className="mt-2 flex items-center gap-1 pl-8">
                            <Settings2 size={10} className="text-blue-400" />
                            <span className="text-[10px] text-blue-400">Configurando...</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Legend */}
          <div
            className="absolute bottom-4 left-4 flex flex-wrap gap-2"
          >
            {Object.entries(nodeConfig).map(([type, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 border border-slate-700/30">
                  <Icon size={10} className={cfg.color} />
                  <span className="text-[10px] text-slate-500 capitalize">{type}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        {selectedNode && (
          <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </div>
  );
};
