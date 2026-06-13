import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, Archive, Eye, RefreshCw, Edit, Search,
  FileText, Copy,
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { Drawer } from '../components/ui/Drawer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockReports } from '../data/mockData';
import { Report } from '../types';

function statusBadge(status: string) {
  switch (status) {
    case 'published': return <Badge variant="success" dot>Publicado</Badge>;
    case 'draft': return <Badge variant="default" dot>Rascunho</Badge>;
    case 'archived': return <Badge variant="default">Arquivado</Badge>;
    case 'attention': return <Badge variant="warning" dot>Atenção</Badge>;
    default: return null;
  }
}

function sensitivityBadge(s: string) {
  switch (s) {
    case 'public': return <Badge variant="info">Público</Badge>;
    case 'internal': return <Badge variant="purple">Interno</Badge>;
    case 'attention': return <Badge variant="warning">Atenção</Badge>;
    default: return null;
  }
}

function refreshBadge(status: string) {
  switch (status) {
    case 'success': return <Badge variant="success"><CheckCircle size={10} className="mr-1" />Sucesso</Badge>;
    case 'failed': return <Badge variant="danger"><AlertTriangle size={10} className="mr-1" />Falha</Badge>;
    case 'delayed': return <Badge variant="warning"><Clock size={10} className="mr-1" />Atrasado</Badge>;
    case 'running': return <Badge variant="info" dot>Executando</Badge>;
    default: return null;
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function formatDateTime(d: string) {
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function ReportDetailDrawer({ report, open, onClose }: { report: Report | null; open: boolean; onClose: () => void }) {
  const { addToast, theme } = useApp();
  const isDark = theme === 'dark';
  if (!report) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={report.name}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Fechar</Button>
          <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => addToast('Modo de edição — em breve.', 'info')}>
            Editar metadados
          </Button>
          <Button size="sm" icon={<ExternalLink size={14} />} onClick={() => addToast('Abrindo relatório no Power BI...', 'info')}>
            Abrir relatório
          </Button>
        </>
      }
    >
      {/* Power BI Preview */}
      <div className={cn(
        'rounded-xl border overflow-hidden mb-5',
        isDark ? 'border-blue-500/20' : 'border-slate-200'
      )}>
        <div className={cn(
          'flex items-center justify-between px-4 py-2 border-b',
          isDark ? 'bg-slate-800/50 border-blue-500/10' : 'bg-slate-50 border-slate-200'
        )}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-xs text-slate-500 font-mono truncate max-w-48">{report.link}</span>
          <button onClick={() => addToast('Link copiado!', 'success')} className="text-slate-500 hover:text-white transition-colors">
            <Copy size={12} />
          </button>
        </div>
        <div className={cn(
          'h-48 flex flex-col items-center justify-center gap-3',
          isDark ? 'bg-slate-900/50' : 'bg-slate-100'
        )}>
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <FileText size={24} className="text-yellow-400" />
          </div>
          <div className="text-center">
            <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>Preview do relatório Power BI</p>
            <p className="text-xs text-slate-500 mt-1">O iframe é renderizado dentro do portal para usuários com acesso</p>
          </div>
          <Button variant="outline" size="sm" icon={<ExternalLink size={12} />} onClick={() => addToast('Abrindo no Power BI...', 'info')}>
            Abrir Power BI
          </Button>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <InfoItem label="Categoria" value={report.category} />
        <InfoItem label="Workspace" value={report.workspace} />
        <InfoItem label="Responsável" value={report.responsible || '—'} />
        <InfoItem label="Dataset" value={report.dataset} />
        <InfoItem label="Freq. de atualização" value={report.refreshFrequency} />
        <InfoItem label="Último refresh" value={formatDateTime(report.lastRefresh)} />
        <InfoItem label="Status do refresh" value={<span>{refreshBadge(report.refreshStatus)}</span>} />
        <InfoItem label="Sensibilidade" value={<span>{sensitivityBadge(report.sensitivity)}</span>} />
        <InfoItem label="Total de acessos" value={String(report.totalAccesses)} />
        <InfoItem label="Último acesso" value={formatDateTime(report.lastAccess)} />
      </div>

      {/* Tags */}
      <div className="mb-5">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Tags</p>
        <div className="flex flex-wrap gap-2">
          {report.tags.map(t => (
            <span key={t} className={cn(
              'px-2 py-1 rounded-md text-xs font-medium border',
              isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            )}>{t}</span>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div className="mb-5">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Grupos com permissão</p>
        <div className="flex flex-wrap gap-2">
          {report.groups.map(g => (
            <Badge key={g} variant="purple">{g}</Badge>
          ))}
        </div>
      </div>

      {/* Users */}
      <div className="mb-5">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Usuários que acessaram</p>
        <div className="flex flex-wrap gap-2">
          {report.usersAccessed.map(u => (
            <div key={u} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400 text-[9px] font-bold">
                {u.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-xs text-slate-400">{u}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className={cn(
        'p-4 rounded-lg border',
        isDark ? 'bg-slate-800/30 border-slate-700/30' : 'bg-slate-50 border-slate-200'
      )}>
        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Descrição</p>
        <p className="text-sm text-slate-400 leading-relaxed">{report.description}</p>
      </div>
    </Drawer>
  );
}

function InfoItem({ label, value }: { label: string; value: string | React.ReactNode }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  return (
    <div>
      <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
      <div className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>
        {typeof value === 'string' ? value : value}
      </div>
    </div>
  );
}

export function Reports() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selected, setSelected] = useState<Report | null>(null);

  const categories = ['all', ...Array.from(new Set(mockReports.map(r => r.category)))];

  const filtered = mockReports.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchCategory = filterCategory === 'all' || r.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Relatórios</h1>
          <p className="text-slate-500 text-sm mt-1">{mockReports.length} relatórios cadastrados no portal</p>
        </div>
        <Button icon={<FileText size={16} />} onClick={() => addToast('Use o menu "Publicar relatório" para adicionar.', 'info')}>
          Novo relatório
        </Button>
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
            placeholder="Buscar por nome ou categoria..."
            className={cn('bg-transparent text-sm outline-none flex-1', isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400')}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className={cn(
            'px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer',
            isDark ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          )}
        >
          <option value="all">Todos os status</option>
          <option value="published">Publicado</option>
          <option value="draft">Rascunho</option>
          <option value="archived">Arquivado</option>
          <option value="attention">Atenção</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className={cn(
            'px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer',
            isDark ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          )}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'Todas as categorias' : c}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500">{filtered.length} resultados</span>
      </div>

      {/* Table */}
      <div className={cn(
        'rounded-xl border overflow-hidden',
        isDark ? 'glass-card border-blue-500/10' : 'bg-white border-slate-200'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', isDark ? 'border-slate-700/50' : 'border-slate-100')}>
                {['Relatório', 'Categoria', 'Workspace', 'Responsável', 'Status', 'Refresh', 'Acessos', 'Sensibilidade', 'Ações'].map(h => (
                  <th key={h} className={cn(
                    'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {filtered.map((report, i) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    'group transition-colors cursor-pointer',
                    isDark ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50'
                  )}
                  onClick={() => setSelected(report)}
                >
                  <td className="px-4 py-3">
                    <div className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>
                      {report.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Atualizado {formatDate(report.lastUpdate)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{report.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500 font-mono">{report.workspace}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {report.responsible ? (
                        <>
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-[9px] font-bold">
                            {report.responsible.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <span className="text-xs text-slate-400">{report.responsible}</span>
                        </>
                      ) : (
                        <Badge variant="danger">Sem responsável</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{statusBadge(report.status)}</td>
                  <td className="px-4 py-3">{refreshBadge(report.refreshStatus)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Eye size={12} className="text-slate-500" />
                      <span className="text-sm font-medium text-slate-300">{report.views}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{sensitivityBadge(report.sensitivity)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelected(report)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Detalhes"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => addToast('Link do portal copiado!', 'success')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                        title="Copiar link"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => addToast('Refresh solicitado! Simulação da API Power BI.', 'info')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        title="Atualizar"
                      >
                        <RefreshCw size={13} />
                      </button>
                      <button
                        onClick={() => addToast(`"${report.name}" arquivado.`, 'warning')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Arquivar"
                      >
                        <Archive size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FileText size={40} className="text-slate-600" />
            <p className="text-slate-500 text-sm">Nenhum relatório encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      <ReportDetailDrawer
        report={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </motion.div>
  );
}
