import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot, Users, Save,
  Eye, EyeOff, CheckCircle, AlertCircle,
  Database,
} from "lucide-react";
import { useToast } from "../components/shared/Toast";
import { cn } from "../utils/cn";

const tabs = [
  { id: "general", label: "Geral", icon: Save },
  { id: "ai", label: "Configurações de IA", icon: Bot },
  { id: "users", label: "Usuários", icon: Users },
];

const aiProviders = [
  { id: "openai", label: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"] },
  { id: "anthropic", label: "Anthropic", models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"] },
  { id: "gemini", label: "Google Gemini", models: ["gemini-2.0-flash", "gemini-1.5-pro"] },
  { id: "local", label: "Modelo local (Ollama)", models: ["llama3.1", "codestral", "mistral"] },
  { id: "simulated", label: "Simulado (Demo)", models: ["dataforge-demo-agent"] },
];

const mockUsers = [
  { name: "Raniere", email: "raniere@dataforge.app", role: "Administrador", status: "ativo" },
  { name: "Ana Silva", email: "ana@empresa.com", role: "Analista", status: "ativo" },
  { name: "Carlos Mendes", email: "carlos@empresa.com", role: "Leitor", status: "inativo" },
];

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [showKey, setShowKey] = useState(false);
  const [provider, setProvider] = useState("simulated");
  const [selectedProvider, setSelectedProvider] = useState(aiProviders.find(p => p.id === "simulated")!);
  const [model, setModel] = useState("dataforge-demo-agent");
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);

  const [generalSettings, setGeneralSettings] = useState({
    orgName: "Raniere.dev",
    theme: "dark",
    language: "pt-BR",
    logRetention: "30",
    artifactDir: "/data/dataforge/artifacts",
    duckdbMemory: "4",
    threads: "4",
  });

  const [aiTools, setAiTools] = useState({
    generateSQL: true,
    editSQL: true,
    explainErrors: true,
    suggestOptimizations: true,
    requireConfirmation: false,
  });

  const handleProviderChange = (pid: string) => {
    setProvider(pid);
    const p = aiProviders.find(ap => ap.id === pid)!;
    setSelectedProvider(p);
    setModel(p.models[0]);
  };

  const handleSave = () => {
    toast("success", "Configurações salvas", "Todas as alterações foram aplicadas.");
  };

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Sidebar */}
      <div
        className="w-44 flex-shrink-0 p-2 space-y-0.5"
        style={{ borderRight: "1px solid rgba(59,130,246,0.1)", background: "rgba(2,8,23,0.8)" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all",
                activeTab === tab.id ? "bg-blue-500/10 text-blue-400" : "text-slate-500 hover:text-slate-200 hover:bg-white/3"
              )}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "general" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 mb-1">Configurações gerais</h2>
              <p className="text-xs text-slate-500">Configurações globais da plataforma DataForge.</p>
            </div>

            {/* Organization */}
            <div className="glass-card rounded-xl p-5 space-y-4" style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Organização</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1.5">Nome da organização</label>
                  <input type="text" value={generalSettings.orgName} onChange={(e) => setGeneralSettings({ ...generalSettings, orgName: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Tema padrão</label>
                  <select value={generalSettings.theme} onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                    <option value="dark">Dark (padrão)</option>
                    <option value="light">Light</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Idioma</label>
                  <select value={generalSettings.language} onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DuckDB */}
            <div className="glass-card rounded-xl p-5 space-y-4" style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <Database size={12} className="text-blue-400" />
                DuckDB Engine
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Limite de memória (GB)</label>
                  <input type="number" min={1} max={64} value={generalSettings.duckdbMemory} onChange={(e) => setGeneralSettings({ ...generalSettings, duckdbMemory: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Threads de execução</label>
                  <input type="number" min={1} max={32} value={generalSettings.threads} onChange={(e) => setGeneralSettings({ ...generalSettings, threads: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1.5">Diretório de artefatos</label>
                  <input type="text" value={generalSettings.artifactDir} onChange={(e) => setGeneralSettings({ ...generalSettings, artifactDir: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 font-mono" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Retenção de logs (dias)</label>
                  <input type="number" min={7} value={generalSettings.logRetention} onChange={(e) => setGeneralSettings({ ...generalSettings, logRetention: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300" />
                </div>
              </div>
            </div>

            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}>
              <Save size={14} />
              Salvar configurações
            </button>
          </motion.div>
        )}

        {activeTab === "ai" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 mb-1">Configurações de IA</h2>
              <p className="text-xs text-slate-500">Configure o provedor e comportamento do agente de IA.</p>
            </div>

            {/* Provider selection */}
            <div className="glass-card rounded-xl p-5 space-y-4" style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Provedor de IA</h3>
              <div className="grid grid-cols-1 gap-2">
                {aiProviders.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProviderChange(p.id)}
                    className={cn("flex items-center justify-between px-3.5 py-3 rounded-xl border text-left transition-all", provider === p.id ? "border-blue-500/40 bg-blue-500/8" : "border-slate-700/40 hover:border-slate-600/60")}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn("h-2 w-2 rounded-full", provider === p.id ? "bg-blue-400" : "bg-slate-600")} />
                      <span className="text-sm font-medium text-slate-300">{p.label}</span>
                    </div>
                    {provider === p.id && <CheckCircle size={14} className="text-blue-400" />}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Modelo padrão</label>
                <select value={model} onChange={(e) => setModel(e.target.value)} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none font-mono">
                  {selectedProvider.models.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Chave de API</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    defaultValue={provider === "simulated" ? "demo-key-not-real-xxxxxxxx" : "sk-xxxxxxxxxxxxxxxxxxxxxxxx"}
                    className="df-input w-full px-3 py-2 pr-9 rounded-lg text-sm text-slate-300 font-mono"
                    disabled={provider === "simulated"}
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {provider === "simulated" && (
                  <p className="text-[11px] text-amber-400/70 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    Modo demonstração — sem chamadas reais à IA
                  </p>
                )}
              </div>
            </div>

            {/* Parameters */}
            <div className="glass-card rounded-xl p-5 space-y-4" style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Parâmetros do modelo</h3>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400">Temperatura</label>
                  <span className="text-xs font-mono text-blue-400">{temperature}</span>
                </div>
                <input type="range" min={0} max={1} step={0.1} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>Preciso (0)</span>
                  <span>Criativo (1)</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Limite de tokens</label>
                <input type="number" min={512} max={16384} step={512} value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Prompt base do agente</label>
                <textarea
                  rows={4}
                  defaultValue={`Você é o DataForge Agent, um assistente especializado em engenharia de dados com DuckDB. Você tem acesso ao schema completo das fontes de dados do usuário e deve ajudar a criar, editar, explicar e otimizar queries SQL. Seja direto, técnico e preciso.`}
                  className="df-input w-full px-3 py-2 rounded-lg text-xs text-slate-300 resize-none"
                />
              </div>
            </div>

            {/* Tools */}
            <div className="glass-card rounded-xl p-5 space-y-4" style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Permissões e tools</h3>
              <div className="space-y-2.5">
                {[
                  { key: "generateSQL", label: "Permitir gerar SQL" },
                  { key: "editSQL", label: "Permitir editar SQL" },
                  { key: "explainErrors", label: "Permitir explicar erros" },
                  { key: "suggestOptimizations", label: "Permitir sugerir otimizações" },
                  { key: "requireConfirmation", label: "Exigir confirmação antes de executar query" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setAiTools({ ...aiTools, [opt.key]: !aiTools[opt.key as keyof typeof aiTools] })}
                      className={cn("relative h-5 w-9 rounded-full transition-colors", aiTools[opt.key as keyof typeof aiTools] ? "bg-blue-500" : "bg-slate-700")}
                    >
                      <div className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm", aiTools[opt.key as keyof typeof aiTools] ? "translate-x-4" : "translate-x-0")} />
                    </div>
                    <span className="text-sm text-slate-300">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}>
              <Save size={14} />
              Salvar configurações
            </button>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 mb-1">Usuários e permissões</h2>
              <p className="text-xs text-slate-500">Gerencie acesso à plataforma DataForge.</p>
            </div>

            <div className="glass-card rounded-xl overflow-hidden" style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-500/8">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Membros</h3>
                <button onClick={() => toast("info", "Demo", "Funcionalidade disponível na versão completa.")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">+ Convidar usuário</button>
              </div>
              <div className="divide-y divide-slate-800/40">
                {mockUsers.map((user) => (
                  <div key={user.email} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{user.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{user.name}</p>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700/30">{user.role}</span>
                      <span className={cn("h-2 w-2 rounded-full", user.status === "ativo" ? "bg-emerald-400" : "bg-slate-600")} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
