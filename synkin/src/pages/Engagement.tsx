import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/Buttons";
import { StatusBadge, AIBadge } from "../components/ui/Badges";
import { useApp } from "../state/AppContext";
import { engagementOpportunities } from "../data/mockData";
import { cn } from "../utils/cn";
import {
  Heart,
  CheckCheck,
  Edit3,
  X,
  Filter,
  Users2,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { LinkedinIcon } from "../components/layout/LinkedinIcon";

const typeLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  influenciador: { label: "Influenciador", icon: Users2, color: "blue" },
  pergunta_aberta: { label: "Pergunta aberta", icon: HelpCircle, color: "violet" },
  trend_setor: { label: "Trend do setor", icon: TrendingUp, color: "emerald" },
};



export function EngagementPage() {
  const { pushToast } = useApp();
  const [filter, setFilter] = useState<string>("todos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedComments, setEditedComments] = useState<Record<string, string>>({});
  const [processed, setProcessed] = useState<Record<string, "approved" | "rejected" | "liked">>({});

  const filtered = filter === "todos" ? engagementOpportunities : engagementOpportunities.filter((o) => o.type === filter);

  const handleApprove = (id: string) => {
    setProcessed((p) => ({ ...p, [id]: "approved" }));
    pushToast({ title: "Comentário aprovado!", description: "Em produção, seria postado no LinkedIn.", type: "success" });
  };

  const handleLike = (id: string) => {
    setProcessed((p) => ({ ...p, [id]: "liked" }));
    pushToast({ title: "Curtida registrada", description: "Em produção, seria enviada ao post.", type: "info" });
  };

  const handleReject = (id: string) => {
    setProcessed((p) => ({ ...p, [id]: "rejected" }));
    pushToast({ title: "Oportunidade descartada", type: "info" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50 light:text-slate-900">Copiloto de engajamento</h2>
          <p className="mt-1 text-sm text-slate-400">Oportunidades de visibilidade detectadas pela IA</p>
        </div>
      </div>

      {/* Banner */}
      <GlassCard padding="sm" className="border-violet-500/20 bg-violet-500/[0.04] light:bg-violet-50/40 light:border-violet-200/60">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 light:bg-violet-100">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-100 light:text-slate-900">
              A IA nunca comenta ou curte sozinha. Cada ação passa por você.
            </p>
            <p className="mt-0.5 text-xs text-slate-400 light:text-slate-600">
              Você pode editar o texto antes de aprovar, ou simplesmente descartar a oportunidade.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-slate-500" />
        {[
          { id: "todos", label: "Todas" },
          { id: "influenciador", label: "Influenciadores" },
          { id: "pergunta_aberta", label: "Perguntas abertas" },
          { id: "trend_setor", label: "Trends do setor" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === f.id
                ? "border-blue-500/50 bg-blue-500/10 text-blue-300 light:bg-blue-50 light:text-blue-700"
                : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/5 light:border-slate-200 light:bg-slate-50 light:hover:bg-slate-100"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Opportunities list */}
      <div className="space-y-4">
        {filtered.map((op, i) => {
          const cfg = typeLabels[op.type];
          const TypeIcon = cfg.icon;
          const isProcessed = !!processed[op.id];
          const comment = editedComments[op.id] ?? op.suggestedComment;
          const isEditing = editingId === op.id;

          return (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard padding="none" className={cn("transition-all", isProcessed && "opacity-60")}>
                <div className="p-5">
                  {/* Header */}
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                      {op.author.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-100 light:text-slate-900">{op.author}</p>
                        <span className="text-xs text-slate-500">· {op.authorRole}</span>
                        <LinkedinIcon className="h-3 w-3 text-blue-400" />
                        <span className="text-[10px] text-slate-500">{op.authorFollowers.toLocaleString("pt-BR")} seguidores</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <StatusBadge variant={cfg.color as any}>
                          <TypeIcon className="h-3 w-3" /> {cfg.label}
                        </StatusBadge>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Eye className="h-2.5 w-2.5" /> {op.engagement.toLocaleString("pt-BR")} interações
                        </span>
                        <span className="text-[10px] text-violet-400">· {op.reason}</span>
                      </div>
                    </div>
                    {isProcessed && (
                      <StatusBadge variant={processed[op.id] === "approved" ? "success" : processed[op.id] === "liked" ? "info" : "default"}>
                        {processed[op.id] === "approved" ? "Comentário aprovado" : processed[op.id] === "liked" ? "Curtido" : "Descartado"}
                      </StatusBadge>
                    )}
                  </div>

                  {/* Post preview */}
                  <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 light:border-slate-200 light:bg-slate-50">
                    <p className="text-sm leading-relaxed text-slate-300 light:text-slate-800">{op.preview}</p>
                  </div>

                  {/* AI suggestion */}
                  <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-4 light:border-violet-200 light:bg-violet-50/40">
                    <div className="mb-2 flex items-center justify-between">
                      <AIBadge />
                      <span className="text-[10px] text-slate-500">Comentário sugerido</span>
                    </div>
                    {isEditing ? (
                      <textarea
                        value={comment}
                        onChange={(e) => setEditedComments((p) => ({ ...p, [op.id]: e.target.value }))}
                        rows={5}
                        className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-sm text-slate-100 outline-none focus:border-blue-500/50 light:border-slate-200 light:bg-white"
                      />
                    ) : (
                      <p className="text-sm leading-relaxed text-slate-100 light:text-slate-900">{comment}</p>
                    )}
                  </div>

                  {/* Actions */}
                  {!isProcessed && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <GlowButton size="sm" variant="success" onClick={() => handleApprove(op.id)}>
                        <CheckCheck className="h-3.5 w-3.5" /> Aprovar comentário
                      </GlowButton>
                      <GlowButton size="sm" variant="secondary" onClick={() => setEditingId(isEditing ? null : op.id)}>
                        <Edit3 className="h-3.5 w-3.5" /> {isEditing ? "Salvar edição" : "Editar"}
                      </GlowButton>
                      <GlowButton size="sm" variant="violet" onClick={() => handleLike(op.id)}>
                        <Heart className="h-3.5 w-3.5" /> Curtir também
                      </GlowButton>
                      <GlowButton size="sm" variant="ghost" onClick={() => handleReject(op.id)}>
                        <X className="h-3.5 w-3.5" /> Ignorar
                      </GlowButton>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
