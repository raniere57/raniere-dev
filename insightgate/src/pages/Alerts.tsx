import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, AlertTriangle, CheckCircle, Info, Plus, Eye, X, XCircle
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { MetricCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockAlerts } from '../data/mockData';

function getSeverityConfig(severity: string) {
  return severityConfig[severity as SeverityKey] ?? severityConfig.info;
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

type SeverityKey = 'critical' | 'warning' | 'info';
const severityConfig: Record<SeverityKey, { badge: 'danger' | 'warning' | 'info'; icon: React.ReactNode; label: string }> = {
  critical: { badge: 'danger' as const, icon: <XCircle size={14} />, label: 'Crítico' },
  warning: { badge: 'warning' as const, icon: <AlertTriangle size={14} />, label: 'Atenção' },
  info: { badge: 'info' as const, icon: <Info size={14} />, label: 'Info' },
};

export function Alerts() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showNewRule, setShowNewRule] = useState(false);
  const [detailAlert, setDetailAlert] = useState<typeof mockAlerts[0] | null>(null);
  const [newRule, setNewRule] = useState({
    name: '', eventType: '', condition: '', reportOrCategory: '', severity: 'warning',
    notifyAdmins: true, notifyResponsible: false, group: '',
    channels: { email: true, whatsapp: false, webhook: false }
  });

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active');

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a));
    addToast('Alerta marcado como resolvido.', 'success');
    setDetailAlert(null);
  };

  const ignoreAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ignored' as const } : a));
    addToast('Alerta ignorado.', 'info');
    setDetailAlert(null);
  };

  const handleCreateRule = () => {
    addToast(`Regra "${newRule.name}" criada com sucesso!`, 'success');
    setShowNewRule(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Central de alertas</h1>
          <p className="text-slate-500 text-sm mt-1">Monitore e responda a eventos críticos do portal</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowNewRule(true)}>
          Nova regra
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Alertas ativos" value={activeAlerts.length} icon={<Bell size={18} />} color="yellow" />
        <MetricCard title="Disparados no mês" value={alerts.length} icon={<AlertTriangle size={18} />} color="blue" />
        <MetricCard title="Resolvidos" value={resolvedAlerts.length} icon={<CheckCircle size={18} />} color="green" />
        <MetricCard title="Críticos ativos" value={criticalAlerts.length} icon={<XCircle size={18} />} color="red" />
      </div>

      {/* Active alerts */}
      <div className="space-y-3">
        <h3 className={cn('font-semibold text-lg', isDark ? 'text-white' : 'text-slate-900')}>
          Alertas ativos
        </h3>
        {activeAlerts.length === 0 ? (
          <div className={cn('glass-card rounded-xl border p-10 text-center', isDark ? 'border-blue-500/10' : 'border-slate-200')}>
            <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-500">Nenhum alerta ativo. Tudo sob controle.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert, i) => {
              const config = severityConfig[alert.severity];
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    'glass-card rounded-xl border p-4 flex items-start gap-4',
                    alert.severity === 'critical' ? 'border-red-500/20' : alert.severity === 'warning' ? 'border-amber-500/15' : 'border-blue-500/15'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                    alert.severity === 'critical' ? 'bg-red-500/15 text-red-400' :
                    alert.severity === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-blue-500/15 text-blue-400'
                  )}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{alert.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={config.badge}>{config.label}</Badge>
                        <span className="text-[11px] font-mono text-slate-500">{formatDateTime(alert.datetime)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{alert.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-600">Relatório: <span className="text-slate-400">{alert.report}</span></span>
                      {alert.responsible && (
                        <span className="text-xs text-slate-600">Responsável: <span className="text-slate-400">{alert.responsible}</span></span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setDetailAlert(alert)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                      title="Ver detalhes"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                      title="Resolver"
                    >
                      <CheckCircle size={14} />
                    </button>
                    <button
                      onClick={() => ignoreAlert(alert.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
                      title="Ignorar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved alerts */}
      <div className="space-y-3">
        <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Alertas resolvidos</h3>
        <div className={cn('rounded-xl border overflow-hidden', isDark ? 'glass-card border-blue-500/10' : 'bg-white border-slate-200')}>
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', isDark ? 'border-slate-700/50' : 'border-slate-100')}>
                {['Alerta', 'Severidade', 'Relatório', 'Data', 'Status'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {alerts.filter(a => a.status !== 'active').map((alert, i) => (
                <tr key={alert.id} className={cn('transition-colors', isDark ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50')}>
                  <td className="px-4 py-3">
                    <span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>{alert.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={severityConfig[alert.severity].badge}>{severityConfig[alert.severity].label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{alert.report}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(alert.datetime)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={alert.status === 'resolved' ? 'success' : 'default'}>
                      {alert.status === 'resolved' ? 'Resolvido' : 'Ignorado'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!detailAlert}
        onClose={() => setDetailAlert(null)}
        title="Detalhe do alerta"
        size="md"
        footer={
          detailAlert ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => ignoreAlert(detailAlert.id)}>Ignorar</Button>
              <Button size="sm" icon={<CheckCircle size={14} />} onClick={() => resolveAlert(detailAlert.id)}>Resolver</Button>
            </>
          ) : undefined
        }
      >
        {detailAlert && (
          <div className="space-y-4">
            <div className={cn(
              'p-4 rounded-xl border',
              detailAlert.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
              detailAlert.severity === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={severityConfig[detailAlert.severity].badge}>{severityConfig[detailAlert.severity].label}</Badge>
                <span className="text-xs font-mono text-slate-500">{formatDateTime(detailAlert.datetime)}</span>
              </div>
              <p className={cn('text-base font-semibold mb-2', isDark ? 'text-white' : 'text-slate-900')}>{detailAlert.title}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{detailAlert.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={cn('p-3 rounded-xl', isDark ? 'bg-slate-800/40' : 'bg-slate-50')}>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Relatório</p>
                <p className={cn('text-sm font-medium mt-0.5', isDark ? 'text-white' : 'text-slate-900')}>{detailAlert.report}</p>
              </div>
              <div className={cn('p-3 rounded-xl', isDark ? 'bg-slate-800/40' : 'bg-slate-50')}>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Responsável</p>
                <p className={cn('text-sm font-medium mt-0.5', isDark ? 'text-white' : 'text-slate-900')}>{detailAlert.responsible || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* New Rule Modal */}
      <Modal
        open={showNewRule}
        onClose={() => setShowNewRule(false)}
        title="Nova regra de alerta"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowNewRule(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleCreateRule} disabled={!newRule.name}>Criar regra</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Nome da regra *" isDark={isDark}>
            <input value={newRule.name} onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Alerta de refresh falho" className={inputClass(isDark)} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo de evento" isDark={isDark}>
              <select value={newRule.eventType} onChange={e => setNewRule(p => ({ ...p, eventType: e.target.value }))} className={inputClass(isDark)}>
                <option value="">Selecionar...</option>
                <option>Refresh falhou</option>
                <option>Sem acesso há 30 dias</option>
                <option>Acesso negado</option>
                <option>Exportação falhou</option>
                <option>Dataset atrasado</option>
                <option>Sem responsável</option>
              </select>
            </FormField>
            <FormField label="Severidade" isDark={isDark}>
              <select value={newRule.severity} onChange={e => setNewRule(p => ({ ...p, severity: e.target.value }))} className={inputClass(isDark)}>
                <option value="critical">Crítico</option>
                <option value="warning">Atenção</option>
                <option value="info">Info</option>
              </select>
            </FormField>
            <FormField label="Relatório ou categoria" isDark={isDark}>
              <select value={newRule.reportOrCategory} onChange={e => setNewRule(p => ({ ...p, reportOrCategory: e.target.value }))} className={inputClass(isDark)}>
                <option value="">Todos</option>
                <option>Visão Financeira</option>
                <option>Indicadores Comerciais</option>
                <option>Categoria: Financeiro</option>
                <option>Categoria: Comercial</option>
              </select>
            </FormField>
          </div>
          <FormField label="Notificar" isDark={isDark}>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newRule.notifyAdmins} onChange={e => setNewRule(p => ({ ...p, notifyAdmins: e.target.checked }))} />
                <span className="text-sm text-slate-400">Admins</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newRule.notifyResponsible} onChange={e => setNewRule(p => ({ ...p, notifyResponsible: e.target.checked }))} />
                <span className="text-sm text-slate-400">Responsável do relatório</span>
              </label>
            </div>
          </FormField>
          <FormField label="Canal de notificação" isDark={isDark}>
            <div className="flex flex-wrap gap-4">
              {(['email', 'whatsapp', 'webhook'] as const).map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRule.channels[c]}
                    onChange={e => setNewRule(p => ({ ...p, channels: { ...p.channels, [c]: e.target.checked } }))}
                  />
                  <span className="text-sm text-slate-400 capitalize">
                    {c === 'email' ? 'Email' : c === 'whatsapp' ? 'WhatsApp (simulado)' : 'Webhook (simulado)'}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
        </div>
      </Modal>
    </motion.div>
  );
}

function FormField({ label, children, isDark }: { label: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className={cn('text-xs font-semibold uppercase tracking-wide', isDark ? 'text-slate-400' : 'text-slate-500')}>
        {label}
      </label>
      {children}
    </div>
  );
}

function inputClass(isDark: boolean) {
  return cn(
    'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all',
    isDark
      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500/50'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400'
  );
}
