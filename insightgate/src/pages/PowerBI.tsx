import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle,
  Wifi, Database, Play, History, ChevronRight, Info
} from 'lucide-react';
import { Drawer } from '../components/ui/Drawer';
import { MetricCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockDatasets } from '../data/mockData';

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const refreshHistory = [
  { datetime: '2024-01-17T06:00:00', status: 'success', duration: '4min 32s', message: 'Refresh concluído com sucesso.', user: 'Sistema (agendado)', origin: 'Agendado' },
  { datetime: '2024-01-16T06:00:00', status: 'success', duration: '4min 18s', message: 'Refresh concluído com sucesso.', user: 'Sistema (agendado)', origin: 'Agendado' },
  { datetime: '2024-01-15T14:30:00', status: 'success', duration: '5min 02s', message: 'Refresh manual concluído.', user: 'Ana Costa', origin: 'Manual' },
  { datetime: '2024-01-15T06:00:00', status: 'failed', duration: '—', message: 'Falha na conexão com a fonte de dados. Credenciais expiradas.', user: 'Sistema (agendado)', origin: 'Agendado' },
  { datetime: '2024-01-14T06:00:00', status: 'success', duration: '3min 55s', message: 'Refresh concluído com sucesso.', user: 'Sistema (agendado)', origin: 'Agendado' },
];

