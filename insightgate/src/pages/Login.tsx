import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

export function Login() {
  const { setIsLoggedIn, theme, toggleTheme, addToast } = useApp();
  const isDark = theme === 'dark';
  // Demo: credenciais já preenchidas — "Entrar" funciona direto.
  const [email, setEmail] = useState('gestor@demo.insightgate');
  const [password, setPassword] = useState('demo-insightgate-2026');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email && !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      addToast('Bem-vindo ao InsightGate!', 'success');
    }, 1200);
  };

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      addToast('Acesso demo ativado. Explore o portal!', 'success');
    }, 800);
  };

  return (
    <div className={cn(
      'min-h-screen flex relative overflow-hidden',
      isDark ? 'bg-[#030712]' : 'bg-slate-50'
    )}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left side — branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative"
      >
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <span className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>InsightGate</span>
              <div className="text-xs text-slate-500">Portal de Governança BI</div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className={cn('text-4xl font-bold leading-tight', isDark ? 'text-white' : 'text-slate-900')}>
              Governança leve para{' '}
              <span className="text-gradient">relatórios e dashboards</span>{' '}
              públicos.
            </h1>
            <p className={cn('text-lg leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-600')}>
              Power BI, Tableau, Looker Studio, Metabase, Redash, Streamlit e outras plataformas — centralize, controle, monitore e automatize a distribuição de BI para equipes sem uma estrutura cara de licenças.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              { icon: '🔐', title: 'Controle de acesso', desc: 'Gerencie quem vê cada relatório' },
              { icon: '📊', title: 'Auditoria completa', desc: 'Histórico de todos os acessos' },
              { icon: '⚡', title: 'Alertas automáticos', desc: 'Notificações sobre falhas e anomalias' },
              { icon: '📤', title: 'Entregas agendadas', desc: 'Exportações automáticas para líderes' },
            ].map(f => (
              <div key={f.title} className="flex items-center gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <div className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{f.title}</div>
                  <div className="text-xs text-slate-500">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(
          'flex items-start gap-3 p-4 rounded-xl border text-sm',
          isDark ? 'bg-amber-500/5 border-amber-500/20 text-amber-200/70' : 'bg-amber-50 border-amber-200 text-amber-800'
        )}>
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          Relatórios publicados na web continuam públicos pelo link original. O InsightGate adiciona governança e auditoria sobre qualquer fonte, mas não substitui embedded autenticado para dados sensíveis.
        </div>
      </motion.div>

      {/* Right side — login form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <span className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>InsightGate</span>
              <div className="text-xs text-slate-500">Portal de Governança BI</div>
            </div>
          </div>

          <div className={cn(
            'glass-card rounded-2xl border p-8 glow-blue',
            isDark ? 'border-blue-500/15' : 'border-slate-200'
          )}>
            <h2 className={cn('text-2xl font-bold mb-1', isDark ? 'text-white' : 'text-slate-900')}>Entrar no portal</h2>
            <p className="text-slate-500 text-sm mb-6">Acesse com suas credenciais corporativas</p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className={cn('text-xs font-semibold uppercase tracking-wide', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="raniere@empresa.com"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all',
                    isDark
                      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500/60'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className={cn('text-xs font-semibold uppercase tracking-wide', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all pr-11',
                      isDark
                        ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500/60'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                className="w-full justify-center py-3"
                size="lg"
                loading={loading}
                onClick={handleLogin}
                icon={<ArrowRight size={18} />}
                disabled={!email || !password}
              >
                Entrar
              </Button>

              <div className="relative flex items-center">
                <div className={cn('flex-1 border-t', isDark ? 'border-slate-700/50' : 'border-slate-200')} />
                <span className="px-3 text-xs text-slate-600">ou</span>
                <div className={cn('flex-1 border-t', isDark ? 'border-slate-700/50' : 'border-slate-200')} />
              </div>

              <Button
                variant="secondary"
                className="w-full justify-center py-3"
                size="lg"
                loading={loading}
                onClick={handleDemo}
              >
                ✨ Entrar como demo
              </Button>
            </div>

            <div className={cn(
              'mt-6 p-3 rounded-xl border text-xs leading-relaxed',
              isDark ? 'bg-blue-500/5 border-blue-500/15 text-blue-300/70' : 'bg-blue-50 border-blue-200 text-blue-700'
            )}>
              <strong>Demo:</strong> Use o botão "Entrar como demo" para explorar todas as funcionalidades sem cadastro.
              Todos os dados são fictícios.
            </div>
          </div>

          {/* Theme toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={toggleTheme}
              className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-2"
            >
              {isDark ? '☀️ Modo claro' : '🌙 Modo escuro'}
            </button>
            <span className="text-slate-700">·</span>
            <a
              href="https://raniere.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
            >
              raniere.dev
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
