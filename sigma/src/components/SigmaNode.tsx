import { useRef, useState } from "react";
import { NodeProps, NodeToolbar, Position } from "@xyflow/react";
import {
  Banknote,
  BrainCircuit,
  Copy,
  Headphones,
  MoreHorizontal,
  RadioTower,
  Settings2,
  ShieldCheck,
  Target,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import clsx from "clsx";

const iconByKind = {
  reception: UserRoundCheck,
  finance: Banknote,
  support: Headphones,
  retention: ShieldCheck,
  commercial: Target,
  operations: RadioTower,
} as const;

const labelByKind = {
  reception: "recepção",
  finance: "financeiro",
  support: "suporte",
  retention: "retenção",
  commercial: "comercial",
  operations: "operação",
} as const;

type NodeData = {
  nodeId?: string;
  label: string;
  kind: keyof typeof iconByKind;
  status: "idle" | "running" | "completed";
  model?: string;
  systemPrompt?: string;
  description?: string;
  role?: "reception" | "specialist";
  tools?: string[];
  canRemove?: boolean;
  onConfigure?: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
  onRemove?: (nodeId: string) => void;
};

export function SigmaNode({ id, data, selected }: NodeProps) {
  const node = data as NodeData;
  const nodeId = node.nodeId ?? id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const downEventHandledRef = useRef(false);
  const Icon = iconByKind[node.kind] ?? BrainCircuit;

  return (
    <div
      className={clsx(
        "group relative min-w-56 rounded-[7px] border bg-[#0b0f0d]/95 px-4 py-3 shadow-node backdrop-blur transition duration-200",
        selected ? "border-acid shadow-glow" : "border-[#26322e]",
        node.status === "running" && "border-ember",
        node.status === "completed" && "border-acid/70",
      )}
    >
      <NodeToolbar
        nodeId={nodeId}
        isVisible
        position={Position.Top}
        align="end"
        offset={-32}
        className="nodrag nopan pointer-events-auto"
      >
        <div className="relative">
          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
              if (!downEventHandledRef.current) {
                downEventHandledRef.current = true;
                setIsMenuOpen((current) => !current);
              }
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
              if (!downEventHandledRef.current) {
                downEventHandledRef.current = true;
                setIsMenuOpen((current) => !current);
              }
            }}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              if (downEventHandledRef.current) {
                downEventHandledRef.current = false;
                return;
              }
              setIsMenuOpen((current) => !current);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.stopPropagation();
                event.preventDefault();
                setIsMenuOpen((current) => !current);
              }
            }}
            className={clsx(
              "pointer-events-auto grid h-7 w-7 place-items-center rounded-md text-steel outline-none transition hover:bg-white/[.08] hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40",
              isMenuOpen && "bg-white/[.08] text-white",
            )}
            aria-label={`Ações de ${node.label}`}
            aria-expanded={isMenuOpen}
          >
            <MoreHorizontal size={16} />
          </button>

          {isMenuOpen && (
            <div
              className="pointer-events-auto absolute right-0 top-8 z-40 w-40 overflow-hidden rounded-md border border-white/10 bg-[#101512] py-1 shadow-[0_18px_50px_rgba(0,0,0,.42)]"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  node.onConfigure?.(nodeId);
                }}
                className="flex h-9 w-full items-center gap-2 px-3 text-left text-xs font-medium text-[#dce5df] outline-none transition hover:bg-white/[.07] focus-visible:bg-white/[.07]"
              >
                <Settings2 size={14} />
                Configurar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  node.onDuplicate?.(nodeId);
                }}
                className="flex h-9 w-full items-center gap-2 px-3 text-left text-xs font-medium text-[#dce5df] outline-none transition hover:bg-white/[.07] focus-visible:bg-white/[.07]"
              >
                <Copy size={14} />
                Duplicar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  node.onRemove?.(nodeId);
                }}
                disabled={!node.canRemove}
                className="flex h-9 w-full items-center gap-2 px-3 text-left text-xs font-medium text-ember outline-none transition hover:bg-ember/10 focus-visible:bg-ember/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={14} />
                Remover
              </button>
            </div>
          )}
        </div>
      </NodeToolbar>
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            "mt-0.5 grid h-9 w-9 place-items-center rounded-md border",
            node.status === "completed" ? "border-acid/50 bg-acid/10 text-acid" : "border-white/10 bg-white/[.04] text-steel",
          )}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-white">{node.label}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
              {labelByKind[node.kind] ?? "node"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel/70">
              {node.role === "reception" ? "classifica" : `${node.tools?.length ?? 0} tools`}
            </span>
            <span
              className={clsx(
                "h-1.5 w-1.5 rounded-full",
                node.status === "idle" && "bg-steel/45",
                node.status === "running" && "bg-ember",
                node.status === "completed" && "bg-acid",
              )}
            />
          </div>
          {node.description && <p className="mt-2 max-w-48 truncate text-[11px] leading-4 text-steel/80">{node.description}</p>}
          {node.model && <p className="mt-2 max-w-44 truncate font-mono text-[10px] text-steel/80">{node.model}</p>}
        </div>
      </div>
      {node.role === "reception" && (
        <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
          <BrainCircuit size={13} className="text-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">entrada oficial</span>
        </div>
      )}
    </div>
  );
}
