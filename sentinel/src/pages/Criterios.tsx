import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { GlassCard, SeverityBadge, PageWrapper, GlowButton, Modal } from '../components/SharedComponents';
import { criterios } from '../data/mockData';
import { Plus, Search, Tag } from 'lucide-react';

export default function Criterios() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = criterios.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorias = [...new Set(criterios.map(c => c.categoria))];

  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Biblioteca de Critérios</h2>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Critérios reutilizáveis para compor modelos de avaliação.</p>
          </div>
          <GlowButton onClick={() => setShowNewModal(true)}>
            <Plus size={16} /> Novo critério
          </GlowButton>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text" placeholder="Buscar critérios..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.06] text-white placeholder-slate-600 focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-300'}`}
          />
        </div>

        {/* By Category */}
        {categorias.map(cat => {
          const catCriterios = filtered.filter(c => c.categoria === cat);
          if (catCriterios.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Tag size={14} className="inline mr-1.5" />{cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {catCriterios.map(crit => (
                  <GlassCard key={crit.id} hover className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{crit.nome}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${crit.status === 'ativo' ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700') : (isDark ? 'bg-slate-500/10 text-slate-500' : 'bg-slate-100 text-slate-400')}`}>
                        {crit.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Peso: <strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>{crit.pesoSugerido}%</strong></span>
                      <SeverityBadge severity={crit.severidade} />
                    </div>
                    <div className={`text-xs mt-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      Usado em <strong className={isDark ? 'text-slate-400' : 'text-slate-600'}>{crit.usadoEmModelos}</strong> modelo{crit.usadoEmModelos !== 1 ? 's' : ''}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className={`text-center py-12 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Nenhum critério encontrado.
          </div>
        )}
      </div>

      {/* New Criteria Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Novo Critério">
        <form onSubmit={e => { e.preventDefault(); setShowNewModal(false); addToast('Critério criado com sucesso!', 'success'); }} className="space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Nome do critério</label>
            <input type="text" placeholder="Ex: Verificação de segurança" className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-300'}`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Categoria</label>
              <select className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option>Comunicação</option><option>Processo</option><option>Comportamento</option><option>Resultado</option><option>Conformidade</option><option>Eficiência</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Severidade</label>
              <select className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option>crítica</option><option>alta</option><option>média</option><option>baixa</option>
              </select>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Peso sugerido (%)</label>
            <input type="number" defaultValue={10} min={1} max={50} className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-300'}`} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Instrução para IA</label>
            <textarea rows={3} placeholder="Descreva como a IA deve avaliar este critério..." className={`w-full px-3 py-2 rounded-lg text-sm outline-none resize-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-300'}`} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <GlowButton variant="ghost" onClick={() => setShowNewModal(false)}>Cancelar</GlowButton>
            <GlowButton type="submit">Criar critério</GlowButton>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
