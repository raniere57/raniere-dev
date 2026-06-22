import { GlassCard } from "../components/ui/GlassCard";
import { AIBadge } from "../components/ui/Badges";
import { SynkinLogo } from "../components/ui/Logo";
import { CheckCircle2, ShieldCheck, ExternalLink, Globe } from "lucide-react";
import { LinkedinIcon } from "../components/layout/LinkedinIcon";

export function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <SynkinLogo size={64} className="mx-auto justify-center" showText={false} />
        <h2 className="mt-4 text-3xl font-bold text-slate-50 light:text-slate-900">Synkin</h2>
        <p className="mt-1 text-sm text-slate-400">LinkedIn com estratégia e IA</p>
        <p className="mt-3 text-xs text-slate-500">Demo navegável · portfólio raniere.dev</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GlassCard>
          <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">O que é o Synkin?</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 light:text-slate-700">
            SaaS de inbound e outbound para LinkedIn com auxílio de IA. Ajudamos profissionais e empresas a crescer no LinkedIn com estratégia, conteúdo e relacionamento — <strong className="text-slate-100 light:text-slate-900">sem automação cega</strong>.
          </p>
          <div className="mt-4 space-y-2">
            {[
              "Conexão de uma ou mais contas LinkedIn",
              "Módulos de inbound (conteúdo, engajamento, inbox) e outbound (prospecção)",
              "IA sugere ações — você sempre aprova antes de publicar, comentar, curtir ou enviar",
              "Score de perfil, calendário de conteúdo, copiloto de engajamento, CRM e mais",
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300 light:text-slate-700">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard glow="violet">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Princípio central</h3>
          </div>
          <p className="text-base font-semibold leading-relaxed text-slate-100 light:text-slate-900">
            Humano no controle, IA como copiloto.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 light:text-slate-700">
            Nenhuma publicação, comentário, curtida ou mensagem é enviada sem aprovação humana explícita. Esse é o DNA do Synkin e não pode ser desligado — inclusive nesta demo.
          </p>
          <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/[0.06] p-3 light:border-violet-200 light:bg-violet-50/40">
            <AIBadge />
            <p className="mt-2 text-xs leading-relaxed text-slate-300 light:text-slate-700">
              "IA que executa sem perguntar queima marca. IA que pergunta antes de executar constroi reputação."
            </p>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Esta demo</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300 light:text-slate-700">
          100% front-end, sem backend, sem integração real com LinkedIn. Todos os dados são fictícios. Todas as ações (publicar, comentar, curtir, enviar mensagem) são simuladas e local — nada sai do seu navegador.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "Stack: React 19 + TypeScript + Vite + Tailwind v4",
            "Animações com framer-motion, gráficos com recharts",
            "Mock data em pt-BR, com 10 conversas, 8 prospects, 5 oportunidades",
            "Tema claro/escuro com persistência em localStorage",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md border border-white/[0.04] bg-white/[0.02] p-2.5 text-xs text-slate-300 light:border-slate-200 light:bg-slate-50 light:text-slate-700">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              {f}
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard glow="blue">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">RR</div>
            <div>
              <h3 className="text-sm font-bold text-slate-50 light:text-slate-900">Raniere Rodrigues Gomes</h3>
              <p className="text-xs text-slate-400">Engenheiro de Software · Dados & Automação</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="https://raniere.dev" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 light:border-slate-200 light:bg-white light:text-slate-700">
              <Globe className="h-3.5 w-3.5" /> raniere.dev
              <ExternalLink className="h-3 w-3" />
            </a>
            <a href="https://linkedin.com/in/raniere-rodrigues" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-300 transition-colors hover:bg-blue-500/20 light:bg-blue-50 light:text-blue-700">
              <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 light:border-slate-200 light:bg-white light:text-slate-700">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.3 2.8.2 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" /></svg>
              GitHub
            </a>
          </div>
        </div>
      </GlassCard>

      <p className="text-center text-[11px] text-slate-500">
        Synkin · parte do portfólio em <a href="https://raniere.dev" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">raniere.dev</a> · junto com Signal, Sigma, Sentinel QA, InsightGate e DataForge
      </p>
    </div>
  );
}
