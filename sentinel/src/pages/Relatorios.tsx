import { useApp } from '../contexts/AppContext';
import { GlassCard, PageWrapper, GlowButton } from '../components/SharedComponents';
import { monthlyQuality, qualityByChannel, qualityBySetor, criteriosMaisReprovados, agentes } from '../data/mockData';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function Relatorios() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const tooltipStyle = { background: isDark ? 'rgba(15,22,41,0.95)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(56,189,248,0.15)' : '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: isDark ? '#f1f5f9' : '#1e293b' };
  const axisTick = { fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' };
  const gridStroke = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';

  const agentPerformance = agentes.slice(0, 6).map(a => ({ nome: a.nome.split(' ')[0], score: a.scoreMedio }));

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Relatórios</h2>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Análise visual de qualidade e performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <GlowButton variant="secondary" size="sm" onClick={() => addToast('PDF exportado (simulado)', 'success')}>
              <Download size={14} /> Exportar PDF
            </GlowButton>
            <GlowButton variant="secondary" size="sm" onClick={() => addToast('CSV exportado (simulado)', 'success')}>
              <FileText size={14} /> Exportar CSV
            </GlowButton>
          </div>
        </div>

        {/* Evolução Mensal */}
        <GlassCard className="p-5">
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <BarChart3 size={16} className="inline mr-2 text-cyan-500" />
            Evolução Mensal da Qualidade
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyQuality}>
                <defs>
                  <linearGradient id="monthlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="mes" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} fill="url(#monthlyGrad)" dot={{ r: 4, fill: '#06b6d4', stroke: isDark ? '#0f1629' : '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Qualidade por Canal */}
          <GlassCard className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Qualidade por Canal</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityByChannel}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="canal" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {qualityByChannel.map((_, i) => <Cell key={i} fill={['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Qualidade por Setor */}
          <GlassCard className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Qualidade por Setor</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityBySetor} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis dataKey="setor" type="category" tick={axisTick} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {qualityBySetor.map((entry, i) => (
                      <Cell key={i} fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Performance por Agente */}
          <GlassCard className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance por Agente</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="nome" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {agentPerformance.map((entry, i) => (
                      <Cell key={i} fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Critérios mais Reprovados */}
          <GlassCard className="p-5">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Critérios mais Reprovados</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={criteriosMaisReprovados} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis dataKey="criterio" type="category" tick={{ ...axisTick, fontSize: 10 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="reprovações" fill="#ef4444" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
}
