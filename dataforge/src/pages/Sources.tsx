import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, RefreshCw, Settings, Trash2,
  Plug, Clock, Loader2,
  FileSpreadsheet, FileText, Globe, Package,
  Upload, Server,
} from "lucide-react";
import { Modal } from "../components/shared/Modal";
import { getStatusBadge } from "../components/shared/Badge";
import { useToast } from "../components/shared/Toast";
import { mockSources } from "../data/mockData";
import { cn } from "../utils/cn";

const typeIcon: Record<string, React.ReactNode> = {
  postgresql: <Server size={16} className="text-blue-400" />,
  mariadb: <Server size={16} className="text-orange-400" />,
  xlsx: <FileSpreadsheet size={16} className="text-emerald-400" />,
  csv: <FileText size={16} className="text-amber-400" />,
  api: <Globe size={16} className="text-violet-400" />,
  parquet: <Package size={16} className="text-cyan-400" />,
  upload: <Upload size={16} className="text-slate-400" />,
};

const typeLabel: Record<string, string> = {
  postgresql: "PostgreSQL",
  mariadb: "MariaDB",
  xlsx: "Planilha XLSX",
  csv: "Arquivo CSV",
  api: "API REST",
  parquet: "Parquet",
  upload: "Upload manual",
};

const sourceTypes = [
  { id: "postgresql", label: "PostgreSQL", icon: <Server size={20} className="text-blue-400" /> },
  { id: "mariadb", label: "MySQL / MariaDB", icon: <Server size={20} className="text-orange-400" /> },
  { id: "sqlserver", label: "SQL Server", icon: <Server size={20} className="text-cyan-400" /> },
  { id: "csv", label: "Arquivo CSV", icon: <FileText size={20} className="text-amber-400" /> },
  { id: "xlsx", label: "Arquivo XLSX", icon: <FileSpreadsheet size={20} className="text-emerald-400" /> },
  { id: "parquet", label: "Pasta Parquet", icon: <Package size={20} className="text-cyan-400" /> },
  { id: "api", label: "API REST", icon: <Globe size={20} className="text-violet-400" /> },
  { id: "upload", label: "Upload manual", icon: <Upload size={20} className="text-slate-400" /> },
];

