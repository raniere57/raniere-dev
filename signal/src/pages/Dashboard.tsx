import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Clock, CheckCircle, Phone, Send, Bot,
  AlertTriangle, ArrowRight,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { KpiCard } from '../components/ui/KpiCard';
import { ChannelBadge } from '../components/ui/ChannelBadge';
import { useTheme } from '../contexts/ThemeContext';
import { weeklyData, channelData, conversations } from '../data/mockData';

const attentionConversations = conversations.filter(c => c.slaBreached || (c.waitingMinutes && c.waitingMinutes > 20));

export const Dashboard: React.FC<{ onNavigate: (page: any) => void }> = ({ onNavigate }) => {
  const { isDark } = useTheme();
  const gridBg = isDark ? 'bg-slate-900/40 border-slate-800/50' : 'bg-white border-slate-200 shadow-sm';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-xl`}>
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-xl`}>
        <p className="font-semibold">{payload[0].name}: {payload[0].value}%</p>
      </div>
    );
  };

  return (
    <div className={`p-5 space-y-5 overflow-y-auto h-full ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard index={0} title="Conversas ativas" value="47" subtitle="agora mesmo" icon={<MessageSquare size={20} />} accent="emerald" trend={{ value: '+12 vs ontem', up: true }} />
        <KpiCard index={1} title="Tempo 1ª resposta" value="2m 18s" subtitle="média hoje" icon={<Clock size={20} />} accent="blue" trend={{ value: '−34s vs semana', up: true }} />
        <KpiCard index={2} title="Resolução 1º contato" value="78%" subtitle="FCR hoje" icon={<CheckCircle size={20} />} accent="emerald" trend={{ value: '+3% vs ontem', up: true }} />
        <KpiCard index={3} title="Fila PBX" value="3" subtitle="chamadas aguardando" icon={<Phone size={20} />} accent="amber" />
        <KpiCard index={4} title="Mensagens enviadas" value="1.284" subtitle="disparos hoje" icon={<Send size={20} />} accent="violet" trend={{ value: '+220 vs ontem', up: true }} />
        <KpiCard index={5} title="Agente de IA" value="64%" subtitle="dos atendimentos" icon={<Bot size={20} />} accent="violet" trend={{ value: '+8% vs semana', up: true }} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`lg:col-span-2 rounded-2xl p-5 border ${gridBg}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-semibold ${textPrimary}`}>Evolução de conversas</h3>
              <p className={`text-xs ${textMuted}`}>últimos 7 dias</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block rounded" /> Conversas</span>
              <span className={`flex items-center gap-1.5 ${textMuted}`}><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" /> Resolvidas</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="conversas" name="Conversas" stroke="#f59e0b" strokeWidth={2} fill="url(#grad1)" dot={false} />
              <Area type="monotone" dataKey="resolvidas" name="Resolvidas" stroke="#10b981" strokeWidth={2} fill="url(#grad2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-5 border ${gridBg}`}
        >
          <div className="mb-4">
            <h3 className={`text-sm font-semibold ${textPrimary}`}>Volume por canal</h3>
            <p className={`text-xs ${textMuted}`}>distribuição atual</p>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {channelData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {channelData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: d.color }} />
                  <span className={textMuted}>{d.name}</span>
                </span>
                <span className={`font-semibold ${textPrimary}`}>{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Attention conversations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl p-5 border ${gridBg}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <h3 className={`text-sm font-semibold ${textPrimary}`}>Conversas que precisam de atenção</h3>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">{attentionConversations.length}</span>
          </div>
          <button
            onClick={() => onNavigate('inbox')}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            Ver todas <ArrowRight size={13} />
          </button>
        </div>

        <div className="space-y-2">
          {attentionConversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => onNavigate('inbox')}
              className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                conv.slaBreached
                  ? isDark ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' : 'bg-red-50 border-red-200'
                  : isDark ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40' : 'bg-amber-50 border-amber-200'
              }`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                conv.slaBreached ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {conv.clientName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${textPrimary}`}>{conv.clientName}</span>
                  <ChannelBadge channel={conv.channel} />
                  {conv.slaBreached && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">SLA ESTOURADO</span>}
                </div>
                <p className={`text-xs truncate mt-0.5 ${textMuted}`}>{conv.lastMessage}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-xs font-semibold ${conv.slaBreached ? 'text-red-400' : 'text-amber-400'}`}>
                  {conv.waitingMinutes}min
                </p>
                <p className={`text-[10px] ${textMuted}`}>sem resposta</p>
              </div>
            </div>
          ))}

          {attentionConversations.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className={`text-sm ${textMuted}`}>Tudo em dia! Nenhuma conversa crítica.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
