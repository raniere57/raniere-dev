import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { GlassCard, SeverityBadge, PageWrapper, GlowButton } from '../components/SharedComponents';
import { modelosAvaliacao } from '../data/mockData';
import { ArrowLeft, Copy, Play, Edit3, Plus, Trash2, CheckCircle, FileText } from 'lucide-react';
import type { ModeloAvaliacao } from '../types';

export default function ModelosAvaliacao() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [editingModelo, setEditingModelo] = useState<ModeloAvaliacao | null>(null);

  // Editor View
  if (editingModelo) {
    const mod = editingModelo;
    return (
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingModelo(null)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mod.nome}</h2>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Versão {mod.versao} • {mod.criterios.length} critérios • Peso total: {mod.criterios.reduce((a, c) => a + c.peso, 0)}</p>
            </div>
            <div className="flex items-center gap-2">
              <GlowButton variant="secondary" size="sm" onClick={() => addToast('Simulação executada (simulado)', 'info')}>
                <Play size={14} /> Testar com atendimento simulado
              </GlowButton>
              <GlowButton size="sm" onClick={() => { setEditingModelo(null); addToast('Versão publicada com sucesso!', 'success'); }}>
                <CheckCircle size={14} /> Publicar versão
              </GlowButton>
            </div>
          </div>

          <GlassCard className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Nome do modelo</label>
                <input type="text" defaultValue={mod.nome} className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-300'}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Versão</label>
                <input type="text" defaultValue={mod.versao} className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-300'}`} />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Descrição</label>
                <textarea defaultValue={mod.descricao} rows={2} className={`w-full px-3 py-2 rounded-lg text-sm outline-none resize-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-300'}`} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Critérios de Avaliação</h3>
              <GlowButton variant="ghost" size="sm" onClick={() => addToast('Novo critério adicionado (simulado)', 'success')}>
                <Plus size={14} /> Adicionar critério
              </GlowButton>
            </div>

            <div className="space-y-3">
              {mod.criterios.map((crit, idx) => (
                <div key={crit.id} className={`p-4 rounded-lg border transition-colors ${isDark ? 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/20' : 'bg-slate-50 border-slate-200 hover:border-cyan-300'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>{idx + 1}</span>
                      <div>
                        <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{crit.nome}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Peso: {crit.peso}%</span>
                          <SeverityBadge severity={crit.severidade} />
                        </div>
                      </div>
                    </div>
                    <button className={`p-1 rounded transition-colors ${isDark ? 'text-slate-600 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Instrução para IA</label>
                      <textarea defaultValue={crit.instrucaoIA} rows={2} className={`w-full px-3 py-2 rounded-lg text-xs outline-none resize-none ${isDark ? 'bg-white/[0.03] border border-white/[0.05] text-slate-300 focus:border-cyan-500/20' : 'bg-white border border-slate-200 text-slate-700 focus:border-cyan-300'}`} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 text-emerald-500`}>Exemplos de aprovação</label>
                        {(crit.exemplosAprovacao || []).map((ex, i) => (
                          <div key={i} className={`flex items-center gap-2 px-2 py-1 rounded text-xs mb-1 ${isDark ? 'bg-emerald-500/5 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                            <CheckCircle size={10} /> {ex}
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 text-red-400`}>Exemplos de reprovação</label>
                        {(crit.exemplosReprovacao || []).map((ex, i) => (
                          <div key={i} className={`flex items-center gap-2 px-2 py-1 rounded text-xs mb-1 ${isDark ? 'bg-red-500/5 text-red-400' : 'bg-red-50 text-red-700'}`}>
                            <Trash2 size={10} /> {ex}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </PageWrapper>
    );
  }

  // List View
  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Modelos de Avaliação</h2>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Configure e gerencie modelos de avaliação de qualidade.</p>
          </div>
          <GlowButton onClick={() => { setEditingModelo({ id: 'new', nome: 'Novo Modelo', descricao: '', pesoTotal: 100, criterios: [], status: 'rascunho', versao: '1.0' }); }}>
            <Plus size={16} /> Novo modelo
          </GlowButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelosAvaliacao.map(mod => (
            <GlassCard key={mod.id} hover className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mod.nome}</h3>
                    <span className={`text-xs ${mod.status === 'publicado' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {mod.status === 'publicado' ? '● Publicado' : '● Rascunho'}
                    </span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-white/[0.06] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  v{mod.versao}
                </span>
              </div>
              <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{mod.descricao}</p>
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Critérios</p>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mod.criterios.length}</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Peso total</p>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mod.criterios.reduce((a, c) => a + c.peso, 0)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GlowButton variant="secondary" size="sm" onClick={() => setEditingModelo(mod)}>
                  <Edit3 size={12} /> Editar
                </GlowButton>
                <GlowButton variant="ghost" size="sm" onClick={() => addToast('Modelo duplicado (simulado)', 'success')}>
                  <Copy size={12} /> Duplicar
                </GlowButton>
                <GlowButton variant="ghost" size="sm" onClick={() => addToast('Simulação executada (simulado)', 'info')}>
                  <Play size={12} /> Simular
                </GlowButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
