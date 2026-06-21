import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Phone, Mail, MessageSquare, ChevronRight, Plus, Tag, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { contacts } from '../data/mockData';
import { ChannelBadge } from '../components/ui/ChannelBadge';
import toast from 'react-hot-toast';

export const Contatos: React.FC = () => {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const tableBg = isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm';

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const openDrawer = (contact: typeof contacts[0]) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
  };

  const historyItems = [
    { type: 'conversa', text: 'Dúvida sobre fatura', channel: 'whatsapp', date: '15 Jan 2025' },
    { type: 'conversa', text: 'Suporte técnico - Configuração', channel: 'site', date: '02 Jan 2025' },
    { type: 'disparo', text: 'Recebeu campanha "Janeiro 2025"', channel: 'whatsapp', date: '12 Jan 2025' },
    { type: 'conversa', text: 'Cancelamento revertido', channel: 'facebook', date: '18 Dez 2024' },
  ];

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-5 h-full overflow-y-auto relative`}>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-base font-semibold ${textPrimary}`}>Contatos</h2>
            <p className={`text-xs ${textMuted}`}>{contacts.length} contatos cadastrados</p>
          </div>
          <button
            onClick={() => toast.success('Novo contato em breve!')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all"
          >
            <Plus size={15} /> Novo contato
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail ou telefone..."
              className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${isDark ? 'bg-slate-900/60 border-slate-800/60 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`}
            />
          </div>
          <button onClick={() => toast('Filtros avançados em breve!', { icon: '🔧' })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-colors ${isDark ? 'border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 bg-slate-900/60' : 'border-slate-200 text-slate-500 hover:text-slate-900 bg-white'}`}>
            <Filter size={14} /> Filtros
          </button>
        </div>

        {/* Table */}
        <div className={`rounded-2xl border overflow-hidden ${tableBg}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs font-semibold uppercase tracking-wider ${textMuted} border-b ${isDark ? 'border-slate-800 bg-slate-800/30' : 'border-slate-100 bg-slate-50'}`}>
                  <th className="text-left px-4 py-3">Nome</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Telefone</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">E-mail</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Canal</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 hidden xl:table-cell">Última interação</th>
                  <th className="text-right px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                {filtered.map((contact, i) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => openDrawer(contact)}
                    className={`cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                          {contact.name.charAt(0)}
                        </div>
                        <span className={`font-medium ${textPrimary}`}>{contact.name}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 hidden sm:table-cell ${textMuted}`}>{contact.phone}</td>
                    <td className={`px-4 py-3 hidden md:table-cell ${textMuted} text-xs`}>{contact.email}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <ChannelBadge channel={contact.preferredChannel} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                          <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className={`px-4 py-3 hidden xl:table-cell text-xs ${textMuted}`}>{contact.lastInteraction}</td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight size={15} className={textMuted} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Search size={32} className={`${textMuted} mx-auto mb-2`} />
                <p className={`text-sm ${textMuted}`}>Nenhum contato encontrado para "{search}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedContact && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-40" />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 bottom-0 w-80 z-50 border-l overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              {/* Drawer header */}
              <div className={`flex items-center gap-3 p-4 border-b sticky top-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                  {selectedContact.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${textPrimary}`}>{selectedContact.name}</p>
                  <ChannelBadge channel={selectedContact.preferredChannel} />
                </div>
                <button onClick={() => setDrawerOpen(false)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'} transition-colors`}>
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Contact info */}
                <div className={`rounded-xl p-3 border space-y-2 ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className={textMuted} />
                    <span className={`text-sm ${textPrimary}`}>{selectedContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className={textMuted} />
                    <span className={`text-xs ${textPrimary}`}>{selectedContact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className={textMuted} />
                    <span className={`text-xs ${textMuted}`}>Última interação: {selectedContact.lastInteraction}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={13} className={textMuted} />
                    <span className={`text-xs ${textMuted}`}>{selectedContact.conversations} conversas no total</span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag size={12} className={textMuted} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContact.tags.map(tag => (
                      <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {tag}
                      </span>
                    ))}
                    <button onClick={() => toast('Gerenciar tags em breve!', { icon: '🏷️' })} className="text-xs px-2.5 py-1 rounded-full font-medium border border-dashed text-amber-400 border-amber-500/30 hover:bg-amber-500/10 transition-colors">
                      + Tag
                    </button>
                  </div>
                </div>

                {/* History */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Histórico completo</p>
                  <div className="space-y-2">
                    {historyItems.map((item, i) => (
                      <div key={i} className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${isDark ? 'bg-slate-800/40 border-slate-700/30 hover:border-slate-600' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-semibold uppercase ${item.type === 'conversa' ? 'text-blue-400' : 'text-amber-400'}`}>{item.type}</span>
                          <span className={`text-[10px] ${textMuted}`}>{item.date}</span>
                        </div>
                        <p className={`text-xs ${textPrimary}`}>{item.text}</p>
                        <span className={`text-[10px] capitalize ${textMuted}`}>{item.channel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button onClick={() => toast.success('Iniciando conversa com ' + selectedContact.name)}
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                    <MessageSquare size={15} /> Nova conversa
                  </button>
                  <button onClick={() => toast.success('Ligando para ' + selectedContact.phone)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                    <Phone size={15} /> Ligar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
