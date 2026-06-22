import { useState } from "react";
import { motion } from "framer-motion";
import { SynkinLogo } from "../components/ui/Logo";
import { GlowButton } from "../components/ui/Buttons";
import { Mail, Lock, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

// Inline LinkedIn icon to avoid lucide-react naming differences
const Linkedin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);
import { useApp } from "../state/AppContext";

export function LoginPage() {
  const { setAuthenticated, pushToast } = useApp();
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
    <div className="relative min-h-screen overflow-hidden bg-navy-950 bg-grid">
      {/* Radial gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

      {/* Back to portfolio pill */}
      <a
        href="https://raniere.dev"
        target="_blank"
        rel="noreferrer"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:border-white/20"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> raniere.dev · demo
      </a>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="relative">
              <div className="mb-7 flex justify-center">
                <SynkinLogo size={56} />
              </div>

              <div className="mb-7 text-center">
                <h1 className="text-2xl font-bold text-slate-50">Entre na sua conta</h1>
                <p className="mt-1.5 text-sm text-slate-400">Acesse seu cockpit de LinkedIn com IA</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">E-mail</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Senha</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-50 placeholder-slate-500 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 text-slate-400">
                    <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-white/20 bg-white/5" />
                    Lembrar de mim
                  </label>
                  <a href="#" className="text-blue-400 hover:text-blue-300">Esqueci a senha</a>
                </div>

                <GlowButton type="submit" loading={loading} className="w-full" size="lg" glow>
                  <Sparkles className="h-4 w-4" />
                  Entrar no Synkin
                </GlowButton>

                <div className="relative my-2 flex items-center gap-3 text-xs text-slate-500">
                  <div className="h-px flex-1 bg-white/10" />
                  <span>ou</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
                >
                  <Linkedin className="h-4 w-4 text-blue-400" />
                  Continuar com LinkedIn
                </button>
              </form>

              <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    <strong className="text-slate-300">Conta demo ·</strong> use as credenciais pré-preenchidas acima. Nenhuma integração real com LinkedIn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-500">
            Ambiente de demonstração · dados fictícios · nenhuma ação real no LinkedIn
          </p>
        </motion.div>
      </div>
    </div>
  );
}
