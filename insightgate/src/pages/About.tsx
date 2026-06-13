import { motion } from 'framer-motion';
import {
  Shield, CheckCircle, AlertTriangle, ArrowRight, ExternalLink, BarChart2,
  Lock, Eye, RefreshCw, Download, Bell, Users, BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const features = [
  { icon: <BookOpen size={18} />, title: 'Portal centralizado', desc: 'Todos os relatórios Power BI da empresa em um único lugar organizado' },
  { icon: <Eye size={18} />, title: 'Controle de acessos', desc: 'Gerencie quem pode ver cada relatório por usuário e grupo' },
  { icon: <BarChart2 size={18} />, title: 'Auditoria e histórico', desc: 'Rastreie cada acesso, exportação e ação realizada no portal' },
  { icon: <RefreshCw size={18} />, title: 'Monitoramento de refresh', desc: 'Monitore status de atualização dos datasets conectados' },
  { icon: <Download size={18} />, title: 'Automação de entregas', desc: 'Agende exportações e envios automáticos para equipes' },
  { icon: <Bell size={18} />, title: 'Central de alertas', desc: 'Receba alertas sobre falhas, acessos negados e anomalias' },
];

const roadmap = [
  { version: 'v1', label: 'MVP', desc: 'Portal, login, relatórios, acessos e auditoria', status: 'done' },
  { version: 'v2', label: 'Integração API', desc: 'API simulada Power BI para metadados e refresh', status: 'done' },
  { version: 'v3', label: 'Automações', desc: 'Exportação, agendamento e alertas avançados', status: 'done' },
  { version: 'v4', label: 'Em breve', desc: 'Power BI Embedded, RLS real e multi-tenant', status: 'upcoming' },
];

export function About() {
  const { theme, setCurrentPage } = useApp();
  const isDark = theme === 'dark';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 max-w-4xl mx-auto">
      {/* Hero */}
      <div className={cn(
        'glass-card rounded-2xl border p-8 text-center relative overflow-hidden',
        isDark ? 'border-blue-500/20' : 'border-blue-200'
      )}>
        {/* Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-5">
            <Shield size={28} className="text-blue-400" />
          </div>
          <h1 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
            <span className="text-gradient">InsightGate</span>
          </h1>
          <p className={cn('text-lg mb-4', isDark ? 'text-slate-400' : 'text-slate-600')}>
            Governança leve para relatórios Power BI públicos
          </p>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Centralize relatórios, controle o acesso pelo portal, acompanhe uso, monitore atualizações e automatize entregas para equipes que precisam de BI sem uma estrutura cara de licenças.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button onClick={() => setCurrentPage('dashboard')} icon={<BarChart2 size={16} />}>
              Ver dashboard
            </Button>
            <Button variant="secondary" onClick={() => setCurrentPage('catalog')} icon={<BookOpen size={16} />}>
              Ver catálogo
            </Button>
          </div>
        </div>
      </div>

      {/* Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem */}
        <div className={cn(
          'glass-card rounded-2xl border p-6',
          isDark ? 'border-red-500/15' : 'border-red-200'
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <h2 className={cn('font-semibold text-lg', isDark ? 'text-white' : 'text-slate-900')}>O problema</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Pequenas empresas usam relatórios Power BI públicos porque não querem pagar muitas licenças, mas acabam com:
          </p>
          <ul className="space-y-2">
            {[
              'Links espalhados em emails e mensagens',
              'Falta de rastreabilidade de quem acessou',
              'Nenhum controle operacional ou governança',
              'Relatórios desatualizados sem notificação',
              'Zero visibilidade sobre uso e adoção',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                <span className="text-red-400 mt-0.5">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Solution */}
        <div className={cn(
          'glass-card rounded-2xl border p-6',
          isDark ? 'border-emerald-500/15' : 'border-emerald-200'
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle size={16} className="text-emerald-400" />
            </div>
            <h2 className={cn('font-semibold text-lg', isDark ? 'text-white' : 'text-slate-900')}>A solução</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Um portal centralizado para publicar relatórios, controlar acessos, acompanhar uso e automatizar exportações:
          </p>
          <ul className="space-y-2">
            {[
              'Portal único para todos os relatórios da empresa',
              'Histórico completo de quem acessou e quando',
              'Alertas de falhas e anomalias em tempo real',
              'Exportação automatizada para líderes e diretores',
              'Monitoramento de refresh e saúde dos datasets',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                <span className="text-emerald-400 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className={cn(
        'flex items-start gap-4 p-6 rounded-2xl border',
        isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'
      )}>
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <Lock size={18} className="text-amber-400" />
        </div>
        <div>
          <h3 className={cn('font-semibold mb-2', isDark ? 'text-amber-300' : 'text-amber-800')}>
            Limitação honesta — importante ler
          </h3>
          <p className={cn('text-sm leading-relaxed', isDark ? 'text-amber-200/70' : 'text-amber-800/80')}>
            Links públicos do Power BI continuam públicos fora do portal. Para dados sensíveis, o ideal é Power BI Embedded com autenticação ou outro modelo de segurança real.
            O InsightGate é ideal para relatórios não sensíveis onde a organização, rastreabilidade e automação operacional são o valor principal — não a restrição de acesso técnico ao dado.
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className={cn('text-xl font-bold mb-5', isDark ? 'text-white' : 'text-slate-900')}>
          O que o portal oferece
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                'glass-card rounded-xl border p-4 hover:border-blue-500/30 transition-all',
                isDark ? 'border-blue-500/10' : 'border-slate-200'
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 mb-3">
                {f.icon}
              </div>
              <h3 className={cn('text-sm font-semibold mb-1', isDark ? 'text-white' : 'text-slate-900')}>{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <h2 className={cn('text-xl font-bold mb-5', isDark ? 'text-white' : 'text-slate-900')}>
          Versões do produto
        </h2>
        <div className="space-y-3">
          {roadmap.map((item, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border',
                item.status === 'done'
                  ? isDark ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50'
                  : isDark ? 'border-slate-700/50 bg-slate-800/30' : 'border-slate-200 bg-slate-50'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                item.status === 'done'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700/50 text-slate-500'
              )}>
                {item.version}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{item.label}</span>
                  {item.status === 'done' && <CheckCircle size={12} className="text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <span className={cn(
                'text-xs font-medium px-2.5 py-1 rounded-lg border',
                item.status === 'done'
                  ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                  : 'text-slate-500 border-slate-700/50'
              )}>
                {item.status === 'done' ? 'Concluído' : 'Em breve'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={cn(
        'glass-card rounded-2xl border p-8 text-center',
        isDark ? 'border-blue-500/15' : 'border-blue-200'
      )}>
        <h2 className={cn('text-xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
          Este é um projeto de portfólio
        </h2>
        <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
          Desenvolvido por Raniere Costa como demonstração de uma aplicação SaaS completa.
          Acesse raniere.dev para ver mais projetos e serviços.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => setCurrentPage('dashboard')} icon={<ArrowRight size={16} />}>
            Explorar o portal
          </Button>
          <a href="https://raniere.dev" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" icon={<ExternalLink size={16} />}>
              raniere.dev
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
