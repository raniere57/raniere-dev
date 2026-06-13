import { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, Shield } from 'lucide-react';

const DEMO_EMAIL = 'supervisor@demo.sentinel';
const DEMO_PASSWORD = 'demo-sentinel-2026';
const RANIERE_HOME = 'https://raniere.dev';

interface LoginScreenProps {
  onAuthenticated: () => void;
}

export default function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    // Auth puramente cosmética — pequeno atraso para parecer real.
    window.setTimeout(onAuthenticated, 650);
  }

  return (
    <div className="grid-bg relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4 text-white">
      {/* Brilhos de atmosfera */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 50% 40% at 50% -5%, rgba(6,182,212,0.18), transparent), radial-gradient(ellipse 40% 40% at 90% 100%, rgba(139,92,246,0.12), transparent)',
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-[0_0_24px_rgba(6,182,212,0.45)]">
              <Shield size={24} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight">
                Sentinel <span className="text-cyan-400">QA</span>
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Monitoria Inteligente
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Monitoria de qualidade de atendimentos com avaliação por IA.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-navy-900/70 p-6 shadow-2xl backdrop-blur-xl"
        >
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wider text-slate-500">
              E-mail
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 focus-within:border-cyan-500/40">
              <Mail size={15} className="text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent py-2.5 text-sm text-white outline-none"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="mb-6 block">
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wider text-slate-500">
              Senha
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 focus-within:border-cyan-500/40">
              <Lock size={15} className="text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent py-2.5 text-sm text-white outline-none"
                autoComplete="current-password"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Entrando…
              </>
            ) : (
              <>
                Entrar
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-slate-600">
          Ambiente de demonstração · dados fictícios · credenciais já preenchidas
        </p>

        <a
          href={RANIERE_HOME}
          className="group mt-4 inline-flex w-full items-center justify-center gap-2 text-xs text-slate-500 transition-colors hover:text-cyan-400"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Voltar para raniere.dev
        </a>
      </div>
    </div>
  );
}
