import { useApp } from '../contexts/AppContext';
import { GlassCard, PageWrapper, GlowButton } from '../components/SharedComponents';
import { Shield, Brain, Eye, Zap, BarChart3, CheckCircle, ArrowRight, Bot, Target, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const { theme, navigate } = useApp();
  const isDark = theme === 'dark';

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <PageWrapper>
      <div className="space-y-16 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center py-12 hero-gradient rounded-2xl px-6">
          <motion.div {...fadeUp}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto mb-6 glow-cyan-strong animate-float">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Sentinel <span className="text-cyan-500 text-glow-cyan">QA</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Monitoria inteligente de atendimentos com inteligência artificial.
              Mais consistência, velocidade e rastreabilidade para sua operação.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <GlowButton size="lg" onClick={() => navigate('dashboard')}>
                Explorar Dashboard <ArrowRight size={18} />
              </GlowButton>
            </div>
          </motion.div>
        </div>

        {/* The Problem */}
        <motion.div {...fadeUp}>
          <div className="text-center mb-8">
            <span className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-red-400' : 'text-red-500'}`}>O Problema</span>
            <h2 className={`text-2xl sm:text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Monitoria manual é lenta, subjetiva e difícil de escalar
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Eye size={20} />, title: 'Cobertura limitada', desc: 'Menos de 3% dos atendimentos são efetivamente monitorados. A maioria das falhas passa despercebida.' },
              { icon: <Target size={20} />, title: 'Subjetividade', desc: 'Avaliadores humanos aplicam critérios de forma inconsistente. O mesmo atendimento recebe notas diferentes.' },
              { icon: <Zap size={20} />, title: 'Lentidão', desc: 'O ciclo de monitoria manual leva dias. Quando o feedback chega, o agente já esqueceu o atendimento.' },
            ].map((item, i) => (
              <GlassCard key={i} className="p-6" hover>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'}`}>
                  {item.icon}
                </div>
                <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* The Solution */}
        <motion.div {...fadeUp}>
          <div className="text-center mb-8">
            <span className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-cyan-400' : 'text-cyan-500'}`}>A Solução</span>
            <h2 className={`text-2xl sm:text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Modelos de IA avaliam atendimentos com critérios configuráveis
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Bot size={20} />, title: 'Análise automatizada', desc: 'IA avalia 100% dos atendimentos de forma consistente, seguindo critérios objetivos e configuráveis.' },
              { icon: <Layers size={20} />, title: 'Modelos personalizáveis', desc: 'Crie modelos de avaliação com critérios, pesos e instruções específicas para cada tipo de atendimento.' },
              { icon: <Brain size={20} />, title: 'Insights inteligentes', desc: 'A IA identifica padrões, gera sugestões de feedback e aponta riscos automaticamente.' },
              { icon: <BarChart3 size={20} />, title: 'Métricas em tempo real', desc: 'Dashboards com scores, rankings, distribuições e tendências atualizados automaticamente.' },
            ].map((item, i) => (
              <GlassCard key={i} className="p-6" hover glow>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>
                  {item.icon}
                </div>
                <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* The Result */}
        <motion.div {...fadeUp}>
          <div className="text-center mb-8">
            <span className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>O Resultado</span>
            <h2 className={`text-2xl sm:text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Mais consistência, velocidade, rastreabilidade e melhoria contínua
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '100%', label: 'Cobertura de análise', color: 'cyan' },
              { value: '85%', label: 'Menos tempo gasto', color: 'emerald' },
              { value: '3x', label: 'Mais consistência', color: 'violet' },
              { value: '24/7', label: 'Monitoramento ativo', color: 'amber' },
            ].map((item, i) => {
              const colorMap: Record<string, string> = {
                cyan: isDark ? 'text-cyan-400' : 'text-cyan-600',
                emerald: isDark ? 'text-emerald-400' : 'text-emerald-600',
                violet: isDark ? 'text-violet-400' : 'text-violet-600',
                amber: isDark ? 'text-amber-400' : 'text-amber-600',
              };
              return (
                <GlassCard key={i} className="p-5 text-center" hover>
                  <p className={`text-3xl font-bold ${colorMap[item.color]}`}>{item.value}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</p>
                </GlassCard>
              );
            })}
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div {...fadeUp}>
          <GlassCard className="p-8" glow>
            <h3 className={`text-lg font-semibold mb-6 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              O que o Sentinel QA faz por você
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Avalia atendimentos com critérios objetivos e configuráveis',
                'Gera scores de qualidade automaticamente para cada interação',
                'Identifica falhas, riscos e pontos de atenção em tempo real',
                'Sugere feedbacks construtivos para cada agente',
                'Ranking e perfil detalhado de performance dos agentes',
                'Dashboards com métricas, gráficos e tendências',
                'Modelos de avaliação flexíveis e versionados',
                'Biblioteca de critérios reutilizáveis',
                'Monitorias agendadas com frequência configurável',
                'Análise de sentimento e intenção do cliente',
                'Detecção de não conformidade e risco regulatório',
                'Relatórios visuais com exportação',
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp}>
          <div className="text-center py-8">
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Pronto para transformar sua operação de monitoria?
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Esta é uma demonstração com dados fictícios. Explore todas as funcionalidades do Sentinel QA.
            </p>
            <GlowButton size="lg" onClick={() => navigate('dashboard')}>
              Acessar Dashboard <ArrowRight size={18} />
            </GlowButton>
          </div>
        </motion.div>

        {/* Footer */}
        <div className={`text-center py-6 border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
          <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Sentinel QA — Monitoria Inteligente de Atendimentos • Ambiente demonstrativo com dados fictícios
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
            Desenvolvido por <a href="https://raniere.dev" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400">raniere.dev</a>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
