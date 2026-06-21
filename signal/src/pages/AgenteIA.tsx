import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Power, MessageSquare, FileText, ArrowRightLeft, CheckCircle,
  Plus, Trash2, Save, Zap, BarChart3,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { aiLogs, knowledgeBases } from '../data/mockData';
import toast from 'react-hot-toast';
import type { Channel } from '../data/mockData';

const channelLabels: Record<Channel, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  site: 'Chat do Site',
  telefone: 'Telefone',
};

const transferRules = [
  { id: 'r1', label: 'Cliente solicitar falar com humano', active: true },
  { id: 'r2', label: 'Sentimento negativo detectado', active: true },
  { id: 'r3', label: 'Assunto: reclamação formal', active: true },
  { id: 'r4', label: '3 respostas consecutivas sem resolução', active: false },
  { id: 'r5', label: 'Horário fora do expediente', active: false },
];

export const AgenteIA: React.FC = () => {
  const { isDark } = useTheme();
  const [agentActive, setAgentActive] = useState(true);
  const [agentName, setAgentName] = useState('Aria');
  const [personality, setPersonality] = useState('Amigável, objetiva e proativa. Sempre se apresenta pelo nome e busca resolver o problema do cliente na primeira interação. Usa linguagem clara e evita jargões técnicos.');
  const [rules, setRules] = useState(transferRules);
  const [channels, setChannels] = useState<Record<Channel, boolean>>({
    whatsapp: true, instagram: true, facebook: true, site: true, telefone: false,
  });

  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark ? 'bg-slate-800/60 border-slate-700/60 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400';

  const toggleChannel = (ch: Channel) => setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  const toggleRule = (id: string) => setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-5 h-full overflow-y-auto`}>
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Status card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 border ${cardBg} flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
          <div className={`p-3 rounded-2xl ${agentActive ? 'bg-violet-500/15 text-violet-400' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
            <Bot size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-base font-bold ${textPrimary}`}>{agentName}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${agentActive ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : isDark ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                {agentActive ? '● Ativo' : '○ Inativo'}
              </span>
            </div>
            <p className={`text-sm ${textMuted}`}>
              {agentActive ? '34 conversas sendo atendidas agora · Taxa de resolução autônoma: 64%' : 'Agente offline · Todas as conversas redirecionadas para agentes humanos'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center hidden sm:block">
              <p className={`text-2xl font-bold ${textPrimary}`}>2m 04s</p>
              <p className={`text-xs ${textMuted}`}>Tempo médio</p>
            </div>
            <div className="text-center hidden sm:block">
              <p className={`text-2xl font-bold text-violet-400`}>4.7</p>
              <p className={`text-xs ${textMuted}`}>Satisfação estimada</p>
            </div>
            <button
              onClick={() => { setAgentActive(v => !v); toast.success(agentActive ? 'Agente de IA desativado' : 'Agente de IA ativado!'); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                agentActive
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                  : 'bg-violet-500/15 text-violet-400 border border-violet-500/30 hover:bg-violet-500/25'
              }`}
            >
              <Power size={16} />{agentActive ? 'Desativar' : 'Ativar'}
            </button>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Resolução autônoma', value: '64%', sub: 'sem transferência', icon: <CheckCircle size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Conversas hoje', value: '89', sub: 'atendidas pelo agente', icon: <MessageSquare size={18} />, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Tempo médio', value: '2m 04s', sub: 'por atendimento', icon: <Zap size={18} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Satisfação estimada', value: '4.7/5', sub: 'baseado em contexto', icon: <BarChart3 size={18} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
              className={`rounded-2xl p-4 border ${cardBg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${textMuted}`}>{kpi.label}</span>
                <span className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>{kpi.icon}</span>
              </div>
              <p className={`text-xl font-bold ${textPrimary}`}>{kpi.value}</p>
              <p className={`text-xs mt-0.5 ${textMuted}`}>{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Agent config */}
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className={`rounded-2xl p-5 border ${cardBg} space-y-4`}>
            <h3 className={`text-sm font-semibold ${textPrimary} flex items-center gap-2`}>
              <Bot size={16} className="text-violet-400" /> Configuração do Agente
            </h3>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>Nome do agente</label>
              <input value={agentName} onChange={e => setAgentName(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500/40 transition-all ${inputBg}`} />
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>Personalidade e instruções</label>
              <textarea value={personality} onChange={e => setPersonality(e.target.value)} rows={4}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500/40 transition-all ${inputBg}`} />
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Canais ativos</label>
              <div className="space-y-2">
                {(Object.keys(channels) as Channel[]).map(ch => (
                  <label key={ch} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${channels[ch] ? 'bg-violet-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
                      onClick={() => toggleChannel(ch)}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${channels[ch] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className={`text-sm ${channels[ch] ? textPrimary : textMuted}`}>{channelLabels[ch]}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={() => toast.success('Configurações do agente salvas!')}
              className="w-full py-2.5 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              <Save size={15} /> Salvar configurações
            </button>
          </motion.div>

          <div className="space-y-5">
            {/* Transfer rules */}
            <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className={`rounded-2xl p-5 border ${cardBg}`}>
              <h3 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center gap-2`}>
                <ArrowRightLeft size={16} className="text-amber-400" /> Regras de transferência para humano
              </h3>
              <div className="space-y-2">
                {rules.map(rule => (
                  <div key={rule.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/40' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors flex-shrink-0 ${rule.active ? 'bg-amber-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
                      onClick={() => toggleRule(rule.id)}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${rule.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                    <span className={`text-sm flex-1 ${rule.active ? textPrimary : textMuted}`}>{rule.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Knowledge base */}
            <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className={`rounded-2xl p-5 border ${cardBg}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold ${textPrimary} flex items-center gap-2`}>
                  <FileText size={16} className="text-blue-400" /> Base de conhecimento
                </h3>
                <button onClick={() => toast('Upload em breve!', { icon: '📂' })}
                  className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  <Plus size={13} /> Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {knowledgeBases.map(kb => (
                  <div key={kb.id} className={`flex items-center gap-3 p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-100'}`}>
                    <div className={`p-1.5 rounded-lg ${kb.type === 'PDF' ? 'bg-red-500/15 text-red-400' : kb.type === 'XLSX' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>
                      <FileText size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${textPrimary}`}>{kb.name}</p>
                      <p className={`text-[10px] ${textMuted}`}>{kb.type} · {kb.size} · {kb.updated}</p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${kb.status === 'ativo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {kb.status}
                    </span>
                    <button onClick={() => toast.error('Documento removido')} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Execution log */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`rounded-2xl p-5 border ${cardBg}`}>
          <h3 className={`text-sm font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
            <Zap size={16} className="text-amber-400" /> Log de execuções recentes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs font-semibold uppercase tracking-wider ${textMuted} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className="text-left pb-3">Hora</th>
                  <th className="text-left pb-3">Cliente</th>
                  <th className="text-left pb-3">Canal</th>
                  <th className="text-left pb-3">Ação</th>
                  <th className="text-left pb-3">Ferramenta</th>
                  <th className="text-left pb-3">Transferido?</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                {aiLogs.map(log => (
                  <tr key={log.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                    <td className={`py-3 font-mono text-xs ${textMuted}`}>{log.time}</td>
                    <td className={`py-3 font-medium ${textPrimary}`}>{log.client}</td>
                    <td className={`py-3 capitalize ${textMuted} text-xs`}>{log.channel}</td>
                    <td className={`py-3 ${textPrimary} text-xs`}>{log.action}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        {log.tool}
                      </span>
                    </td>
                    <td className="py-3">
                      {log.transferred ? (
                        <span className="flex items-center gap-1 text-amber-400 text-xs font-medium"><ArrowRightLeft size={11} /> Sim</span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium"><CheckCircle size={11} /> Não</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
