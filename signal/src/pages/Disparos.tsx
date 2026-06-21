import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Plus, X, CheckCircle, AlertCircle, FileText, Calendar,
  BarChart3,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { campaigns } from '../data/mockData';
import { ChannelBadge } from '../components/ui/ChannelBadge';
import toast from 'react-hot-toast';

const statusConfig = {
  rascunho: { label: 'Rascunho', icon: <FileText size={12} />, className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  agendada: { label: 'Agendada', icon: <Calendar size={12} />, className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  enviando: { label: 'Enviando', icon: <Send size={12} />, className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  concluída: { label: 'Concluída', icon: <CheckCircle size={12} />, className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  erro: { label: 'Erro', icon: <AlertCircle size={12} />, className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export const Disparos: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    channel: 'whatsapp',
    template: '',
    segment: 'todos',
    schedule: 'agora',
    dateTime: '',
  });

  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark ? 'bg-slate-800/60 border-slate-700/60 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400';

  const campaignMetrics = selectedCampaign ? [
    { name: 'Enviadas', value: selectedCampaign.sent, color: '#f59e0b' },
    { name: 'Entregues', value: selectedCampaign.delivered, color: '#10b981' },
    { name: 'Lidas', value: selectedCampaign.read, color: '#8b5cf6' },
    { name: 'Falhas', value: selectedCampaign.failed, color: '#ef4444' },
  ] : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`px-3 py-2 rounded-xl border text-xs shadow-xl ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <p className="font-semibold">{label}: {payload[0].value}</p>
      </div>
    );
  };

  const sampleTemplates = [
    { id: 't1', name: 'Promoção Padrão', text: 'Olá {{nome}}! A {{empresa}} tem uma oferta especial para você hoje. Aproveite nosso desconto de 20% em todos os planos. Válido até domingo!' },
    { id: 't2', name: 'Reengajamento', text: 'Oi {{nome}}, sentimos sua falta! Que tal reativar seu plano na {{empresa}} com condições especiais? Responda SIM para saber mais.' },
    { id: 't3', name: 'NPS', text: 'Olá {{nome}}! Em uma escala de 0 a 10, como você avalia o serviço da {{empresa}}? Sua opinião é muito importante para nós.' },
  ];

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-5 h-full overflow-y-auto`}>
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-base font-semibold ${textPrimary}`}>Campanhas de disparo</h2>
            <p className={`text-xs ${textMuted}`}>{campaigns.length} campanhas · {campaigns.filter(c => c.status === 'enviando').length} em andamento</p>
          </div>
          <button onClick={() => { setShowModal(true); setStep(1); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/25">
            <Plus size={16} /> Nova campanha
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Campaign list */}
          <div className="space-y-2">
            {campaigns.map(campaign => {
              const stt = statusConfig[campaign.status];
              return (
                <motion.button key={campaign.id} onClick={() => setSelectedCampaign(campaign)}
                  whileHover={{ scale: 1.01 }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedCampaign?.id === campaign.id
                      ? isDark ? 'bg-amber-500/8 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                      : `${cardBg} hover:border-amber-500/20`
                  }`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-sm font-semibold ${textPrimary} leading-tight`}>{campaign.name}</span>
                    <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${stt.className}`}>
                      {stt.icon}{stt.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <ChannelBadge channel={campaign.channel} />
                    <span className={`text-xs ${textMuted}`}>{campaign.recipients.toLocaleString('pt-BR')} destinatários</span>
                  </div>
                  {campaign.deliveryRate > 0 && (
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 h-1.5 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${campaign.deliveryRate}%` }} />
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">{campaign.deliveryRate}%</span>
                    </div>
                  )}
                  <p className={`text-[10px] mt-1.5 ${textMuted}`}>{campaign.scheduledAt || campaign.createdAt}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Campaign metrics */}
          <div className="lg:col-span-2 space-y-4">
            {selectedCampaign && (
              <AnimatePresence mode="wait">
                <motion.div key={selectedCampaign.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className={`rounded-2xl p-5 border ${cardBg} mb-4`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-base font-bold ${textPrimary}`}>{selectedCampaign.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <ChannelBadge channel={selectedCampaign.channel} />
                          <span className={`text-xs ${textMuted}`}>Criada em {selectedCampaign.createdAt}</span>
                        </div>
                      </div>
                      {selectedCampaign.status === 'concluída' && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle size={12} /> Concluída
                        </span>
                      )}
                    </div>

                    {/* Metric cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {campaignMetrics.map(m => (
                        <div key={m.name} className={`p-3 rounded-xl ${isDark ? 'bg-slate-800/60' : 'bg-slate-50 border border-slate-100'}`}>
                          <p className={`text-xs ${textMuted} mb-1`}>{m.name}</p>
                          <p className="text-xl font-bold" style={{ color: m.color }}>{m.value.toLocaleString('pt-BR')}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bar chart */}
                    {selectedCampaign.sent > 0 && (
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={campaignMetrics} barSize={36}>
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {campaignMetrics.map((m, i) => <Cell key={i} fill={m.color} fillOpacity={0.8} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {selectedCampaign.sent === 0 && (
                      <div className={`flex flex-col items-center justify-center h-32 rounded-xl ${isDark ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
                        <BarChart3 size={28} className={`${textMuted} mb-2`} />
                        <p className={`text-sm ${textMuted}`}>Nenhum dado disponível ainda</p>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {selectedCampaign.status !== 'rascunho' && (
                    <div className={`rounded-2xl p-5 border ${cardBg}`}>
                      <h4 className={`text-sm font-semibold ${textPrimary} mb-3`}>Preview da mensagem</h4>
                      <div className={`rounded-xl p-4 max-w-xs ${isDark ? 'bg-green-900/20 border border-green-800/30' : 'bg-green-50 border border-green-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="text-green-400 text-xs font-bold">S</span>
                          </div>
                          <span className={`text-xs font-semibold ${textPrimary}`}>Signal Comunicação</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${textPrimary}`}>
                          Olá <strong>Maria</strong>! A <strong>Signal</strong> tem uma oferta especial para você. Aproveite condições exclusivas no nosso plano premium. Válido até essa semana!
                        </p>
                        <p className={`text-[10px] mt-2 text-right ${textMuted}`}>09:00 ✓✓</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* New campaign modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl border shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              {/* Modal header */}
              <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div>
                  <h3 className={`text-base font-bold ${textPrimary}`}>Nova campanha</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`h-1 rounded-full transition-all ${s <= step ? 'bg-amber-400 w-8' : isDark ? 'bg-slate-700 w-4' : 'bg-slate-200 w-4'}`} />
                    ))}
                    <span className={`text-xs ${textMuted}`}>Passo {step} de 3</span>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'} transition-colors`}>
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>Nome da campanha</label>
                      <input value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} placeholder="Ex: Promoção de Verão 2025"
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`} />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>Canal</label>
                      <select value={formData.channel} onChange={e => setFormData(d => ({ ...d, channel: e.target.value }))}
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all ${inputBg}`}>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-1.5`}>Público-alvo</label>
                      <select value={formData.segment} onChange={e => setFormData(d => ({ ...d, segment: e.target.value }))}
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all ${inputBg}`}>
                        <option value="todos">Todos os contatos (1.240)</option>
                        <option value="vip">Clientes VIP (156)</option>
                        <option value="inativos">Inativos há 30+ dias (580)</option>
                        <option value="novos">Novos clientes (320)</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Template de mensagem</label>
                      <div className="space-y-2 mb-3">
                        {sampleTemplates.map(t => (
                          <button key={t.id} onClick={() => setFormData(d => ({ ...d, template: t.text }))}
                            className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                              formData.template === t.text
                                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                                : isDark ? 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                            }`}>
                            <p className="font-medium text-xs mb-1">{t.name}</p>
                            <p className="text-xs truncate">{t.text.slice(0, 60)}...</p>
                          </button>
                        ))}
                      </div>
                      <textarea value={formData.template} onChange={e => setFormData(d => ({ ...d, template: e.target.value }))} rows={3}
                        placeholder="Ou escreva sua mensagem. Use {{nome}} e {{empresa}} para personalizar."
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`} />
                      <p className={`text-[10px] mt-1 ${textMuted}`}>Variáveis: {'{{nome}}'} {'{{empresa}}'}</p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Agendamento</label>
                      <div className="flex gap-2">
                        {['agora', 'agendar'].map(s => (
                          <button key={s} onClick={() => setFormData(d => ({ ...d, schedule: s }))}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                              formData.schedule === s ? 'border-amber-500/50 bg-amber-500/15 text-amber-400' : isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}>
                            {s === 'agora' ? '⚡ Enviar agora' : '📅 Agendar'}
                          </button>
                        ))}
                      </div>
                    </div>
                    {formData.schedule === 'agendar' && (
                      <input type="datetime-local" value={formData.dateTime} onChange={e => setFormData(d => ({ ...d, dateTime: e.target.value }))}
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all ${inputBg}`} />
                    )}
                    {/* Preview */}
                    <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Resumo</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className={textMuted}>Campanha:</span>
                          <span className={`font-medium ${textPrimary}`}>{formData.name || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={textMuted}>Canal:</span>
                          <span className={`font-medium ${textPrimary} capitalize`}>{formData.channel}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={textMuted}>Envio:</span>
                          <span className={`font-medium ${textPrimary}`}>{formData.schedule === 'agora' ? 'Imediato' : formData.dateTime || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal footer */}
              <div className={`flex items-center gap-3 p-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)} className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900'}`}>
                    Voltar
                  </button>
                )}
                <button
                  onClick={() => {
                    if (step < 3) { setStep(s => s + 1); }
                    else { setShowModal(false); toast.success('Campanha criada com sucesso!'); setStep(1); }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2">
                  {step === 3 ? <><Send size={15} /> Criar campanha</> : 'Próximo →'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
