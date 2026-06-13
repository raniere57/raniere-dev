import { motion } from 'framer-motion';
import {
  FileBarChart2, Eye, Users, AlertTriangle, Clock, Download,
  TrendingUp, ArrowRight, Zap, CheckCircle, XCircle, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MetricCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockDailyAccesses, mockTopReports, mockCategoryDistribution, mockReports } from '../data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-blue-500/20">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value} acessos</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const { setCurrentPage, theme } = useApp();
  const isDark = theme === 'dark';

  const criticalReports = mockReports.filter(r =>
    r.refreshStatus === 'failed' || r.responsible === null || r.status === 'attention'
  );

  const insights = [
    { icon: <AlertTriangle size={14} />, color: 'text-amber-400', text: '3 relatórios não são acessados há mais de 30 dias' },
    { icon: <XCircle size={14} />, color: 'text-red-400', text: '2 datasets falharam na última atualização' },
    { icon: <TrendingUp size={14} />, color: 'text-emerald-400', text: 'Indicadores Comerciais teve alta de 42% nos acessos' },
    { icon: <AlertTriangle size={14} />, color: 'text-amber-400', text: 'Revise permissões de relatórios marcados como sensíveis' },
  ];

  const gridColors = isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)';
  const axisColor = isDark ? '#334155' : '#cbd5e1';
  const tickColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            Bem-vindo, <span className="text-gradient">Raniere</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Quinta-feira, 17 de Janeiro de 2024 · Portal InsightGate v2.1
          </p>
        </div>
        <Button onClick={() => setCurrentPage('publish')} icon={<FileBarChart2 size={16} />} size="md">
          Publicar novo relatório
        </Button>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Relatórios publicados"
          value="8"
          subtitle="de 10 totais"
          icon={<FileBarChart2 size={18} />}
          color="blue"
          trend={{ value: 14, label: 'vs mês anterior' }}
        />
        <MetricCard
          title="Acessos (30 dias)"
          value="2.034"
          subtitle="+18% vs anterior"
          icon={<Eye size={18} />}
          color="cyan"
          trend={{ value: 18, label: '' }}
        />
        <MetricCard
          title="Usuários ativos"
          value="7"
          subtitle="de 8 cadastrados"
          icon={<Users size={18} />}
          color="purple"
        />
        <MetricCard
          title="Falhas de refresh"
          value="2"
          subtitle="Ação recomendada"
          icon={<AlertTriangle size={18} />}
          color="red"
          trend={{ value: -5, label: '' }}
        />
        <MetricCard
          title="Sem acesso (30d)"
          value="3"
          subtitle="Possível obsolescência"
          icon={<Clock size={18} />}
          color="yellow"
        />
        <MetricCard
          title="Exportações agend."
          value="4"
          subtitle="2 ativas, 1 pausada"
          icon={<Download size={18} />}
          color="green"
        />
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acessos por dia */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-xl p-5 border border-blue-500/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Acessos por dia</h3>
              <p className="text-xs text-slate-500 mt-0.5">Últimos 17 dias</p>
            </div>
            <Badge variant="info">2.034 total</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockDailyAccesses}>
              <defs>
                <linearGradient id="acessosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColors} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="acessos"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#acessosGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribuição por categoria */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-5 border border-blue-500/10">
          <div className="mb-5">
            <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Por categoria</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribuição de acessos</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={mockCategoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                dataKey="value"
                strokeWidth={0}
              >
                {mockCategoryDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => [`${v} acessos`, '']}
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {mockCategoryDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top reports chart */}
      <motion.div variants={itemVariants} className="glass-card rounded-xl p-5 border border-blue-500/10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Relatórios mais acessados</h3>
            <p className="text-xs text-slate-500 mt-0.5">Top 5 no período</p>
          </div>
          <button
            onClick={() => setCurrentPage('reports')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRight size={12} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={mockTopReports} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColors} horizontal={false} />
            <XAxis type="number" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} width={150} />
            <Tooltip
              formatter={(v: any) => [`${v} acessos`, 'Total']}
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', fontSize: '12px' }}
            />
            <Bar dataKey="acessos" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical reports */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-5 border border-red-500/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Relatórios críticos</h3>
            <Badge variant="danger">{criticalReports.length}</Badge>
          </div>
          <div className="space-y-3">
            {criticalReports.map(r => (
              <div key={r.id} className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                isDark ? 'bg-red-500/5 border-red-500/15' : 'bg-red-50 border-red-200'
              )}>
                <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className={cn('text-sm font-medium truncate', isDark ? 'text-white' : 'text-slate-900')}>
                    {r.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {r.refreshStatus === 'failed' && 'Falha no refresh do dataset'}
                    {r.responsible === null && ' · Sem responsável definido'}
                    {r.status === 'attention' && ' · Marcado como atenção'}
                  </div>
                </div>
                <Badge variant={r.refreshStatus === 'failed' ? 'danger' : 'warning'}>
                  {r.refreshStatus === 'failed' ? 'Falha' : 'Atenção'}
                </Badge>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage('reports')}
            className="mt-4 w-full text-center text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 transition-colors"
          >
            Ver todos os relatórios <ArrowRight size={12} />
          </button>
        </motion.div>

        {/* Insights */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-5 border border-blue-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Zap size={12} className="text-blue-400" />
            </div>
            <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Insights do portal</h3>
          </div>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-200'
              )}>
                <span className={cn('flex-shrink-0 mt-0.5', ins.color)}>{ins.icon}</span>
                <p className="text-sm text-slate-400">{ins.text}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className={cn(
            'mt-5 p-3 rounded-lg border text-xs leading-relaxed',
            isDark ? 'bg-amber-500/5 border-amber-500/20 text-amber-200/70' : 'bg-amber-50 border-amber-200 text-amber-800'
          )}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={12} className="flex-shrink-0 mt-0.5 text-amber-400" />
              <span>
                Relatórios publicados na web continuam públicos pelo link original.
                O InsightGate adiciona governança e auditoria, mas não substitui Power BI Embedded para dados sensíveis.
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setCurrentPage('powerbi')}
              className={cn(
                'flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium transition-all border',
                isDark ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white border-slate-700/50' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              )}
            >
              <RefreshCw size={13} className="text-blue-400" /> Sincronizar datasets
            </button>
            <button
              onClick={() => setCurrentPage('alerts')}
              className={cn(
                'flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium transition-all border',
                isDark ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white border-slate-700/50' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              )}
            >
              <CheckCircle size={13} className="text-emerald-400" /> Ver alertas
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
