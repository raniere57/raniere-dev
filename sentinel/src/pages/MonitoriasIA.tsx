import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { GlassCard, StatusBadge, PageWrapper, GlowButton, Modal } from '../components/SharedComponents';
import { monitorias, modelosAvaliacao } from '../data/mockData';
import { Plus, Play, Pause, Eye } from 'lucide-react';

export default function MonitoriasIA() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <PageWrapper>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Monitorias IA</h2>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Gerencie monitorias automatizadas e agendadas.</p>
          </div>
          <GlowButton onClick={() => setShowNewModal(true)}>
            <Plus size={16} /> Nova monitoria IA
          </GlowButton>
        </div>

        {/* Monitorias List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monitorias.map(mon => (
            <GlassCard key={mon.id} hover className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mon.nome}</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Modelo: {mon.modelo}</p>
                </div>
                <StatusBadge status={mon.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Canal</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{mon.canal}</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Fila/Setor</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{mon.fila}</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Avaliados</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{mon.qtdAvaliados}</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Última execução</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{mon.ultimaExecucao}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Score médio</p>
                  <p className={`text-lg font-bold ${mon.scoreMedio >= 80 ? 'text-emerald-400' : mon.scoreMedio >= 60 ? 'text-amber-400' : mon.scoreMedio > 0 ? 'text-red-400' : isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    {mon.scoreMedio > 0 ? mon.scoreMedio : '—'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {mon.status === 'em execução' && (
                    <button onClick={() => addToast('Monitoria pausada (simulado)', 'info')} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-amber-400 hover:bg-amber-500/10' : 'text-amber-600 hover:bg-amber-50'}`}>
                      <Pause size={16} />
                    </button>
                  )}
                  {mon.status === 'agendada' && (
                    <button onClick={() => addToast('Monitoria iniciada (simulado)', 'success')} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                      <Play size={16} />
                    </button>
                  )}
                  <button onClick={() => addToast('Detalhes da monitoria (simulado)', 'info')} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-white/[0.06]' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* New Monitoria Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nova Monitoria IA" size="lg">
        <form onSubmit={e => { e.preventDefault(); setShowNewModal(false); addToast('Monitoria criada com sucesso!', 'success'); }} className="space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Nome da monitoria</label>
            <input type="text" placeholder="Ex: Auditoria Semanal - Financeiro" className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-300'}`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Canal</label>
              <select className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option>Todos</option><option>WhatsApp</option><option>Telefone</option><option>Chat</option><option>E-mail</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Setor/Fila</label>
              <select className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option>Todos</option><option>Financeiro</option><option>Comercial</option><option>Suporte Técnico</option><option>Retenção</option><option>Cobrança</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Período de análise</label>
              <select className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option>Últimos 7 dias</option><option>Últimos 14 dias</option><option>Últimos 30 dias</option><option>Personalizado</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Modelo de avaliação</label>
              <select className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                {modelosAvaliacao.map(m => <option key={m.id}>{m.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Modelo de IA</label>
              <select className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option>GPT-4.1</option><option>Claude</option><option>Gemini</option><option>Modelo local</option><option>Simulado</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Frequência</label>
              <select className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option>Manual</option><option>Diária</option><option>Semanal</option><option>Mensal</option>
              </select>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sensibilidade da análise</label>
            <div className="flex gap-3">
              {(['conservadora', 'equilibrada', 'rigorosa'] as const).map(s => (
                <label key={s} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm
                  ${s === 'equilibrada' 
                    ? isDark ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' : 'border-cyan-300 bg-cyan-50 text-cyan-700'
                    : isDark ? 'border-white/[0.08] text-slate-400 hover:border-white/20' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  <input type="radio" name="sensibilidade" value={s} defaultChecked={s === 'equilibrada'} className="sr-only" />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 cursor-pointer`}>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-cyan-500 text-cyan-500 focus:ring-cyan-500/30" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Gerar feedback automático para o agente</span>
            </label>
            <label className={`flex items-center gap-3 cursor-pointer`}>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-cyan-500 text-cyan-500 focus:ring-cyan-500/30" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sinalizar atendimentos críticos automaticamente</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <GlowButton variant="ghost" onClick={() => setShowNewModal(false)}>Cancelar</GlowButton>
            <GlowButton type="submit">Criar monitoria</GlowButton>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
