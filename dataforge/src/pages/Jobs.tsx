import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PlayCircle, RefreshCw, XCircle, Download, FileText,
  Clock, CheckCircle, AlertCircle, Loader2,
  BarChart3,
} from "lucide-react";
import { Modal } from "../components/shared/Modal";
import { MetricCard } from "../components/shared/MetricCard";
import { getStatusBadge } from "../components/shared/Badge";
import { useToast } from "../components/shared/Toast";
import { mockJobs } from "../data/mockData";
import { cn } from "../utils/cn";

const timelineSteps = [
  { label: "Conectar fontes", duration: "0.8s", status: "done" },
  { label: "Carregar dados", duration: "12.4s", status: "done" },
  { label: "Aplicar transformações", duration: "45.2s", status: "done" },
  { label: "Validar qualidade", duration: "8.1s", status: "done" },
  { label: "Gerar artefatos", duration: "28.7s", status: "done" },
  { label: "Publicar saída", duration: "4.2s", status: "done" },
];

const mockLogs = `[08:45:00.001] INFO  Pipeline "Consolidado Comercial" — job #88 iniciado
[08:45:00.042] INFO  Conectando ao PostgreSQL ERP (erp.internal.corp:5432)...
[08:45:00.847] OK    PostgreSQL ERP conectado (0.8s)
[08:45:00.850] INFO  Conectando ao CSV Financeiro (financeiro.csv)...
[08:45:01.120] OK    CSV Financeiro carregado (0.3s)
[08:45:01.122] INFO  Conectando à Planilha Comercial (comercial.xlsx)...
[08:45:01.380] OK    Planilha Comercial carregada (0.3s)
[08:45:01.382] INFO  Iniciando carregamento de dados...
[08:45:01.383] INFO  → clientes: 87.240 registros
[08:45:05.214] INFO  → metas: 2.400 registros
[08:45:07.890] INFO  → recebíveis: 22.400 registros
[08:45:13.782] OK    Dados carregados (12.4s · 1.2 GB)
[08:45:13.783] INFO  Aplicando transformações SQL...
[08:45:13.784] INFO  → CTE clientes_base: 87.240 linhas
[08:45:24.100] INFO  → CTE cobranças_agg: 22.400 linhas → 87.240 após LEFT JOIN
[08:45:38.200] INFO  → CTE atendimentos_agg: 215.000 linhas → 87.240 após LEFT JOIN
[08:45:58.985] OK    Transformações aplicadas (45.2s · 142.800 linhas finais)
[08:45:58.986] INFO  Executando validações de qualidade...
[08:45:59.100] OK    CPF/CNPJ válido: 87.198 OK · 42 WARN
[08:45:59.800] OK    Valor > 0: 22.400 OK
[08:46:00.240] OK    id_cliente único: 87.240 OK
[08:46:07.070] OK    Qualidade validada (8.1s · 3 alertas · 0 erros críticos)
[08:46:07.071] INFO  Gerando artefatos de saída...
[08:46:07.072] INFO  → Escrevendo consolidado_comercial.parquet (Snappy)...
[08:46:22.100] INFO  → Escrevendo consolidado_comercial.duckdb...
[08:46:35.775] OK    Artefatos gerados (28.7s · 96.4 MB)
[08:46:35.776] INFO  Publicando saída...
[08:46:39.976] OK    Publicação concluída (4.2s)
[08:46:39.977] INFO  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:46:39.977] OK    Job #88 finalizado com SUCESSO
[08:46:39.977] INFO  Duração total: 2m 14s · 142.800 linhas · 420 MB usados`;

