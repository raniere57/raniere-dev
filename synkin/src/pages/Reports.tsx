import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/Buttons";
import { StatusBadge } from "../components/ui/Badges";
import { useApp } from "../state/AppContext";
import { reportsData, linkedinAccounts } from "../data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Download, TrendingUp, Users2, Eye, MessageSquare, Flame } from "lucide-react";
import { cn } from "../utils/cn";

const periods = ["7 dias", "30 dias", "90 dias", "12 meses"];

export function ReportsPage() {
  const { pushToast } = useApp();
  const [period, setPeriod] = useState("30 dias");
  const [accountId, setAccountId] = useState(linkedinAccounts[0].id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50 light:text-slate-900">Relatórios</h2>
          <p className="mt-1 text-sm text-slate-400">Métricas de crescimento, engajamento e geração de leads</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="h-9 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 text-xs text-slate-200 outline-none light:border-slate-200 light:bg-white"
          >
            {linkedinAccounts.filter((a) => a.status === "conectada").map((a) => (
              <option key={a.id} value={a.id} className="bg-slate-900 light:bg-white">{a.name}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-white/[0.06] bg-white/[0.03] p-0.5 light:border-slate-200 light:bg-slate-100">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  period === p ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <GlowButton variant="secondary" size="sm" onClick={() => pushToast({ title: "Exportação iniciada", description: "Em produção, geraria PDF/CSV.", type: "success" })}>
            <Download className="h-3.5 w-3.5" /> Exportar
          </GlowButton>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Conexões", value: "1.284", delta: "+4,2%", icon: <Users2 className="h-5 w-5" />, color: "blue" },
          { label: "Impressões", value: "18.4k", delta: "+58%", icon: <Eye className="h-5 w-5" />, color: "violet" },
          { label: "Engajamento", value: "1.240", delta: "+22%", icon: <MessageSquare className="h-5 w-5" />, color: "emerald" },
          { label: "Leads quentes", value: "7", delta: "+2", icon: <Flame className="h-5 w-5" />, color: "rose" },
        ].map((k, i) => (
          <GlassCard key={i} padding="md" hover>
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl ring-1",
                k.color === "blue" && "bg-blue-500/15 text-blue-300 ring-blue-500/30",
                k.color === "violet" && "bg-violet-500/15 text-violet-300 ring-violet-500/30",
                k.color === "emerald" && "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
                k.color === "rose" && "bg-rose-500/15 text-rose-300 ring-rose-500/30"
              )}>
                {k.icon}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-bold tabular-nums text-slate-50 light:text-slate-900">{k.value}</p>
                  <span className="text-[10px] font-semibold text-emerald-400">{k.delta}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Connections growth */}
        <GlassCard className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Crescimento de conexões</h3>
              <p className="mt-0.5 text-xs text-slate-500">Últimos 7 meses</p>
            </div>
            <StatusBadge variant="success">
              <TrendingUp className="h-3 w-3" /> +31%
            </StatusBadge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportsData.connectionsGrowth}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0A66C2" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  contentStyle={{ background: "rgba(15,22,41,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line type="monotone" dataKey="value" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: "#0A66C2", r: 4 }} activeDot={{ r: 6, fill: "#8b5cf6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Channel breakdown */}
        <GlassCard>
          <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Origem das conversas</h3>
          <p className="mt-0.5 text-xs text-slate-500">Últimos 30 dias</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reportsData.channelBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {reportsData.channelBreakdown.map((_, i) => (
                    <Cell key={i} fill={["#0A66C2", "#8b5cf6", "#3b82f6", "#10b981"][i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(15,22,41,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {reportsData.channelBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: ["#0A66C2", "#8b5cf6", "#3b82f6", "#10b981"][i] }} />
                  <span className="text-slate-300 light:text-slate-700">{c.name}</span>
                </div>
                <span className="font-semibold text-slate-100 light:text-slate-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Funnel */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Funil de conversão</h3>
        <p className="mt-0.5 text-xs text-slate-500">De impressão a lead quente · últimos 30 dias</p>
        <div className="mt-4 space-y-2.5">
          {reportsData.funnel.map((f, i) => {
            const maxValue = reportsData.funnel[0].value;
            const widthPct = (f.value / maxValue) * 100;
            return (
              <div key={i}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-300 light:text-slate-700">{f.stage}</span>
                  <span className="font-bold text-slate-100 light:text-slate-900 tabular-nums">{f.value.toLocaleString("pt-BR")}</span>
                </div>
                <div className="h-7 overflow-hidden rounded-md bg-white/5 light:bg-slate-100">
                  <div
                    className="flex h-full items-center justify-end px-2 text-[10px] font-semibold text-white"
                    style={{ width: `${widthPct}%`, background: f.color }}
                  >
                    {widthPct > 15 && `${widthPct.toFixed(1)}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