export const Sources: React.FC = () => {
  const { toast } = useToast();
  const [sources, setSources] = useState(mockSources);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("postgresql");
  const [testing, setTesting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<"type" | "config">("type");

  const [form, setForm] = useState({
    name: "", host: "", port: "5432", database: "", user: "", password: "", token: "", path: "",
  });

  const handleTestConnection = (sourceId: string) => {
    setTesting(sourceId);
    setTimeout(() => {
      setTesting(null);
      const success = Math.random() > 0.3;
      if (success) {
        toast("success", "Conexão bem-sucedida", "A fonte está acessível e respondendo normalmente.");
      } else {
        toast("error", "Falha na conexão", "Tempo limite de conexão excedido. Verifique host e credenciais.");
      }
    }, 1800);
  };

  const handleSync = (sourceId: string) => {
    setSyncing(sourceId);
    setSources((prev) => prev.map((s) => s.id === sourceId ? { ...s, status: "syncing" } : s));
    setTimeout(() => {
      setSyncing(null);
      setSources((prev) => prev.map((s) => s.id === sourceId ? { ...s, status: "connected", lastSync: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) } : s));
      toast("success", "Sincronização concluída", "Dados atualizados com sucesso.");
    }, 2500);
  };

  const handleRemove = (sourceId: string) => {
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
    toast("info", "Fonte removida", "A fonte de dados foi desconectada.");
  };

  const handleSaveSource = () => {
    if (!form.name) {
      toast("error", "Nome obrigatório", "Informe um nome para a fonte de dados.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newSource: any = {
      id: `src-${Date.now()}`,
      name: form.name,
      type: selectedType,
      status: "pending",
      lastSync: "—",
      tables: 0,
      volume: "—",
      responsible: "Raniere",
      host: form.host || null,
      port: form.port ? parseInt(form.port) : null,
      database: form.database || null,
      tags: [],
    };
    setSources((prev) => [...prev, newSource]);
    setShowModal(false);
    setFormStep("type");
    setForm({ name: "", host: "", port: "5432", database: "", user: "", password: "", token: "", path: "" });
    toast("success", "Fonte adicionada", `${form.name} foi adicionada. Configure e teste a conexão.`);
  };

  const needsDbConfig = ["postgresql", "mariadb", "sqlserver"].includes(selectedType);
  const needsApiConfig = selectedType === "api";
  const needsPathConfig = ["csv", "xlsx", "parquet", "upload"].includes(selectedType);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-200">Fontes de Dados</h2>
          <p className="text-xs text-slate-500 mt-0.5">{sources.length} fontes configuradas · {sources.filter(s => s.status === "connected").length} conectadas</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}
        >
          <Plus size={14} />
          Nova fonte
        </motion.button>
      </div>

      {/* Sources grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {sources.map((source, i) => (
          <motion.div
            key={source.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card rounded-xl overflow-hidden"
            style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/60">
                    {typeIcon[source.type]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{source.name}</h3>
                    <p className="text-[11px] text-slate-500">{typeLabel[source.type]}</p>
                  </div>
                </div>
                {getStatusBadge(source.status)}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { label: "Tabelas/Arquivos", value: source.tables || "—" },
                  { label: "Volume", value: source.volume },
                  { label: "Responsável", value: source.responsible },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{item.label}</p>
                    <p className="text-xs font-medium text-slate-300 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-600">
                  <Clock size={10} className="inline mr-1" />
                  {source.lastSync}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTestConnection(source.id)}
                    disabled={testing === source.id}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
                  >
                    {testing === source.id ? <Loader2 size={10} className="animate-spin" /> : <Plug size={10} />}
                    Testar
                  </button>
                  <button
                    onClick={() => handleSync(source.id)}
                    disabled={syncing === source.id}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                  >
                    {syncing === source.id ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                    Sync
                  </button>
                  <button className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
                    <Settings size={12} />
                  </button>
                  <button
                    onClick={() => handleRemove(source.id)}
                    className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {source.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {source.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 bg-slate-800/60 border border-slate-700/40">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setFormStep("type"); }} title="Nova fonte de dados" subtitle="Conecte uma nova origem de dados ao DataForge" size="lg">
        <div className="p-5">
          {formStep === "type" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Selecione o tipo de fonte:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {sourceTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all",
                      selectedType === t.id
                        ? "border-blue-500/40 bg-blue-500/10"
                        : "border-slate-700/40 bg-slate-800/20 hover:border-slate-600/60 hover:bg-slate-800/40"
                    )}
                  >
                    {t.icon}
                    <span className="text-[11px] font-medium text-slate-300">{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setFormStep("config")}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
                >
                  Configurar →
                </button>
              </div>
            </div>
          )}

          {formStep === "config" && (
            <div className="space-y-4">
              <button onClick={() => setFormStep("type")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                ← Voltar
              </button>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/15">
                {typeIcon[selectedType]}
                <span className="text-sm font-medium text-slate-200">{typeLabel[selectedType]}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Nome da fonte *</label>
                  <input
                    type="text"
                    placeholder="Ex.: PostgreSQL ERP Produção"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600"
                  />
                </div>

                {needsDbConfig && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Host</label>
                      <input type="text" placeholder="localhost" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Porta</label>
                      <input type="text" placeholder="5432" value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Banco de dados</label>
                      <input type="text" placeholder="my_database" value={form.database} onChange={(e) => setForm({ ...form, database: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Usuário</label>
                      <input type="text" placeholder="postgres" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-slate-400 block mb-1">Senha</label>
                      <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600" />
                    </div>
                  </>
                )}

                {needsApiConfig && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-slate-400 block mb-1">URL da API</label>
                      <input type="text" placeholder="https://api.exemplo.com/v2" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-slate-400 block mb-1">Token de autenticação</label>
                      <input type="password" placeholder="••••••••••••••••" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600" />
                    </div>
                  </>
                )}

                {needsPathConfig && (
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 block mb-1">Caminho do arquivo / pasta</label>
                    <input type="text" placeholder="/data/exports/arquivo.csv" value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleTestConnection("new")}
                  disabled={testing === "new"}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-blue-400 border border-blue-500/20 hover:bg-blue-500/8 transition-colors disabled:opacity-50"
                >
                  {testing === "new" ? <Loader2 size={13} className="animate-spin" /> : <Plug size={13} />}
                  Testar conexão
                </button>
                <button
                  onClick={handleSaveSource}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
                >
                  Salvar fonte
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
