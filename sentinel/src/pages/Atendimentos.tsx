import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { GlassCard, StatusBadge, RiskBadge, ScoreBar, PageWrapper, GlowButton } from '../components/SharedComponents';
import { atendimentos } from '../data/mockData';
import { Search, Eye, ArrowLeft, User, Clock, MessageSquare, Brain, 
  ThumbsUp, ThumbsDown, AlertTriangle, FileText, Download, CheckCircle, RotateCcw } from 'lucide-react';
import type { Canal, Risco } from '../types';

export default function Atendimentos() {
  const { theme, navigate, selectedAtendimento, setSelectedAtendimento, addToast } = useApp();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCanal, setFilterCanal] = useState<Canal | 'Todos'>('Todos');
  const [filterRisco, setFilterRisco] = useState<Risco | 'Todos'>('Todos');

  const filtered = atendimentos.filter(a => {
    const matchSearch = searchTerm === '' || a.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || a.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) || a.agente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCanal = filterCanal === 'Todos' || a.canal === filterCanal;
    const matchRisco = filterRisco === 'Todos' || a.risco === filterRisco;
    return matchSearch && matchCanal && matchRisco;
  });

  // Detail View
  if (selectedAtendimento) {
    const at = selectedAtendimento;
    const sentimentoColors: Record<string, string> = {
      positivo: isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
      negativo: isDark ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-red-700 bg-red-50 border-red-200',
      neutro: isDark ? 'text-slate-400 bg-slate-500/10 border-slate-500/20' : 'text-slate-600 bg-slate-100 border-slate-200',
      misto: isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-amber-700 bg-amber-50 border-amber-200',
    };

    return (
      <PageWrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedAtendimento(null)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{at.protocolo}</h2>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{at.cliente} • {at.canal} • {at.data}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <GlowButton variant="secondary" size="sm" onClick={() => addToast('Relatório exportado (simulado)', 'success')}>
                <Download size={14} /> Exportar
              </GlowButton>
              <GlowButton variant="secondary" size="sm" onClick={() => addToast('Enviado para revisão manual', 'info')}>
                <RotateCcw size={14} /> Revisar manualmente
              </GlowButton>
              <GlowButton size="sm" onClick={() => addToast('Monitoria aprovada com sucesso', 'success')}>
                <CheckCircle size={14} /> Aprovar monitoria
              </GlowButton>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Dados do Atendimento */}
              <GlassCard className="p-5">
                <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dados do Atendimento</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Cliente', value: at.cliente, icon: <User size={14} /> },
                    { label: 'Agente', value: at.agente, icon: <User size={14} /> },
                    { label: 'Canal', value: at.canal, icon: <MessageSquare size={14} /> },
                    { label: 'Setor', value: at.setor, icon: <FileText size={14} /> },
                    { label: 'Data', value: at.data, icon: <Clock size={14} /> },
                    { label: 'Duração', value: at.duracao, icon: <Clock size={14} /> },
                    { label: 'Status', value: at.statusAnalise, icon: <CheckCircle size={14} /> },
                    { label: 'Score IA', value: `${at.scoreIA}/100`, icon: <Brain size={14} /> },
                  ].map(item => (
                    <div key={item.label}>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</p>
                      <p className={`text-sm font-medium mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Timeline */}
              {at.timeline && at.timeline.length > 0 && (
                <GlassCard className="p-5">
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Timeline da Conversa</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {at.timeline.map(msg => (
                      <div key={msg.id} className={`flex gap-3 ${msg.remetente === 'cliente' ? '' : msg.remetente === 'agente' ? 'flex-row-reverse' : 'justify-center'}`}>
                        {msg.remetente !== 'sistema' && (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                            ${msg.remetente === 'cliente' 
                              ? isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'
                              : isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                            }`}>
                            {msg.remetente === 'cliente' ? 'CL' : 'AG'}
                          </div>
                        )}
                        <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm
                          ${msg.remetente === 'sistema' 
                            ? isDark ? 'bg-white/[0.03] text-slate-500 text-center text-xs italic w-full' : 'bg-slate-100 text-slate-500 text-center text-xs italic w-full'
                            : msg.remetente === 'cliente'
                              ? isDark ? 'bg-violet-500/10 text-slate-300 border border-violet-500/10' : 'bg-violet-50 text-slate-700 border border-violet-100'
                              : isDark ? 'bg-cyan-500/10 text-slate-300 border border-cyan-500/10' : 'bg-cyan-50 text-slate-700 border border-cyan-100'
                          }`}>
                          <p>{msg.mensagem}</p>
                          <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{msg.horario}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Resumo IA */}
              {at.resumoIA && (
                <GlassCard className="p-5" glow>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={16} className="text-cyan-500" />
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Resumo da IA</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{at.resumoIA}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {at.sentimento && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${sentimentoColors[at.sentimento]}`}>
                        Sentimento: {at.sentimento}
                      </span>
                    )}
                    {at.intencao && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-200'}`}>
                        Intenção: {at.intencao}
                      </span>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* Pontos Positivos e Melhoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {at.pontosPositivos && (
                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp size={16} className="text-emerald-500" />
                      <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pontos Positivos</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {at.pontosPositivos.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                )}
                {at.pontosMelhoria && (
                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsDown size={16} className="text-amber-500" />
                      <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pontos de Melhoria</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {at.pontosMelhoria.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                )}
              </div>

              {/* Problemas */}
              {at.problemas && at.problemas.length > 0 && (
                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-red-500" />
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Problemas Encontrados</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {at.problemas.map((p, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Score Geral */}
              <GlassCard className="p-5" glow>
                <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Score Geral</h3>
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4
                    ${at.scoreIA >= 80 ? 'border-emerald-500' : at.scoreIA >= 60 ? 'border-amber-500' : 'border-red-500'}`}>
                    <span className={`text-3xl font-bold ${at.scoreIA >= 80 ? 'text-emerald-400' : at.scoreIA >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {at.scoreIA}
                    </span>
                  </div>
                </div>
                <RiskBadge risk={at.risco} />
              </GlassCard>

              {/* Scores por Critério */}
              {at.scoresCriterios && (
                <GlassCard className="p-5">
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Scores por Critério</h3>
                  <div className="space-y-3">
                    {at.scoresCriterios.map((sc, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{sc.criterio}</span>
                          <span className={`text-xs font-semibold ${sc.score >= 80 ? 'text-emerald-400' : sc.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                            {sc.score}
                          </span>
                        </div>
                        <ScoreBar score={sc.score} size="sm" />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Sugestão de Feedback */}
              {at.sugestaoFeedback && (
                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={16} className="text-violet-500" />
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sugestão de Feedback</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{at.sugestaoFeedback}</p>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // List View
  return (
    <PageWrapper>
      <div className="space-y-4">
        {/* Filters */}
        <GlassCard className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text" placeholder="Buscar por protocolo, cliente ou agente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all
                  ${isDark ? 'bg-white/[0.04] border border-white/[0.06] text-white placeholder-slate-500 focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-300'}`}
              />
            </div>
            <div className="flex gap-2">
              <select value={filterCanal} onChange={e => setFilterCanal(e.target.value as Canal | 'Todos')}
                className={`px-3 py-2 rounded-lg text-sm outline-none
                  ${isDark ? 'bg-white/[0.04] border border-white/[0.06] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option value="Todos">Todos os canais</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telefone">Telefone</option>
                <option value="Chat">Chat</option>
                <option value="E-mail">E-mail</option>
              </select>
              <select value={filterRisco} onChange={e => setFilterRisco(e.target.value as Risco | 'Todos')}
                className={`px-3 py-2 rounded-lg text-sm outline-none
                  ${isDark ? 'bg-white/[0.04] border border-white/[0.06] text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                <option value="Todos">Todos os riscos</option>
                <option value="crítico">Crítico</option>
                <option value="alto">Alto</option>
                <option value="médio">Médio</option>
                <option value="baixo">Baixo</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
                  {['Protocolo', 'Cliente', 'Canal', 'Agente', 'Setor', 'Data', 'Duração', 'Status', 'Score', 'Risco', ''].map(h => (
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(at => (
                  <tr key={at.id} className={`border-b transition-colors ${isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className={`px-4 py-3 text-sm font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{at.protocolo}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{at.cliente}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{at.canal}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{at.agente}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{at.setor}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{at.data}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{at.duracao}</td>
                    <td className="px-4 py-3"><StatusBadge status={at.statusAnalise} /></td>
                    <td className={`px-4 py-3 text-sm font-bold ${at.scoreIA >= 80 ? 'text-emerald-400' : at.scoreIA >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {at.scoreIA || '—'}
                    </td>
                    <td className="px-4 py-3"><RiskBadge risk={at.risco} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSelectedAtendimento(at); navigate('atendimento-detail'); }}
                        className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-cyan-400 hover:bg-cyan-500/10' : 'text-cyan-600 hover:bg-cyan-50'}`}
                        title="Ver análise"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className={`text-center py-12 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Nenhum atendimento encontrado com os filtros selecionados.
            </div>
          )}
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
