import React from 'react';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, Phone, Bot, Send, Radio, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Sobre: React.FC = () => {
  const { isDark } = useTheme();
  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  const features = [
    { icon: <MessageSquare size={20} />, title: 'Inbox Omnichannel', desc: 'Gerencie conversas de WhatsApp, Instagram, Facebook, Site e Telefone em um único painel com layout estilo helpdesk.' },
    { icon: <Bot size={20} />, title: 'Agente de IA', desc: 'Agente inteligente com base de conhecimento personalizada, regras de transferência e log de execuções.' },
    { icon: <Phone size={20} />, title: 'Telefonia / PBX', desc: 'Softphone integrado com fila de chamadas, controle de ramais e histórico com gravações.' },
    { icon: <Send size={20} />, title: 'Disparos em Massa', desc: 'Campanhas de mensagens com templates, segmentação de público, agendamento e métricas.' },
    { icon: <Radio size={20} />, title: 'Gestão de Canais', desc: 'Configure e monitore cada canal de comunicação com dados de volume e status em tempo real.' },
    { icon: <Zap size={20} />, title: 'Relatórios', desc: 'Análises por período e canal com gráficos de CSAT, tempo de resposta e performance de agentes.' },
  ];

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-5 h-full overflow-y-auto`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-8 border text-center relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900/80 to-slate-950 border-slate-800/60' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm'}`}>
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }} />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4 shadow-lg shadow-amber-500/25">
              <Zap size={32} className="text-slate-950" fill="currentColor" />
            </div>
            <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>Signal</h1>
            <p className="text-amber-400 font-semibold text-lg mb-3">Plataforma Omnichannel</p>
            <p className={`text-sm leading-relaxed max-w-2xl mx-auto ${textMuted}`}>
              Signal é uma plataforma de atendimento omnichannel que unifica todos os canais de comunicação da sua empresa — WhatsApp, Instagram, Facebook, Site e Telefonia — em um único painel inteligente, potencializado por Agente de IA.
            </p>
          </div>
        </motion.div>

        {/* Demo notice */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-5 border ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-amber-400 font-bold text-sm mb-1">Ambiente de demonstração</h3>
              <p className={`text-sm ${textMuted} leading-relaxed`}>
                Esta é uma versão demonstrativa do Signal com <strong className={textPrimary}>dados completamente fictícios</strong>. 
                Não há conexão com backend real, não existe autenticação, e todas as informações exibidas — clientes, conversas, métricas, campanhas — foram criadas exclusivamente para fins de demonstração.
              </p>
              <p className={`text-sm ${textMuted} mt-2`}>
                Nenhum dado pessoal real é coletado ou processado. As credenciais de acesso são de demonstração e não representam uma conta real.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className={`text-base font-bold ${textPrimary} mb-4`}>Funcionalidades demonstradas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                className={`rounded-xl p-4 border ${cardBg}`}>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 inline-flex mb-3">
                  {feature.icon}
                </div>
                <h3 className={`text-sm font-semibold ${textPrimary} mb-1`}>{feature.title}</h3>
                <p className={`text-xs leading-relaxed ${textMuted}`}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`rounded-2xl p-5 border ${cardBg}`}>
          <h2 className={`text-sm font-bold ${textPrimary} mb-3`}>Stack técnica</h2>
          <div className="flex flex-wrap gap-2">
            {['React 19', 'TypeScript', 'Vite 7', 'Tailwind CSS 4', 'Framer Motion', 'Recharts', 'React Hot Toast', 'Lucide Icons'].map(tech => (
              <span key={tech} className={`text-xs px-3 py-1.5 rounded-full font-medium ${isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                {tech}
              </span>
            ))}
          </div>
          <p className={`text-xs mt-3 ${textMuted}`}>
            Código limpo e componentizado, pronto para integração em subpasta <code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-amber-700'}`}>/signal/</code> de um monorepo Vite.
          </p>
        </motion.div>

        {/* About developer */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`rounded-2xl p-6 border ${isDark ? 'bg-gradient-to-br from-slate-900/80 to-amber-500/5 border-amber-500/20' : 'bg-gradient-to-br from-white to-amber-50/50 border-amber-200 shadow-sm'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl flex-shrink-0 shadow-lg shadow-amber-500/20">
              R
            </div>
            <div className="flex-1">
              <p className={`text-base font-bold ${textPrimary}`}>Raniere</p>
              <p className={`text-sm ${textMuted} mb-2`}>Desenvolvedor Full Stack · UX/UI · Criador do Signal</p>
              <p className={`text-xs leading-relaxed ${textMuted}`}>
                Este projeto foi desenvolvido como demonstração de produto para o portfólio. Todas as decisões de design, arquitetura de componentes e UX foram pensadas para simular uma aplicação de produção real.
              </p>
            </div>
            <div className="flex gap-2">
              <a href="https://raniere.dev" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20">
                <Globe size={15} /> raniere.dev
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
