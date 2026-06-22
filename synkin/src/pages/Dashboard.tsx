import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { MetricCard } from "../components/ui/MetricCard";
import { StatusBadge, AIBadge } from "../components/ui/Badges";
import { GlowButton } from "../components/ui/Buttons";
import { useApp } from "../state/AppContext";
import { dashboardKPIs, impressionsChartData } from "../data/mockData";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import {
  Sparkles,
  Send,
  MessageSquare,
  Heart,
  TrendingUp,
  Users2,
  CheckCheck,
  Edit3,
  X,
  Clock,
  Zap,
  ArrowRight,
  BarChart3,
  Target,
  Calendar,
} from "lucide-react";
import { cn as cnUtil } from "../utils/cn";
import { LinkedinIcon } from "../components/layout/LinkedinIcon";

function getActionIcon(type: string) {
  switch (type) {
    case "publicar_post": return <Sparkles className="h-4 w-4" />;
    case "comentar": return <MessageSquare className="h-4 w-4" />;
    case "enviar_mensagem": return <Send className="h-4 w-4" />;
    case "enviar_convite": return <Users2 className="h-4 w-4" />;
    case "curtir": return <Heart className="h-4 w-4" />;
    default: return <Zap className="h-4 w-4" />;
  }
}

function getActionLabel(type: string) {
  switch (type) {
    case "publicar_post": return "Publicação";
    case "comentar": return "Comentário";
    case "enviar_mensagem": return "Mensagem";
    case "enviar_convite": return "Convite";
    case "curtir": return "Curtida";
    default: return "Ação";
  }
}

