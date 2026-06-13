import React from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Database, GitBranch, PlayCircle, Share2, Cpu,
  AlertTriangle, TrendingUp, Rows3, Bot, Plus,
  CheckCircle, XCircle, Clock,
} from "lucide-react";
import { MetricCard } from "../components/shared/MetricCard";
import { Badge, getStatusBadge } from "../components/shared/Badge";
import { chartData, mockPipelines, mockJobs } from "../data/mockData";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs border border-blue-500/15" style={{ background: "rgba(5,14,31,0.97)" }}>
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: <span className="font-semibold">{p.value}</span></p>
      ))}
    </div>
  );
};

const aiInsights = [
  { icon: <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />, text: 'A tabela clientes possui duplicidades potenciais — 42 registros com CPF/CNPJ inválido detectados.', severity: 'warning' },
  { icon: <TrendingUp size={13} className="text-blue-400 flex-shrink-0" />, text: 'A query de vendas pode ser otimizada com materialização intermediária — redução estimada de 40% no tempo.', severity: 'info' },
  { icon: <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />, text: 'A fonte financeiro.xlsx não é atualizada há 12 dias — dados potencialmente desatualizados.', severity: 'error' },
  { icon: <TrendingUp size={13} className="text-emerald-400 flex-shrink-0" />, text: 'O pipeline comercial pode ser agendado diariamente — execução manual detectada 7 vezes esta semana.', severity: 'success' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const metrics = [
    { label: "Fontes conectadas", value: "6", icon: <Database size={16} />, accent: "blue" as const, trend: { value: "+1", up: true }, subtext: "1 com erro · 1 pendente" },
    { label: "Tabelas sincronizadas", value: "52", icon: <Rows3 size={16} />, accent: "cyan" as const, trend: { value: "+4", up: true }, subtext: "Última sync: 08:42" },
    { label: "Pipelines ativos", value: "3", icon: <GitBranch size={16} />, accent: "purple" as const, subtext: "1 pausado · 1 com erro" },
    { label: "Jobs executados hoje", value: "24", icon: <PlayCircle size={16} />, accent: "emerald" as const, trend: { value: "+6", up: true }, subtext: "1 falha · 1 executando" },
    { label: "Linhas processadas", value: "274K", icon: <Cpu size={16} />, accent: "blue" as const, trend: { value: "+8.2%", up: true }, subtext: "Acumulado hoje" },
    { label: "Publicações geradas", value: "5", icon: <Share2 size={16} />, accent: "cyan" as const, subtext: "Último: 08:50" },
    { label: "Tempo médio de exec.", value: "3m 08s", icon: <Clock size={16} />, accent: "amber" as const, trend: { value: "-12%", up: true }, subtext: "vs. semana anterior" },
    { label: "Alertas de qualidade", value: "4", icon: <AlertTriangle size={16} />, accent: "red" as const, trend: { value: "+1", up: false }, subtext: "2 críticos · 2 médios" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Bem-vindo, <span className="gradient-text">Raniere</span> 👋
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Quarta-feira, 15 de Janeiro de 2025 · 3 pipelines ativos · DuckDB online
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate("pipeline")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
          }}
        >
          <Plus size={15} />
          Criar novo pipeline
        </motion.button>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} delay={i * 0.04} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Executions chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 glass-card rounded-xl p-5"
          style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Execuções por dia</h3>
              <p className="text-xs text-slate-500">Últimos 7 dias</p>
            </div>
            <Badge variant="info" dot={false}>Últimos 7d</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData.executionsByDay}>
              <defs>
                <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="executions" name="Execuções" stroke="#3b82f6" fill="url(#execGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="errors" name="Erros" stroke="#ef4444" fill="url(#errGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Volume by source */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-5"
          style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Volume por fonte</h3>
            <p className="text-xs text-slate-500">Em MB</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData.volumeBySource} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="source" type="category" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" name="Volume (MB)" radius={[0, 4, 4, 0]}>
                {chartData.volumeBySource.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent pipelines */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-1 glass-card rounded-xl overflow-hidden"
          style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-blue-500/8">
            <h3 className="text-sm font-semibold text-slate-200">Pipelines recentes</h3>
            <button onClick={() => onNavigate("pipeline")} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
              Ver todos →
            </button>
          </div>
          <div className="divide-y divide-blue-500/5">
            {mockPipelines.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-200 truncate">{p.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.lastRun}</p>
                </div>
                {getStatusBadge(p.status)}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Failed jobs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1 glass-card rounded-xl overflow-hidden"
          style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-blue-500/8">
            <h3 className="text-sm font-semibold text-slate-200">Jobs recentes</h3>
            <button onClick={() => onNavigate("jobs")} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
              Ver todos →
            </button>
          </div>
          <div className="divide-y divide-blue-500/5">
            {mockJobs.slice(0, 4).map((j) => (
              <div key={j.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {j.status === "success" && <CheckCircle size={11} className="text-emerald-400 flex-shrink-0" />}
                    {j.status === "error" && <XCircle size={11} className="text-red-400 flex-shrink-0" />}
                    {j.status === "running" && <div className="h-2 w-2 rounded-full bg-blue-400 status-running flex-shrink-0" />}
                    <p className="text-xs font-medium text-slate-200 truncate">{j.name}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 pl-3.5">{j.duration} · {j.rows.toLocaleString()} linhas</p>
                </div>
                {getStatusBadge(j.status)}
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="lg:col-span-1 glass-card rounded-xl overflow-hidden"
          style={{
            background: "rgba(5,14,31,0.7)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-violet-500/10">
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-violet-400" />
              <h3 className="text-sm font-semibold text-slate-200">Insights da IA</h3>
            </div>
            <button onClick={() => onNavigate("agent")} className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors">
              Abrir agente →
            </button>
          </div>
          <div className="divide-y divide-violet-500/5">
            {aiInsights.map((ins, i) => (
              <div key={i} className="flex items-start gap-2.5 px-5 py-3 hover:bg-white/2 transition-colors">
                <div className="mt-0.5">{ins.icon}</div>
                <p className="text-[12px] text-slate-300 leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
