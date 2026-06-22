import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/Buttons";
import { ScoreBadge, AIBadge } from "../components/ui/Badges";
import { useApp } from "../state/AppContext";
import { profileAnalysis } from "../data/mockData";
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Wand2,
  Briefcase,
  FileText,
  Pin,
  Tag,
  Compass,
  AlertCircle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { cn } from "../utils/cn";

type Section = "headline" | "about" | "experience" | "highlights" | "keywords" | "positioning";

const sectionConfig: { id: Section; label: string; icon: React.ElementType; weight: number }[] = [
  { id: "headline", label: "Headline", icon: FileText, weight: 20 },
  { id: "about", label: "Sobre", icon: FileText, weight: 25 },
  { id: "experience", label: "Experiências", icon: Briefcase, weight: 20 },
  { id: "highlights", label: "Destaques", icon: Pin, weight: 15 },
  { id: "keywords", label: "Palavras-chave", icon: Tag, weight: 10 },
  { id: "positioning", label: "Posicionamento", icon: Compass, weight: 10 },
];

export function ProfilePage() {
  const { pushToast } = useApp();
  const [activeSection, setActiveSection] = useState<Section>("headline");
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null);

  const applySuggestion = (idx: number) => {
    setApplyingIdx(idx);
    setTimeout(() => {
      setApplyingIdx(null);
      pushToast({ title: "Headline atualizada!", description: "A versão foi aplicada ao rascunho do perfil.", type: "success" });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50 light:text-slate-900">Análise de perfil</h2>
          <p className="mt-1 text-sm text-slate-400">
            A IA audita sua conta ativa e sugere ajustes. Você sempre aprova antes de publicar.
          </p>
        </div>
        <GlowButton variant="secondary" size="sm">
          <RefreshCw className="h-3.5 w-3.5" /> Reanalisar perfil
        </GlowButton>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Score panel */}
        <div className="space-y-4">
          <GlassCard glow="violet" className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Score de autoridade</p>
            <div className="relative mx-auto my-5 h-40 w-40">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
                <motion.circle
                  cx="100" cy="100" r="85" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={`${(2 * Math.PI * 85 * profileAnalysis.overall) / 100} ${2 * Math.PI * 85}`}
                  initial={{ strokeDasharray: `0 ${2 * Math.PI * 85}` }}
                  animate={{ strokeDasharray: `${(2 * Math.PI * 85 * profileAnalysis.overall) / 100} ${2 * Math.PI * 85}` }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#0A66C2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold tabular-nums text-slate-50 light:text-slate-900">{profileAnalysis.overall}</span>
                <span className="text-xs text-slate-500">de 100</span>
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 light:bg-emerald-50 light:text-emerald-700">
              <TrendingUp className="h-3 w-3" /> +6 vs. mês passado
            </div>
          </GlassCard>

          {/* Breakdown */}
          <GlassCard>
            <h3 className="mb-3 text-sm font-semibold text-slate-50 light:text-slate-900">Breakdown</h3>
            <div className="space-y-3">
              {profileAnalysis.breakdown.map((b, i) => (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-300 light:text-slate-700">{b.label}</span>
                    <span className="font-semibold tabular-nums text-slate-100 light:text-slate-900">{b.score}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5 light:bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      className={cn(
                        "h-full rounded-full",
                        b.score >= 80 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                        b.score >= 60 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                        "bg-gradient-to-r from-rose-500 to-rose-400"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Sections list */}
          <GlassCard padding="sm">
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Seções analisadas</p>
            {sectionConfig.map((s) => {
              const Icon = s.icon;
              const score = (profileAnalysis.sections as any)[s.id]?.score ?? 0;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
                    isActive ? "bg-blue-500/10 text-blue-300 light:bg-blue-50 light:text-blue-700" : "text-slate-300 hover:bg-white/5 light:text-slate-700 light:hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="flex-1 text-sm">{s.label}</span>
                  <ScoreBadge score={score} />
                </button>
              );
            })}
          </GlassCard>
        </div>

        {/* Section detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === "headline" && (
                <GlassCard>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-50 light:text-slate-900">Headline</h3>
                        <AIBadge />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">A frase que aparece logo abaixo do seu nome</p>
                    </div>
                    <ScoreBadge score={profileAnalysis.sections.headline.score} className="!text-sm" />
                  </div>

                  <div className="mb-5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 light:border-slate-200 light:bg-slate-50">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Sua headline atual</p>
                    <p className="mt-1.5 text-sm text-slate-200 light:text-slate-800">{profileAnalysis.sections.headline.current}</p>
                  </div>

                  <p className="mb-2.5 text-xs font-semibold text-slate-400">3 variações sugeridas pela IA</p>
                  <div className="space-y-2.5">
                    {profileAnalysis.sections.headline.suggestions.map((s, i) => (
                      <div key={i} className="rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-3.5 transition-colors hover:border-violet-500/40 light:border-violet-200 light:bg-violet-50/40">
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-violet-500/20 text-[10px] font-bold text-violet-300">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <p className="flex-1 text-sm text-slate-100 light:text-slate-900">{s}</p>
                          <GlowButton
                            size="sm"
                            variant="violet"
                            loading={applyingIdx === i}
                            onClick={() => applySuggestion(i)}
                          >
                            <Wand2 className="h-3 w-3" /> Aplicar
                          </GlowButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {activeSection === "about" && (
                <GlassCard>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-50 light:text-slate-900">Sobre</h3>
                        <AIBadge />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Resumo, proposta de valor e CTA</p>
                    </div>
                    <ScoreBadge score={profileAnalysis.sections.about.score} className="!text-sm" />
                  </div>

                  <div className="mb-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 light:border-slate-200 light:bg-slate-50">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Seu Sobre atual</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-300 light:text-slate-700">{profileAnalysis.sections.about.current}</p>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.04] p-3 light:border-rose-200 light:bg-rose-50/40">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-rose-300 light:text-rose-700">Palavras-chave ausentes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profileAnalysis.sections.about.keywordsMissing.map((k, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-300 light:text-rose-700">
                            <XCircle className="h-2.5 w-2.5" /> {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 light:border-emerald-200 light:bg-emerald-50/40">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 light:text-emerald-700">Já presentes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profileAnalysis.sections.about.keywordsFound.map((k, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 light:text-emerald-700">
                            <CheckCircle2 className="h-2.5 w-2.5" /> {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-4 light:border-violet-200 light:bg-violet-50/40">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AIBadge />
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Reescrita sugerida</p>
                      </div>
                      <GlowButton size="sm" variant="violet" onClick={() => {
                        pushToast({ title: "Sobre atualizado!", description: "A versão foi aplicada ao rascunho do perfil.", type: "success" });
                      }}>
                        <Wand2 className="h-3 w-3" /> Aplicar sugestão
                      </GlowButton>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-100 light:text-slate-900">
                      {profileAnalysis.sections.about.suggestion}
                    </p>
                  </div>
                </GlassCard>
              )}

              {activeSection === "experience" && (
                <GlassCard>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-50 light:text-slate-900">Experiências</h3>
                        <AIBadge />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Bullets com impacto mensurável vendem mais</p>
                    </div>
                    <ScoreBadge score={profileAnalysis.sections.experience.score} className="!text-sm" />
                  </div>

                  <div className="mb-5 space-y-3">
                    {profileAnalysis.sections.experience.weak.map((w, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-3.5 light:border-amber-200 light:bg-amber-50/40">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-100 light:text-slate-900">{w.role}</p>
                          <p className="mt-0.5 text-xs text-amber-300/90 light:text-amber-700">{w.issue}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mb-2.5 text-xs font-semibold text-slate-400">Sugestões de bullets</p>
                  <div className="space-y-2.5">
                    {profileAnalysis.sections.experience.suggestions.map((s, i) => (
                      <div key={i} className="rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-3.5 light:border-violet-200 light:bg-violet-50/40">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" />
                          <p className="flex-1 text-sm text-slate-100 light:text-slate-900">{s}</p>
                          <GlowButton size="sm" variant="violet" onClick={() => pushToast({ title: "Bullet adicionado ao rascunho", type: "success" })}>
                            <Wand2 className="h-3 w-3" /> Aplicar
                          </GlowButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {activeSection === "highlights" && (
                <GlassCard>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-50 light:text-slate-900">Destaques</h3>
                        <AIBadge />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Posts fixados e links em destaque</p>
                    </div>
                    <ScoreBadge score={profileAnalysis.sections.highlights.score} className="!text-sm" />
                  </div>

                  <div className="mb-5">
                    <p className="mb-2.5 text-xs font-semibold text-slate-400">Faltando no seu perfil</p>
                    <div className="space-y-2">
                      {profileAnalysis.sections.highlights.missing.map((m, i) => (
                        <div key={i} className="flex items-center gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/[0.04] px-3 py-2 light:border-rose-200 light:bg-rose-50/40">
                          <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-rose-400" />
                          <span className="text-sm text-slate-200 light:text-slate-800">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mb-2.5 text-xs font-semibold text-slate-400">Ideias para destacar</p>
                  <div className="space-y-2.5">
                    {profileAnalysis.sections.highlights.ideas.map((idea, i) => (
                      <div key={i} className="rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-3.5 light:border-violet-200 light:bg-violet-50/40">
                        <div className="flex items-start gap-3">
                          <Pin className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" />
                          <p className="flex-1 text-sm text-slate-100 light:text-slate-900">{idea}</p>
                          <GlowButton size="sm" variant="violet" onClick={() => pushToast({ title: "Sugestão salva no calendário", type: "success" })}>
                            Criar
                          </GlowButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {activeSection === "keywords" && (
                <GlassCard>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-50 light:text-slate-900">Palavras-chave</h3>
                        <AIBadge />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Presentes vs. recomendadas para o nicho</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2.5 text-xs font-semibold text-slate-400">Presentes no perfil</p>
                      <div className="flex flex-wrap gap-2">
                        {profileAnalysis.sections.keywords.present.map((k, i) => (
                          <span key={i} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 light:text-emerald-700">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2.5 text-xs font-semibold text-slate-400">Recomendadas para o nicho</p>
                      <div className="flex flex-wrap gap-2">
                        {profileAnalysis.sections.keywords.recommended.map((k, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 light:text-violet-700">
                            <Sparkles className="h-2.5 w-2.5" /> {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-3.5 light:border-blue-200 light:bg-blue-50/40">
                    <div className="flex items-start gap-2.5">
                      <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                      <p className="text-xs leading-relaxed text-slate-200 light:text-slate-800">
                        <strong className="text-slate-50 light:text-slate-900">Dica:</strong> integre 3 das palavras-chave recomendadas em headline, sobre e nos próximos 4 posts. Isso aumenta o match com buscas do seu ICP.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {activeSection === "positioning" && (
                <GlassCard>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-50 light:text-slate-900">Posicionamento</h3>
                        <AIBadge />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">O grande "para quem" e "por que você"</p>
                    </div>
                  </div>

                  <div className="mb-5 rounded-lg border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.08] to-blue-500/[0.04] p-5 light:border-violet-200 light:from-violet-50/60 light:to-blue-50/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300 light:text-violet-700">Resumo IA</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-100 light:text-slate-900">
                      {profileAnalysis.sections.positioning.summary}
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-4 light:border-blue-200 light:bg-blue-50/40">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300 light:text-blue-700">Recomendação prática</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200 light:text-slate-800">
                      {profileAnalysis.sections.positioning.tip}
                    </p>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
