import { useApp } from '../contexts/AppContext';
import { GlassCard, MetricCard, PageWrapper, RiskBadge, GlowButton } from '../components/SharedComponents';
import { scoreHistory, channelDistribution, atendimentos, agentes, aiInsights } from '../data/mockData';
import { Headphones, Award, AlertTriangle, Clock, ClipboardCheck, ShieldCheck, TrendingUp, TrendingDown, 
  Minus, Bot, Sparkles, Zap, Lightbulb, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { theme, navigate, addToast } = useApp();
  const isDark = theme === 'dark';

  const highRiskAtendimentos = atendimentos
    .filter(a => a.risco === 'crítico' || a.risco === 'alto')
    .sort((a, b) => a.scoreIA - b.scoreIA)
    .slice(0, 5);

  const topAgentes = [...agentes].sort((a, b) => b.scoreMedio - a.scoreMedio).slice(0, 5);

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Bem-vindo, <span className="text-cyan-500 text-glow-cyan">Raniere</span>
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Aqui está o resumo da operação de monitoria hoje.
            </p>
          </div>
          <GlowButton onClick={() => { navigate('modelo-editor'); addToast('Editor de modelo aberto', 'info'); }}>
            <Sparkles size={16} />
            Criar modelo de monitoria
          </GlowButton>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard title="Atendimentos analisados" value="1.062" subtitle="+12% vs. semana anterior" icon={<Headphones size={20} />} trend="up" color="cyan" />
          <MetricCard title="Score médio de qualidade" value="82.4" subtitle="+3.2pts vs. mês anterior" icon={<Award size={20} />} trend="up" color="cyan" />
          <MetricCard title="Alertas críticos" value="7" subtitle="3 novos hoje" icon={<AlertTriangle size={20} />} trend="down" color="red" />
          <MetricCard title="Economia estimada" value="340h" subtitle="vs. monitoria manual" icon={<Clock size={20} />} color="purple" />
          <MetricCard title="Monitorias pendentes" value="12" subtitle="4 agendadas para hoje" icon={<ClipboardCheck size={20} />} color="yellow" />
          <MetricCard title="Taxa de conformidade" value="87%" subtitle="+5% vs. mês anterior" icon={<ShieldCheck size={20} />} trend="up" color="green" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Score Evolution */}
          <GlassCard className="lg:col-span-2 p-5">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Evolução do Score de Qualidade
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreHistory}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: isDark ? 'rgba(15,22,41,0.95)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(56,189,248,0.15)' : '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: isDark ? '#f1f5f9' : '#1e293b' }} />
                  <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} fill="url(#scoreGradient)" dot={{ r: 3, fill: '#06b6d4', stroke: isDark ? '#0f1629' : '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Channel Distribution */}
          <GlassCard className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Distribuição por Canal
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistribution}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={75}
                    paddingAngle={3}
                    dataKey="quantidade"
                  >
                    {channelDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.cor} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: isDark ? 'rgba(15,22,41,0.95)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(56,189,248,0.15)' : '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: isDark ? '#f1f5f9' : '#1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {channelDistribution.map(ch => (
                <div key={ch.canal} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.cor }} />
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ch.canal}</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ch.quantidade}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Agent Ranking */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Ranking de Agentes
              </h3>
              <button onClick={() => navigate('agentes')} className="text-xs text-cyan-500 hover:text-cyan-400 font-medium">
                Ver todos →
              </button>
            </div>
            <div className="space-y-3">
              {topAgentes.map((ag, i) => (
                <div key={ag.id} className="flex items-center gap-3">
                  <span className={`w-5 text-xs font-bold ${i === 0 ? 'text-cyan-400' : i === 1 ? 'text-slate-300' : isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    {i + 1}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${i === 0 ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white' : isDark ? 'bg-white/[0.06] text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                    {ag.iniciais}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{ag.nome}</p>
                    <div className="flex items-center gap-1">
                      {ag.tendencia === 'subindo' && <TrendingUp size={10} className="text-emerald-400" />}
                      {ag.tendencia === 'descendo' && <TrendingDown size={10} className="text-red-400" />}
                      {ag.tendencia === 'estável' && <Minus size={10} className="text-slate-500" />}
                      <span className="text-xs text-slate-500">{ag.atendimentosAvaliados} atendimentos</span>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${ag.scoreMedio >= 80 ? 'text-emerald-400' : ag.scoreMedio >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                    {ag.scoreMedio}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* High Risk */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Atendimentos com Maior Risco
              </h3>
              <button onClick={() => navigate('atendimentos')} className="text-xs text-cyan-500 hover:text-cyan-400 font-medium">
                Ver todos →
              </button>
            </div>
            <div className="space-y-3">
              {highRiskAtendimentos.map(at => (
                <div key={at.id} className="flex items-center gap-3">
                  <RiskBadge risk={at.risco} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{at.cliente}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{at.protocolo}</p>
                  </div>
                  <span className={`text-sm font-bold ${at.scoreIA >= 80 ? 'text-emerald-400' : at.scoreIA >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                    {at.scoreIA}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Insights */}
          <GlassCard className="p-5" glow>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Bot size={12} className="text-white" />
              </div>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Insights da IA
              </h3>
            </div>
            <div className="space-y-3">
              {aiInsights.slice(0, 4).map(insight => {
                const iconMap = {
                  alerta: <AlertTriangle size={14} className="text-red-400" />,
                  oportunidade: <Lightbulb size={14} className="text-amber-400" />,
                  melhoria: <Zap size={14} className="text-cyan-400" />,
                  sucesso: <CheckCircle2 size={14} className="text-emerald-400" />,
                };
                return (
                  <div key={insight.id} className={`p-3 rounded-lg ${isDark ? 'bg-white/[0.03] border border-white/[0.04]' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">{iconMap[insight.tipo]}</span>
                      <div>
                        <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{insight.titulo}</p>
                        <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{insight.descricao}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
}
