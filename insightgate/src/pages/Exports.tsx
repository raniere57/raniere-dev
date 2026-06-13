import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Play, Pause, Edit, Plus, CheckCircle, XCircle,
  Clock, Mail, FileText, Loader
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { MetricCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockExports, mockExportHistory } from '../data/mockData';

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const statusBadge = (status: string) => {
  switch (status) {
    case 'active': return <Badge variant="success" dot>Ativo</Badge>;
    case 'paused': return <Badge variant="default" dot>Pausado</Badge>;
    case 'failed': return <Badge variant="danger" dot>Falha</Badge>;
    default: return null;
  }
};

const historyStatusBadge = (status: string) => {
  switch (status) {
    case 'success': return <Badge variant="success"><CheckCircle size={10} className="mr-1" />Sucesso</Badge>;
    case 'failed': return <Badge variant="danger"><XCircle size={10} className="mr-1" />Falha</Badge>;
    default: return null;
  }
};

export function Exports() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState(mockExportHistory);
  const [newSchedule, setNewSchedule] = useState({
    name: '', report: '', format: 'PDF', frequency: '',
    recipients: '', subject: '', message: '', attachSnapshot: true, saveHistory: true
  });

  const handleRunNow = (id: string, name: string) => {
    setRunning(id);
    setTimeout(() => {
      setRunning(null);
      addToast(`Exportação "${name}" executada com sucesso!`, 'success');
      const newEntry = {
        id: String(exportHistory.length + 1),
        datetime: new Date().toISOString(),
        report: mockExports.find(e => e.id === id)?.report || '',
        format: mockExports.find(e => e.id === id)?.format || 'PDF',
        requestedBy: 'Raniere Costa',
        status: 'success',
        size: '3.2 MB',
      };
      setExportHistory(prev => [newEntry, ...prev]);
    }, 2500);
  };

  const handleCreateSchedule = () => {
    addToast(`Agendamento "${newSchedule.name}" criado com sucesso!`, 'success');
    setShowNewSchedule(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Exportações e envios</h1>
          <p className="text-slate-500 text-sm mt-1">Automatize entregas de relatórios para equipes</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowNewSchedule(true)}>
          Novo agendamento
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Exportações agendadas" value="4" icon={<Clock size={18} />} color="blue" />
        <MetricCard title="PDFs gerados no mês" value="28" icon={<FileText size={18} />} color="cyan" />
        <MetricCard title="Envios por email" value="24" icon={<Mail size={18} />} color="green" />
        <MetricCard title="Falhas de envio" value="2" icon={<XCircle size={18} />} color="red" />
      </div>

      {/* Schedules table */}
      <div className={cn('glass-card rounded-xl border overflow-hidden', isDark ? 'border-blue-500/10' : 'border-slate-200')}>
        <div className={cn('flex items-center justify-between px-5 py-4 border-b', isDark ? 'border-slate-700/50' : 'border-slate-100')}>
          <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Agendamentos ativos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', isDark ? 'border-slate-700/30' : 'border-slate-100')}>
                {['Nome', 'Relatório', 'Formato', 'Frequência', 'Destinatários', 'Próxima execução', 'Status', 'Ações'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {mockExports.map((exp, i) => (
                <motion.tr
                  key={exp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn('group transition-colors', isDark ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50')}
                >
                  <td className="px-4 py-3">
                    <span className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>{exp.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{exp.report}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={exp.format === 'PDF' ? 'danger' : exp.format === 'PPTX' ? 'warning' : 'info'}>
                      {exp.format}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{exp.frequency}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-500 truncate max-w-32 block">{exp.recipients}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(exp.nextRun)}</span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(exp.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => addToast('Modo de edição...', 'info')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Editar"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleRunNow(exp.id, exp.name)}
                        disabled={running === exp.id}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        title="Executar agora"
                      >
                        {running === exp.id ? <Loader size={13} className="animate-spin" /> : <Play size={13} />}
                      </button>
                      <button
                        onClick={() => addToast('Agendamento pausado.', 'warning')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        title="Pausar"
                      >
                        <Pause size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export history */}
      <div className={cn('glass-card rounded-xl border overflow-hidden', isDark ? 'border-blue-500/10' : 'border-slate-200')}>
        <div className={cn('flex items-center justify-between px-5 py-4 border-b', isDark ? 'border-slate-700/50' : 'border-slate-100')}>
          <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Histórico de exportações</h3>
          <Badge variant="info">{exportHistory.length} registros</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', isDark ? 'border-slate-700/30' : 'border-slate-100')}>
                {['Data/hora', 'Relatório', 'Formato', 'Solicitado por', 'Status', 'Tamanho', 'Ação'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {exportHistory.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn('transition-colors', isDark ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50')}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(item.datetime)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-sm', isDark ? 'text-slate-300' : 'text-slate-700')}>{item.report}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.format === 'PDF' ? 'danger' : item.format === 'PPTX' ? 'warning' : 'info'}>
                      {item.format}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{item.requestedBy}</span>
                  </td>
                  <td className="px-4 py-3">{historyStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{item.size}</span>
                  </td>
                  <td className="px-4 py-3">
                    {item.status === 'success' && (
                      <button
                        onClick={() => addToast('Download simulado. Arquivo disponível em 2 segundos.', 'info')}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                      >
                        <Download size={11} /> Baixar
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New schedule modal */}
      <Modal
        open={showNewSchedule}
        onClose={() => setShowNewSchedule(false)}
        title="Novo agendamento"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowNewSchedule(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleCreateSchedule} disabled={!newSchedule.name}>Criar agendamento</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ModalField label="Nome do agendamento *">
              <input value={newSchedule.name} onChange={e => setNewSchedule(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Financeiro Mensal" className={inputClass(isDark)} />
            </ModalField>
            <ModalField label="Relatório">
              <select value={newSchedule.report} onChange={e => setNewSchedule(p => ({ ...p, report: e.target.value }))} className={inputClass(isDark)}>
                <option value="">Selecionar...</option>
                {['Visão Financeira', 'Indicadores Comerciais', 'Performance Operacional', 'Diretoria Executiva'].map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </ModalField>
            <ModalField label="Formato">
              <select value={newSchedule.format} onChange={e => setNewSchedule(p => ({ ...p, format: e.target.value }))} className={inputClass(isDark)}>
                <option>PDF</option>
                <option>PPTX</option>
                <option>CSV</option>
              </select>
            </ModalField>
            <ModalField label="Frequência">
              <select value={newSchedule.frequency} onChange={e => setNewSchedule(p => ({ ...p, frequency: e.target.value }))} className={inputClass(isDark)}>
                <option value="">Selecionar...</option>
                <option>Diária</option>
                <option>Semanal</option>
                <option>Quinzenal</option>
                <option>Mensal</option>
              </select>
            </ModalField>
          </div>
          <ModalField label="Destinatários (emails separados por vírgula)">
            <input value={newSchedule.recipients} onChange={e => setNewSchedule(p => ({ ...p, recipients: e.target.value }))} placeholder="board@empresa.com, diretoria@empresa.com" className={inputClass(isDark)} />
          </ModalField>
          <ModalField label="Assunto do email">
            <input value={newSchedule.subject} onChange={e => setNewSchedule(p => ({ ...p, subject: e.target.value }))} placeholder="Relatório mensal — InsightGate" className={inputClass(isDark)} />
          </ModalField>
          <ModalField label="Mensagem">
            <textarea value={newSchedule.message} onChange={e => setNewSchedule(p => ({ ...p, message: e.target.value }))} placeholder="Segue em anexo o relatório..." rows={3} className={inputClass(isDark)} />
          </ModalField>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newSchedule.attachSnapshot} onChange={e => setNewSchedule(p => ({ ...p, attachSnapshot: e.target.checked }))} />
              <span className="text-sm text-slate-400">Anexar snapshot do relatório</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newSchedule.saveHistory} onChange={e => setNewSchedule(p => ({ ...p, saveHistory: e.target.checked }))} />
              <span className="text-sm text-slate-400">Salvar no histórico</span>
            </label>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
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
