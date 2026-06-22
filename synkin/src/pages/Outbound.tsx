import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/Buttons";
import { StatusBadge, AIBadge, ScoreBadge } from "../components/ui/Badges";
import { useApp } from "../state/AppContext";
import { prospects, prospectLists, outboundMetrics, Prospect } from "../data/mockData";
import { cn } from "../utils/cn";
import {
  Send,
  CheckCheck,
  Edit3,
  X,
  Plus,
  Upload,
  Users2,
  TrendingUp,
  Mail,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const statusLabels: Record<string, { label: string; variant: "default" | "info" | "success" | "warning" | "danger" }> = {
  nao_contactado: { label: "Não contactado", variant: "default" },
  convite_enviado: { label: "Convite enviado", variant: "info" },
  respondeu: { label: "Respondeu", variant: "success" },
  aceitou: { label: "Aceitou", variant: "success" },
  ignorado: { label: "Ignorado", variant: "danger" },
};

export function OutboundPage() {
  const { pushToast } = useApp();
  const [tab, setTab] = useState<"prospects" | "fila" | "listas">("prospects");
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(prospects[0]);
  const [selectedVariation, setSelectedVariation] = useState(0);

  const fila = [
    { id: "f1", name: "Felipe Andrade", role: "VP Sales · Loop", action: "Convite + nota", preview: "Convite com nota personalizada...", status: "pendente" },
    { id: "f2", name: "Renata Borges", role: "CEO · Nimble", action: "Mensagem direta", preview: "Renata, vi a Nimble crescer com consistência...", status: "pendente" },
    { id: "f3", name: "Tiago Mendonça", role: "Head of Eng · Pulse", action: "Follow-up #2", preview: "Tiago, mando um café virtual de 15min...", status: "pendente" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50 light:text-slate-900">Outbound</h2>
          <p className="mt-1 text-sm text-slate-400">Prospecção assistida — IA sugere, você sempre aprova</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <GlowButton variant="secondary" size="sm">
            <Upload className="h-3.5 w-3.5" /> Importar CSV
          </GlowButton>
          <GlowButton variant="violet" size="sm">
            <Plus className="h-3.5 w-3.5" /> Nova lista
          </GlowButton>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Taxa de aceite", value: `${outboundMetrics.acceptanceRate}%`, icon: <CheckCircle2 className="h-5 w-5" />, color: "emerald" },
          { label: "Taxa de resposta", value: `${outboundMetrics.responseRate}%`, icon: <TrendingUp className="h-5 w-5" />, color: "blue" },
          { label: "Follow-ups pendentes", value: outboundMetrics.followUpsPending, icon: <Mail className="h-5 w-5" />, color: "amber" },
          { label: "Enviados esta semana", value: outboundMetrics.sentThisWeek, icon: <Send className="h-5 w-5" />, color: "violet" },
        ].map((m, i) => (
          <GlassCard key={i} padding="md" hover>
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl ring-1",
                m.color === "emerald" && "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
                m.color === "blue" && "bg-blue-500/15 text-blue-300 ring-blue-500/30",
                m.color === "amber" && "bg-amber-500/15 text-amber-300 ring-amber-500/30",
                m.color === "violet" && "bg-violet-500/15 text-violet-300 ring-violet-500/30",
              )}>
                {m.icon}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{m.label}</p>
                <p className="text-2xl font-bold tabular-nums text-slate-50 light:text-slate-900">{m.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] light:border-slate-200/60">
        {[
          { id: "prospects", label: "Prospects", count: prospects.length },
          { id: "fila", label: "Fila de envios", count: fila.length },
          { id: "listas", label: "Listas", count: prospectLists.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={cn(
              "relative flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-blue-500 text-blue-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            {t.label}
            <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] light:bg-slate-100">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "prospects" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Table */}
          <div className="lg:col-span-3">
            <GlassCard padding="none">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 light:border-slate-200/60">
                      <th className="px-4 py-3">Prospect</th>
                      <th className="px-4 py-3">Cargo</th>
                      <th className="px-4 py-3">Fit</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prospects.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProspect(p)}
                        className={cn(
                          "cursor-pointer border-b border-white/[0.04] transition-colors light:border-slate-100",
                          selectedProspect?.id === p.id ? "bg-blue-500/10 light:bg-blue-50" : "hover:bg-white/[0.02] light:hover:bg-slate-50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-[10px] font-bold text-white">
                              {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-100 light:text-slate-900">{p.name}</p>
                              <p className="text-[10px] text-slate-500">{p.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-300 light:text-slate-700">{p.role}</p>
                          <p className="text-[10px] text-slate-500">{p.company}</p>
                        </td>
                        <td className="px-4 py-3">
                          <ScoreBadge score={p.fitScore} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge variant={statusLabels[p.status].variant}>{statusLabels[p.status].label}</StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Detail / generate */}
          <div className="lg:col-span-2">
            {selectedProspect && (
              <GlassCard className="lg:sticky lg:top-20">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                    {selectedProspect.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100 light:text-slate-900">{selectedProspect.name}</p>
                    <p className="text-[10px] text-slate-500">{selectedProspect.role}</p>
                    <p className="text-[10px] text-slate-500">{selectedProspect.company} · {selectedProspect.city}</p>
                  </div>
                  <ScoreBadge score={selectedProspect.fitScore} />
                </div>

                <div className="mb-3 rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-3 light:border-violet-200 light:bg-violet-50/40">
                  <AIBadge />
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300 light:text-slate-800">{selectedProspect.reason}</p>
                </div>

                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Abordagem sugerida</p>
                  <button className="text-[10px] font-semibold text-violet-400 hover:text-violet-300">Gerar variações</button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedVariation(0)}
                    className={cn(
                      "block w-full rounded-lg border p-3 text-left text-xs transition-colors",
                      selectedVariation === 0 ? "border-blue-500/50 bg-blue-500/10 light:bg-blue-50" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] light:border-slate-200 light:bg-slate-50"
                    )}
                  >
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400">Direto</p>
                    <p className="leading-relaxed text-slate-200 light:text-slate-800">{selectedProspect.suggestedApproach}</p>
                  </button>
                  {selectedProspect.approachVariations.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariation(i + 1)}
                      className={cn(
                        "block w-full rounded-lg border p-3 text-left text-xs transition-colors",
                        selectedVariation === i + 1 ? "border-blue-500/50 bg-blue-500/10 light:bg-blue-50" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] light:border-slate-200 light:bg-slate-50"
                      )}
                    >
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400">{v.startsWith("(Tom storytelling") ? "Storytelling" : v.startsWith("(Tom provocador") ? "Provocador" : v.startsWith("(Tom curioso") ? "Curioso" : "Técnico"}</p>
                      <p className="leading-relaxed text-slate-200 light:text-slate-800">{v.replace(/^\(Tom \w+\)\s*/, "")}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <GlowButton size="sm" variant="success" onClick={() => pushToast({ title: "Convite aprovado!", description: "Em produção, seria enviado ao LinkedIn.", type: "success" })}>
                    <Send className="h-3.5 w-3.5" /> Aprovar envio
                  </GlowButton>
                  <GlowButton size="sm" variant="secondary">
                    <Edit3 className="h-3.5 w-3.5" /> Editar
                  </GlowButton>
                  <GlowButton size="sm" variant="ghost">
                    <X className="h-3.5 w-3.5" /> Pular
                  </GlowButton>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {tab === "fila" && (
        <div className="space-y-3">
          <GlassCard padding="sm" className="border-amber-500/20 bg-amber-500/[0.04] light:border-amber-200 light:bg-amber-50/40">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
              <p className="text-xs text-slate-200 light:text-slate-800">
                <strong className="text-slate-50 light:text-slate-900">Fila obrigatória:</strong> nenhuma mensagem ou convite sai sem sua aprovação explícita.
              </p>
            </div>
          </GlassCard>
          {fila.map((f) => (
            <GlassCard key={f.id}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                  {f.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-100 light:text-slate-900">{f.name}</p>
                    <span className="text-xs text-slate-500">· {f.role}</span>
                    <StatusBadge variant="violet">{f.action}</StatusBadge>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300 light:text-slate-700">{f.preview}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <GlowButton size="sm" variant="success" onClick={() => pushToast({ title: "Envio aprovado!", type: "success" })}>
                      <CheckCheck className="h-3.5 w-3.5" /> Aprovar
                    </GlowButton>
                    <GlowButton size="sm" variant="secondary">
                      <Edit3 className="h-3.5 w-3.5" /> Editar
                    </GlowButton>
                    <GlowButton size="sm" variant="ghost">
                      <X className="h-3.5 w-3.5" /> Rejeitar
                    </GlowButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {tab === "listas" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {prospectLists.map((l) => (
            <GlassCard key={l.id} hover>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30">
                  <Users2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-100 light:text-slate-900">{l.name}</h3>
                  <p className="mt-0.5 text-[11px] text-slate-500">{l.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                    <Users2 className="h-3 w-3" /> {l.size} prospects
                    <span>·</span>
                    <span>{l.createdAt}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
          <GlassCard hover className="flex cursor-pointer items-center justify-center border-dashed">
            <div className="py-6 text-center">
              <Plus className="mx-auto h-6 w-6 text-slate-500" />
              <p className="mt-2 text-xs font-medium text-slate-400">Criar nova lista</p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
