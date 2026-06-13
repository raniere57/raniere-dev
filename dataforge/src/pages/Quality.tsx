import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, AlertTriangle, XCircle, CheckCircle,
  Plus, Bot, Sparkles, Play,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Modal } from "../components/shared/Modal";
import { MetricCard } from "../components/shared/MetricCard";
import { getStatusBadge } from "../components/shared/Badge";
import { SqlEditor } from "../components/shared/SqlEditor";
import { useToast } from "../components/shared/Toast";
import { mockQualityRules, chartData } from "../data/mockData";
import { cn } from "../utils/cn";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(5,14,31,0.97)", border: "1px solid rgba(59,130,246,0.15)" }}>
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-emerald-400">Score: <span className="font-bold">{payload[0].value}</span></p>
    </div>
  );
};


const validationTypes = [
  { label: "Formato (regex)", value: "formato" },
  { label: "Não nulo", value: "nulidade" },
  { label: "Intervalo de valores", value: "intervalo" },
  { label: "Unicidade", value: "unicidade" },
  { label: "Domínio de valores", value: "domínio" },
  { label: "SQL customizado", value: "custom" },
];

export const Quality: React.FC = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState(mockQualityRules);
  const [showModal, setShowModal] = useState(false);
  const [generatingSQL, setGeneratingSQL] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dataset: "clientes_360",
    column: "",
    type: "formato",
    severity: "high",
    sql: "",
  });

  const generatedSQLExample = `-- Regra: Validar formato do ${form.column || 'campo'}
-- Dataset: ${form.dataset}

SELECT COUNT(*) AS registros_inválidos
FROM ${form.dataset}
WHERE ${form.column || 'coluna'} IS NOT NULL
  AND NOT REGEXP_MATCHES(
    ${form.column || 'coluna'},
    '^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}$'
  );`;

  const handleGenerateSQL = () => {
    setGeneratingSQL(true);
    setTimeout(() => {
      setGeneratingSQL(false);
      setForm({ ...form, sql: generatedSQLExample });
      toast("success", "SQL gerado", "Regra de qualidade gerada pelo agente IA.");
    }, 1500);
  };

  const handleSaveRule = () => {
    if (!form.name || !form.column) {
      toast("error", "Campos obrigatórios", "Preencha nome e coluna da regra.");
      return;
    }
    const newRule = {
      id: `qr-${Date.now()}`,
      name: form.name,
      dataset: form.dataset,
      column: form.column,
      type: form.type,
      severity: form.severity,
      affected: 0,
      lastRun: "—",
      status: "pass",
    };
    setRules((prev) => [...prev, newRule]);
    setShowModal(false);
    toast("success", "Regra criada", `${form.name} adicionada ao dataset ${form.dataset}.`);
  };

  const metrics = [
    { label: "Score geral de qualidade", value: "91%", icon: <ShieldCheck size={16} />, accent: "emerald" as const, trend: { value: "+3%", up: true } },
    { label: "Registros com erro", value: "63", icon: <XCircle size={16} />, accent: "red" as const, trend: { value: "+12", up: false } },
    { label: "Colunas com nulos", value: "7", icon: <AlertTriangle size={16} />, accent: "amber" as const },
    { label: "Duplicidades", value: "0", icon: <CheckCircle size={16} />, accent: "emerald" as const },
    { label: "Regras ativas", value: String(rules.length), icon: <ShieldCheck size={16} />, accent: "blue" as const },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-200">Qualidade dos Dados</h2>
          <p className="text-xs text-slate-500 mt-0.5">Monitoramento e validação contínua dos datasets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}
        >
          <Plus size={14} />
          Criar regra com IA
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} delay={i * 0.04} />
        ))}
      </div>

      {/* Quality chart + rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-xl p-5"
          style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Score de qualidade</h3>
            <p className="text-xs text-slate-500">Evolução nos últimos 7 dias</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData.qualityByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rules list */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden" style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}>
          <div className="px-5 py-3 border-b border-blue-500/8">
            <h3 className="text-sm font-semibold text-slate-200">Regras de qualidade</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs data-table">
              <thead style={{ background: "rgba(5,14,31,0.8)" }}>
                <tr>
                  {["Regra", "Dataset", "Coluna", "Tipo", "Severidade", "Afetados", "Última exec.", "Status", "Ações"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left whitespace-nowrap border-b border-blue-500/8">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-slate-800/40 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-medium whitespace-nowrap">{rule.name}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono whitespace-nowrap">{rule.dataset}</td>
                    <td className="px-4 py-3 text-cyan-400 font-mono whitespace-nowrap">{rule.column}</td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800/50 text-[10px] text-slate-400">{rule.type}</span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(rule.severity)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("font-medium", rule.affected > 0 ? "text-amber-400" : "text-emerald-400")}>
                        {rule.affected}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">{rule.lastRun}</td>
                    <td className="px-4 py-3">{getStatusBadge(rule.status)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toast("info", "Executando regra", `${rule.name} sendo validada...`)}
                        className="p-1.5 rounded text-blue-400 hover:bg-blue-500/10 transition-colors"
                        title="Executar"
                      >
                        <Play size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Rule Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nova regra de qualidade" subtitle="Defina uma validação para garantir integridade dos dados" size="lg">
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1.5">Nome da regra *</label>
              <input type="text" placeholder="Ex: Email válido" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Dataset</label>
              <select value={form.dataset} onChange={(e) => setForm({ ...form, dataset: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                {["clientes_360", "recebiveis", "atendimentos", "vw_performance_comercial"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Coluna *</label>
              <input type="text" placeholder="Ex: email" value={form.column} onChange={(e) => setForm({ ...form, column: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 font-mono placeholder-slate-600" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Tipo de validação</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                {validationTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Severidade</label>
              <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                <option value="critical">Crítico</option>
                <option value="high">Alto</option>
                <option value="medium">Médio</option>
                <option value="low">Baixo</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-slate-400">SQL da regra</label>
              <button
                onClick={handleGenerateSQL}
                disabled={generatingSQL}
                className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
              >
                {generatingSQL ? <Sparkles size={10} className="animate-pulse" /> : <Bot size={10} />}
                {generatingSQL ? "Gerando..." : "Gerar SQL com IA"}
              </button>
            </div>
            <SqlEditor value={form.sql} onChange={(v) => setForm({ ...form, sql: v })} height="160px" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { toast("info", "Testando regra", "Executando validação em amostra de 1.000 registros..."); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-blue-400 border border-blue-500/20 hover:bg-blue-500/8 transition-colors"
            >
              <Play size={13} />
              Testar regra
            </button>
            <button
              onClick={handleSaveRule}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
            >
              Salvar regra
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
