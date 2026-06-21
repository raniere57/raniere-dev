import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, TrendingUp, Clock, Star, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { channelData, reportData } from '../data/mockData';
import toast from 'react-hot-toast';

export const Relatorios: React.FC = () => {
  const { isDark } = useTheme();
  const [period, setPeriod] = useState('30d');
  const [selectedChannel, setSelectedChannel] = useState('todos');

  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`px-3 py-2 rounded-xl border text-xs shadow-xl ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color || p.fill }}>{p.name}: {p.value}{p.name === 'Tempo' ? 'min' : p.name === 'CSAT' ? '/100' : ''}</p>)}
      </div>
    );
  };

  const volumeData = channelData.map(d => ({ canal: d.name, volume: Math.round(d.value * 12.3), color: d.color }));



  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-5 h-full overflow-y-auto`}>
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200'}`}>
            <Calendar size={14} className={textMuted} />
            {['7d', '30d', '90d', '12m'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === p ? 'bg-amber-500/20 text-amber-400' : `${textMuted} hover:${isDark ? 'text-white' : 'text-slate-900'}`}`}>
                {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : p === '90d' ? '90 dias' : '12 meses'}
              </button>
            ))}
          </div>

          <select value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-900/60 border-slate-800/60 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
            <option value="todos">Todos os canais</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="site">Site</option>
          </select>

          <button onClick={() => toast.success('Relatório exportado como CSV!')}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 text-sm font-semibold transition-colors">
            <Download size={15} /> Exportar
          </button>
        </div>

        {/* KPI summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total de conversas', value: '639', change: '+18%', icon: <TrendingUp size={16} />, color: 'text-amber-400 bg-amber-500/10' },
            { label: 'Tempo médio resposta', value: '3m 12s', change: '−22%', icon: <Clock size={16} />, color: 'text-blue-400 bg-blue-500/10' },
            { label: 'CSAT médio', value: '93/100', change: '+4pts', icon: <Star size={16} />, color: 'text-emerald-400 bg-emerald-500/10' },
            { label: 'Atendimentos IA', value: '64%', change: '+8%', icon: <Users size={16} />, color: 'text-violet-400 bg-violet-500/10' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`rounded-2xl p-4 border ${cardBg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${textMuted}`}>{kpi.label}</span>
                <span className={`p-1.5 rounded-lg ${kpi.color}`}>{kpi.icon}</span>
              </div>
              <p className={`text-xl font-bold ${textPrimary}`}>{kpi.value}</p>
              <p className="text-xs text-emerald-400 mt-0.5 font-medium">{kpi.change} vs período anterior</p>
            </motion.div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Volume by channel */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`rounded-2xl p-5 border ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textPrimary} mb-4`}>Volume por canal</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeData} barSize={32}>
                <XAxis dataKey="canal" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="volume" name="Volume" radius={[6, 6, 0, 0]}>
                  {volumeData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Response time */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className={`rounded-2xl p-5 border ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textPrimary} mb-4`}>Tempo médio de resposta (min)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={reportData.responseTime} barSize={32} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="canal" type="category" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="tempo" name="Tempo" radius={[0, 6, 6, 0]} fill="#f59e0b" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* CSAT */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`rounded-2xl p-5 border ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textPrimary} mb-4`}>CSAT ao longo do tempo</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={reportData.csat}>
                <defs>
                  <linearGradient id="csatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="CSAT" stroke="#10b981" strokeWidth={2} fill="url(#csatGrad)" dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Agent vs IA */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className={`rounded-2xl p-5 border ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textPrimary} mb-4`}>Performance: Agentes vs Agente de IA</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={reportData.agentPerformance} barSize={22} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                <Bar yAxisId="left" dataKey="resolvidas" name="Resolvidas" fill="#f59e0b" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="tempo" name="Tempo (min)" fill="#8b5cf6" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 text-xs justify-center">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-amber-400/80 inline-block" /> Conversas resolvidas</span>
              <span className={`flex items-center gap-1.5 ${textMuted}`}><span className="w-3 h-2 rounded bg-violet-500/80 inline-block" /> Tempo médio (min)</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