export function DashboardPage() {
  const { activeAccount, actions, updateActionStatus, pushToast } = useApp();
  const pending = actions.filter((a) => a.status === "pendente_aprovacao");
  const firstName = activeAccount.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LinkedinIcon className="h-3.5 w-3.5 text-blue-400" />
            <span>Conta ativa: <strong className="text-slate-300 light:text-slate-700">{activeAccount.name}</strong> · {activeAccount.type}</span>
          </div>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl light:text-slate-900">
            Bom dia, {firstName} 👋
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Você tem <strong className="text-amber-400">{pending.length} ações pendentes de aprovação</strong> · {pending.filter(a => a.priority === "alta").length} de alta prioridade
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge variant="violet" className="!text-xs !px-2.5 !py-1">
            <Sparkles className="h-3 w-3" /> Copiloto IA ativo
          </StatusBadge>
        </div>
      </div>

      {/* Banner: princípio humano no controle */}
      <GlassCard padding="sm" className="border-blue-500/20 bg-blue-500/[0.04] light:bg-blue-50/80 light:border-blue-200/60">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 light:bg-blue-100">
            <CheckCheck className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-100 light:text-slate-900">
              Você está no controle. A IA sugere — você aprova.
            </p>
            <p className="mt-0.5 text-xs text-slate-400 light:text-slate-600">
              Nenhuma publicação, comentário, curtida ou mensagem é enviada sem sua aprovação explícita.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          label="Score de perfil"
          value={dashboardKPIs.profileScore}
          delta={dashboardKPIs.weeklyDelta.profileScore}
          icon={<Target className="h-5 w-5" />}
          accent="violet"
          hint="de 100"
        />
        <MetricCard
          label="Posts esta semana"
          value={dashboardKPIs.postsThisWeek}
          delta={dashboardKPIs.weeklyDelta.postsThisWeek}
          icon={<BarChart3 className="h-5 w-5" />}
          accent="blue"
        />
        <MetricCard
          label="Engajamento médio"
          value={`${dashboardKPIs.avgEngagement}%`}
          delta={dashboardKPIs.weeklyDelta.avgEngagement}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="emerald"
        />
        <MetricCard
          label="Leads quentes"
          value={dashboardKPIs.hotLeads}
          delta={dashboardKPIs.weeklyDelta.hotLeads}
          icon={<Sparkles className="h-5 w-5" />}
          accent="amber"
        />
        <MetricCard
          label="Conversas pendentes"
          value={dashboardKPIs.pendingConversations}
          delta={dashboardKPIs.weeklyDelta.pendingConversations}
          icon={<MessageSquare className="h-5 w-5" />}
          accent="rose"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Fila de aprovações */}
        <div className="lg:col-span-2">
          <GlassCard padding="none">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 light:border-slate-200/60">
              <div>
                <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Fila de aprovações</h3>
                <p className="mt-0.5 text-xs text-slate-500">IA sugeriu · você decide</p>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusBadge variant="warning">{pending.length} pendentes</StatusBadge>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06] light:divide-slate-200/60">
              {pending.slice(0, 5).map((action, i) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 transition-colors hover:bg-white/[0.02] light:hover:bg-slate-50"
                >
                  <div className="flex items-start gap-3">
                    <div className={cnUtil(
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                      action.priority === "alta" ? "bg-rose-500/15 text-rose-400" :
                      action.priority === "media" ? "bg-amber-500/15 text-amber-400" :
                      "bg-slate-500/15 text-slate-400"
                    )}>
                      {getActionIcon(action.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge variant={action.priority === "alta" ? "danger" : action.priority === "media" ? "warning" : "default"}>
                          {getActionLabel(action.type)}
                        </StatusBadge>
                        {action.priority === "alta" && (
                          <StatusBadge variant="danger" className="!text-[10px]">Alta prioridade</StatusBadge>
                        )}
                        {action.scheduledFor && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock className="h-2.5 w-2.5" /> {action.scheduledFor}
                          </span>
                        )}
                        <span className="ml-auto text-[10px] text-slate-500">{action.createdAt}</span>
                      </div>
                      <h4 className="mt-1.5 text-sm font-semibold text-slate-100 light:text-slate-900">{action.title}</h4>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400 light:text-slate-600">
                        {action.preview}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-violet-400">
                        <Sparkles className="h-3 w-3" /> {action.reason}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <GlowButton size="sm" variant="success" onClick={() => updateActionStatus(action.id, "aprovado")}>
                          <CheckCheck className="h-3.5 w-3.5" /> Aprovar
                        </GlowButton>
                        <GlowButton size="sm" variant="secondary" onClick={() => pushToast({ title: "Edição aberta", description: "Em produção, abriria o editor inline.", type: "info" })}>
                          <Edit3 className="h-3.5 w-3.5" /> Editar
                        </GlowButton>
                        <GlowButton size="sm" variant="ghost" onClick={() => updateActionStatus(action.id, "rejeitado")}>
                          <X className="h-3.5 w-3.5" /> Rejeitar
                        </GlowButton>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Side widgets */}
        <div className="space-y-4">
          {/* Chart */}
          <GlassCard>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Impressões · 7 dias</h3>
                <p className="mt-0.5 text-xs text-slate-500">+58% vs. semana anterior</p>
              </div>
              <StatusBadge variant="success">
                <TrendingUp className="h-3 w-3" /> +58%
              </StatusBadge>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={impressionsChartData}>
                  <defs>
                    <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0A66C2" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0A66C2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ background: "rgba(15,22,41,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Area type="monotone" dataKey="impressoes" stroke="#0A66C2" strokeWidth={2} fill="url(#impGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Opportunities */}
          <GlassCard>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Oportunidades hoje</h3>
                <p className="mt-0.5 text-xs text-slate-500">Detectadas pela IA</p>
              </div>
              <AIBadge />
            </div>
            <div className="space-y-2.5">
              {[
                { icon: <MessageSquare className="h-3.5 w-3.5" />, title: "3 perguntas abertas do seu nicho", sub: "Alta chance de visibilidade", color: "blue" },
                { icon: <Users2 className="h-3.5 w-3.5" />, title: "5 leads prontos para convite", sub: "Fit ICP > 75%", color: "violet" },
                { icon: <Calendar className="h-3.5 w-3.5" />, title: "Janela ótima para postar", sub: "Ter-sex 09:00–10:30", color: "emerald" },
                { icon: <Heart className="h-3.5 w-3.5" />, title: "2 micro-engajamentos pendentes", sub: "Aquecer leads para follow-up", color: "rose" },
              ].map((o, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5 light:border-slate-200 light:bg-slate-50">
                  <div className={cnUtil(
                      "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md",
                      o.color === "blue" && "bg-blue-500/15 text-blue-400",
                      o.color === "violet" && "bg-violet-500/15 text-violet-400",
                      o.color === "emerald" && "bg-emerald-500/15 text-emerald-400",
                      o.color === "rose" && "bg-rose-500/15 text-rose-400"
                    )}>
                    {o.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-200 light:text-slate-800">{o.title}</p>
                    <p className="text-[10px] text-slate-500">{o.sub}</p>
                  </div>
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}