export function PowerBI() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [refreshingDataset, setRefreshingDataset] = useState<string | null>(null);
  const [historyDrawer, setHistoryDrawer] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<typeof mockDatasets[0] | null>(null);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      addToast('Sincronização concluída. 6 datasets atualizados.', 'success');
    }, 2000);
  };

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      addToast('Conexão testada com sucesso! API Power BI respondendo (simulado).', 'success');
    }, 1500);
  };

  const handleRefreshDataset = (datasetId: string, datasetName: string) => {
    setRefreshingDataset(datasetId);
    setTimeout(() => {
      setRefreshingDataset(null);
      addToast(`Refresh solicitado com sucesso. Esta é uma simulação da API Power BI.`, 'info');
    }, 2000);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="success" dot>Sucesso</Badge>;
      case 'failed': return <Badge variant="danger" dot>Falha</Badge>;
      case 'delayed': return <Badge variant="warning" dot>Atrasado</Badge>;
      case 'running': return <Badge variant="info" dot>Executando</Badge>;
      default: return null;
    }
  };

  const failed = mockDatasets.filter(d => d.status === 'failed').length;
  const success = mockDatasets.filter(d => d.status === 'success').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Atualizações Power BI</h1>
        <p className="text-slate-500 text-sm mt-1">Monitoramento simulado via API Power BI</p>
      </div>

      {/* Connection status */}
      <div className={cn('glass-card rounded-xl border p-5', isDark ? 'border-emerald-500/20' : 'border-emerald-200')}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'
            )}>
              <Wifi size={22} className="text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>
                  Conexão Power BI
                </span>
                <Badge variant="success" dot>Conectado (Simulado)</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Tenant: <span className="font-mono text-slate-400">empresa.onmicrosoft.com</span></span>
                <span>Conta: <span className="font-mono text-slate-400">svc-bi@empresa.com</span></span>
                <span>Última sync: <span className="font-mono text-slate-400">17/01 06:15</span></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              loading={testing}
              icon={<CheckCircle size={14} />}
              onClick={handleTest}
            >
              Testar conexão
            </Button>
            <Button
              variant="secondary"
              size="sm"
              loading={syncing}
              icon={<RefreshCw size={14} />}
              onClick={handleSync}
            >
              Sincronizar agora
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Datasets monitorados"
          value={mockDatasets.length}
          icon={<Database size={18} />}
          color="blue"
        />
        <MetricCard
          title="Atualizações com sucesso"
          value={success}
          icon={<CheckCircle size={18} />}
          color="green"
        />
        <MetricCard
          title="Falhas de refresh"
          value={failed}
          icon={<XCircle size={18} />}
          color="red"
        />
        <MetricCard
          title="Refreshes manuais hoje"
          value="3/8"
          subtitle="Limite da licença simulada"
          icon={<Clock size={18} />}
          color="yellow"
        />
      </div>

      {/* Warning */}
      <div className={cn(
        'flex items-start gap-3 p-4 rounded-xl border',
        isDark ? 'bg-blue-500/5 border-blue-500/15 text-blue-300/70' : 'bg-blue-50 border-blue-200 text-blue-800'
      )}>
        <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          Em cenários reais, a quantidade de refreshes depende da licença e da capacidade do Power BI.
          Esta tela simula a integração com a API REST do Power BI para fins de demonstração.
        </p>
      </div>

      {/* Datasets table */}
      <div className={cn('glass-card rounded-xl border overflow-hidden', isDark ? 'border-blue-500/10' : 'border-slate-200')}>
        <div className={cn('flex items-center justify-between px-5 py-4 border-b', isDark ? 'border-slate-700/50' : 'border-slate-100')}>
          <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Datasets monitorados</h3>
          <Badge variant="info">{mockDatasets.length} datasets</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', isDark ? 'border-slate-700/30' : 'border-slate-100')}>
                {['Dataset', 'Workspace', 'Relatório', 'Último refresh', 'Próximo refresh', 'Status', 'Duração', 'Ações'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {mockDatasets.map((dataset, i) => (
                <motion.tr
                  key={dataset.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn('group transition-colors', isDark ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50')}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Database size={13} className="text-blue-400 flex-shrink-0" />
                      <span className={cn('text-sm font-medium font-mono', isDark ? 'text-white' : 'text-slate-900')}>{dataset.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{dataset.workspace}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{dataset.report}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(dataset.lastRefresh)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(dataset.nextRefresh)}</span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(dataset.status)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{dataset.duration}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleRefreshDataset(dataset.id, dataset.name)}
                        disabled={refreshingDataset === dataset.id}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
                          isDark
                            ? 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10'
                            : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                        )}
                      >
                        <RefreshCw size={11} className={refreshingDataset === dataset.id ? 'animate-spin' : ''} />
                        {refreshingDataset === dataset.id ? 'Atualizando...' : 'Atualizar'}
                      </button>
                      <button
                        onClick={() => { setSelectedDataset(dataset); setHistoryDrawer(true); }}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
                          isDark
                            ? 'text-slate-400 border-slate-700/50 hover:bg-slate-700/50'
                            : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                        )}
                      >
                        <History size={11} /> Histórico
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Drawer */}
      <Drawer
        open={historyDrawer}
        onClose={() => { setHistoryDrawer(false); setSelectedDataset(null); }}
        title={`Histórico de refresh — ${selectedDataset?.name || ''}`}
        size="md"
      >
        {selectedDataset && (
          <div className="space-y-3">
            <div className={cn('p-3 rounded-xl border mb-5', isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-200')}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide">Dataset</p>
                  <p className={cn('text-sm font-medium font-mono mt-0.5', isDark ? 'text-white' : 'text-slate-900')}>{selectedDataset.name}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide">Status atual</p>
                  <div className="mt-0.5">{statusBadge(selectedDataset.status)}</div>
                </div>
              </div>
            </div>
            {refreshHistory.map((h, i) => (
              <div key={i} className={cn(
                'p-4 rounded-xl border',
                isDark ? 'bg-slate-800/30 border-slate-700/30' : 'bg-white border-slate-200'
              )}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-slate-500">{formatDateTime(h.datetime)}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={h.status === 'success' ? 'success' : 'danger'} dot>
                      {h.status === 'success' ? 'Sucesso' : 'Falha'}
                    </Badge>
                    <Badge variant="default">{h.origin}</Badge>
                  </div>
                </div>
                <p className={cn('text-sm mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}>{h.message}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Duração: {h.duration}</span>
                  <span>{h.user}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </motion.div>
  );
}
