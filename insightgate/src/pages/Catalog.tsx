import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, ExternalLink, BookOpen, Filter, Eye,
  Calendar, TrendingUp, Tag, X, Maximize, AlertCircle, Download, FileText
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockReports } from '../data/mockData';

function statusBadge(status: string) {
  switch (status) {
    case 'published': return <Badge variant="success" dot>Publicado</Badge>;
    case 'draft': return <Badge variant="default">Rascunho</Badge>;
    case 'archived': return <Badge variant="default">Arquivado</Badge>;
    case 'attention': return <Badge variant="warning" dot>Atenção</Badge>;
    default: return null;
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function Catalog() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['2', '5']);
  const [openReport, setOpenReport] = useState<(typeof mockReports)[0] | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const categories = ['all', ...Array.from(new Set(mockReports.map(r => r.category)))];

  const published = mockReports.filter(r => r.status !== 'archived' && r.status !== 'draft');

  const filtered = published.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.includes(search.toLowerCase()));
    const matchCat = filterCat === 'all' || r.category === filterCat;
    const matchFav = !showFavorites || favorites.includes(r.id);
    return matchSearch && matchCat && matchFav;
  });

  const toggleFav = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    addToast(favorites.includes(id) ? 'Removido dos favoritos' : 'Adicionado aos favoritos', 'info');
  };

  const handleOpen = (report: typeof mockReports[0]) => {
    setOpenReport(report);
    addToast(`Acesso registrado: "${report.name}"`, 'info');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Catálogo de relatórios</h1>
          <p className="text-slate-500 text-sm mt-1">Central de acesso para usuários do portal</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">{filtered.length} relatórios</Badge>
        </div>
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
            placeholder="Buscar relatório, tag ou categoria..."
            className={cn('bg-transparent text-sm outline-none flex-1', isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400')}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                filterCat === c
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : isDark ? 'text-slate-400 border-slate-700 hover:border-slate-600' : 'text-slate-500 border-slate-200 hover:border-slate-300'
              )}
            >
              {c === 'all' ? 'Todos' : c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border',
            showFavorites
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              : isDark ? 'text-slate-400 border-slate-700 hover:border-slate-600' : 'text-slate-500 border-slate-200'
          )}
        >
          <Star size={13} fill={showFavorites ? 'currentColor' : 'none'} />
          Favoritos
        </button>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <BookOpen size={48} className="text-slate-700" />
          <p className="text-slate-500">Nenhum relatório encontrado.</p>
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterCat('all'); setShowFavorites(false); }}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                'group glass-card rounded-xl border p-5 flex flex-col hover:border-blue-500/30 transition-all duration-200 cursor-pointer',
                isDark ? 'border-blue-500/10' : 'border-slate-200'
              )}
              onClick={() => handleOpen(report)}
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-slate-900')}>
                      {report.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{report.category}</p>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleFav(report.id); }}
                  className={cn(
                    'p-1.5 rounded-lg transition-all',
                    favorites.includes(report.id)
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-slate-600 hover:text-amber-400 hover:bg-amber-400/10'
                  )}
                >
                  <Star size={14} fill={favorites.includes(report.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                {report.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {report.tags.slice(0, 3).map(t => (
                  <span key={t} className={cn(
                    'px-2 py-0.5 rounded-md text-[10px] font-medium border',
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'
                  )}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {formatDate(report.lastUpdate)}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={10} />
                  {report.views} acessos
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/30">
                {statusBadge(report.status)}
                <Button
                  variant="secondary"
                  size="sm"
                  className="ml-auto text-xs"
                  icon={<Eye size={12} />}
                  onClick={e => { e.stopPropagation(); handleOpen(report); }}
                >
                  Abrir
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Report viewer */}
      <AnimatePresence>
        {openReport && (
          <div className={cn('fixed inset-0 z-50', fullscreen ? '' : 'p-4 flex items-center justify-center')}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => { setOpenReport(null); setFullscreen(false); }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={cn(
                'relative glass-card border border-blue-500/20 flex flex-col',
                fullscreen ? 'w-full h-full' : 'w-full max-w-5xl rounded-2xl h-[85vh]'
              )}
            >
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between px-6 py-4 border-b flex-shrink-0',
                isDark ? 'border-slate-700/50' : 'border-slate-200'
              )}>
                <div>
                  <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{openReport.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atualizado em {formatDate(openReport.lastUpdate)} · {openReport.views} acessos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFav(openReport.id)}
                    className={cn('p-2 rounded-lg transition-all', favorites.includes(openReport.id) ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-amber-400')}
                    title="Favoritar"
                  >
                    <Star size={16} fill={favorites.includes(openReport.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => setFullscreen(!fullscreen)}
                    className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                    title="Tela cheia"
                  >
                    <Maximize size={16} />
                  </button>
                  <button
                    onClick={() => addToast('Problema reportado com sucesso!', 'info')}
                    className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                    title="Reportar problema"
                  >
                    <AlertCircle size={16} />
                  </button>
                  <button
                    onClick={() => addToast('Exportação em andamento... PDF será gerado em instantes.', 'info')}
                    className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    title="Exportar PDF"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => { setOpenReport(null); setFullscreen(false); }}
                    className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className={cn(
                'px-6 py-3 border-b flex-shrink-0',
                isDark ? 'border-slate-700/30 bg-slate-800/20' : 'border-slate-100 bg-slate-50/50'
              )}>
                <p className="text-sm text-slate-400">{openReport.description}</p>
              </div>

              {/* Iframe mock */}
              <div className={cn(
                'flex-1 flex flex-col items-center justify-center gap-4',
                isDark ? 'bg-gradient-to-br from-slate-900/80 to-slate-800/30' : 'bg-slate-100'
              )}>
                <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                  <FileText size={36} className="text-yellow-400" />
                </div>
                <div className="text-center max-w-md">
                  <p className={cn('text-base font-semibold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
                    {openReport.name}
                  </p>
                  <p className="text-sm text-slate-500 mb-5">
                    Em produção, o iframe do Power BI seria renderizado aqui.
                    Este é o preview do portal InsightGate.
                  </p>
                  <Button
                    icon={<ExternalLink size={14} />}
                    onClick={() => addToast('Abrindo relatório no Power BI...', 'info')}
                  >
                    Abrir no Power BI
                  </Button>
                </div>
                <div className={cn(
                  'absolute bottom-6 left-6 right-6 p-3 rounded-xl border text-xs flex items-start gap-2',
                  isDark ? 'bg-amber-500/5 border-amber-500/20 text-amber-300/70' : 'bg-amber-50 border-amber-200 text-amber-800'
                )}>
                  <AlertCircle size={12} className="flex-shrink-0 mt-0.5 text-amber-400" />
                  Relatórios publicados na web continuam acessíveis pelo link original. O InsightGate gerencia acesso e auditoria dentro do portal, mas não restringe o link original.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
