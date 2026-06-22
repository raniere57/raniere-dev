import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/Buttons";
import { AIBadge } from "../components/ui/Badges";
import { useApp } from "../state/AppContext";
import { calendarPosts, ideas, CalendarPost } from "../data/mockData";
import { cn } from "../utils/cn";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCheck,
  X,
  Plus,
  Calendar as CalIcon,
  Wand2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

const statusStyles: Record<string, { bg: string; text: string; ring: string; label: string; dot: string }> = {
  rascunho: { bg: "bg-slate-500/10", text: "text-slate-300", ring: "ring-slate-500/30", label: "Rascunho", dot: "bg-slate-400" },
  agendado: { bg: "bg-blue-500/10", text: "text-blue-300", ring: "ring-blue-500/30", label: "Agendado", dot: "bg-blue-400" },
  aguardando_aprovacao: { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-500/30", label: "Aguardando", dot: "bg-amber-400" },
  publicado: { bg: "bg-emerald-500/10", text: "text-emerald-300", ring: "ring-emerald-500/30", label: "Publicado", dot: "bg-emerald-400" },
};

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function CalendarPage() {
  const { pushToast } = useApp();
  const [view, setView] = useState<"semana" | "mes">("semana");
  const [generating, setGenerating] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  const [, setSelectedSlot] = useState<string | null>(null);

  // Group posts by date
  const postsByDate = calendarPosts.reduce((acc, p) => {
    (acc[p.date] = acc[p.date] || []).push(p);
    return acc;
  }, {} as Record<string, CalendarPost[]>);

  // Week dates
  const weekDates = ["2026-01-19", "2026-01-20", "2026-01-21", "2026-01-22", "2026-01-23", "2026-01-24", "2026-01-25"];

  const generatePosts = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedPosts([
        "Acabei de perder 4 horas debugando um pipeline que 'simplesmente parou'.\n\nA causa? 1 linha de configuração que ninguém mexeu em 8 meses.\n\nLição: pipelines de dados não morrem de morte súbita. Morrem de pequenas mudanças sem observabilidade.\n\n3 práticas que salvaram minha semana desde então 👇\n\n1) Alertas em 'sem mudanças significativas'\n2) Diff de config versionado e visível\n3) Postmortem automático em incidentes silenciosos\n\nQual dessas faria diferença no seu time hoje?",
        "Hot take controverso: 80% dos times de dados não precisa de mais uma ferramenta.\n\nPrecisa de menos código sem observabilidade.\n\nDito isso, se eu tivesse que escolher 3 ferramentas pra começar do zero hoje, seriam essas 👇\n\n→ [ferramenta 1] pra orquestração\n→ [ferramenta 2] pra observabilidade\n→ [ferramenta 3] pra lineage\n\nConcorda? O que está no seu stack?",
        "Pergunta honesta para o time técnico: qual foi a decisão que mais te arrependeu em 2025?\n\nEu começo: migrar para microsserviços antes de ter observabilidade. Custo: 6 meses de incidentes, 1 burnout, 0 benefício real.\n\nHoje a regra é clara: 'observabilidade antes de escala'. Você tem regra parecida?",
      ]);
      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50 light:text-slate-900">Calendário de conteúdo</h2>
          <p className="mt-1 text-sm text-slate-400">Planejamento, criação e aprovação — humano sempre no controle</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-white/[0.06] bg-white/[0.03] p-0.5 light:border-slate-200 light:bg-slate-100">
            {(["semana", "mes"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  view === v ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {v === "semana" ? "Semana" : "Mês"}
              </button>
            ))}
          </div>
          <GlowButton variant="violet" size="sm" onClick={() => setShowGenerate(true)}>
            <Wand2 className="h-3.5 w-3.5" /> Gerar com IA
          </GlowButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-3">
          <GlassCard padding="none">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 light:border-slate-200/60">
              <div className="flex items-center gap-3">
                <button className="rounded-md p-1 text-slate-400 hover:bg-white/5"><ChevronLeft className="h-4 w-4" /></button>
                <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Semana 19–25 jan 2026</h3>
                <button className="rounded-md p-1 text-slate-400 hover:bg-white/5"><ChevronRight className="h-4 w-4" /></button>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                {Object.entries(statusStyles).map(([key, st]) => (
                  <span key={key} className="flex items-center gap-1.5 text-slate-400">
                    <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} /> {st.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-white/[0.06] light:border-slate-200/60">
              {weekDays.map((d, i) => (
                <div key={d} className="border-r border-white/[0.06] px-3 py-2 text-center last:border-r-0 light:border-slate-200/60">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{d}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-200 light:text-slate-800">{19 + i}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 min-h-[420px]">
              {weekDates.map((date) => {
                const posts = postsByDate[date] || [];
                return (
                  <div
                    key={date}
                    className="group relative min-h-[140px] border-r border-b border-white/[0.06] p-2 last:border-r-0 light:border-slate-200/60"
                  >
                    {posts.map((p) => {
                      const st = statusStyles[p.status];
                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn("mb-1.5 cursor-pointer rounded-md p-2 text-[11px] ring-1 transition-all hover:scale-[1.02]", st.bg, st.ring)}
                        >
                          <p className={cn("text-[9px] font-semibold tabular-nums", st.text)}>{p.time}</p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] font-medium text-slate-100 light:text-slate-900">{p.title}</p>
                          <p className="mt-1 text-[9px] text-slate-400">{p.pillar}</p>
                        </motion.div>
                      );
                    })}
                    {posts.length === 0 && (
                      <button
                        onClick={() => { setSelectedSlot(date); setShowGenerate(true); }}
                        className="absolute inset-2 flex items-center justify-center rounded-md border border-dashed border-white/[0.04] text-slate-600 opacity-0 transition-opacity hover:border-blue-500/30 hover:text-blue-400 hover:opacity-100 group-hover:opacity-100 light:border-slate-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Repurpose section */}
          <GlassCard className="mt-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Reaproveitamento inteligente</h3>
              <AIBadge />
            </div>
            <p className="mt-1 text-xs text-slate-500">Transforme um case em múltiplos formatos</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { type: "Carrossel", icon: "📊", desc: "6 slides + CTA final", color: "blue" },
                { type: "Texto único", icon: "📝", desc: "Post denso e opinativo", color: "violet" },
                { type: "Pergunta aberta", icon: "💬", desc: "Engajamento com pergunta", color: "emerald" },
              ].map((f, i) => (
                <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 transition-all hover:border-blue-500/30 hover:bg-white/[0.04] light:border-slate-200 light:bg-slate-50 light:hover:bg-white">
                  <div className="text-2xl">{f.icon}</div>
                  <p className="mt-2 text-sm font-semibold text-slate-100 light:text-slate-900">{f.type}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{f.desc}</p>
                  <button
                    onClick={() => pushToast({ title: `${f.type} gerado!`, description: "Rascunho salvo no calendário.", type: "success" })}
                    className="mt-2 text-[11px] font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Gerar agora →
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Side: ideas */}
        <div className="space-y-4">
          <GlassCard>
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Ideias da semana</h3>
            </div>
            <p className="mb-3 text-[11px] text-slate-500">Sugeridas pela IA com base no seu nicho</p>
            <div className="space-y-2">
              {ideas.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedSlot("2026-01-26"); setShowGenerate(true); }}
                  className="block w-full rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5 text-left transition-colors hover:border-blue-500/30 hover:bg-white/[0.05] light:border-slate-200 light:bg-slate-50 light:hover:bg-white"
                >
                  <p className="text-xs font-medium text-slate-100 light:text-slate-900">{idea.title}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{idea.pillar}</p>
                </button>
              ))}
            </div>
            <GlowButton variant="secondary" size="sm" className="mt-3 w-full">
              <RefreshCw className="h-3.5 w-3.5" /> Gerar mais ideias
            </GlowButton>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Status do mês</h3>
            <div className="mt-3 space-y-2.5">
              {[
                { label: "Publicados", count: 8, color: "emerald" },
                { label: "Agendados", count: 5, color: "blue" },
                { label: "Aguardando", count: 2, color: "amber" },
                { label: "Rascunhos", count: 4, color: "slate" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border border-white/[0.04] bg-white/[0.02] px-3 py-2 light:border-slate-200 light:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      s.color === "emerald" && "bg-emerald-400",
                      s.color === "blue" && "bg-blue-400",
                      s.color === "amber" && "bg-amber-400",
                      s.color === "slate" && "bg-slate-400"
                    )} />
                    <span className="text-xs text-slate-300 light:text-slate-700">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-100 light:text-slate-900">{s.count}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Generate modal */}
      <AnimatePresence>
        {showGenerate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowGenerate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl light:bg-white light:border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 light:border-slate-200">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-semibold text-slate-50 light:text-slate-900">Gerar post com IA</h3>
                  <AIBadge />
                </div>
                <button onClick={() => setShowGenerate(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-5">
                {!generatedPosts.length ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">Tema / Nicho</label>
                      <input
                        defaultValue="Engenharia de software · dados · IA aplicada a produto"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500/50 light:border-slate-200 light:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">Tom</label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {["Profissional", "Storytelling", "Provocador", "Educativo"].map((t, i) => (
                          <button
                            key={t}
                            className={cn(
                              "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                              i === 0
                                ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">CTA (opcional)</label>
                      <input
                        placeholder="Ex: 'Comenta sua experiência abaixo'"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500/50 light:border-slate-200 light:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">Baseado em case do usuário</label>
                      <textarea
                        placeholder="Conte um case recente: contexto, ação, resultado, aprendizado..."
                        rows={3}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500/50 light:border-slate-200 light:bg-slate-50"
                      />
                    </div>

                    <GlowButton variant="violet" className="w-full" onClick={generatePosts} loading={generating}>
                      <Sparkles className="h-4 w-4" /> {generating ? "Gerando 3 variações..." : "Gerar 3 variações"}
                    </GlowButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-300">3 variações geradas. Escolha uma para revisar.</p>
                    {generatedPosts.map((p, i) => (
                      <div key={i} className="rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-4 light:border-violet-200 light:bg-violet-50/40">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">Variação {String.fromCharCode(65 + i)}</span>
                          <span className="text-[10px] text-slate-500">{p.length} caracteres</span>
                        </div>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-100 light:text-slate-900">{p}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <GlowButton size="sm" variant="success" onClick={() => { pushToast({ title: "Post agendado!", description: "Aguardando aprovação para publicar.", type: "success" }); setShowGenerate(false); setGeneratedPosts([]); }}>
                            <CalIcon className="h-3.5 w-3.5" /> Agendar
                          </GlowButton>
                          <GlowButton size="sm" variant="secondary" onClick={() => { pushToast({ title: "Rascunho salvo", type: "info" }); setShowGenerate(false); setGeneratedPosts([]); }}>
                            Salvar rascunho
                          </GlowButton>
                          <GlowButton size="sm" variant="violet" onClick={() => { pushToast({ title: "Aguardando aprovação!", description: "Post marcado para revisão.", type: "success" }); setShowGenerate(false); setGeneratedPosts([]); }}>
                            <CheckCheck className="h-3.5 w-3.5" /> Aprovar
                          </GlowButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
