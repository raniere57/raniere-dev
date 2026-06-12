import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Lock, User } from "lucide-react";

const DEMO_EMAIL = "operador@demo.sigma";
const DEMO_PASSWORD = "demo-sigma-2026";
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
    <div className="relative min-h-screen bg-ink text-steel font-mono flex items-center justify-center px-4 overflow-hidden">
      {/* Atmosfera: grid técnico + brilho acid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(199,255,61,.10), transparent), linear-gradient(rgba(142,163,154,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(142,163,154,.05) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 56px 56px, 56px 56px",
        }}
      />

      <a
        href={RANIERE_HOME}
        className="absolute left-5 top-5 inline-flex items-center gap-2 text-xs text-steel/70 transition-colors hover:text-acid"
      >
        <ArrowLeft size={14} />
        raniere.dev
      </a>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-acid font-sans text-lg font-extrabold text-ink">
              Σ
            </span>
            <span className="font-sans text-2xl font-extrabold tracking-tight text-white">
              Sigma
            </span>
          </div>
          <p className="text-xs leading-relaxed text-steel/70">
            Orquestrador de agentes de IA para atendimento e operação.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-line bg-panel/80 p-6 shadow-node backdrop-blur"
        >
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wider text-steel/60">
              Usuário
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-ink px-3 focus-within:border-acid">
              <User size={15} className="text-steel/50" />
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
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wider text-steel/60">
              Senha
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-ink px-3 focus-within:border-acid">
              <Lock size={15} className="text-steel/50" />
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
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-acid py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-70"
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

        <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-steel/50">
          Ambiente de demonstração · dados fictícios · credenciais já preenchidas
        </p>
      </div>
    </div>
  );
}
