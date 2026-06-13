import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookTemplate, Database, ArrowRight, Copy, Edit3, Eye, Play,
  Code2, Check, Tag,
} from "lucide-react";
import { Modal } from "../components/shared/Modal";
import { SqlEditor } from "../components/shared/SqlEditor";

import { useToast } from "../components/shared/Toast";
import { mockTransformTemplates } from "../data/mockData";
import { cn } from "../utils/cn";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  comercial: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  financeiro: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  atendimento: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  operacional: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
};

const templateSqlMap: Record<string, string> = {
  "tpl-1": `-- Base de Clientes 360
-- Unifica ERP, CRM e Atendimento

WITH crm_data AS (
  SELECT id_cliente, MAX(dt_contato) AS ultimo_contato,
         COUNT(*) AS interacoes_crm
  FROM read_json_auto('crm_api.json')
  GROUP BY id_cliente
),
atend_data AS (
  SELECT id_cliente,
         AVG(tempo_resolucao_horas) AS tma,
         SUM(CASE WHEN tipo='reclamação' THEN 1 ELSE 0 END) AS reclamações
  FROM atendimentos
  GROUP BY id_cliente
)
SELECT
  c.*,
  crm.interacoes_crm,
  crm.ultimo_contato,
  at.tma               AS tma_atendimento,
  at.reclamações,
  -- Score de saúde 0–100
  LEAST(100, 100 - (at.reclamações * 10)) AS health_score
FROM clientes c
LEFT JOIN crm_data  crm USING (id_cliente)
LEFT JOIN atend_data at  USING (id_cliente)
WHERE c.status = 'ativo';`,
  "tpl-4": `-- Score de Churn
-- Combina inadimplência + atendimentos + tenure

WITH churn_features AS (
  SELECT
    c.id_cliente,
    c.segmento,
    DATEDIFF('month', c.dt_cadastro, CURRENT_DATE) AS tenure_meses,
    COALESCE(cob.atraso_medio, 0)  AS atraso_medio,
    COALESCE(at.reclamações, 0)    AS reclamações_90d,
    COALESCE(cob.pct_vencidas, 0)  AS pct_inadimplencia
  FROM clientes c
  LEFT JOIN (
    SELECT id_cliente,
      AVG(atraso_dias) AS atraso_medio,
      ROUND(SUM(CASE WHEN status='vencida' THEN 1.0 ELSE 0 END)
            / COUNT(*) * 100, 2) AS pct_vencidas
    FROM cobranças GROUP BY id_cliente
  ) cob USING (id_cliente)
  LEFT JOIN (
    SELECT id_cliente,
      SUM(CASE WHEN tipo='reclamação' THEN 1 ELSE 0 END) AS reclamações
    FROM atendimentos
    WHERE dt_abertura >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY id_cliente
  ) at USING (id_cliente)
)
SELECT *,
  LEAST(100, ROUND(
    atraso_medio * 2 +
    reclamações_90d * 5 +
    pct_inadimplencia * 0.5
  )) AS churn_score,
  CASE WHEN churn_score >= 70 THEN 'alto'
       WHEN churn_score >= 40 THEN 'médio'
       ELSE 'baixo' END AS risco
FROM churn_features
ORDER BY churn_score DESC;`,
};

