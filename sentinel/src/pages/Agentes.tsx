import { useApp } from '../contexts/AppContext';
import { GlassCard, ScoreBar, PageWrapper, GlowButton } from '../components/SharedComponents';
import { agentes, atendimentos } from '../data/mockData';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle, BookOpen, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Agentes() {
  const { theme, selectedAgente, setSelectedAgente } = useApp();
  const isDark = theme === 'dark';

  // Profile View
  if (selectedAgente) {
    const ag = selectedAgente;
    const agAtendimentos = atendimentos.filter(a => a.agenteId === ag.id).slice(0, 5);
    const mediaEquipe = agentes.reduce((a, b) => a + b.scoreMedio, 0) / agentes.length;
    const scoreData = ag.scoreHistorico.map((s, i) => ({ periodo: `S${i + 1}`, agente: s, equipe: Math.round(mediaEquipe) }));

    return (
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedAgente(null)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
              <ArrowLeft size={20} />
            </button>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
              ${ag.scoreMedio >= 80 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : ag.scoreMedio >= 60 ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-red-500 to-red-600'} text-white`}>
              {ag.iniciais}
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ag.nome}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${ag.scoreMedio >= 80 ? 'text-emerald-400' : ag.scoreMedio >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  Score: {ag.scoreMedio}/100
                </span>
                {ag.tendencia === 'subindo' && <TrendingUp size={14} className="text-emerald-400" />}
                {ag.tendencia === 'descendo' && <TrendingDown size={14} className="text-red-400" />}
                {ag.tendencia === 'estável' && <Minus size={14} className="text-slate-500" />}
              </div>
            </div>
          </div>

          {/* Score vs Equipe */}
          <GlassCard className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Score Histórico vs Média da Equipe
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: isDark ? 'rgba(15,22,41,0.95)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(56,189,248,0.15)' : '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: isDark ? '#f1f5f9' : '#1e293b' }} />
                  <Line type="monotone" dataKey="agente" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: '#06b6d4' }} name="Agente" />
                  <Line type="monotone" dataKey="equipe" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Média equipe" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Erros */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown size={16} className="text-red-500" />
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Principais Erros</h3>
              </div>
              <div className="space-y-2">
                {ag.principaisErros.map((e, i) => (
                  <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-red-500/5 border border-red-500/10' : 'bg-red-50 border border-red-100'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'}`}>{i + 1}</span>
                    <span className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{e}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Elogios */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp size={16} className="text-emerald-500" />
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Principais Elogios</h3>
              </div>
              <div className="space-y-2">
                {ag.principaisElogios.map((e, i) => (
                  <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-emerald-50 border border-emerald-100'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>{i + 1}</span>
                    <span className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{e}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Treinamento */}
            <GlassCard className="p-5" glow>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-violet-500" />
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recomendações de Treinamento</h3>
              </div>
              <div className="space-y-2">
                {ag.recomendacoesTreinamento.map((r, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-violet-500/5 border border-violet-500/10' : 'bg-violet-50 border border-violet-100'}`}>
                    <BookOpen size={12} className="text-violet-500 shrink-0" />
                    <span className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>{r}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Alertas */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-500" />
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Alertas Recorrentes</h3>
              </div>
              {ag.alertas.length > 0 ? (
                <div className="space-y-2">
                  {ag.alertas.map((a, i) => (
                    <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-amber-50 border border-amber-100'}`}>
                      <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                      <span className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{a}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Nenhum alerta ativo.</p>
              )}
            </GlassCard>
          </div>

          {/* Últimos Atendimentos */}
          <GlassCard className="p-5">
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Últimos Atendimentos Analisados</h3>
            <div className="space-y-2">
              {agAtendimentos.map(at => (
                <div key={at.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${isDark ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-slate-50 hover:bg-slate-100'} transition-colors cursor-pointer`}
                  onClick={() => { setSelectedAgente(null); }}>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{at.protocolo}</span>
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{at.cliente}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{at.data}</span>
                    <span className={`text-sm font-bold ${at.scoreIA >= 80 ? 'text-emerald-400' : at.scoreIA >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{at.scoreIA}</span>
                  </div>
                </div>
              ))}
              {agAtendimentos.length === 0 && (
                <p className={`text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Nenhum atendimento analisado recentemente.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </PageWrapper>
    );
  }

  // List View
  return (
    <PageWrapper>
      <div className="space-y-4">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Agentes</h2>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Performance e perfil dos agentes de atendimento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agentes.map(ag => (
            <GlassCard key={ag.id} hover className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  ${ag.scoreMedio >= 80 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : ag.scoreMedio >= 60 ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-red-500 to-red-600'} text-white`}>
                  {ag.iniciais}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{ag.nome}</h3>
                  <div className="flex items-center gap-1">
                    {ag.tendencia === 'subindo' && <TrendingUp size={12} className="text-emerald-400" />}
                    {ag.tendencia === 'descendo' && <TrendingDown size={12} className="text-red-400" />}
                    {ag.tendencia === 'estável' && <Minus size={12} className="text-slate-500" />}
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{ag.atendimentosAvaliados} atendimentos</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Score médio</span>
                <span className={`text-lg font-bold ${ag.scoreMedio >= 80 ? 'text-emerald-400' : ag.scoreMedio >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {ag.scoreMedio}
                </span>
              </div>
              <ScoreBar score={ag.scoreMedio} size="sm" />

              <div className="mt-3 space-y-1">
                <div>
                  <span className={`text-xs ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>Fortes: </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ag.pontosFortes.slice(0, 2).join(', ')}</span>
                </div>
                <div>
                  <span className={`text-xs ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>Melhorar: </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ag.pontosMelhoria.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              {ag.alertas.length > 0 && (
                <div className={`mt-3 px-2 py-1.5 rounded-lg ${isDark ? 'bg-red-500/5 border border-red-500/10' : 'bg-red-50 border border-red-100'}`}>
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={10} className="text-red-500" />
                    <span className="text-[10px] text-red-400 font-medium">{ag.alertas.length} alerta{ag.alertas.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <GlowButton variant="ghost" size="sm" className="w-full" onClick={() => setSelectedAgente(ag)}>
                  <Eye size={12} /> Ver perfil
                </GlowButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
