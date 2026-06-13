import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Database, Loader2, Lock, Mail, Zap } from "lucide-react";

const DEMO_EMAIL = "engenheiro@demo.dataforge";
const DEMO_PASSWORD = "demo-dataforge-2026";
const RANIERE_HOME = "https://raniere.dev";

interface LoginScreenProps {
  onAuthenticated: () => void;
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020817] px-4 text-slate-200">
      {/* Atmosfera: grid técnico + brilhos */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 50% -5%, rgba(59,130,246,0.18), transparent), radial-gradient(ellipse 40% 40% at 90% 100%, rgba(139,92,246,0.12), transparent), linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 56px 56px, 56px 56px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_0_24px_rgba(59,130,246,0.45)]">
              <Zap size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Data
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Forge
              </span>
            </h1>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Pipelines de dados com DuckDB, SQL e IA — conecte, transforme e publique.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-blue-500/15 bg-[#0a1932]/70 p-6 shadow-2xl backdrop-blur-xl"
        >
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500">
              E-mail
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-blue-500/15 bg-[#020817]/60 px-3 focus-within:border-blue-500/50">
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
            <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500">
              Senha
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-blue-500/15 bg-[#020817]/60 px-3 focus-within:border-blue-500/50">
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
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Entrando…
              </>
            ) : (
              <>
                <Database size={15} />
                Entrar no workspace
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