export const Templates: React.FC = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewSqlTemplate, setViewSqlTemplate] = useState<(typeof mockTransformTemplates)[0] | null>(null);
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);

  const categories = ["comercial", "financeiro", "atendimento", "operacional"];
  const filtered = activeCategory
    ? mockTransformTemplates.filter((t) => t.category === activeCategory)
    : mockTransformTemplates;

  const handleUse = (tpl: typeof mockTransformTemplates[0]) => {
    setUsedTemplates((prev) => [...prev, tpl.id]);
    toast("success", `Template aplicado: ${tpl.name}`, "Pipeline criado com base no template. Configure as fontes no Pipeline Builder.");
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-200">Modelos de Transformação</h2>
          <p className="text-xs text-slate-500 mt-0.5">{mockTransformTemplates.length} templates disponíveis · Prontos para uso</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all", activeCategory === null ? "border-blue-500/40 bg-blue-500/10 text-blue-300" : "border-slate-700/40 text-slate-500 hover:border-slate-600")}
        >
          Todos ({mockTransformTemplates.length})
        </button>
        {categories.map((cat) => {
          const cfg = categoryColors[cat];
          const count = mockTransformTemplates.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize", activeCategory === cat ? `${cfg.bg} ${cfg.text} ${cfg.border}` : "border-slate-700/40 text-slate-500 hover:border-slate-600")}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((tpl, i) => {
          const catCfg = categoryColors[tpl.category];
          const isUsed = usedTemplates.includes(tpl.id);
          return (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl overflow-hidden"
              style={{ background: "rgba(5,14,31,0.7)", border: "1px solid rgba(59,130,246,0.12)" }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("p-2 rounded-lg", catCfg.bg)}>
                      <BookTemplate size={15} className={catCfg.text} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">{tpl.name}</h3>
                      <span className={cn("text-[10px] font-medium capitalize px-1.5 py-0.5 rounded", catCfg.bg, catCfg.text)}>
                        {tpl.category}
                      </span>
                    </div>
                  </div>
                  {tpl.usageCount > 0 && (
                    <span className="text-[10px] text-slate-500 bg-slate-800/40 px-1.5 py-0.5 rounded border border-slate-700/30">
                      {tpl.usageCount}× usado
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">{tpl.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1.5">Fontes esperadas</p>
                    <div className="space-y-0.5">
                      {tpl.sources.map((s) => (
                        <div key={s} className="flex items-center gap-1.5">
                          <Database size={9} className="text-slate-500" />
                          <span className="text-[11px] text-slate-400">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1.5">Saídas geradas</p>
                    <div className="space-y-0.5">
                      {tpl.outputs.map((o) => (
                        <div key={o} className="flex items-center gap-1.5">
                          <ArrowRight size={9} className="text-slate-500" />
                          <span className="text-[11px] text-slate-400 font-mono">{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1.5">Principais transformações</p>
                  <div className="flex flex-wrap gap-1">
                    {tpl.transformations.map((t) => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/50 border border-slate-700/30 text-[10px] text-slate-400">
                        <Tag size={8} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUse(tpl)}
                    disabled={isUsed}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-60 transition-all"
                    style={{ background: isUsed ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
                  >
                    {isUsed ? <Check size={11} className="text-emerald-400" /> : <Play size={11} />}
                    {isUsed ? "Aplicado" : "Usar template"}
                  </button>
                  {templateSqlMap[tpl.id] && (
                    <button
                      onClick={() => setViewSqlTemplate(tpl)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 hover:text-slate-200 transition-colors"
                    >
                      <Eye size={11} />
                      Ver SQL
                    </button>
                  )}
                  <button
                    onClick={() => toast("info", "Duplicado", `Template "${tpl.name}" copiado.`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 hover:text-slate-200 transition-colors"
                  >
                    <Copy size={11} />
                    Duplicar
                  </button>
                  <button
                    onClick={() => toast("info", "Editando", "Abra o Pipeline Builder para editar.")}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 hover:text-slate-200 transition-colors"
                  >
                    <Edit3 size={11} />
                    Editar
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SQL Modal */}
      <Modal
        open={!!viewSqlTemplate}
        onClose={() => setViewSqlTemplate(null)}
        title={viewSqlTemplate?.name ?? ""}
        subtitle="SQL principal da transformação"
        size="xl"
      >
        <div className="p-5">
          <SqlEditor
            value={templateSqlMap[viewSqlTemplate?.id ?? ""] ?? "-- SQL não disponível para este template"}
            readOnly
            height="420px"
          />
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => {
                toast("success", "Template aplicado", "Pipeline criado com sucesso.");
                setViewSqlTemplate(null);
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
            >
              <Play size={13} className="inline mr-1.5" />
              Usar este template
            </button>
            <button
              onClick={() => toast("info", "Copiado", "SQL copiado para a área de transferência.")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 transition-colors"
            >
              <Code2 size={13} />
              Copiar SQL
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
