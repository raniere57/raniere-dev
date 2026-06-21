import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, GitBranch, Clock, Bell, Save, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'geral', label: 'Geral', icon: <Settings size={15} /> },
  { id: 'equipe', label: 'Equipe', icon: <Users size={15} /> },
  { id: 'filas', label: 'Filas', icon: <GitBranch size={15} /> },
  { id: 'horario', label: 'Horário', icon: <Clock size={15} /> },
  { id: 'notificacoes', label: 'Notificações', icon: <Bell size={15} /> },
];

export const Configuracoes: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('geral');

  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark ? 'bg-slate-800/60 border-slate-700/60 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400';

  const handleSave = () => toast.success('Configurações salvas com sucesso!');

  const Input = ({ label, defaultValue, type = 'text', placeholder = '' }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) => (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`} />
    </div>
  );

  const Toggle = ({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) => {
    const [on, setOn] = useState(defaultOn);
    return (
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm font-medium ${textPrimary}`}>{label}</p>
          {description && <p className={`text-xs mt-0.5 ${textMuted}`}>{description}</p>}
        </div>
        <div className={`relative w-10 h-5 rounded-full cursor-pointer flex-shrink-0 transition-colors ${on ? 'bg-amber-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`} onClick={() => setOn(v => !v)}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </div>
    );
  };

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-5 h-full overflow-y-auto`}>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200'}`}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center ${
                activeTab === tab.id ? 'bg-amber-500/20 text-amber-400' : `${textMuted} hover:${isDark ? 'text-white' : 'text-slate-900'}`
              }`}>
              {tab.icon}
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {activeTab === 'geral' && (
            <>
              <div className={`rounded-2xl p-5 border ${cardBg} space-y-4`}>
                <h3 className={`text-sm font-bold ${textPrimary}`}>Informações da empresa</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Nome da empresa" defaultValue="Signal Comunicação" />
                  <Input label="CNPJ" defaultValue="12.345.678/0001-90" />
                  <Input label="E-mail de suporte" defaultValue="suporte@signal.com.br" type="email" />
                  <Input label="Telefone" defaultValue="+55 11 3000-1234" />
                </div>
                <Input label="Site" defaultValue="https://signal.com.br" />
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>Fuso horário</label>
                  <select className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${inputBg}`}>
                    <option>America/Sao_Paulo (UTC-3)</option>
                    <option>America/Manaus (UTC-4)</option>
                    <option>America/Belem (UTC-3)</option>
                  </select>
                </div>
              </div>
              <div className={`rounded-2xl p-5 border ${cardBg} space-y-4`}>
                <h3 className={`text-sm font-bold ${textPrimary}`}>Preferências</h3>
                <Toggle label="Tradução automática" description="Detectar idioma do cliente e traduzir automaticamente" defaultOn />
                <Toggle label="Arquivamento automático" description="Arquivar conversas resolvidas após 7 dias" defaultOn />
                <Toggle label="Mensagem de boas-vindas" description="Enviar mensagem automática ao iniciar nova conversa" defaultOn />
                <Toggle label="LGPD: solicitar consentimento" description="Solicitar aceite antes de coletar dados do cliente" />
              </div>
            </>
          )}

          {activeTab === 'equipe' && (
            <div className={`rounded-2xl p-5 border ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${textPrimary}`}>Agentes humanos</h3>
                <button onClick={() => toast.success('Convite enviado!')} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors font-medium">
                  <Plus size={13} /> Convidar agente
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Raniere', email: 'raniere@signal.com.br', role: 'Administrador', status: 'disponível', calls: 89 },
                  { name: 'Fernanda', email: 'fernanda@signal.com.br', role: 'Agente', status: 'em chamada', calls: 67 },
                  { name: 'Lucas', email: 'lucas@signal.com.br', role: 'Agente', status: 'em chamada', calls: 54 },
                ].map(agent => (
                  <div key={agent.name} className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-100'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isDark ? 'bg-slate-700 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                      {agent.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${textPrimary}`}>{agent.name}</p>
                      <p className={`text-xs ${textMuted}`}>{agent.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${agent.role === 'Administrador' ? 'bg-violet-500/20 text-violet-400' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>{agent.role}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${agent.status === 'disponível' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{agent.status}</span>
                    <button onClick={() => toast('Editando agente...', { icon: '✏️' })} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-500 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'} transition-colors`}>
                      <Settings size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'filas' && (
            <div className={`rounded-2xl p-5 border ${cardBg} space-y-4`}>
              <h3 className={`text-sm font-bold ${textPrimary}`}>Configuração de filas</h3>
              <div className="space-y-3">
                {[
                  { name: 'Suporte Técnico', agents: 2, sla: 5, priority: 'alta' },
                  { name: 'Comercial', agents: 2, sla: 10, priority: 'normal' },
                  { name: 'Financeiro', agents: 1, sla: 15, priority: 'normal' },
                  { name: 'Cancelamentos', agents: 1, sla: 5, priority: 'alta' },
                ].map(queue => (
                  <div key={queue.name} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-semibold ${textPrimary}`}>{queue.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${queue.priority === 'alta' ? 'bg-red-500/20 text-red-400' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>{queue.priority}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs ${textMuted} mb-1`}>Agentes</label>
                        <input type="number" defaultValue={queue.agents} className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-all ${inputBg}`} />
                      </div>
                      <div>
                        <label className={`block text-xs ${textMuted} mb-1`}>SLA (min)</label>
                        <input type="number" defaultValue={queue.sla} className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-all ${inputBg}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => toast.success('Novas filas em breve!')} className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium">
                <Plus size={13} /> Adicionar fila
              </button>
            </div>
          )}

          {activeTab === 'horario' && (
            <div className={`rounded-2xl p-5 border ${cardBg} space-y-4`}>
              <h3 className={`text-sm font-bold ${textPrimary}`}>Horário de atendimento</h3>
              <div className="space-y-2">
                {[
                  { day: 'Segunda-feira', start: '08:00', end: '18:00', active: true },
                  { day: 'Terça-feira', start: '08:00', end: '18:00', active: true },
                  { day: 'Quarta-feira', start: '08:00', end: '18:00', active: true },
                  { day: 'Quinta-feira', start: '08:00', end: '18:00', active: true },
                  { day: 'Sexta-feira', start: '08:00', end: '17:00', active: true },
                  { day: 'Sábado', start: '09:00', end: '13:00', active: true },
                  { day: 'Domingo', start: '-', end: '-', active: false },
                ].map(day => (
                  <div key={day.day} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/40' : 'bg-slate-50 border border-slate-100'}`}>
                    <span className={`text-sm w-32 flex-shrink-0 ${day.active ? textPrimary : textMuted}`}>{day.day}</span>
                    {day.active ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input type="time" defaultValue={day.start} className={`px-2 py-1.5 rounded-lg border text-xs focus:outline-none transition-all ${inputBg}`} />
                        <span className={textMuted}>–</span>
                        <input type="time" defaultValue={day.end} className={`px-2 py-1.5 rounded-lg border text-xs focus:outline-none transition-all ${inputBg}`} />
                      </div>
                    ) : (
                      <span className={`text-xs ${textMuted} flex-1`}>Fechado</span>
                    )}
                    <div className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors ${day.active ? 'bg-amber-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${day.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>Mensagem fora do expediente</label>
                <textarea defaultValue="Nosso atendimento está encerrado agora. Envie sua mensagem e retornaremos no próximo horário comercial!" rows={3}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`} />
              </div>
            </div>
          )}

          {activeTab === 'notificacoes' && (
            <div className={`rounded-2xl p-5 border ${cardBg} space-y-5`}>
              <h3 className={`text-sm font-bold ${textPrimary}`}>Notificações e alertas</h3>
              <div className="space-y-4">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted} mb-3`}>Alertas operacionais</p>
                  <div className="space-y-3">
                    <Toggle label="SLA prestes a vencer" description="Notificar 2 minutos antes do SLA estourar" defaultOn />
                    <Toggle label="Nova conversa não atribuída" description="Alertar quando nova conversa não tiver agente" defaultOn />
                    <Toggle label="Agente de IA transferiu" description="Notificar quando IA transferir para humano" defaultOn />
                    <Toggle label="Fila crítica (5+ em espera)" description="Alertar quando fila telefônica estiver sobrecarregada" defaultOn />
                  </div>
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted} mb-3`}>Relatórios automáticos</p>
                  <div className="space-y-3">
                    <Toggle label="Relatório diário por e-mail" description="Resumo de atendimentos às 18h" defaultOn />
                    <Toggle label="Relatório semanal" description="Análise comparativa toda segunda-feira" />
                    <Toggle label="Alertas de anomalia" description="Detectar variações bruscas no volume" defaultOn />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>E-mail para relatórios</label>
                  <input type="email" defaultValue="raniere@signal.com.br"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`} />
                </div>
              </div>
            </div>
          )}

          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20">
            <Save size={16} /> Salvar configurações
          </button>
        </motion.div>
      </div>
    </div>
  );
};
