import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Settings, MessageSquare, Phone, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const channels = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'API oficial Meta · Número verificado',
    connected: true,
    todayVolume: 189,
    icon: '💬',
    color: 'from-green-500/20 to-green-600/10 border-green-500/30',
    iconBg: 'bg-green-500/15 text-green-400',
    number: '+55 11 3000-1234',
    account: 'Signal Comunicação',
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    description: 'Meta Business · @signal_oficial',
    connected: true,
    todayVolume: 87,
    icon: '📸',
    color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    iconBg: 'bg-pink-500/15 text-pink-400',
    number: '@signal_oficial',
    account: 'Signal Comunicação',
  },
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    description: 'Meta Business · Página verificada',
    connected: true,
    todayVolume: 54,
    icon: '👥',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    iconBg: 'bg-blue-500/15 text-blue-400',
    number: 'Signal Comunicação',
    account: 'signal.comunicacao',
  },
  {
    id: 'site',
    name: 'Chat do Site',
    description: 'Widget ativo · script instalado',
    connected: true,
    todayVolume: 43,
    icon: '🌐',
    color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
    iconBg: 'bg-slate-500/15 text-slate-400',
    number: 'signal.com.br',
    account: 'Widget v2.4.1',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Não configurado',
    connected: false,
    todayVolume: 0,
    icon: '✈️',
    color: 'from-sky-500/10 to-sky-600/5 border-sky-500/20',
    iconBg: 'bg-sky-500/10 text-sky-500',
    number: '-',
    account: '-',
  },
  {
    id: 'email',
    name: 'E-mail',
    description: 'Não configurado',
    connected: false,
    todayVolume: 0,
    icon: '📧',
    color: 'from-violet-500/10 to-violet-600/5 border-violet-500/20',
    iconBg: 'bg-violet-500/10 text-violet-500',
    number: '-',
    account: '-',
  },
];

export const Canais: React.FC = () => {
  const { isDark } = useTheme();
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDark ? 'bg-slate-900/60' : 'bg-white';

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-5 h-full overflow-y-auto`}>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Canais conectados', value: '4', icon: <CheckCircle size={16} />, color: 'text-emerald-400 bg-emerald-500/10' },
            { label: 'Mensagens hoje', value: '373', icon: <MessageSquare size={16} />, color: 'text-amber-400 bg-amber-500/10' },
            { label: 'Chamadas ativas', value: '3', icon: <Phone size={16} />, color: 'text-blue-400 bg-blue-500/10' },
            { label: 'Canais pendentes', value: '2', icon: <XCircle size={16} />, color: 'text-slate-400 bg-slate-500/10' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${textMuted}`}>{item.label}</span>
                <span className={`p-1.5 rounded-lg ${item.color}`}>{item.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${textPrimary}`}>{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Channel cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel, i) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`rounded-2xl border p-5 ${cardBg} bg-gradient-to-br ${channel.color} relative overflow-hidden group`}
            >
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5 text-6xl flex items-center justify-center">
                {channel.icon}
              </div>

              {/* Status */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl text-2xl ${channel.iconBg}`}>
                  {channel.icon}
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  channel.connected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isDark ? 'bg-slate-800/80 text-slate-500 border border-slate-700/50' : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {channel.connected ? <><CheckCircle size={10} /> Conectado</> : <><XCircle size={10} /> Desconectado</>}
                </span>
              </div>

              <h3 className={`text-sm font-bold ${textPrimary} mb-0.5`}>{channel.name}</h3>
              <p className={`text-xs ${textMuted} mb-3`}>{channel.description}</p>

              {channel.connected && (
                <div className={`rounded-xl p-3 mb-3 ${isDark ? 'bg-slate-800/40' : 'bg-white/60'} border ${isDark ? 'border-slate-700/30' : 'border-slate-200/60'}`}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={textMuted}>Conta</span>
                    <span className={`font-medium ${textPrimary}`}>{channel.account}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={textMuted}>Mensagens hoje</span>
                    <span className="font-bold text-amber-400">{channel.todayVolume}</span>
                  </div>
                </div>
              )}

              {!channel.connected && (
                <div className={`rounded-xl p-3 mb-3 ${isDark ? 'bg-slate-800/30 border border-slate-700/20' : 'bg-slate-50 border border-slate-200'} text-center`}>
                  <p className={`text-xs ${textMuted}`}>Canal não configurado</p>
                  <p className={`text-[10px] ${textMuted} mt-0.5`}>Clique em "Configurar" para conectar</p>
                </div>
              )}

              <button
                onClick={() => toast.success(`Abrindo configurações de ${channel.name}...`)}
                className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  channel.connected
                    ? isDark ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700/50' : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                }`}
              >
                <Settings size={13} />
                {channel.connected ? 'Configurar' : 'Conectar canal'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Integration tips */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center gap-2`}>
            <Send size={15} className="text-amber-400" /> Dicas de integração
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'WhatsApp API Oficial', desc: 'Use a API Business para envio de templates aprovados pela Meta e maior volume de mensagens.', icon: '🟢' },
              { title: 'Chat no Site', desc: 'Instale o snippet JavaScript no <head> do seu site para ativar o widget de atendimento em tempo real.', icon: '🌐' },
              { title: 'E-mail via SMTP', desc: 'Conecte seu servidor SMTP ou use o SendGrid para receber e responder e-mails diretamente na plataforma.', icon: '📬' },
            ].map(tip => (
              <div key={tip.title} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/40 border border-slate-700/30' : 'bg-slate-50 border border-slate-100'}`}>
                <div className="text-xl mb-2">{tip.icon}</div>
                <p className={`text-xs font-semibold ${textPrimary} mb-1`}>{tip.title}</p>
                <p className={`text-xs ${textMuted} leading-relaxed`}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
