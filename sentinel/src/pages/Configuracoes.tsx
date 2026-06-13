import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { GlassCard, PageWrapper, GlowButton } from '../components/SharedComponents';
import { Save, Wifi, WifiOff, Key, Cpu, Shield } from 'lucide-react';

export default function Configuracoes() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedModel, setSelectedModel] = useState('gpt-4.1');

  const inputClass = `w-full px-3 py-2 rounded-lg text-sm outline-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-300'}`;
  const labelClass = `block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`;

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult('idle');
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
      addToast('Conexão com modelo de IA estabelecida com sucesso', 'success');
    }, 2000);
  };

  const aiModels = [
    { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', desc: 'Modelo mais avançado para análise detalhada' },
    { id: 'claude', name: 'Claude', provider: 'Anthropic', desc: 'Excelente em análise de contexto e nuances' },
    { id: 'gemini', name: 'Gemini', provider: 'Google', desc: 'Alta capacidade multimodal e velocidade' },
    { id: 'local', name: 'Modelo Local', provider: 'On-premise', desc: 'Modelo local para máxima privacidade' },
    { id: 'simulado', name: 'Simulado', provider: 'Interno', desc: 'Modelo simulado para demonstração e testes' },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Configurações</h2>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Configure os modelos de IA e parâmetros do sistema.</p>
        </div>

        {/* AI Model Selection */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={18} className="text-cyan-500" />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Modelo de IA</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {aiModels.map(model => (
              <button
                key={model.id}
                onClick={() => { setSelectedModel(model.id); setTestResult('idle'); }}
                className={`p-3 rounded-lg border text-left transition-all
                  ${selectedModel === model.id
                    ? isDark ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-cyan-300 bg-cyan-50'
                    : isDark ? 'border-white/[0.06] hover:border-white/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${selectedModel === model.id ? 'bg-cyan-400' : isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{model.name}</span>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{model.provider}</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{model.desc}</p>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* API Configuration */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key size={18} className="text-violet-500" />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Configuração da API</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Chave de API</label>
              <div className="relative">
                <input type="password" defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxx" className={inputClass} />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>●●●●●●●●</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Temperatura: <span className="text-cyan-500">0.3</span></label>
                <input type="range" min="0" max="100" defaultValue="30" className="w-full" />
                <div className={`flex justify-between text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span>Preciso</span><span>Criativo</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Limite de tokens</label>
                <input type="number" defaultValue={4096} min={256} max={128000} className={inputClass} />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Global Prompt */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={18} className="text-cyan-500" />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Prompt Base Global</h3>
          </div>
          <textarea
            rows={5}
            defaultValue={`Você é um avaliador de qualidade de atendimento. Analise a conversa fornecida considerando os critérios definidos no modelo de avaliação. Para cada critério, atribua uma nota de 0 a 100 e justifique sua avaliação. Ao final, forneça um resumo geral, pontos positivos, pontos de melhoria e uma sugestão de feedback construtivo para o agente. Seja objetivo, consistente e baseie sua avaliação apenas nas evidências presentes na conversa.`}
            className={`w-full px-3 py-2 rounded-lg text-sm outline-none resize-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300 focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-700 focus:border-cyan-300'}`}
          />
        </GlassCard>

        {/* Privacy & Retention */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-emerald-500" />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Privacidade e Retenção</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Regras de privacidade</label>
              <textarea
                rows={3}
                defaultValue="Dados pessoais devem ser anonimizados antes do processamento. Não armazenar dados sensíveis (CPF, cartão) além do período necessário. Atendimentos com dados de menores devem ser tratados com atenção especial."
                className={`w-full px-3 py-2 rounded-lg text-sm outline-none resize-none ${isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300 focus:border-cyan-500/30' : 'bg-slate-50 border border-slate-200 text-slate-700 focus:border-cyan-300'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Retenção de dados</label>
                <select className={inputClass}>
                  <option>30 dias</option><option>60 dias</option><option>90 dias</option><option>180 dias</option><option>365 dias</option><option>Indefinido</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Anonimização automática</label>
                <select className={inputClass}>
                  <option>Ativada</option><option>Desativada</option>
                </select>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Test & Save */}
        <div className="flex items-center gap-3">
          <GlowButton onClick={handleTestConnection} variant="secondary">
            {testing ? (
              <><WifiOff size={16} className="animate-pulse" /> Testando...</>
            ) : testResult === 'success' ? (
              <><Wifi size={16} className="text-emerald-400" /> Conexão OK</>
            ) : (
              <><Wifi size={16} /> Testar conexão</>
            )}
          </GlowButton>
          <GlowButton onClick={() => addToast('Configurações salvas com sucesso!', 'success')}>
            <Save size={16} /> Salvar configurações
          </GlowButton>
        </div>
      </div>
    </PageWrapper>
  );
}