export const Jobs: React.FC = () => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [rerunning, setRerunning] = useState<string | null>(null);

  const handleRerun = (job: typeof mockJobs[0]) => {
    setRerunning(job.id);
    toast("info", "Reexecutando job", `${job.pipeline} — nova execução iniciada.`);
    setTimeout(() => {
      setRerunning(null);
      toast("success", "Job concluído", `${job.pipeline} finalizado com sucesso.`);
    }, 3000);
  };

  const metrics = [
    { label: "Execuções hoje", value: "24", icon: <PlayCircle size={16} />, accent: "blue" as const },
    { label: "Sucesso", value: "21", icon: <CheckCircle size={16} />, accent: "emerald" as const },
    { label: "Falhas", value: "1", icon: <AlertCircle size={16} />, accent: "red" as const },
    { label: "Tempo médio", value: "3m 08s", icon: <Clock size={16} />, accent: "cyan" as const },
    { label: "Linhas processadas", value: "274K", icon: <BarChart3 size={16} />, accent: "purple" as const },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-200">Jobs e Execuções</h2>
        <p className="text-xs text-slate-500 mt-0.5">Monitoramento de execução de pipelines em tempo real</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} delay={i * 0.04} />
        ))}
      </div>

      {/* Jobs table */}
      <div
        className="glass-card rounded-xl overflow-hidden"
        style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
      >
        <div className="px-5 py-3 border-b border-blue-500/8">
          <h3 className="text-sm font-semibold text-slate-200">Histórico de execuções</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs data-table">
            <thead style={{ background: "rgba(5,14,31,0.8)" }}>
              <tr>
                {["Job", "Pipeline", "Status", "Início", "Duração", "Linhas", "Memória", "Usuário", "Próxima exec.", "Ações"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap border-b border-blue-500/8">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-slate-800/40 hover:bg-white/2 transition-colors cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <td className="px-4 py-3 text-slate-300 font-medium whitespace-nowrap">{job.name}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{job.pipeline}</td>
                  <td className="px-4 py-3">{getStatusBadge(job.status)}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono">{job.startedAt}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{job.duration}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{job.rows ? job.rows.toLocaleString() : "—"}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{job.memory}</td>
                  <td className="px-4 py-3 text-slate-400">{job.user}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">{job.nextRun}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleRerun(job)}
                        disabled={rerunning === job.id || job.status === "running"}
                        className="p-1.5 rounded text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-40"
                        title="Reexecutar"
                      >
                        {rerunning === job.id ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                      </button>
                      <button
                        onClick={() => { setSelectedJob(job); setShowLogs(true); }}
                        className="p-1.5 rounded text-slate-400 hover:bg-white/5 transition-colors"
                        title="Ver logs"
                      >
                        <FileText size={12} />
                      </button>
                      {job.status === "running" && (
                        <button
                          onClick={() => toast("warning", "Job cancelado", `${job.name} foi cancelado.`)}
                          className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Cancelar"
                        >
                          <XCircle size={12} />
                        </button>
                      )}
                      {job.status === "success" && (
                        <button
                          onClick={() => toast("success", "Baixando artefato", "Download iniciado.")}
                          className="p-1.5 rounded text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          title="Baixar artefato"
                        >
                          <Download size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job detail modal */}
      <Modal
        open={!!selectedJob}
        onClose={() => { setSelectedJob(null); setShowLogs(false); }}
        title={selectedJob?.name ?? ""}
        subtitle={`Pipeline: ${selectedJob?.pipeline}`}
        size="xl"
      >
        <div className="p-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Status", value: selectedJob?.status ? getStatusBadge(selectedJob.status) : "—" },
              { label: "Duração", value: selectedJob?.duration ?? "—" },
              { label: "Linhas", value: selectedJob?.rows?.toLocaleString() ?? "—" },
              { label: "Memória", value: selectedJob?.memory ?? "—" },
            ].map((item) => (
              <div key={item.label} className="px-3 py-2.5 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{item.label}</p>
                {typeof item.value === "string" ? (
                  <p className="text-sm font-semibold text-slate-200">{item.value}</p>
                ) : item.value}
              </div>
            ))}
          </div>

          {/* Timeline */}
          {!showLogs && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Timeline de execução</p>
              <div className="space-y-2">
                {timelineSteps.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={10} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 h-px bg-emerald-500/15" />
                      <span className="text-xs text-slate-300">{step.label}</span>
                      <div className="flex-1 h-px bg-emerald-500/10" />
                      <span className="text-[11px] text-slate-500 font-mono">{step.duration}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Logs */}
          {showLogs && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Logs técnicos</p>
              <div
                className="rounded-lg overflow-auto font-mono text-[11px] leading-relaxed p-4"
                style={{
                  background: "#030b18",
                  border: "1px solid rgba(59,130,246,0.15)",
                  maxHeight: 360,
                  whiteSpace: "pre",
                }}
              >
                {mockLogs.split("\n").map((line, i) => {
                  const isOk = line.includes("] OK ");
                  const isError = line.includes("ERROR") || line.includes("FAIL");
                  const isWarn = line.includes("WARN");
                  return (
                    <p key={i} className={cn(isOk ? "text-emerald-400" : isError ? "text-red-400" : isWarn ? "text-amber-400" : "text-slate-400")}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 transition-colors"
            >
              <FileText size={13} />
              {showLogs ? "Ver timeline" : "Ver logs"}
            </button>
            {selectedJob && (
              <button
                onClick={() => handleRerun(selectedJob)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                <RefreshCw size={13} />
                Reexecutar
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
