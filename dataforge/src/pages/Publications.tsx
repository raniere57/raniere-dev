import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2, Download, RefreshCw, Eye, Plus,
  FileText, Package, FileSpreadsheet, Database,
  Clock, Link,
} from "lucide-react";
import { Modal } from "../components/shared/Modal";
import { getStatusBadge } from "../components/shared/Badge";
import { useToast } from "../components/shared/Toast";
import { mockPublications } from "../data/mockData";
import { cn } from "../utils/cn";

const formatIcon: Record<string, React.ReactNode> = {
  duckdb: <Database size={16} className="text-blue-400" />,
  parquet: <Package size={16} className="text-cyan-400" />,
  csv: <FileText size={16} className="text-amber-400" />,
  xlsx: <FileSpreadsheet size={16} className="text-emerald-400" />,
};

const formatLabel: Record<string, string> = {
  duckdb: "DuckDB",
  parquet: "Parquet",
  csv: "CSV",
  xlsx: "Excel (XLSX)",
};

export const Publications: React.FC = () => {
  const { toast } = useToast();
  const [publications, setPublications] = useState(mockPublications);
  const [showModal, setShowModal] = useState(false);
  const [showMetadata, setShowMetadata] = useState<typeof mockPublications[0] | null>(null);

  const [form, setForm] = useState({
    pipeline: "Consolidado Comercial",
    name: "",
    format: "parquet",
    destination: "local",
    schedule: "manual",
    compress: true,
    partition: false,
    docs: false,
    manifest: true,
  });

  const handlePublish = () => {
    if (!form.name) {
      toast("error", "Nome obrigatório", "Informe o nome do artefato.");
      return;
    }
    const newPub = {
      id: `pub-${Date.now()}`,
      name: `${form.name}.${form.format}`,
      format: form.format,
      size: "—",
      generatedAt: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
      pipeline: form.pipeline,
      status: "available",
      destination: form.destination,
      downloads: 0,
    };
    setPublications((prev) => [newPub, ...prev]);
    setShowModal(false);
    toast("success", "Publicação criada", `${newPub.name} será gerado na próxima execução.`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-200">Publicações</h2>
          <p className="text-xs text-slate-500 mt-0.5">{publications.length} artefatos gerados · Prontos para download e distribuição</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}
        >
          <Plus size={14} />
          Nova publicação
        </button>
      </div>

      {/* Publications grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {publications.map((pub, i) => (
          <motion.div
            key={pub.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card rounded-xl overflow-hidden"
            style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-800/60">{formatIcon[pub.format]}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100 font-mono">{pub.name}</p>
                    <p className="text-[11px] text-slate-500">{formatLabel[pub.format]}</p>
                  </div>
                </div>
                {getStatusBadge(pub.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Tamanho</p>
                  <p className="text-slate-300 font-medium mt-0.5">{pub.size}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Downloads</p>
                  <p className="text-slate-300 font-medium mt-0.5">{pub.downloads}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Pipeline</p>
                  <p className="text-slate-400 mt-0.5 truncate">{pub.pipeline}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Destino</p>
                  <p className="text-slate-400 mt-0.5 truncate">{pub.destination}</p>
                </div>
              </div>

              <p className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-3">
                <Clock size={10} />
                {pub.generatedAt}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => toast("success", "Download iniciado", `${pub.name} sendo baixado.`)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-400 border border-blue-500/20 hover:bg-blue-500/8 transition-colors"
                >
                  <Download size={11} />
                  Baixar
                </button>
                <button
                  onClick={() => { navigator.clipboard?.writeText(`https://dataforge.app/pub/${pub.id}`); toast("success", "Link copiado", "URL de download copiada."); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 transition-colors"
                >
                  <Link size={11} />
                  Copiar link
                </button>
                <button
                  onClick={() => toast("info", "Republicando", `${pub.name} será gerado novamente.`)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 transition-colors"
                >
                  <RefreshCw size={11} />
                  Gerar novo
                </button>
                <button
                  onClick={() => setShowMetadata(pub)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 transition-colors"
                >
                  <Eye size={11} />
                  Metadados
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Publication Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nova publicação" subtitle="Configure e publique um artefato de dados" size="lg">
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Pipeline de origem</label>
              <select value={form.pipeline} onChange={(e) => setForm({ ...form, pipeline: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                {["Consolidado Comercial", "Base Clientes 360", "Score de Churn", "Recebíveis e Inadimplência"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Nome do artefato</label>
              <input type="text" placeholder="ex: consolidado_comercial" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 font-mono placeholder-slate-600" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Formato de saída</label>
            <div className="grid grid-cols-4 gap-2">
              {(["parquet", "duckdb", "csv", "xlsx"] as const).map((fmt) => (
                <button key={fmt} onClick={() => setForm({ ...form, format: fmt })} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all", form.format === fmt ? "border-blue-500/40 bg-blue-500/10" : "border-slate-700/40 hover:border-slate-600")}>
                  {formatIcon[fmt]}
                  <span className="text-[11px] font-medium text-slate-300">{formatLabel[fmt]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Destino</label>
              <select value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                <option value="local">Local (download manual)</option>
                <option value="shared">Pasta compartilhada</option>
                <option value="s3">Bucket S3 (simulado)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Agendamento</label>
              <select value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} className="df-input w-full px-3 py-2 rounded-lg text-sm text-slate-300 appearance-none">
                <option value="manual">Manual</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Opções adicionais</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "compress", label: "Compactar artefato" },
                { key: "partition", label: "Particionar por data" },
                { key: "docs", label: "Incluir documentação" },
                { key: "manifest", label: "Gerar manifesto de schema" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/3 transition-colors">
                  <div
                    onClick={() => setForm({ ...form, [opt.key]: !form[opt.key as keyof typeof form] })}
                    className={cn("h-4 w-4 rounded border flex items-center justify-center transition-colors", form[opt.key as keyof typeof form] ? "border-blue-500/60 bg-blue-500/20" : "border-slate-600")}
                  >
                    {form[opt.key as keyof typeof form] && <div className="h-2 w-2 rounded-sm bg-blue-400" />}
                  </div>
                  <span className="text-xs text-slate-400">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handlePublish}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
          >
            <Share2 size={14} className="inline mr-2" />
            Criar publicação
          </button>
        </div>
      </Modal>

      {/* Metadata Modal */}
      <Modal open={!!showMetadata} onClose={() => setShowMetadata(null)} title="Metadados do artefato" subtitle={showMetadata?.name} size="md">
        {showMetadata && (
          <div className="p-5 space-y-3">
            {[
              { label: "Nome", value: showMetadata.name },
              { label: "Formato", value: formatLabel[showMetadata.format] },
              { label: "Tamanho", value: showMetadata.size },
              { label: "Pipeline de origem", value: showMetadata.pipeline },
              { label: "Destino", value: showMetadata.destination },
              { label: "Última geração", value: showMetadata.generatedAt },
              { label: "Total de downloads", value: String(showMetadata.downloads) },
              { label: "SHA-256 (simulado)", value: "a3f4b2c1d8e9f0...3a2b1c", mono: true },
              { label: "Versão do schema", value: "v1.4.0" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800/40">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className={cn("text-xs text-slate-300", item.mono && "font-mono text-blue-400")}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};
