import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SynkinLogo } from "../components/ui/Logo";
import { GlowButton } from "../components/ui/Buttons";
import { Mail, Lock, Sparkles, ArrowLeft, ShieldCheck, Sun, Moon } from "lucide-react";
import { useApp } from "../state/AppContext";

const Linkedin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 light:border-slate-200 light:bg-white light:text-slate-900 light:placeholder-slate-400 light:focus:border-blue-500/40 light:focus:ring-blue-500/15";

export function LoginPage() {
  const { setAuthenticated, pushToast, theme, toggleTheme } = useApp();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("usuario@demo.synkin");
  const [password, setPassword] = useState("demo-synkin-2026");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 650));
    setLoading(false);
    setAuthenticated(true);
    pushToast({
      title: "Bem-vindo, Raniere!",
      description: "Conectado como conta pessoal · 1 nova ação aguardando aprovação",
      type: "success",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-950 bg-grid light:bg-slate-50 light:bg-grid-light">
      {/* Radial gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px] light:bg-blue-400/15" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px] light:bg-violet-400/10" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px] light:bg-blue-300/10" />

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
        <a
          href="https://raniere.dev"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:border-white/20 light:border-slate-200 light:bg-white/80 light:text-slate-600 light:hover:bg-white light:hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> raniere.dev · demo
        </a>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-400 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-slate-200 light:border-slate-200 light:bg-white/80 light:text-slate-500 light:hover:bg-white light:hover:text-slate-800"
          aria-label="Alternar tema"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl light:border-slate-200/80 light:bg-white/90 light:shadow-xl">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl light:bg-blue-400/15" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl light:bg-violet-400/10" />

            <div className="relative">
              <div className="mb-7 flex justify-center">
                <SynkinLogo size={56} />
              </div>

              <div className="mb-7 text-center">
                <h1 className="text-2xl font-bold text-slate-50 light:text-slate-900">Entre na sua conta</h1>
                <p className="mt-1.5 text-sm text-slate-400 light:text-slate-600">Acesse seu cockpit de LinkedIn com IA</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300 light:text-slate-700">E-mail</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 light:text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300 light:text-slate-700">Senha</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 light:text-slate-400" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 text-slate-400 light:text-slate-600">
                    <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 light:border-slate-300 light:bg-white" />
                    Lembrar de mim
                  </label>
                  <a href="#" className="text-blue-400 hover:text-blue-300 light:text-blue-600 light:hover:text-blue-700">Esqueci a senha</a>
                </div>

                <GlowButton type="submit" loading={loading} className="w-full" size="lg" glow>
                  <Sparkles className="h-4 w-4" />
                  Entrar no Synkin
                </GlowButton>

                <div className="relative my-2 flex items-center gap-3 text-xs text-slate-500 light:text-slate-400">
                  <div className="h-px flex-1 bg-white/10 light:bg-slate-200" />
                  <span>ou</span>
                  <div className="h-px flex-1 bg-white/10 light:bg-slate-200" />
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 light:border-slate-200 light:bg-slate-50 light:text-slate-800 light:hover:bg-slate-100"
                >
                  <Linkedin className="h-4 w-4 text-blue-400 light:text-[#0A66C2]" />
                  Continuar com LinkedIn
                </button>
              </form>

              <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-3 light:border-slate-200 light:bg-slate-50">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400 light:text-emerald-600" />
                  <p className="text-[11px] leading-relaxed text-slate-400 light:text-slate-600">
                    <strong className="text-slate-300 light:text-slate-800">Conta demo ·</strong> use as credenciais pré-preenchidas acima. Nenhuma integração real com LinkedIn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-500 light:text-slate-400">
            Ambiente de demonstração · dados fictícios · nenhuma ação real no LinkedIn
          </p>
        </motion.div>
      </div>
    </div>
  );
}
