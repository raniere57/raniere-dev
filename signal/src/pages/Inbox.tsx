import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Send, FileText, ArrowRightLeft, XCircle, Bot, User, Phone, Mail, Tag, History, FileEdit, ChevronRight,
} from 'lucide-react';
import { ChannelBadge } from '../components/ui/ChannelBadge';
import { ChannelIcon } from '../components/ui/ChannelIcon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useTheme } from '../contexts/ThemeContext';
import { conversations, type ConversationStatus, type Channel } from '../data/mockData';
import toast from 'react-hot-toast';

const channelFilters: { value: 'todos' | Channel; label: string; icon?: Channel }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
  { value: 'instagram', label: 'Instagram', icon: 'instagram' },
  { value: 'facebook', label: 'Facebook', icon: 'facebook' },
  { value: 'site', label: 'Site', icon: 'site' },
  { value: 'telefone', label: 'Telefone', icon: 'telefone' },
];

const statusFilters: { value: 'todos' | ConversationStatus; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'aberta', label: 'Abertas' },
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'resolvida', label: 'Resolvidas' },
];

export const Inbox: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedId, setSelectedId] = useState<string>('c1');
  const [channelFilter, setChannelFilter] = useState<'todos' | Channel>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | ConversationStatus>('todos');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [panelTab, setPanelTab] = useState<'info' | 'historico' | 'notas'>('info');
  const [localConvs, setLocalConvs] = useState(conversations);

  const filtered = localConvs.filter(c => {
    if (channelFilter !== 'todos' && c.channel !== channelFilter) return false;
    if (statusFilter !== 'todos' && c.status !== statusFilter) return false;
    if (search && !c.clientName.toLowerCase().includes(search.toLowerCase()) && !c.lastMessage.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = localConvs.find(c => c.id === selectedId) || localConvs[0];

  const handleSend = () => {
    if (!reply.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      sender: 'agente' as const,
      text: reply.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      agentName: 'Raniere',
    };
    setLocalConvs(prev => prev.map(c =>
      c.id === selected.id
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: reply.trim(), lastTime: newMsg.time }
        : c
    ));
    setReply('');
    toast.success('Mensagem enviada!');
  };

  const handleEncerrar = () => {
    setLocalConvs(prev => prev.map(c => c.id === selected.id ? { ...c, status: 'resolvida' } : c));
    toast.success('Conversa encerrada com sucesso');
  };

  const handleTransferir = () => {
    toast('Transferindo para próximo agente disponível...', { icon: '↩️' });
  };

  const bg = isDark ? 'bg-slate-950' : 'bg-slate-50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark ? 'bg-slate-800/60 border-slate-700/50 text-white placeholder-slate-500' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div className={`flex h-full overflow-hidden ${bg}`}>
      {/* Column 1: conversation list */}
      <div className={`w-72 flex-shrink-0 flex flex-col border-r ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
        {/* Filters */}
        <div className={`p-3 border-b space-y-2 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
          <div className="relative">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`}
            />
          </div>
          {/* Channel filter */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {channelFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setChannelFilter(f.value)}
                className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-lg transition-colors font-medium inline-flex items-center gap-1.5 ${
                  channelFilter === f.value
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                {f.icon && <ChannelIcon channel={f.icon} size={12} />}
                {f.label}
              </button>
            ))}
          </div>
          {/* Status filter */}
          <div className="flex gap-1">
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`flex-1 text-xs py-1 rounded-lg transition-colors font-medium ${
                  statusFilter === f.value
                    ? 'bg-slate-700/60 text-white'
                    : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-center px-4">
              <Filter size={24} className={`${textMuted} mb-2`} />
              <p className={`text-xs ${textMuted}`}>Nenhuma conversa encontrada</p>
            </div>
          )}
          {filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`w-full text-left px-3 py-3 border-b transition-all ${
                selectedId === conv.id
                  ? isDark ? 'bg-amber-500/8 border-amber-500/20' : 'bg-amber-50 border-amber-100'
                  : isDark ? 'hover:bg-slate-800/40 border-slate-800/40' : 'hover:bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  selectedId === conv.id ? 'bg-amber-500/20 text-amber-400' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  {conv.clientName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className={`text-sm font-medium truncate ${textPrimary}`}>{conv.clientName}</span>
                    <span className={`text-[10px] flex-shrink-0 ${textMuted}`}>{conv.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs truncate ${textMuted}`}>{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ChannelBadge channel={conv.channel} showLabel={false} />
                    <StatusBadge status={conv.status} />
                    {conv.slaBreached && (
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-bold">SLA!</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: chat thread */}
      <div className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <>
            {/* Chat header */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b flex-shrink-0 ${isDark ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                {selected.clientName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${textPrimary}`}>{selected.clientName}</span>
                  <ChannelBadge channel={selected.channel} />
                  <StatusBadge status={selected.status} />
                </div>
                <p className={`text-xs ${textMuted}`}>Atribuído: {selected.assignedAgent}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={handleTransferir} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors font-medium">
                  <ArrowRightLeft size={13} /> Transferir
                </button>
                <button onClick={handleEncerrar} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-colors font-medium">
                  <XCircle size={13} /> Encerrar
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {selected.messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'cliente' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[70%] ${msg.sender === 'cliente' ? '' : ''}`}>
                      {msg.sender !== 'cliente' && (
                        <div className={`flex items-center gap-1.5 mb-1 justify-end`}>
                          {msg.sender === 'ia' && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full font-semibold">
                              <Bot size={10} /> IA
                            </span>
                          )}
                          {msg.sender === 'agente' && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                              <User size={10} /> {msg.agentName}
                            </span>
                          )}
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.sender === 'cliente'
                          ? isDark ? 'bg-slate-800 text-slate-200 rounded-tl-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                          : msg.sender === 'ia'
                          ? 'bg-violet-500/15 text-violet-200 border border-violet-500/20 rounded-tr-sm'
                          : 'bg-amber-500/15 text-amber-200 border border-amber-500/20 rounded-tr-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[10px] mt-1 ${textMuted} ${msg.sender === 'cliente' ? 'text-left' : 'text-right'}`}>{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Reply input */}
            <div className={`p-3 border-t flex-shrink-0 ${isDark ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'}`}>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Digite sua resposta... (Enter para enviar)"
                    rows={2}
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <button onClick={handleSend} className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors">
                    <Send size={16} />
                  </button>
                  <button onClick={() => toast('Templates em breve!', { icon: '📋' })} className={`p-2.5 rounded-xl border transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'}`}>
                    <FileText size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className={textMuted}>Selecione uma conversa</p>
          </div>
        )}
      </div>

      {/* Column 3: client panel */}
      {selected && (
        <div className={`w-64 flex-shrink-0 flex flex-col border-l overflow-y-auto ${isDark ? 'border-slate-800/60 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
          {/* Tabs */}
          <div className={`flex border-b ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
            {[
              { id: 'info' as const, label: 'Info', icon: <User size={13} /> },
              { id: 'historico' as const, label: 'Histórico', icon: <History size={13} /> },
              { id: 'notas' as const, label: 'Notas', icon: <FileEdit size={13} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPanelTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  panelTab === tab.id
                    ? 'border-amber-400 text-amber-400'
                    : `border-transparent ${textMuted} hover:${isDark ? 'text-slate-300' : 'text-slate-700'}`
                }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4 flex-1">
            {panelTab === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                    {selected.clientName.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary}`}>{selected.clientName}</p>
                    <p className={`text-xs ${textMuted}`}>Cliente</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className={textMuted} />
                    <span className={`text-xs ${textPrimary}`}>{selected.clientPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className={textMuted} />
                    <span className={`text-xs ${textPrimary} truncate`}>{selected.clientEmail}</span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Tag size={12} className={textMuted} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.clientTags.map(tag => (
                      <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className={`rounded-xl p-3 border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${textMuted}`}>Conversas anteriores</span>
                    <span className={`text-sm font-bold ${textPrimary}`}>{selected.previousConversations}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${textMuted}`}>Canal preferido</span>
                    <ChannelBadge channel={selected.channel} showLabel={false} />
                  </div>
                </div>
              </motion.div>
            )}

            {panelTab === 'historico' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted} mb-3`}>Conversas anteriores</p>
                {selected.previousConversations > 0 ? (
                  Array.from({ length: Math.min(selected.previousConversations, 4) }).map((_, i) => (
                    <div key={i} className={`p-3 rounded-xl border cursor-pointer hover:scale-[1.01] transition-transform ${isDark ? 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-semibold ${textMuted}`}>{`${i + 1}ª conversa`}</span>
                        <ChevronRight size={12} className={textMuted} />
                      </div>
                      <p className={`text-xs ${textPrimary}`}>{['Dúvida sobre fatura', 'Suporte técnico', 'Cancelamento revertido', 'Atualização de cadastro', 'Upgrade de plano', 'NF-e solicitada'][i % 6]}</p>
                      <p className={`text-[10px] mt-1 ${textMuted}`}>{`há ${(i + 1) * 14} dias`}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <History size={24} className={`${textMuted} mx-auto mb-2`} />
                    <p className={`text-xs ${textMuted}`}>Primeiro contato</p>
                  </div>
                )}
              </motion.div>
            )}

            {panelTab === 'notas' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>Notas internas</p>
                <textarea
                  defaultValue={selected.notes}
                  placeholder="Adicionar nota interna..."
                  rows={5}
                  className={`w-full px-3 py-2.5 text-xs rounded-xl border resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`}
                />
                <button
                  onClick={() => toast.success('Nota salva!')}
                  className="w-full py-2 text-xs font-semibold rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                >
                  Salvar nota
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
