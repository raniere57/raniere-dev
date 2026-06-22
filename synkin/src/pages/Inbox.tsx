import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/Buttons";
import { StatusBadge, AIBadge } from "../components/ui/Badges";
import { useApp } from "../state/AppContext";
import { conversations } from "../data/mockData";
import { cn } from "../utils/cn";
import {
  Send,
  Sparkles,
  Edit3,
  X,
  Tag,
  Flame,
  Thermometer,
  Snowflake,
  StickyNote,
  History,
} from "lucide-react";

const intentLabels: Record<string, { label: string; color: string }> = {
  interesse_comercial: { label: "Interesse comercial", color: "emerald" },
  networking: { label: "Networking", color: "blue" },
  duvida: { label: "Dúvida", color: "violet" },
  spam: { label: "Spam", color: "rose" },
};

const tempConfig: Record<string, { icon: React.ElementType; color: string; label: string; ring: string }> = {
  quente: { icon: Flame, color: "text-rose-400", label: "Quente", ring: "ring-rose-500/30" },
  morno: { icon: Thermometer, color: "text-amber-400", label: "Morno", ring: "ring-amber-500/30" },
  frio: { icon: Snowflake, color: "text-sky-400", label: "Frio", ring: "ring-sky-500/30" },
};

export function InboxPage() {
  const { pushToast } = useApp();
  const [filter, setFilter] = useState<string>("todos");
  const [selectedId, setSelectedId] = useState<string>(conversations[0].id);
  const [editedReply, setEditedReply] = useState<string>("");
  const [showEdit, setShowEdit] = useState(false);

  const selected = conversations.find((c) => c.id === selectedId)!;
  const filtered = filter === "todos" ? conversations : filter === "quente" || filter === "morno" || filter === "frio" ? conversations.filter((c) => c.temperature === filter) : conversations.filter((c) => c.status === filter);

  const counts = {
    todos: conversations.length,
    quente: conversations.filter((c) => c.temperature === "quente").length,
    morno: conversations.filter((c) => c.temperature === "morno").length,
    frio: conversations.filter((c) => c.temperature === "frio").length,
    aguardando: conversations.filter((c) => c.status === "aguardando").length,
  };

  const sendReply = () => {
    pushToast({ title: "Mensagem aprovada!", description: "Em produção, seria enviada ao LinkedIn.", type: "success" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50 light:text-slate-900">Inbox / CRM</h2>
          <p className="mt-1 text-sm text-slate-400">Conversas, leads e relacionamento — com copiloto IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        {/* Column 1: Conversation list */}
        <div className="lg:col-span-3">
          <GlassCard padding="none" className="lg:sticky lg:top-20">
            <div className="border-b border-white/[0.06] p-3 light:border-slate-200/60">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "todos", label: "Todos", count: counts.todos },
                  { id: "quente", label: "Quentes", count: counts.quente },
                  { id: "morno", label: "Mornos", count: counts.morno },
                  { id: "frio", label: "Frios", count: counts.frio },
                  { id: "aguardando", label: "Aguardando", count: counts.aguardando },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                      filter === f.id
                        ? "bg-blue-500/20 text-blue-300 light:bg-blue-50 light:text-blue-700"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 light:bg-slate-100 light:text-slate-600"
                    )}
                  >
                    {f.label}
                    <span className="rounded-full bg-white/10 px-1.5 text-[9px] light:bg-slate-200">{f.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
              {filtered.map((c) => {
                const TempIcon = tempConfig[c.temperature].icon;
                const isSelected = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "flex w-full items-start gap-2.5 border-b border-white/[0.04] p-3 text-left transition-colors light:border-slate-100",
                      isSelected ? "bg-blue-500/10 light:bg-blue-50" : "hover:bg-white/[0.02] light:hover:bg-slate-50"
                    )}
                  >
                    <div className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white", c.avatarColor)}>
                      {c.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-semibold text-slate-100 light:text-slate-900">{c.name}</p>
                        <TempIcon className={cn("h-3 w-3 flex-shrink-0", tempConfig[c.temperature].color)} />
                      </div>
                      <p className="truncate text-[10px] text-slate-500">{c.role}</p>
                      <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">{c.lastMessage}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-500">{c.lastTime}</span>
                        {c.unread > 0 && (
                          <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-blue-500 px-1 text-[8px] font-bold text-white">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Column 2: Thread */}
        <div className="lg:col-span-6">
          <GlassCard padding="none" className="flex h-full flex-col">
            {/* Thread header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] p-4 light:border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white", selected.avatarColor)}>
                  {selected.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100 light:text-slate-900">{selected.name}</p>
                  <p className="text-[11px] text-slate-500">{selected.role} · {selected.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusBadge variant={tempConfig[selected.temperature].label === "Quente" ? "danger" : tempConfig[selected.temperature].label === "Morno" ? "warning" : "info"}>
                  {tempConfig[selected.temperature].label}
                </StatusBadge>
                <StatusBadge variant={intentLabels[selected.intent].color as any}>
                  {intentLabels[selected.intent].label}
                </StatusBadge>
              </div>
            </div>

            {/* AI Summary */}
            <div className="m-4 rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-3.5 light:border-violet-200 light:bg-violet-50/40">
              <div className="mb-1.5 flex items-center gap-2">
                <AIBadge />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Resumo da thread</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-200 light:text-slate-800">{selected.threadSummary}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
              {selected.messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
                      m.from === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                        : "bg-white/[0.05] text-slate-200 light:bg-slate-100 light:text-slate-800"
                    )}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    <p className={cn("mt-1 text-[10px]", m.from === "user" ? "text-blue-100" : "text-slate-500")}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Reply suggestion */}
            <div className="border-t border-white/[0.06] p-4 light:border-slate-200/60">
              <div className="mb-2 flex items-center justify-between">
                <AIBadge />
                <span className="text-[10px] text-slate-500">Sugestão de próxima resposta</span>
              </div>
              {showEdit ? (
                <textarea
                  value={editedReply || selected.nextReplySuggestion}
                  onChange={(e) => setEditedReply(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500/50 light:border-slate-200 light:bg-white"
                />
              ) : (
                <p className="rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-3 text-sm leading-relaxed text-slate-100 light:border-violet-200 light:bg-violet-50/40 light:text-slate-900">
                  {editedReply || selected.nextReplySuggestion}
                </p>
              )}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <GlowButton size="sm" variant="success" onClick={sendReply}>
                  <Send className="h-3.5 w-3.5" /> Aprovar e enviar
                </GlowButton>
                <GlowButton size="sm" variant="secondary" onClick={() => setShowEdit(!showEdit)}>
                  <Edit3 className="h-3.5 w-3.5" /> {showEdit ? "Salvar edição" : "Editar"}
                </GlowButton>
                <GlowButton size="sm" variant="ghost">
                  <X className="h-3.5 w-3.5" /> Descartar
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Column 3: Lead info */}
        <div className="lg:col-span-3">
          <GlassCard className="lg:sticky lg:top-20">
            <div className="text-center">
              <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white", selected.avatarColor)}>
                {selected.initials}
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-50 light:text-slate-900">{selected.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{selected.role}</p>
              <p className="text-xs text-slate-500">{selected.company}</p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 light:border-slate-200 light:bg-slate-50">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Lead score</p>
                  <span className={cn(
                    "rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums",
                    selected.score >= 80 ? "bg-rose-500/15 text-rose-300" :
                    selected.score >= 60 ? "bg-amber-500/15 text-amber-300" :
                    "bg-sky-500/15 text-sky-300"
                  )}>
                    {selected.score}/100
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300 light:text-slate-700">
                  <Sparkles className="mr-0.5 inline h-2.5 w-2.5 text-violet-400" /> {selected.temperatureReason}
                </p>
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((t, i) => (
                    <span key={i} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-slate-300 light:border-slate-200 light:bg-slate-100 light:text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <History className="h-3 w-3" /> Histórico
                </p>
                <div className="space-y-1.5">
                  {selected.history.length === 0 ? (
                    <p className="text-[11px] text-slate-500">Sem interações anteriores.</p>
                  ) : (
                    selected.history.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="h-1 w-1 rounded-full bg-slate-500" />
                        <span>{h.type}</span>
                        <span className="ml-auto text-[10px] text-slate-500">{h.date}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-3 light:border-blue-200 light:bg-blue-50/40">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300 light:text-blue-700">Próxima ação</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-200 light:text-slate-800">{selected.nextAction}</p>
              </div>

              {selected.notes && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-3 light:border-amber-200 light:bg-amber-50/40">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 light:text-amber-700 flex items-center gap-1">
                    <StickyNote className="h-3 w-3" /> Notas internas
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-200 light:text-slate-800">{selected.notes}</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
