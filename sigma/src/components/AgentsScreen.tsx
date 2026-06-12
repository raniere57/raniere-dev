import { useMemo, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Bot,
  Eye,
  GitCompareArrows,
  History,
  Pencil,
  Plus,
  Rocket,
  RotateCcw,
  X,
} from "lucide-react";
import clsx from "clsx";

import {
  agentDisplayName,
  currentVersionNumber,
  diffSummary,
  diffVersions,
  versionLabel,
  type Agent,
} from "../lib/agents";

type AgentsScreenProps = {
  agents: Agent[];
  onOpen: (agentId: string, mode: "view" | "edit") => void;
  onCreate: () => void;
  onArchiveToggle: (agentId: string) => void;
  onRestore: (agentId: string, version: number) => void;
  onPublish: (agentId: string, version?: number) => void;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function AgentsScreen({ agents, onOpen, onCreate, onArchiveToggle, onRestore, onPublish }: AgentsScreenProps) {
  const [historyAgentId, setHistoryAgentId] = useState<string | null>(null);

  const activeAgents = agents.filter((agent) => agent.status === "active");
  const archivedAgents = agents.filter((agent) => agent.status === "archived");
  const historyAgent = agents.find((agent) => agent.id === historyAgentId) ?? null;

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_18%_12%,rgba(199,255,61,.10),transparent_24%),linear-gradient(135deg,#070908_0%,#0d1210_52%,#080808_100%)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid">agentes</p>
            <h2 className="mt-2 text-2xl font-semibold">Organizações de atendimento</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-steel">
              Cada agente é um fluxo de atendimento próprio. Construa, versione e teste de forma isolada e segura.
            </p>
          </div>
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-acid/35 bg-acid px-3.5 text-sm font-semibold text-black shadow-[0_12px_36px_rgba(199,255,61,.18)] outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-acid/50 active:scale-[.98]"
          >
            <Plus size={16} />
            Novo agente
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
          {activeAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onOpen={onOpen}
              onArchiveToggle={onArchiveToggle}
              onHistory={() => setHistoryAgentId(agent.id)}
            />
          ))}
        </div>

        {archivedAgents.length > 0 && (
          <>
            <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-steel">Arquivados</h3>
            <div className="mt-4 grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
              {archivedAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onOpen={onOpen}
                  onArchiveToggle={onArchiveToggle}
                  onHistory={() => setHistoryAgentId(agent.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {historyAgent && (
        <HistoryModal
          agent={historyAgent}
          onClose={() => setHistoryAgentId(null)}
          onRestore={onRestore}
          onPublish={onPublish}
        />
      )}
    </section>
  );
}

type AgentCardProps = {
  agent: Agent;
  onOpen: (agentId: string, mode: "view" | "edit") => void;
  onArchiveToggle: (agentId: string) => void;
  onHistory: () => void;
};

function AgentCard({ agent, onOpen, onArchiveToggle, onHistory }: AgentCardProps) {
  const areaCount = agent.draft.filter((node) => node.data.role === "specialist").length;
  const isArchived = agent.status === "archived";

  return (
    <div
      className={clsx(
        "flex flex-col rounded-[10px] border border-white/10 bg-[#0a0e0c]/86 p-5 shadow-node backdrop-blur transition",
        isArchived ? "opacity-60" : "hover:border-white/20",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-acid">
            <Bot size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">{agent.name}</h3>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-acid">
              {versionLabel(agent.publishedVersion)} publicada · {areaCount} escopo(s)
            </p>
          </div>
        </div>
        <span
          className={clsx(
            "shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]",
            isArchived ? "bg-white/[.06] text-steel" : "bg-acid/15 text-acid",
          )}
        >
          {isArchived ? "arquivado" : "ativo"}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-steel">{agent.description || "Sem descrição."}</p>

      <p className="mt-3 font-mono text-[10px] text-steel">Atualizado {formatDate(agent.updatedAt)}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onOpen(agent.id, "view")}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.04] text-xs font-medium text-white outline-none transition hover:border-acid/45 hover:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-acid/40"
        >
          <Eye size={14} />
          Ver
        </button>
        <button
          type="button"
          onClick={() => onOpen(agent.id, "edit")}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.04] text-xs font-medium text-white outline-none transition hover:border-acid/45 hover:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-acid/40"
        >
          <Pencil size={14} />
          Editar
        </button>
        <button
          type="button"
          onClick={onHistory}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.04] text-xs font-medium text-white outline-none transition hover:border-acid/45 hover:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-acid/40"
        >
          <History size={14} />
          Histórico
        </button>
        <button
          type="button"
          onClick={() => onArchiveToggle(agent.id)}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.04] text-xs font-medium text-steel outline-none transition hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40"
        >
          {isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
          {isArchived ? "Restaurar" : "Arquivar"}
        </button>
      </div>
    </div>
  );
}

type HistoryModalProps = {
  agent: Agent;
  onClose: () => void;
  onRestore: (agentId: string, version: number) => void;
  onPublish: (agentId: string, version?: number) => void;
};

function HistoryModal({ agent, onClose, onRestore, onPublish }: HistoryModalProps) {
  const versions = useMemo(() => [...agent.versions].sort((a, b) => b.version - a.version), [agent.versions]);
  const [selectedVersion, setSelectedVersion] = useState<number>(versions[0]?.version ?? 1);

  const current = agent.versions.find((entry) => entry.version === selectedVersion) ?? null;
  const previous = useMemo(() => {
    const earlier = agent.versions.filter((entry) => entry.version < selectedVersion);
    return earlier.length > 0 ? earlier[earlier.length - 1] : null;
  }, [agent.versions, selectedVersion]);

  const diffs = useMemo(() => {
    if (!current) return [];
    return diffVersions(previous?.nodes ?? [], current.nodes).filter((diff) => diff.change !== "unchanged");
  }, [current, previous]);

  const editingVersionNum = currentVersionNumber(agent);
  const isEditing = current?.version === editingVersionNum;
  const isPublished = current?.version === agent.publishedVersion;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[12px] border border-white/10 bg-[#0a0e0c] shadow-[0_24px_80px_rgba(0,0,0,.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">histórico de versões</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{agentDisplayName(agent)}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/[.04] text-steel outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40"
            title="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[240px_minmax(0,1fr)] max-md:grid-cols-1">
          <div className="min-h-0 overflow-y-auto border-r border-white/10 p-3 max-md:max-h-44 max-md:border-r-0 max-md:border-b">
            {versions.map((version) => (
              <button
                key={version.version}
                type="button"
                onClick={() => setSelectedVersion(version.version)}
                className={clsx(
                  "mb-2 flex w-full flex-col items-start gap-1 rounded-md border px-3 py-2.5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40",
                  version.version === selectedVersion
                    ? "border-acid/45 bg-acid/10"
                    : "border-white/10 bg-white/[.03] hover:border-white/20",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-acid">{versionLabel(version.version)}</span>
                  <span className="flex items-center gap-1">
                    {version.version === agent.publishedVersion && (
                      <span className="rounded-full bg-acid/15 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-acid">publicada</span>
                    )}
                    {version.version === editingVersionNum && (
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-steel">edição</span>
                    )}
                  </span>
                </div>
                <span className="line-clamp-1 text-xs text-white">{version.note}</span>
                <span className="font-mono text-[9px] text-steel">{formatDate(version.createdAt)}</span>
              </button>
            ))}
          </div>

          <div className="min-h-0 overflow-y-auto p-5">
            {current && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-steel">
                    <GitCompareArrows size={15} className="text-acid" />
                    <span>
                      {previous ? `${versionLabel(previous.version)} → ${versionLabel(current.version)}` : `${versionLabel(current.version)} (inicial)`}
                    </span>
                    <span className="text-white/30">·</span>
                    <span>{diffSummary(diffVersions(previous?.nodes ?? [], current.nodes))}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isEditing}
                      onClick={() => {
                        onRestore(agent.id, current.version);
                        onClose();
                      }}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-white/[.04] px-3 text-xs font-medium text-white outline-none transition hover:border-acid/45 hover:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-acid/40 disabled:cursor-not-allowed disabled:opacity-40"
                      title={isEditing ? "Já está aberta no editor" : "Carregar esta versão no editor"}
                    >
                      <RotateCcw size={14} />
                      Carregar no editor
                    </button>
                    <button
                      type="button"
                      disabled={isPublished}
                      onClick={() => onPublish(agent.id, current.version)}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-acid/35 bg-acid px-3 text-xs font-semibold text-black outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-acid/50 disabled:cursor-not-allowed disabled:opacity-40"
                      title={isPublished ? "Já é a versão publicada" : "Publicar esta versão"}
                    >
                      <Rocket size={14} />
                      {isPublished ? "Publicada" : "Publicar"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {diffs.length === 0 ? (
                    <p className="rounded-md border border-white/10 bg-black/20 px-4 py-6 text-center text-sm text-steel">
                      {previous ? "Nenhuma diferença em relação à versão anterior." : "Versão inicial do agente."}
                    </p>
                  ) : (
                    diffs.map((diff) => (
                      <div key={diff.id} className="rounded-md border border-white/10 bg-black/20 p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={clsx(
                              "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]",
                              diff.change === "added" && "bg-acid/15 text-acid",
                              diff.change === "removed" && "bg-red-500/15 text-red-300",
                              diff.change === "changed" && "bg-amber-400/15 text-amber-300",
                            )}
                          >
                            {diff.change === "added" ? "adicionada" : diff.change === "removed" ? "removida" : "alterada"}
                          </span>
                          <span className="text-sm font-semibold text-white">{diff.label}</span>
                        </div>
                        {diff.fields.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {diff.fields.map((field) => (
                              <div key={field.label} className="rounded border border-white/10 bg-black/30 px-3 py-2">
                                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{field.label}</p>
                                <div className="mt-1 grid gap-1 text-xs leading-5 md:grid-cols-2">
                                  <p className="whitespace-pre-wrap text-red-300/90 line-through decoration-red-400/40">{field.before}</p>
                                  <p className="whitespace-pre-wrap text-acid/90">{field.after}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
