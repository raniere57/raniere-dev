import { useMemo, useState } from "react";
import { ChevronDown, Database, Globe, Search, Wrench, Zap } from "lucide-react";
import clsx from "clsx";

import { TOOL_CATALOG, toolsForScope, type ToolDefinition } from "../lib/tools";
import type { FlowNodeKind } from "../types/flow";

type ScopeFilter = "all" | FlowNodeKind;

const SCOPE_FILTERS: Array<{ id: ScopeFilter; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "reception", label: "Recepção" },
  { id: "finance", label: "Financeiro" },
  { id: "support", label: "Suporte" },
  { id: "retention", label: "Retenção" },
  { id: "commercial", label: "Comercial" },
  { id: "operations", label: "Operação" },
];

const SCOPE_LABEL: Record<string, string> = {
  reception: "Recepção",
  finance: "Financeiro",
  support: "Suporte",
  retention: "Retenção",
  commercial: "Comercial",
  operations: "Operação",
};

function toolsForFilter(filter: ScopeFilter): ToolDefinition[] {
  if (filter === "all") return TOOL_CATALOG;
  return toolsForScope(filter);
}

export function ToolsScreen() {
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [query, setQuery] = useState("");

  const tools = useMemo(() => {
    const base = toolsForFilter(scope);
    const term = query.trim().toLowerCase();
    if (!term) return base;
    return base.filter((tool) =>
      [tool.label, tool.id, tool.summary, tool.description].some((field) => field.toLowerCase().includes(term)),
    );
  }, [scope, query]);

  const executableCount = TOOL_CATALOG.filter((tool) => tool.executable).length;
  const integrationsCount = new Set(TOOL_CATALOG.filter((tool) => tool.integration).map((tool) => tool.integration)).size;

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_18%_12%,rgba(199,255,61,.10),transparent_24%),linear-gradient(135deg,#070908_0%,#0d1210_52%,#080808_100%)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid">tools</p>
          <h2 className="mt-2 text-2xl font-semibold">Catálogo de tools</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-steel">
            Capacidades que a IA pode acionar nos escopos. O cadastro acontece no código; aqui você consulta o que cada
            uma faz, suas entradas e o que devolve.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Stat label="tools" value={TOOL_CATALOG.length} />
          <Stat label="executáveis" value={executableCount} />
          <Stat label="integrações" value={integrationsCount} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar tool por nome, id ou descrição…"
              className="h-10 w-full rounded-md border border-white/10 bg-black/25 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-steel/65 hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SCOPE_FILTERS.map((filter) => {
            const count = toolsForFilter(filter.id).length;
            const active = scope === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setScope(filter.id)}
                className={clsx(
                  "inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40",
                  active
                    ? "border-acid/45 bg-acid/10 text-acid"
                    : "border-white/10 bg-white/[.03] text-steel hover:border-white/20 hover:text-white",
                )}
              >
                {filter.label}
                <span className="font-mono text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3">
          {tools.length === 0 ? (
            <p className="rounded-md border border-white/10 bg-black/20 px-4 py-6 text-sm text-steel">
              Nenhuma tool encontrada para esse filtro.
            </p>
          ) : (
            tools.map((tool) => <ToolCatalogCard key={tool.id} tool={tool} />)
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[.03] px-4 py-2.5">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{label}</p>
    </div>
  );
}

function ToolCatalogCard({ tool }: { tool: ToolDefinition }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[10px] border border-white/10 bg-[#0a0e0c]/86 shadow-node backdrop-blur transition hover:border-white/20">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex w-full items-start gap-3 p-5 text-left outline-none">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-acid">
          <Wrench size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-white">{tool.label}</h3>
            <span className="rounded-full bg-white/[.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
              {SCOPE_LABEL[tool.scope] ?? tool.scope}
            </span>
            {tool.global && (
              <span className="inline-flex items-center gap-1 rounded-full bg-acid/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-acid">
                <Globe size={10} /> global
              </span>
            )}
            {tool.executable && (
              <span className="inline-flex items-center gap-1 rounded-full bg-acid/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-acid">
                <Zap size={10} /> executável
              </span>
            )}
            {tool.action && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-amber-300">
                <Zap size={10} /> ação
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-[10px] text-steel">{tool.id}</p>
          <p className="mt-2 text-sm leading-5 text-steel">{tool.summary}</p>
        </div>
        <ChevronDown size={18} className={clsx("mt-1 shrink-0 text-steel transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-white/10 px-5 py-4">
          <p className="text-sm leading-6 text-[#dce5df]">{tool.description}</p>

          {tool.integration && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">integração</span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/25 px-2.5 py-1 font-mono text-xs text-[#dce5df]">
                <Database size={12} className="text-acid" />
                {tool.integration}
              </span>
            </div>
          )}

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Parâmetros</p>
            {tool.parameters.length === 0 ? (
              <p className="mt-1 text-sm text-steel">Nenhum.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {tool.parameters.map((parameter) => (
                  <li key={parameter.name} className="rounded border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-acid">{parameter.name}</span>
                      <span className="font-mono text-[10px] text-steel">{parameter.type}</span>
                      <span
                        className={clsx(
                          "rounded px-1 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]",
                          parameter.required ? "bg-acid/15 text-acid" : "bg-white/[.06] text-steel",
                        )}
                      >
                        {parameter.required ? "obrigatório" : "opcional"}
                      </span>
                      {parameter.options && <span className="font-mono text-[10px] text-steel">[{parameter.options.join(" | ")}]</span>}
                    </div>
                    <p className="mt-1 text-steel">{parameter.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Retorno</p>
            <p className="mt-1 text-sm leading-5 text-steel">{tool.returns}</p>
          </div>
        </div>
      )}
    </div>
  );
}
