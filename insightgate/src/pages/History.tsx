import { useState } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Search, Filter, Eye, Star, Download, Shield, AlertTriangle, Archive, Edit, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockAccessHistory, mockHourlyUsage } from '../data/mockData';

const actionIcons: Record<string, React.ReactNode> = {
  'Abriu relatório': <Eye size={12} />,
  'Favoritou': <Star size={12} />,
  'Exportou PDF': <Download size={12} />,
  'Publicou relatório': <Shield size={12} />,
  'Alterou permissão': <Edit size={12} />,
  'Tentou acessar sem permissão': <AlertTriangle size={12} />,
  'Arquivou relatório': <Archive size={12} />,
};

const actionColors: Record<string, string> = {
  'Abriu relatório': 'text-blue-400 bg-blue-500/10',
  'Favoritou': 'text-amber-400 bg-amber-500/10',
  'Exportou PDF': 'text-cyan-400 bg-cyan-500/10',
  'Publicou relatório': 'text-emerald-400 bg-emerald-500/10',
  'Alterou permissão': 'text-purple-400 bg-purple-500/10',
  'Tentou acessar sem permissão': 'text-red-400 bg-red-500/10',
  'Arquivou relatório': 'text-slate-400 bg-slate-500/10',
};

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function History() {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const actions = ['all', ...Array.from(new Set(mockAccessHistory.map(e => e.action)))];
  const users = ['all', ...Array.from(new Set(mockAccessHistory.map(e => e.user)))];

  const filtered = mockAccessHistory.filter(e => {
    const matchSearch = e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.report.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'all' || e.action === filterAction;
    const matchUser = filterUser === 'all' || e.user === filterUser;
    return matchSearch && matchAction && matchUser;
  });

  const denied = mockAccessHistory.filter(e => e.action.includes('sem permissão')).length;
  const uniqueUsers = new Set(mockAccessHistory.map(e => e.user)).size;
  const avgDuration = '22min';

  const tickColor = isDark ? '#64748b' : '#94a3b8';
  const gridColor = isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.1)';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Histórico de uso</h1>
        <p className="text-slate-500 text-sm mt-1">Auditoria completa de acessos e ações no portal</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total de acessos"
          value={mockAccessHistory.length}
          icon={<Eye size={18} />}
          color="blue"
        />
        <MetricCard
          title="Usuários únicos"
          value={uniqueUsers}
          icon={<BarChart2 size={18} />}
          color="cyan"
        />
        <MetricCard
          title="Tempo médio/sessão"
          value={avgDuration}
          icon={<HistoryIcon size={18} />}
          color="purple"
        />
        <MetricCard
          title="Tentativas negadas"
          value={denied}
          icon={<AlertTriangle size={18} />}
          color="red"
        />
      </div>

      {/* Hourly chart */}
      <div className={cn('glass-card rounded-xl border p-5', isDark ? 'border-blue-500/10' : 'border-slate-200')}>
        <div className="mb-4">
          <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Uso por horário</h3>
          <p className="text-xs text-slate-500 mt-0.5">Distribuição de acessos ao longo do dia</p>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={mockHourlyUsage}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: any) => [`${v} acessos`, 'Total']}
              contentStyle={{
                background: isDark ? '#0f172a' : '#fff',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="acessos" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className={cn(
        'flex flex-wrap items-center gap-3 p-4 rounded-xl border',
        isDark ? 'glass-card border-blue-500/10' : 'bg-white border-slate-200'
      )}>
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 min-w-48',
          isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
        )}>
          <Search size={14} className="text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por usuário ou relatório..."
            className={cn('bg-transparent text-sm outline-none flex-1', isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400')}
          />
        </div>
        <select
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          className={cn('px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer', isDark ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')}
        >
          {users.map(u => <option key={u} value={u}>{u === 'all' ? 'Todos os usuários' : u}</option>)}
        </select>
        <select
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
          className={cn('px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer', isDark ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')}
        >
          {actions.map(a => <option key={a} value={a}>{a === 'all' ? 'Todas as ações' : a}</option>)}
        </select>
        <span className="text-xs text-slate-500">{filtered.length} eventos</span>
      </div>

      {/* Events table */}
      <div className={cn('rounded-xl border overflow-hidden', isDark ? 'glass-card border-blue-500/10' : 'bg-white border-slate-200')}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', isDark ? 'border-slate-700/50' : 'border-slate-100')}>
                {['Data/Hora', 'Usuário', 'Ação', 'Relatório', 'IP', 'Dispositivo', 'Duração'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {filtered.map((event, i) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn('transition-colors', isDark ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50')}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(event.datetime)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-[9px] font-bold">
                        {event.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className={cn('text-sm', isDark ? 'text-white' : 'text-slate-900')}>{event.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
                      actionColors[event.action] || 'text-slate-400 bg-slate-500/10'
                    )}>
                      {actionIcons[event.action]}
                      {event.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-sm', isDark ? 'text-slate-300' : 'text-slate-700')}>{event.report}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-500">{event.ip}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{event.device}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{event.duration}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <HistoryIcon size={40} className="text-slate-600" />
            <p className="text-slate-500 text-sm">Nenhum evento encontrado.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
