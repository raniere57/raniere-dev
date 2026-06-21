import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, PhoneOff, PhoneIncoming, PhoneMissed, PhoneOutgoing,
  Mic, MicOff, Pause, Play, Volume2, Clock, Users, CheckCircle, XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { callHistory, agentQueue, agents } from '../data/mockData';
import toast from 'react-hot-toast';

export const Telefonia: React.FC = () => {
  const { isDark } = useTheme();
  const [dialNumber, setDialNumber] = useState('');
  const [callActive, setCallActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [onHold, setOnHold] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callActive) {
      interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleDial = (digit: string) => setDialNumber(d => d + digit);
  const handleCall = () => {
    if (!dialNumber && !callActive) return toast.error('Digite um número');
    if (callActive) {
      setCallActive(false);
      setMuted(false);
      setOnHold(false);
      toast.success('Chamada encerrada');
    } else {
      setCallActive(true);
      toast.success(`Chamando ${dialNumber || '+55 62 94321-0987'}...`);
    }
  };

  const bg = isDark ? 'bg-slate-950' : 'bg-slate-50';
  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  const dialPad = ['1','2','3','4','5','6','7','8','9','*','0','#'];
  const subDigits: Record<string, string> = { '2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ','0':'+','1':'','*':'','#':'' };

  return (
    <div className={`${bg} p-5 h-full overflow-y-auto`}>
      <div className="max-w-6xl mx-auto space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Atendidas hoje', value: '47', icon: <CheckCircle size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Em espera', value: '3', icon: <Clock size={18} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Tempo médio', value: '4m 32s', icon: <Clock size={18} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Abandonadas', value: '6', icon: <XCircle size={18} />, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Agentes ativos', value: '3', icon: <Users size={18} />, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`rounded-2xl p-4 border ${cardBg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${textMuted}`}>{kpi.label}</span>
                <span className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>{kpi.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${textPrimary}`}>{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Softphone */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 border ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
              <Phone size={16} className="text-amber-400" /> Softphone
            </h3>

            {/* Display */}
            <div className={`rounded-xl p-4 mb-4 text-center border ${isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-100 border-slate-200'}`}>
              {callActive ? (
                <div>
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1 animate-pulse">Em chamada</p>
                  <p className={`text-xl font-mono font-bold ${textPrimary}`}>{dialNumber || '+55 62 94321-0987'}</p>
                  <p className="text-emerald-400 text-2xl font-mono font-bold mt-1">{formatTime(callDuration)}</p>
                </div>
              ) : (
                <div>
                  <p className={`text-xl font-mono font-bold tracking-widest ${textPrimary} min-h-[28px]`}>
                    {dialNumber || <span className={`text-base ${textMuted}`}>Digite o número</span>}
                  </p>
                  <p className={`text-xs mt-1 ${textMuted}`}>Ramal 1001 · Raniere</p>
                </div>
              )}
            </div>

            {/* Dial pad */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {dialPad.map(d => (
                <button key={d} onClick={() => handleDial(d)}
                  className={`py-3 rounded-xl text-center transition-all hover:scale-95 active:scale-90 ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}>
                  <div className="font-bold text-sm">{d}</div>
                  {subDigits[d] && <div className={`text-[8px] ${textMuted} mt-0.5`}>{subDigits[d]}</div>}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => { setMuted(v => !v); toast(muted ? 'Microfone ativado' : 'Microfone mudo', { icon: muted ? '🎙️' : '🔇' }); }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
                  muted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}>
                {muted ? <MicOff size={15} /> : <Mic size={15} />} {muted ? 'Mudo' : 'Microfone'}
              </button>
              <button onClick={() => { setOnHold(v => !v); toast(onHold ? 'Chamada retomada' : 'Chamada em espera', { icon: '⏸️' }); }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
                  onHold ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}>
                {onHold ? <Play size={15} /> : <Pause size={15} />} {onHold ? 'Retomar' : 'Hold'}
              </button>
              <button onClick={() => toast('Volume ajustado', { icon: '🔊' })}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                <Volume2 size={15} />
              </button>
            </div>

            {/* Call button */}
            <button onClick={handleCall}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                callActive
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
              }`}>
              {callActive ? <PhoneOff size={18} /> : <Phone size={18} />}
              {callActive ? 'Encerrar chamada' : 'Ligar'}
            </button>

            {dialNumber && !callActive && (
              <button onClick={() => setDialNumber(d => d.slice(0, -1))} className={`w-full mt-2 py-2 rounded-xl text-xs ${textMuted} hover:${isDark ? 'text-white' : 'text-slate-900'} transition-colors`}>
                ← Apagar
              </button>
            )}
          </motion.div>

          {/* Queue + agents */}
          <div className="space-y-4">
            {/* Queue */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className={`rounded-2xl p-5 border ${cardBg}`}>
              <h3 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center gap-2`}>
                <AlertTriangle size={15} className="text-amber-400" /> Fila de espera
                <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">{agentQueue.length}</span>
              </h3>
              <div className="space-y-2">
                {agentQueue.map((item, i) => (
                  <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/40' : 'bg-slate-50 border border-slate-100'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500/20 text-amber-400' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${textPrimary}`}>{item.name}</p>
                      <p className={`text-xs ${textMuted}`}>{item.number}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-mono font-bold ${item.priority === 'alta' ? 'text-red-400' : 'text-amber-400'}`}>{item.waitTime}</p>
                      <p className={`text-[10px] ${item.priority === 'alta' ? 'text-red-400' : textMuted}`}>{item.priority}</p>
                    </div>
                    <button onClick={() => { setCallActive(true); toast.success(`Atendendo ${item.name}`); }} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                      <Phone size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Agents status */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className={`rounded-2xl p-5 border ${cardBg}`}>
              <h3 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center gap-2`}>
                <Users size={15} className="text-violet-400" /> Status dos agentes
              </h3>
              <div className="space-y-2">
                {agents.map(agent => (
                  <div key={agent.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/40' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-slate-700 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                      {agent.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${textPrimary}`}>{agent.name}</p>
                      <p className={`text-xs ${textMuted}`}>Ramal {agent.extension}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        agent.status === 'disponível' ? 'bg-emerald-500/20 text-emerald-400' :
                        agent.status === 'em chamada' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>{agent.status}</span>
                      <p className={`text-[10px] mt-0.5 ${textMuted}`}>{agent.callsToday} chamadas</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Call history */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className={`rounded-2xl p-5 border ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Clock size={15} className="text-blue-400" /> Histórico de chamadas
            </h3>
            <div className="space-y-2">
              {callHistory.map(call => (
                <div key={call.id} className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`p-2 rounded-lg ${
                    call.status === 'perdida' ? 'bg-red-500/15 text-red-400' :
                    call.type === 'entrada' ? 'bg-emerald-500/15 text-emerald-400' :
                    'bg-blue-500/15 text-blue-400'
                  }`}>
                    {call.status === 'perdida' ? <PhoneMissed size={14} /> :
                     call.type === 'entrada' ? <PhoneIncoming size={14} /> : <PhoneOutgoing size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${textPrimary} truncate`}>{call.name}</p>
                    <p className={`text-xs ${textMuted}`}>{call.number}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-medium ${call.status === 'perdida' ? 'text-red-400' : textPrimary}`}>{call.duration}</p>
                    <p className={`text-[10px] ${textMuted}`}>{call.time}</p>
                    {call.status === 'atendida' && (
                      <button onClick={() => toast('Gravação em breve!', { icon: '🎵' })} className="text-[10px] text-amber-400 hover:text-amber-300 mt-0.5">
                        ▶ Gravação
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
