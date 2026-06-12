import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  applyNodeChanges,
  useNodesState,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ArrowUp,
  Banknote,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  Command,
  Eraser,
  Headphones,
  Loader2,
  Pencil,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Play,
  Plug,
  Plus,
  RadioTower,
  Redo2,
  Rocket,
  Settings,
  ShieldCheck,
  Target,
  TerminalSquare,
  Undo2,
  UserRoundCheck,
  Wrench,
} from "lucide-react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import { SigmaNode } from "./components/SigmaNode";
import { ModelSettingsScreen } from "./components/ModelSettingsScreen";
import { AgentsScreen } from "./components/AgentsScreen";
import { HomeScreen } from "./components/HomeScreen";
import { KnowledgeBaseScreen } from "./components/KnowledgeBaseScreen";
import { IntegrationsScreen } from "./components/IntegrationsScreen";
import { ToolsScreen } from "./components/ToolsScreen";
import {
  DEFAULT_MODEL_ID,
  PROVIDERS,
  fetchProvidersStatus,
  getProviderForModel,
  getProviderLabel,
  getProviderModels,
  type ProviderStatusMap,
} from "./lib/aiModels";
import { buildGeminiSystemInstruction, buildGeminiUserPrompt, runAiNode } from "./lib/gemini";
import {
  DEFAULT_AREAS,
  DEFAULT_AREA_PROMPTS,
  addAgent,
  commitAutoVersion,
  createAgent,
  currentVersionNumber,
  fetchAgents,
  getActiveAgent,
  jumpToVersion,
  loadStore,
  publishVersion,
  putAgent,
  renameAgent,
  saveStore,
  schedulePutAgent,
  setAgentStatus,
  stepVersion,
  updateAgentDraft,
  versionLabel,
  type AgentNode,
  type AgentStore,
} from "./lib/agents";
import {
  ERP_WIKI_TOOL_ID,
  OMNICHANNEL_TOOL_ID,
  actionEnabledTools,
  buildActionsPromptBlock,
  buildToolsPromptBlock,
  readEnabledTools,
  toolsForScope,
  type ToolDefinition,
} from "./lib/tools";
import { runTool, type ToolRunResult } from "./lib/toolRuntime";
import type { TraceStep } from "./lib/api";
import type { ContextLine, FlowNodeData, FlowNodeKind } from "./types/flow";

type ChatLine = {
  role: "user" | "assistant";
  content: string;
};

type ContextAreaNode = AgentNode;
type AppView = "home" | "agents" | "editor" | "tools" | "integrations" | "models" | "knowledge";
type EditorMode = "view" | "edit";

const nodeTypes = { sigmaNode: SigmaNode };

const NODE_KIND_OPTIONS: Array<{ kind: FlowNodeKind; label: string }> = [
  { kind: "reception", label: "Recepção" },
  { kind: "finance", label: "Financeiro" },
  { kind: "support", label: "Suporte" },
  { kind: "retention", label: "Retenção" },
  { kind: "commercial", label: "Comercial" },
  { kind: "operations", label: "Operação" },
];

const areaIconByKind = {
  reception: UserRoundCheck,
  finance: Banknote,
  support: Headphones,
  retention: ShieldCheck,
  commercial: Target,
  operations: RadioTower,
} as const;

function makeContextId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeAreaId() {
  return `area-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Instrução de classificação anexada à Recepção em runtime (e no preview fiel). */
const RECEPTION_CLASSIFIER_INSTRUCTION = `Classifique considerando TODO o histórico, não só a última mensagem.
Decisões possíveis: finance, support, retention, commercial, operations, reply ou close.
Regra de continuidade: se o atendimento já está em um fluxo (ex.: cancelamento → retention) e o cliente apenas RESPONDE a uma pergunta sua (ex.: informa o motivo do cancelamento como "internet lenta"), MANTENHA a mesma classificação do fluxo atual — não reclassifique por palavra-chave isolada. Só mude de escopo quando o cliente claramente abre um NOVO assunto.
Confirmações como "sou cliente", "sim", "continuar" ou correção de CPF/CNPJ sem assunto novo devem ser reply: reconheça a identificação e pergunte o que ele precisa. Não classifique como commercial só porque houve oferta comercial antes.`;

/** Placeholder mostrado no preview onde, em runtime, entram os resultados das tools. */
const PREVIEW_TOOL_CONTEXT = "«em runtime: resultado das tools de leitura do escopo (ex.: dados do cliente, faturas, status)»";

function buildKnowledgeToolInstruction(toolIds: string[]) {
  const blocks: string[] = [];
  if (toolIds.includes(ERP_WIKI_TOOL_ID)) {
    blocks.push(`Uso da Wiki do ERP:
- Consulte/use a wiki apenas para explicar conceitos, regras e fluxos do ERP.
- Não use a wiki como dado real do cliente. Valores, status atual, elegibilidade, protocolos, prazos e execução vêm somente das tools operacionais.
- Se a wiki e uma tool operacional parecerem divergir, priorize a tool operacional e responda sem inventar regra.`);
  }

  if (toolIds.includes(OMNICHANNEL_TOOL_ID)) {
    blocks.push(`Uso do Omnichannel NovaConecta:
- Use essa base para soar natural, interpretar intenção e reconhecer ruído/sinais do canal.
- Não copie mensagens antigas literalmente nem force menu numerado; adapte ao contexto e varie a linguagem.
- A base mostra padrões reais de conversa, mas não substitui tools operacionais nem confirma dados do cliente.`);
  }

  return blocks.length > 0 ? `\n\n${blocks.join("\n\n")}` : "";
}

function buildAreaRuntimePrompt(area: FlowNodeData) {
  return `${area.systemPrompt}
${buildKnowledgeToolInstruction(area.tools)}

Escopo de atendimento: ${area.label}
Descrição do escopo: ${area.description}
Tools disponíveis neste escopo:
${buildToolsPromptBlock(area.tools)}`;
}

/** Valida CPF pelos dígitos verificadores (aceita só dígitos, sem pontuação). */
function isValidCpf(digits: string): boolean {
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  const check = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i += 1) sum += Number(digits[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return check(9) === Number(digits[9]) && check(10) === Number(digits[10]);
}

/** Valida CNPJ pelos dígitos verificadores. */
function isValidCnpj(digits: string): boolean {
  if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) return false;
  const check = (len: number) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < len; i += 1) sum += Number(digits[i]) * weights[i];
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return check(12) === Number(digits[12]) && check(13) === Number(digits[13]);
}

function isValidDocument(digits: string): boolean {
  return isValidCpf(digits) || isValidCnpj(digits);
}

/** Último CPF/CNPJ VÁLIDO informado pelo cliente (com ou sem pontuação). */
function getCustomerCpf(context: ContextLine[]): string {
  for (let index = context.length - 1; index >= 0; index -= 1) {
    const item = context[index];
    if (item.role !== "user") continue;
    const digits = item.content.replace(/\D/g, "");
    if (isValidDocument(digits)) return digits;
  }
  return "";
}

/**
 * Sinal determinístico de identificação para a IA conduzir o pedido de CPF de
 * forma natural (em vez de frases engessadas). Detecta CPF/CNPJ já confirmado,
 * tentativa inválida (número com dígitos de menos/mais) ou ausência.
 */
function buildIdentityNote(context: ContextLine[], clientFound: boolean | null = null): string {
  const cpf = getCustomerCpf(context);
  if (cpf) {
    if (clientFound === false) {
      return `NÃO existe cadastro com esse CPF/CNPJ na nossa base. Diga ao cliente que não localizou o cadastro e ofereça reconferir o documento. Se ele disser que ainda não é cliente ou pedir planos, siga para Comercial. NÃO trate como cliente identificado e NÃO mencione alertas, conexão, faturas, região ou qualquer dado cadastral — não há cliente identificado.`;
    }
    return `CPF/CNPJ do titular JÁ confirmado e localizado na base. Se antes houve CPF/CNPJ não localizado, documento errado ou oferta para não-cliente, descarte essa hipótese anterior: agora trate como cliente existente. Não ofereça planos/cobertura/upgrade a menos que o cliente peça; pergunte ou responda ao assunto que ele quer resolver.`;
  }

  const lastUser = [...context].reverse().find((item) => item.role === "user");
  const digits = lastUser ? lastUser.content.replace(/\D/g, "") : "";
  if (digits.length >= 8) {
    // Tentou informar um documento, mas não passou na validação (dígitos
    // verificadores não conferem ou quantidade errada) — antes de qualquer consulta.
    return `O cliente enviou "${lastUser!.content.trim()}", que NÃO é um CPF/CNPJ válido (foi digitado errado: dígitos verificadores não conferem ou número incompleto). Avise de forma natural que o documento parece ter sido digitado errado e peça para reenviar. Não consulte dados cadastrais/operacionais do cliente ainda.`;
  }

  return `Ainda não há CPF/CNPJ do titular no histórico. Antes de consultar dados cadastrais/operacionais do cliente, peça o CPF do titular de forma natural e variada.`;
}

type ToolRunLog = { label: string; ok: boolean; info: string };

/** Tools que confirmam a existência do cliente (lookup cadastral por CPF/CNPJ). */
const CLIENT_LOOKUP_TOOL_IDS = new Set(["consultar_cliente_erp", "consultar_cliente_api"]);

/** `{a:1, b:{x}}` → `"a: 1; b: {\"x\":...}"` (valores aninhados viram JSON). */
function formatToolRow(row: Record<string, unknown>): string {
  return Object.entries(row)
    .map(([key, value]) => {
      if (value === null || value === undefined) return `${key}: —`;
      if (typeof value === "object") return `${key}: ${JSON.stringify(value)}`;
      return `${key}: ${value}`;
    })
    .join("; ");
}

function toolNeedsCpf(tool: ToolDefinition): boolean {
  return tool.parameters.some((parameter) => parameter.name === "cpf" && parameter.required);
}

function buildKnowledgeQuery(message: string, context: ContextLine[]): string {
  const recentContext = context
    .slice(-6)
    .map((item) => `${item.role === "user" ? "Cliente" : "Atendimento"}: ${item.content}`)
    .join("\n");

  return [recentContext, `Cliente agora: ${message}`].filter(Boolean).join("\n").slice(0, 2200);
}

function buildToolParams(tool: ToolDefinition, area: FlowNodeData, cpf: string, message: string, context: ContextLine[]) {
  if (tool.id === ERP_WIKI_TOOL_ID) {
    return {
      consulta: buildKnowledgeQuery(message, context),
      escopo: area.kind,
      limite: 2,
    };
  }

  if (tool.id === OMNICHANNEL_TOOL_ID) {
    return {
      consulta: buildKnowledgeQuery(message, context),
      escopo: area.kind,
      limite: 2,
    };
  }

  return { cpf };
}

/**
 * Executa as tools de leitura do escopo. Retorna o texto p/ prompt, logs p/ UI
 * e `clientFound`: true = lookup achou o cliente, false = lookup rodou e não
 * achou (CPF inexistente), null = nenhum lookup cadastral rodou (indeterminado).
 */
async function buildToolContext(
  area: FlowNodeData,
  cpf: string,
  message: string,
  context: ContextLine[],
): Promise<{ text: string; runs: ToolRunLog[]; clientFound: boolean | null }> {
  const tools = readEnabledTools(area.tools);
  if (tools.length === 0) return { text: "", runs: [], clientFound: null };

  const runs: ToolRunLog[] = [];
  let lookupRan = false;
  let lookupFound = false;
  const blocks = await Promise.all(
    tools.map(async (tool) => {
      if (toolNeedsCpf(tool) && !cpf) return "";

      const result = await runTool(tool.id, buildToolParams(tool, area, cpf, message, context));
      if (!result.ok) {
        runs.push({ label: tool.label, ok: false, info: result.error ?? "erro" });
        return `Tool ${tool.label}: falha ao consultar (${result.error ?? "erro"}).`;
      }

      const rows = result.data ?? [];
      if (CLIENT_LOOKUP_TOOL_IDS.has(tool.id)) {
        lookupRan = true;
        if (rows.length > 0) lookupFound = true;
      }
      runs.push({ label: tool.label, ok: true, info: `${rows.length} registro(s)` });
      if (rows.length === 0) {
        if (tool.id === ERP_WIKI_TOOL_ID || tool.id === OMNICHANNEL_TOOL_ID) return "";
        if (tool.id === "consultar_alertas") return `Tool ${tool.label}: nenhum alerta ativo aplicável ao cliente/serviço identificado.`;
        return `Tool ${tool.label}: nenhum registro encontrado para o CPF informado.`;
      }

      const lines = rows.map((row, rowIndex) => `  ${rowIndex + 1}. ${formatToolRow(row)}`).join("\n");

      return `Tool ${tool.label} (${rows.length} registro(s)):\n${lines}`;
    }),
  );

  return { text: blocks.filter(Boolean).join("\n\n"), runs, clientFound: lookupRan ? lookupFound : null };
}

function formatActionResult(label: string, result: ToolRunResult): string {
  if (!result.ok) {
    return `Ação "${label}": FALHOU (${result.error ?? "erro"}). Informe o cliente que não foi possível concluir agora e ofereça alternativa.`;
  }

  const rows = result.data ?? [];
  const body = rows.length > 0 ? rows.map(formatToolRow).join(" | ") : "concluída";

  return `Ação "${label}" EXECUTADA com sucesso. Resultado: ${body}. Confirme ao cliente de forma natural, sem expor detalhes técnicos.`;
}

function getLastSpecialistAreaKind(context: ContextLine[], nodes: ContextAreaNode[]) {
  for (let index = context.length - 1; index >= 0; index -= 1) {
    const areaId = context[index].areaId;
    if (!areaId) continue;

    const node = nodes.find((currentNode) => currentNode.id === areaId);
    if (node?.data.role === "specialist") return node.data.kind as Exclude<FlowNodeKind, "reception">;
  }

  return null;
}

function classifyAreaKind(message: string): Exclude<FlowNodeKind, "reception"> | null {
  const normalized = message.toLowerCase();

  if (/(boleto|fatura|2 via|segunda via|d[eé]bito|pagamento|pix|mensalidade|cobran[cç]a)/.test(normalized)) return "finance";
  if (/(cancelar|cancelamento|desconto|reten[cç][aã]o|fidelidade|concorrente|insatisfeito)/.test(normalized)) return "retention";
  if (/(plano|contratar|cobertura|upgrade|comercial|instala[cç][aã]o)/.test(normalized)) return "commercial";
  if (/(visita|t[eé]cnico|ordem de servi[cç]o|os |agenda|equipe)/.test(normalized)) return "operations";
  if (/(internet|lenta|ruim|sinal|queda|roteador|wifi|wi-fi|conex[aã]o|sem rede)/.test(normalized)) return "support";
  return null;
}

function isReceptionOnlyMessage(message: string) {
  const normalized = message.toLowerCase().trim();
  const hasAreaIntent = classifyAreaKind(normalized) !== null;
  const isGreeting = /^(bom dia|boa tarde|boa noite|ol[aá]|oi|opa|e ai|e aí|hello|hey)[!.?\s]*$/.test(normalized);

  return isGreeting && !hasAreaIntent;
}

function decisionToAreaKind(decision: string): Exclude<FlowNodeKind, "reception"> | null {
  if (["finance", "support", "retention", "commercial", "operations"].includes(decision)) {
    return decision as Exclude<FlowNodeKind, "reception">;
  }
  return null;
}

/**
 * Seção retrátil reutilizável (começa fechada). Usada nas duas sidebars para
 * reduzir carga visual: clica no cabeçalho → expande.
 */
function CollapsibleSection({
  title,
  icon,
  subtitle,
  badge,
  actions,
  defaultOpen = false,
  className,
  headerClassName,
  bodyClassName,
  children,
}: {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={clsx("rounded-[7px] border border-white/10 bg-white/[.035]", className)}>
      <div className={clsx("flex items-center gap-3", headerClassName ?? "p-4")}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none"
        >
          <ChevronDown size={15} className={clsx("shrink-0 text-steel transition-transform", open ? "rotate-0" : "-rotate-90")} />
          {icon}
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-white">{title}</span>
              {badge}
            </span>
            {subtitle && <span className="mt-0.5 block truncate text-xs text-steel">{subtitle}</span>}
          </span>
        </button>
        {actions}
      </div>
      {open && <div className={bodyClassName ?? "px-4 pb-4"}>{children}</div>}
    </section>
  );
}

function ToolCard({
  tool,
  enabled,
  editable,
  onToggle,
}: {
  tool: ToolDefinition;
  enabled: boolean;
  editable: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx("overflow-hidden rounded-md border bg-black/20 transition", enabled ? "border-acid/40" : "border-white/10")}>
      <div className="flex items-start gap-2 p-3">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="min-w-0 flex-1 text-left outline-none"
        >
          <div className="flex items-center gap-1.5">
            <ChevronDown size={14} className={clsx("shrink-0 text-steel transition-transform", open && "rotate-180")} />
            <span className="truncate text-sm font-medium text-white">{tool.label}</span>
            {enabled && (
              <span className="shrink-0 rounded-full bg-acid/15 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-acid">ativa</span>
            )}
          </div>
          <p className="mt-1 pl-[22px] text-xs leading-5 text-steel">{tool.summary}</p>
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={`${enabled ? "Desabilitar" : "Habilitar"} ${tool.label}`}
          disabled={!editable}
          onClick={onToggle}
          className={clsx(
            "relative mt-0.5 h-5 w-9 shrink-0 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40 disabled:cursor-not-allowed disabled:opacity-50",
            enabled ? "bg-acid" : "bg-white/15",
          )}
        >
          <span className={clsx("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all", enabled ? "left-[18px]" : "left-0.5")} />
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-white/10 bg-black/15 px-3 py-3">
          <p className="text-xs leading-5 text-[#dce5df]">{tool.description}</p>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Parâmetros</p>
            {tool.parameters.length === 0 ? (
              <p className="mt-1 text-xs text-steel">Nenhum.</p>
            ) : (
              <ul className="mt-1.5 space-y-2">
                {tool.parameters.map((parameter) => (
                  <li key={parameter.name} className="rounded border border-white/10 bg-black/25 px-2.5 py-2 text-xs leading-5">
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
            <p className="mt-1 text-xs leading-5 text-steel">{tool.returns}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [store, setStore] = useState<AgentStore>(() => loadStore());

  const urlAgentId = useMemo(() => {
    if (!location.pathname.startsWith("/agents/")) return null;
    const raw = location.pathname.slice("/agents/".length).split("/")[0];
    return raw ? decodeURIComponent(raw) : null;
  }, [location.pathname]);

  const activeView: AppView = useMemo(() => {
    if (urlAgentId) return "editor";
    if (location.pathname === "/agents") return "agents";
    if (location.pathname === "/tools") return "tools";
    if (location.pathname === "/integrations") return "integrations";
    if (location.pathname === "/models") return "models";
    if (location.pathname === "/knowledge") return "knowledge";
    return "home";
  }, [location.pathname, urlAgentId]);

  const editorMode: EditorMode = new URLSearchParams(location.search).get("mode") === "view" ? "view" : "edit";
  const [nodes, setNodes] = useNodesState<ContextAreaNode>([]);
  const [messages, setMessages] = useState<ChatLine[]>([]);
  const [conversationContext, setConversationContext] = useState<ContextLine[]>([]);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [toolRuns, setToolRuns] = useState<ToolRunLog[]>([]);
  const [providerStatus, setProviderStatus] = useState<ProviderStatusMap>({ gemini: false, deepseek: false, zai: false });
  const [input, setInput] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const loadedAgentRef = useRef<string | null>(null);
  const nodesRef = useRef<ContextAreaNode[]>(nodes);
  const autoVersionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resyncFromDraftRef = useRef(false);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const activeAgent = useMemo(() => store.agents.find((agent) => agent.id === urlAgentId) ?? null, [store.agents, urlAgentId]);
  const isEditable = editorMode === "edit";
  const canUndo = isEditable && !!activeAgent && activeAgent.cursor > 0;
  const canRedo = isEditable && !!activeAgent && activeAgent.cursor < activeAgent.versions.length - 1;
  const editingVersion = activeAgent ? currentVersionNumber(activeAgent) : 0;
  const publishedVersion = activeAgent?.publishedVersion ?? 0;
  const hasUnpublishedChanges = !!activeAgent && editingVersion !== publishedVersion;

  // Mantém store.activeAgentId em sincronia com a URL (usado pelas ações de salvar).
  useEffect(() => {
    setStore((prev) => (prev.activeAgentId === urlAgentId ? prev : { ...prev, activeAgentId: urlAgentId }));
  }, [urlAgentId]);

  useEffect(() => {
    fetchProvidersStatus().then(setProviderStatus).catch(() => {});
  }, []);

  const persistDraft = useCallback((nextNodes: ContextAreaNode[]) => {
    // 1) Atualiza o draft ao vivo (canvas responsivo, salva no cache + backend).
    setStore((prev) => {
      if (!prev.activeAgentId) return prev;
      const next = updateAgentDraft(prev, prev.activeAgentId, nextNodes);
      saveStore(next);
      const changed = next.agents.find((agent) => agent.id === prev.activeAgentId);
      if (changed) schedulePutAgent(changed);
      return next;
    });
    // 2) Quando a edição "assenta" (900ms), grava uma nova versão se mudou algo.
    clearTimeout(autoVersionTimer.current);
    autoVersionTimer.current = setTimeout(() => {
      setStore((prev) => {
        if (!prev.activeAgentId) return prev;
        const next = commitAutoVersion(prev, prev.activeAgentId, nextNodes);
        if (getActiveAgent(next) === getActiveAgent(prev)) return prev;
        saveStore(next);
        const changed = getActiveAgent(next);
        if (changed) schedulePutAgent(changed);
        return next;
      });
    }, 900);
  }, []);

  // Carrega do backend (fonte da verdade). Offline → mantém o cache local.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await fetchAgents();
        if (cancelled) return;
        if (remote.length === 0) {
          const local = loadStore().agents;
          await Promise.all(local.map((agent) => putAgent(agent)));
          if (cancelled) return;
          setStore((prev) => ({ ...prev, agents: local }));
        } else {
          // Backend é a fonte da verdade: ao chegar a versão remota, força o
          // editor a re-sincronizar os nós (senão o guard de loadedAgentRef
          // mantém um draft local desatualizado na tela).
          loadedAgentRef.current = null;
          setStore((prev) => {
            const next = { agents: remote, activeAgentId: prev.activeAgentId };
            saveStore(next);
            return next;
          });
        }
      } catch {
        // backend indisponível: segue com o cache do navegador
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeView !== "editor" || !activeAgent) return;
    if (loadedAgentRef.current === activeAgent.id) return;
    loadedAgentRef.current = activeAgent.id;

    setNodes(
      activeAgent.draft.map((node) => ({
        ...node,
        selected: false,
        data: { ...node.data, status: "idle" as const },
      })),
    );
    setSelectedAreaId(null);
    setConversationContext([]);
    setTrace([]);
    setMessages([]);
  }, [activeView, activeAgent, setNodes]);

  const openAgent = useCallback(
    (agentId: string, mode: EditorMode) => {
      navigate(`/agents/${agentId}${mode === "view" ? "?mode=view" : ""}`);
    },
    [navigate],
  );

  const createNewAgent = useCallback(() => {
    const agent = createAgent("Novo agente", "Descreva o que este agente atende.", DEFAULT_AREAS);
    setStore((prev) => {
      const next = addAgent(prev, agent);
      saveStore(next);
      return next;
    });
    putAgent(agent).catch(() => {});
    loadedAgentRef.current = null;
    navigate(`/agents/${agent.id}`);
  }, [navigate]);

  const toggleArchive = useCallback((agentId: string) => {
    setStore((prev) => {
      const target = prev.agents.find((agent) => agent.id === agentId);
      const status = target?.status === "archived" ? "active" : "archived";
      const next = setAgentStatus(prev, agentId, status);
      saveStore(next);
      const changed = next.agents.find((agent) => agent.id === agentId);
      if (changed) putAgent(changed).catch(() => {});
      return next;
    });
  }, []);

  // Carrega uma versão no editor (cursor). loadedAgentRef=null força o efeito do
  // editor a re-sincronizar os nós a partir do draft da versão escolhida.
  const handleRestore = useCallback((agentId: string, version: number) => {
    loadedAgentRef.current = null;
    setStore((prev) => {
      const next = jumpToVersion(prev, agentId, version);
      saveStore(next);
      const changed = next.agents.find((agent) => agent.id === agentId);
      if (changed) putAgent(changed).catch(() => {});
      return next;
    });
  }, []);

  const handlePublish = useCallback((agentId: string, version?: number) => {
    setStore((prev) => {
      const next = publishVersion(prev, agentId, version);
      if (getActiveAgent(next) === getActiveAgent(prev) && next.agents === prev.agents) return prev;
      saveStore(next);
      const changed = next.agents.find((agent) => agent.id === agentId);
      if (changed) putAgent(changed).catch(() => {});
      return next;
    });
  }, []);

  const renameActiveAgent = useCallback((patch: { name?: string; description?: string }) => {
    setStore((prev) => {
      const target = getActiveAgent(prev);
      if (!target) return prev;
      const next = renameAgent(prev, target.id, patch.name ?? target.name, patch.description ?? target.description);
      saveStore(next);
      const changed = next.agents.find((agent) => agent.id === target.id);
      if (changed) schedulePutAgent(changed);
      return next;
    });
  }, []);

  // Undo (dir=-1) / Redo (dir=+1) andando pelas versões. Antes de andar, "flusha"
  // qualquer edição pendente como versão, para que o undo reverta o que foi digitado.
  const moveVersion = useCallback((dir: -1 | 1) => {
    clearTimeout(autoVersionTimer.current);
    setStore((prev) => {
      if (!prev.activeAgentId) return prev;
      const flushed = commitAutoVersion(prev, prev.activeAgentId, nodesRef.current);
      const next = stepVersion(flushed, prev.activeAgentId, dir);
      const prevAgent = getActiveAgent(prev);
      const nextAgent = getActiveAgent(next);

      if (!nextAgent || nextAgent === prevAgent) {
        // Não dá pra andar nessa direção; persiste só o flush se ele criou versão.
        const flushedAgent = getActiveAgent(flushed);
        if (flushedAgent && flushedAgent !== prevAgent) {
          saveStore(flushed);
          schedulePutAgent(flushedAgent);
          return flushed;
        }
        return prev;
      }

      saveStore(next);
      schedulePutAgent(nextAgent);
      // Sinaliza o efeito p/ recarregar os nós do draft da versão (sem resetar o chat).
      resyncFromDraftRef.current = true;
      return next;
    });
  }, []);

  // Recarrega os nós do canvas a partir do draft quando undo/redo move o cursor.
  // Só dispara quando `resyncFromDraftRef` foi marcado (não no auto-versionamento).
  useEffect(() => {
    if (!resyncFromDraftRef.current) return;
    resyncFromDraftRef.current = false;
    if (!activeAgent) return;
    setNodes(activeAgent.draft.map((node) => ({ ...node, selected: false, data: { ...node.data, status: "idle" as const } })));
    setSelectedAreaId(null);
  }, [activeAgent?.cursor, setNodes]);

  // Cmd/Ctrl+Z = desfazer, Cmd/Ctrl+Shift+Z (ou Ctrl+Y) = refazer. Não sequestra
  // o undo nativo quando o foco está num campo de texto.
  useEffect(() => {
    if (activeView !== "editor") return;
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      const key = event.key.toLowerCase();
      const isUndo = key === "z" && !event.shiftKey;
      const isRedo = (key === "z" && event.shiftKey) || key === "y";
      if (!isUndo && !isRedo) return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLElement && (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.isContentEditable);
      if (typing) return;
      event.preventDefault();
      moveVersion(isRedo ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeView, moveVersion]);

  const selectedArea = useMemo(
    () => nodes.find((node) => node.id === selectedAreaId),
    [nodes, selectedAreaId],
  );
  const receptionArea = useMemo(
    () => nodes.find((node) => node.data.role === "reception") ?? nodes[0],
    [nodes],
  );
  const specialistAreas = useMemo(
    () => nodes.filter((node) => node.data.role === "specialist"),
    [nodes],
  );
  const selectedAreaModel =
    selectedArea && getProviderForModel(selectedArea.data.model) ? selectedArea.data.model : DEFAULT_MODEL_ID;
  const selectedModelProvider = getProviderForModel(selectedAreaModel);
  const previewMessage = input.trim() || "minha fatura venceu e preciso da segunda via";
  // Preview FIEL: monta exatamente o que vai para /ai/run, incluindo o bloco de
  // ações executáveis, a instrução de classificação da Recepção, a orientação de
  // identificação e um marcador de onde entram os resultados das tools em runtime.
  const payloadPreview = selectedArea
    ? (() => {
        const isReception = selectedArea.data.role === "reception";
        const systemPrompt = isReception
          ? `${buildAreaRuntimePrompt(selectedArea.data)}\n\n${RECEPTION_CLASSIFIER_INSTRUCTION}`
          : buildAreaRuntimePrompt(selectedArea.data);
        const actionsBlock = isReception ? undefined : buildActionsPromptBlock(selectedArea.data.tools);
        return {
          systemInstruction: buildGeminiSystemInstruction(systemPrompt, actionsBlock),
          userPrompt: buildGeminiUserPrompt({
            context: conversationContext,
            message: previewMessage,
            identityNote: buildIdentityNote(conversationContext),
            toolContext: PREVIEW_TOOL_CONTEXT,
          }),
        };
      })()
    : null;

  const traceStatusByAreaId = useMemo(
    () => new Map(trace.map((step) => [step.node_id, step.status])),
    [trace],
  );

  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const traceStatus = traceStatusByAreaId.get(node.id);

        return {
          ...node,
          selected: node.id === selectedAreaId,
          data: {
            ...node.data,
            status:
              traceStatus === "active"
                ? "running"
                : traceStatus === "completed"
                  ? "completed"
                  : node.data.status === "running"
                    ? "running"
                    : "idle",
          },
        };
      }),
    );
  }, [selectedAreaId, setNodes, traceStatusByAreaId]);

  useEffect(() => {
    if (!isSimulatorOpen) return;
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [isSending, isSimulatorOpen, messages]);

  // O efeito acima já sincroniza `selected` a partir de selectedAreaId.
  const selectArea = useCallback((areaId: string) => setSelectedAreaId(areaId), []);

  const onNodesChange = useCallback(
    (changes: NodeChange<ContextAreaNode>[]) => {
      // Remoção de escopo só acontece pelo botão (removeArea), com confirmação.
      // Ignorar mudanças "remove" aqui evita apagar um escopo por tecla
      // Delete/Backspace ou seleção acidental — sem volta no histórico.
      const safeChanges = changes.filter((change) => change.type !== "remove");
      if (safeChanges.length === 0) return;
      setNodes((current) => {
        const nextNodes = applyNodeChanges(safeChanges, current) as ContextAreaNode[];
        persistDraft(nextNodes);
        return nextNodes;
      });
    },
    [setNodes],
  );

  const updateSelectedArea = useCallback(
    (patch: Partial<FlowNodeData>) => {
      if (!isEditable) return;
      setNodes((current) => {
        const nextNodes = current.map((node) =>
          node.id === selectedArea?.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...patch,
                },
              }
            : node,
        );
        persistDraft(nextNodes);
        return nextNodes;
      });
    },
    [isEditable, selectedArea?.id, setNodes],
  );

  const addContextArea = useCallback(() => {
    if (!isEditable) return;
    const baseArea = selectedArea ?? nodes[0];
    const newAreaId = makeAreaId();
    const newArea: ContextAreaNode = {
      id: newAreaId,
      type: "sigmaNode",
      position: {
        x: (baseArea?.position.x ?? 180) + 280,
        y: (baseArea?.position.y ?? 180) + 90,
      },
      selected: true,
      data: {
        label: "Novo escopo",
        kind: "support",
        role: "specialist",
        status: "idle",
        model: baseArea?.data.model ?? DEFAULT_MODEL_ID,
        description: "Escopo especializado para um assunto de atendimento.",
        systemPrompt: DEFAULT_AREA_PROMPTS.support,
        tools: [],
      },
    };
    const nextNodes = [...nodes.map((node) => ({ ...node, selected: false })), newArea];

    setNodes(nextNodes);
    setSelectedAreaId(newAreaId);
    persistDraft(nextNodes);
  }, [isEditable, nodes, persistDraft, selectedArea, setNodes]);

  const duplicateArea = useCallback(
    (areaId: string) => {
      if (!isEditable) return;
      const sourceArea = nodes.find((node) => node.id === areaId);
      if (!sourceArea) return;

      const newAreaId = makeAreaId();
      const newArea: ContextAreaNode = {
        ...sourceArea,
        id: newAreaId,
        position: {
          x: sourceArea.position.x + 280,
          y: sourceArea.position.y + 70,
        },
        selected: true,
        data: {
          ...sourceArea.data,
          label: `${sourceArea.data.label} cópia`,
          role: "specialist",
          status: "idle",
        },
      };
      const nextNodes = [...nodes.map((node) => ({ ...node, selected: false })), newArea];

      setNodes(nextNodes);
      setSelectedAreaId(newAreaId);
      persistDraft(nextNodes);
    },
    [isEditable, nodes, persistDraft, setNodes],
  );

  const removeArea = useCallback(
    (areaId: string) => {
      if (!isEditable) return;
      const area = nodes.find((node) => node.id === areaId);
      if (!area || area.data.role === "reception" || nodes.length <= 1) return;

      const ok = window.confirm(
        `Remover o escopo "${area.data.label}"? Isso não tem desfazer — só volta salvando uma versão antes.`,
      );
      if (!ok) return;

      const nextNodes = nodes.filter((node) => node.id !== areaId);
      const nextSelectedAreaId = selectedAreaId === areaId ? null : selectedAreaId;
      const selectedNodes = nextNodes.map((node) => ({
        ...node,
        selected: node.id === nextSelectedAreaId,
      }));

      setNodes(selectedNodes);
      setSelectedAreaId(nextSelectedAreaId);
      persistDraft(selectedNodes);
    },
    [isEditable, nodes, persistDraft, selectedAreaId, setNodes],
  );

  const nodesForCanvas = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          model: getProviderForModel(node.data.model) ? node.data.model : DEFAULT_MODEL_ID,
          nodeId: node.id,
          canRemove: node.data.role !== "reception",
          onConfigure: selectArea,
          onDuplicate: duplicateArea,
          onRemove: removeArea,
        },
      })),
    [duplicateArea, nodes, removeArea, selectArea],
  );

  const toggleTool = useCallback(
    (toolId: string) => {
      if (!selectedArea) return;
      const tools = selectedArea.data.tools.includes(toolId)
        ? selectedArea.data.tools.filter((currentToolId) => currentToolId !== toolId)
        : [...selectedArea.data.tools, toolId];
      updateSelectedArea({ tools });
    },
    [selectedArea, updateSelectedArea],
  );

  const resolveSpecialistArea = useCallback(
    (message: string, decision?: string) => {
      if (isReceptionOnlyMessage(message)) return null;

      const directKind = classifyAreaKind(message);
      const decidedKind = decision ? decisionToAreaKind(decision) : null;
      const activeKind = getLastSpecialistAreaKind(conversationContext, nodes);
      if (decision === "close" && !directKind && !activeKind) return null;

      // Decisão da Recepção (vê o histórico todo) tem prioridade. Depois o escopo
      // ativo (mantém continuidade). O regex de palavra-chave é só último recurso:
      // ele enxerga uma frase isolada e erra quando o termo aparece fora de contexto
      // (ex.: "internet lenta" dito como MOTIVO de cancelamento, não como suporte).
      const targetKind = decidedKind ?? activeKind ?? directKind;
      if (!targetKind) return null;

      return specialistAreas.find((area) => area.data.kind === targetKind) ?? specialistAreas[0] ?? receptionArea;
    },
    [conversationContext, nodes, receptionArea, specialistAreas],
  );

  const submit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const message = input.trim();
      if (!message || isSending || !receptionArea) return;

      const resolveRuntime = (node: ContextAreaNode) => {
        const model = getProviderForModel(node.data.model) ? node.data.model : DEFAULT_MODEL_ID;
        const provider = getProviderForModel(model) ?? "gemini";
        return { model, provider };
      };

      const receptionRuntime = resolveRuntime(receptionArea);

      setInput("");
      setIsSending(true);
      setMessages((current) => [...current, { role: "user", content: message }]);
      const userContext: ContextLine = { id: makeContextId(), role: "user", content: message };
      setConversationContext((current) => [...current, userContext]);
      setTrace([]);
      setToolRuns([]);
      setNodes((current) =>
        current.map((node) => ({
          ...node,
          data: {
            ...node.data,
            status: node.id === receptionArea.id ? "running" : "idle",
          },
        })),
      );

      try {
        const receptionCpf = getCustomerCpf([...conversationContext, userContext]);
        const receptionTC = await buildToolContext(receptionArea.data, receptionCpf, message, [...conversationContext, userContext]);
        if (receptionTC.runs.length > 0) setToolRuns((prev) => [...prev, ...receptionTC.runs]);

        const receptionResult = await runAiNode({
          provider: receptionRuntime.provider,
          node: {
            data: {
              ...receptionArea.data,
              model: receptionRuntime.model,
              systemPrompt: `${buildAreaRuntimePrompt(receptionArea.data)}

${RECEPTION_CLASSIFIER_INSTRUCTION}`,
            },
          },
          message,
          context: conversationContext,
          toolContext: receptionTC.clientFound === false ? "" : receptionTC.text,
          identityNote: buildIdentityNote([...conversationContext, userContext], receptionTC.clientFound),
        });
        const targetArea = resolveSpecialistArea(message, receptionResult.decision);

        if (!targetArea) {
          const receptionContext: ContextLine = {
            id: makeContextId(),
            role: "area",
            areaId: receptionArea.id,
            areaLabel: receptionArea.data.label,
            content: receptionResult.reply,
          };

          setConversationContext([...conversationContext, userContext, receptionContext]);
          setMessages((current) => [...current, { role: "assistant", content: receptionResult.reply }]);
          setTrace([
            {
              node_id: receptionArea.id,
              label: receptionArea.data.label,
              decision: receptionResult.decision || "reply",
              output: receptionResult.reply,
              status: receptionResult.shouldClose ? "completed" : "active",
            },
          ]);
          setNodes((current) =>
            current.map((node) => ({
              ...node,
              data: {
                ...node.data,
                status: node.id === receptionArea.id ? "completed" : "idle",
              },
            })),
          );
          return;
        }

        const receptionContext: ContextLine = {
          id: makeContextId(),
          role: "area",
          areaId: receptionArea.id,
          areaLabel: receptionArea.data.label,
          content: `Classificação interna: ${targetArea.data.label}.`,
        };
        setNodes((current) =>
          current.map((node) => ({
            ...node,
            data: {
              ...node.data,
              status:
                node.id === receptionArea.id
                  ? "completed"
                  : node.id === targetArea.id
                    ? "running"
                    : node.data.status,
            },
          })),
        );

        const areaRuntime = resolveRuntime(targetArea);

        const areaContextLines = [...conversationContext, userContext, receptionContext];
        const customerCpf = getCustomerCpf(areaContextLines);
        const specialistTC = await buildToolContext(targetArea.data, customerCpf, message, areaContextLines);
        if (specialistTC.runs.length > 0) setToolRuns((prev) => [...prev, ...specialistTC.runs]);
        const actionsBlock = buildActionsPromptBlock(targetArea.data.tools);
        const areaNode = {
          data: {
            ...targetArea.data,
            model: areaRuntime.model,
            systemPrompt: buildAreaRuntimePrompt(targetArea.data),
          },
        };
        const identityNote = buildIdentityNote(areaContextLines, specialistTC.clientFound);
        const specialistToolText = specialistTC.clientFound === false ? "" : specialistTC.text;

        let areaResult = await runAiNode({
          provider: areaRuntime.provider,
          node: areaNode,
          message,
          context: areaContextLines,
          toolContext: specialistToolText,
          actionsBlock,
          identityNote,
        });

        // Gatilho de ação: modelo confirmou uma ação habilitada → executa e re-pergunta.
        const requestedAction = areaResult.action;
        const allowedAction = requestedAction?.confirmed
          ? actionEnabledTools(targetArea.data.tools).find((tool) => tool.id === requestedAction.tool)
          : undefined;
        if (allowedAction) {
          const actionResult = await runTool(allowedAction.id, { cpf: customerCpf, ...(requestedAction?.params ?? {}) });
          setToolRuns((prev) => [
            ...prev,
            { label: `${allowedAction.label} (ação)`, ok: actionResult.ok, info: actionResult.ok ? "executada" : actionResult.error ?? "erro" },
          ]);
          const actionBlock = formatActionResult(allowedAction.label, actionResult);
          areaResult = await runAiNode({
            provider: areaRuntime.provider,
            node: areaNode,
            message,
            context: areaContextLines,
            toolContext: [specialistToolText, actionBlock].filter(Boolean).join("\n\n"),
            actionsBlock,
            identityNote,
          });
        }
        const areaContext: ContextLine = {
          id: makeContextId(),
          role: "area",
          areaId: targetArea.id,
          areaLabel: targetArea.data.label,
          content: areaResult.reply,
        };

        setConversationContext([...conversationContext, userContext, receptionContext, areaContext]);
        setMessages((current) => [...current, { role: "assistant", content: areaResult.reply }]);
        setTrace([
          {
            node_id: receptionArea.id,
            label: receptionArea.data.label,
            decision: receptionResult.decision || targetArea.data.kind,
            output: `Assunto direcionado para ${targetArea.data.label}.`,
            status: "completed",
          },
          {
            node_id: targetArea.id,
            label: targetArea.data.label,
            decision: areaResult.decision || "reply",
            output: areaResult.reply,
            status: areaResult.shouldClose ? "completed" : "active",
          },
        ]);
        setNodes((current) =>
          current.map((node) => ({
            ...node,
            data: {
              ...node.data,
              status: node.id === targetArea.id ? "completed" : node.data.status,
            },
          })),
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Falha desconhecida ao chamar o provedor de IA.";
        // Cliente nunca vê erro técnico — mensagem graciosa; detalhe vai pro painel de debug.
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: "Tive uma instabilidade aqui no atendimento agora. Pode repetir sua última mensagem, por favor?",
          },
        ]);
        setToolRuns((prev) => [...prev, { label: "Erro no atendimento (IA)", ok: false, info: errorMessage }]);
        setNodes((current) =>
          current.map((node) => ({
            ...node,
            data: {
              ...node.data,
              status: "idle",
            },
          })),
        );
      } finally {
        setIsSending(false);
      }
    },
    [conversationContext, input, isSending, receptionArea, resolveSpecialistArea, setNodes],
  );

  const resetContext = useCallback(() => {
    setConversationContext([]);
    setTrace([]);
    setMessages([
      {
        role: "assistant",
        content: "Contexto limpo. A próxima mensagem entra novamente pela Recepção.",
      },
    ]);
    setNodes((current) =>
      current.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: "idle",
        },
      })),
    );
  }, [setNodes]);

  const SelectedIcon = selectedArea ? areaIconByKind[selectedArea.data.kind] : BrainCircuit;
  const visibleToolOptions = selectedArea ? toolsForScope(selectedArea.data.kind) : [];

  // Home: página de descanso, full-bleed, sem header/sidebars de trabalho.
  if (activeView === "home") {
    return (
      <main className="flex h-screen min-h-screen flex-col overflow-hidden bg-ink text-white">
        <HomeScreen agents={store.agents} onNavigate={navigate} />
      </main>
    );
  }

  return (
    <main className="flex h-screen min-h-screen flex-col overflow-hidden bg-ink text-white">
      <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#080a09]/92 px-5 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-acid/40"
          title="Voltar para a home"
        >
          <div className="grid h-9 w-9 place-items-center rounded-md bg-acid text-black transition group-hover:shadow-[0_0_24px_rgba(199,255,61,.5)]">
            <BrainCircuit size={20} />
          </div>
          <div className="min-w-0 text-left">
            <h1 className="truncate pb-0.5 text-base font-semibold leading-tight">Sigma</h1>
            <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
              {activeView === "editor"
                ? "Editor do agente"
                : activeView === "models"
                  ? "Modelos"
                  : activeView === "integrations"
                    ? "Integrações"
                    : activeView === "tools"
                      ? "Catálogo de tools"
                      : activeView === "knowledge"
                        ? "Base de conhecimento"
                        : "Agentes de atendimento"}
            </p>
          </div>
        </button>

        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-white/10 bg-white/[.04] p-1">
          <button
            onClick={() => navigate("/agents")}
            className={clsx(
              "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40",
              activeView === "agents" || activeView === "editor" ? "bg-white/[.08] text-acid" : "text-steel hover:bg-white/[.05] hover:text-white",
            )}
            title="Agentes"
          >
            <Command size={16} />
            Agentes
          </button>
          <button
            onClick={() => navigate("/tools")}
            className={clsx(
              "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40",
              activeView === "tools" ? "bg-white/[.08] text-acid" : "text-steel hover:bg-white/[.05] hover:text-white",
            )}
            title="Tools"
          >
            <Wrench size={16} />
            Tools
          </button>
          <button
            onClick={() => navigate("/integrations")}
            className={clsx(
              "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40",
              activeView === "integrations" ? "bg-white/[.08] text-acid" : "text-steel hover:bg-white/[.05] hover:text-white",
            )}
            title="Integrações"
          >
            <Plug size={16} />
            Integrações
          </button>
          <button
            onClick={() => navigate("/models")}
            className={clsx(
              "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40",
              activeView === "models" ? "bg-white/[.08] text-acid" : "text-steel hover:bg-white/[.05] hover:text-white",
            )}
            title="Modelos"
          >
            <Settings size={16} />
            Modelos
          </button>
          <button
            onClick={() => navigate("/knowledge")}
            className={clsx(
              "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40",
              activeView === "knowledge" ? "bg-white/[.08] text-acid" : "text-steel hover:bg-white/[.05] hover:text-white",
            )}
            title="Base de conhecimento"
          >
            <BookOpen size={16} />
            Conhecimento
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {activeView === "editor" && (
            <span
              className={clsx(
                "hidden rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] sm:inline",
                isEditable ? "bg-acid/15 text-acid" : "bg-white/[.06] text-steel",
              )}
            >
              {isEditable ? "edição" : "leitura"}
            </span>
          )}
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-steel sm:inline">
            {activeView === "editor"
              ? `${specialistAreas.length} escopo(s)`
              : activeView === "models"
                ? "runtime local"
                : activeView === "integrations"
                  ? "conexões"
                  : activeView === "tools"
                    ? "catálogo"
                    : activeView === "knowledge"
                      ? "wiki + curadoria"
                      : `${store.agents.length} agente(s)`}
          </span>
          <span className="h-2 w-2 rounded-full bg-acid shadow-[0_0_24px_rgba(199,255,61,.65)]" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {activeView === "knowledge" ? (
          <KnowledgeBaseScreen />
        ) : activeView === "models" ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ModelSettingsScreen />
          </div>
        ) : activeView === "tools" ? (
          <ToolsScreen />
        ) : activeView === "integrations" ? (
          <IntegrationsScreen />
        ) : activeView === "agents" ? (
          <AgentsScreen
            agents={store.agents}
            onOpen={openAgent}
            onCreate={createNewAgent}
            onArchiveToggle={toggleArchive}
            onRestore={handleRestore}
            onPublish={handlePublish}
          />
        ) : (
          <>
            <aside
              className={clsx(
                "flex h-full min-h-0 shrink-0 flex-col border-r border-white/10 bg-[#090c0b] transition-[width] duration-200",
                isConfigOpen ? "w-[420px] max-xl:w-[360px]" : "w-12",
              )}
            >
              {isConfigOpen ? (
                <>
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-acid">
                        <SelectedIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">configuração</p>
                        <h2 className="mt-1 truncate text-base font-semibold">{selectedArea ? selectedArea.data.label : "Escopos"}</h2>
                        <p className="mt-1 text-xs text-steel">{selectedArea ? "Prompt, tools e payload do escopo." : "Selecione um escopo no mapa."}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsConfigOpen(false)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-steel outline-none transition hover:border-acid/45 hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40"
                      title="Recolher painel"
                    >
                      <PanelLeftClose size={16} />
                    </button>
                  </div>

                  {selectedArea ? (
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                      <div className="space-y-5">
                    <CollapsibleSection title="Configuração do escopo">
                      <div className="mt-1">
                        <label htmlFor="area-name" className="mb-2 block text-xs font-medium text-steel">Nome do escopo</label>
                        <input
                          id="area-name"
                          value={selectedArea.data.label}
                          onChange={(event) => updateSelectedArea({ label: event.target.value })}
                          disabled={!isEditable}
                          className="h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-steel/65 hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15 disabled:cursor-not-allowed disabled:opacity-60"
                          placeholder="Nome visível no mapa"
                        />
                      </div>

                      <div className="mt-4">
                        <label htmlFor="area-kind" className="mb-2 block text-xs font-medium text-steel">Tipo de escopo</label>
                        <div className="relative">
                          <select
                            id="area-kind"
                            value={selectedArea.data.kind}
                            onChange={(event) => {
                              const kind = event.target.value as FlowNodeKind;
                              updateSelectedArea({
                                kind,
                                role: kind === "reception" ? "reception" : "specialist",
                                systemPrompt: DEFAULT_AREA_PROMPTS[kind],
                                tools: toolsForScope(kind).slice(0, 2).map((tool) => tool.id),
                              });
                            }}
                            disabled={!isEditable || selectedArea.data.role === "reception"}
                            className="h-11 w-full appearance-none rounded-md border border-white/10 bg-black/25 px-3 pr-9 text-sm text-white outline-none transition hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {NODE_KIND_OPTIONS.map((option) => (
                              <option key={option.kind} value={option.kind}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-steel" size={16} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="area-description" className="mb-2 block text-xs font-medium text-steel">Descrição operacional</label>
                        <input
                          id="area-description"
                          value={selectedArea.data.description}
                          onChange={(event) => updateSelectedArea({ description: event.target.value })}
                          disabled={!isEditable}
                          className="h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-steel/65 hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15 disabled:cursor-not-allowed disabled:opacity-60"
                          placeholder="O que este escopo resolve"
                        />
                      </div>

                      <div className="mt-4">
                        <label htmlFor="area-model" className="mb-2 block text-xs font-medium text-steel">Modelo do escopo</label>
                        <div className="relative">
                          <select
                            id="area-model"
                            value={selectedAreaModel}
                            onChange={(event) => updateSelectedArea({ model: event.target.value })}
                            disabled={!isEditable}
                            className="h-11 w-full appearance-none rounded-md border border-white/10 bg-black/25 px-3 pr-9 text-sm text-white outline-none transition hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {PROVIDERS.map((provider) => (
                              <optgroup
                                key={provider.id}
                                label={`${provider.label}${providerStatus[provider.id] ? "" : " (não configurado)"}`}
                              >
                                {getProviderModels(provider.id).map((model) => (
                                  <option key={model.id} value={model.id}>
                                    {model.label}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-steel" size={16} />
                        </div>
                        {selectedModelProvider && !providerStatus[selectedModelProvider] && (
                          <p className="mt-1.5 text-xs text-ember">
                            {getProviderLabel(selectedModelProvider)} não está configurado no servidor. Configure a chave no backend (.env) para usar este escopo.
                          </p>
                        )}
                      </div>

                      <div className="mt-4">
                        <label htmlFor="area-prompt" className="mb-2 block text-xs font-medium text-steel">Prompt da IA</label>
                        <textarea
                          id="area-prompt"
                          value={selectedArea.data.systemPrompt}
                          onChange={(event) => updateSelectedArea({ systemPrompt: event.target.value })}
                          disabled={!isEditable}
                          rows={7}
                          className="w-full resize-none rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-steel/65 hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15 disabled:cursor-not-allowed disabled:opacity-60"
                          placeholder="Instrua como este escopo atende, decide e usa as tools."
                        />
                      </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                      title="Tools do escopo"
                      icon={
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 bg-black/25 text-acid">
                          <Wrench size={16} />
                        </div>
                      }
                      badge={
                        visibleToolOptions.length > 0 ? (
                          <span className="font-mono text-[10px] text-steel">
                            {selectedArea.data.tools.length}/{visibleToolOptions.length}
                          </span>
                        ) : undefined
                      }
                      subtitle={
                        selectedArea.data.role === "reception"
                          ? "Consulta dados do cliente para classificar melhor."
                          : "Capacidades que a IA deste escopo pode acionar."
                      }
                    >
                      <div className="grid gap-2">
                        {visibleToolOptions.length === 0 ? (
                          <p className="rounded-md border border-white/10 bg-black/20 px-3 py-3 text-sm text-steel">
                            Nenhuma tool cadastrada para este tipo de escopo ainda.
                          </p>
                        ) : (
                          visibleToolOptions.map((tool) => (
                            <ToolCard
                              key={tool.id}
                              tool={tool}
                              enabled={selectedArea.data.tools.includes(tool.id)}
                              editable={isEditable}
                              onToggle={() => toggleTool(tool.id)}
                            />
                          ))
                        )}
                      </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                      title="Payload para IA"
                      icon={
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 bg-black/25 text-acid">
                          <TerminalSquare size={16} />
                        </div>
                      }
                      subtitle="Exatamente o que vai para a IA: prompt, guardrails, identificação e tools."
                    >
                      {payloadPreview && (
                        <div className="space-y-3">
                          <div>
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-steel">system_instruction</p>
                            <pre className="max-h-52 overflow-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs leading-5 text-[#dce5df] whitespace-pre-wrap">
                              {payloadPreview.systemInstruction}
                            </pre>
                          </div>
                          <div>
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-steel">contents[0].parts[0].text</p>
                            <pre className="max-h-40 overflow-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs leading-5 text-[#dce5df] whitespace-pre-wrap">
                              {payloadPreview.userPrompt}
                            </pre>
                          </div>
                        </div>
                      )}
                    </CollapsibleSection>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                      <section className="rounded-[7px] border border-white/10 bg-white/[.035] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold text-white">Identidade do agente</h3>
                          {activeAgent && (
                            <span className="rounded-full bg-acid/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-acid">
                              {versionLabel(editingVersion)}
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <label htmlFor="agent-name" className="mb-2 block text-xs font-medium text-steel">Nome do agente</label>
                          <input
                            id="agent-name"
                            value={activeAgent?.name ?? ""}
                            onChange={(event) => renameActiveAgent({ name: event.target.value })}
                            disabled={!isEditable}
                            className="h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-steel/65 hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15 disabled:cursor-not-allowed disabled:opacity-60"
                            placeholder="Ex.: Atendimento, Vendas, Pós-venda"
                          />
                        </div>

                        <div className="mt-4">
                          <label htmlFor="agent-description" className="mb-2 block text-xs font-medium text-steel">Para que serve</label>
                          <textarea
                            id="agent-description"
                            value={activeAgent?.description ?? ""}
                            onChange={(event) => renameActiveAgent({ description: event.target.value })}
                            disabled={!isEditable}
                            rows={3}
                            className="w-full resize-none rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-steel/65 hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15 disabled:cursor-not-allowed disabled:opacity-60"
                            placeholder="Descreva o objetivo deste agente de atendimento."
                          />
                        </div>

                        <p className="mt-4 text-xs leading-5 text-steel">
                          Selecione um escopo no mapa para configurar prompt, tools e payload.
                        </p>
                      </section>

                      {isEditable ? (
                        <section className="mt-5 rounded-[7px] border border-white/10 bg-white/[.035] p-4">
                          <h3 className="text-sm font-semibold text-white">Versão & publicação</h3>
                          <p className="mt-1 text-xs leading-5 text-steel">
                            Toda alteração avança a versão e salva sozinha. Desfaça/refaça com os botões ou Cmd+Z / Cmd+Shift+Z. A versão publicada continua em vigor até você publicar outra.
                          </p>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-md border border-white/10 bg-black/20 px-3 py-2">
                              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">em edição</p>
                              <p className="mt-0.5 font-mono text-sm text-white">{versionLabel(editingVersion)}</p>
                            </div>
                            <div className="rounded-md border border-white/10 bg-black/20 px-3 py-2">
                              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">publicada</p>
                              <p className="mt-0.5 font-mono text-sm text-acid">{versionLabel(publishedVersion)}</p>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => moveVersion(-1)}
                              disabled={!canUndo}
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.04] text-xs font-medium text-white outline-none transition hover:border-acid/45 hover:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-acid/40 disabled:cursor-not-allowed disabled:opacity-40"
                              title="Desfazer (Cmd+Z)"
                            >
                              <Undo2 size={14} />
                              Desfazer
                            </button>
                            <button
                              type="button"
                              onClick={() => moveVersion(1)}
                              disabled={!canRedo}
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.04] text-xs font-medium text-white outline-none transition hover:border-acid/45 hover:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-acid/40 disabled:cursor-not-allowed disabled:opacity-40"
                              title="Refazer (Cmd+Shift+Z)"
                            >
                              <Redo2 size={14} />
                              Refazer
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => activeAgent && handlePublish(activeAgent.id)}
                            disabled={!hasUnpublishedChanges}
                            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-acid/35 bg-acid text-sm font-semibold text-black outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-acid/50 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Rocket size={15} />
                            {hasUnpublishedChanges ? `Publicar ${versionLabel(editingVersion)}` : "Tudo publicado"}
                          </button>
                          {hasUnpublishedChanges && (
                            <p className="mt-2 text-[11px] leading-4 text-amber-300/80">
                              Alterações não publicadas — não estão em produção até você publicar.
                            </p>
                          )}
                        </section>
                      ) : (
                        <section className="mt-5 rounded-[7px] border border-white/10 bg-white/[.035] p-4">
                          <h3 className="text-sm font-semibold text-white">Modo leitura</h3>
                          <p className="mt-1 text-xs leading-5 text-steel">
                            Você está visualizando este agente. Entre em edição para alterar escopos e publicar versões.
                          </p>
                          <button
                            type="button"
                            onClick={() => urlAgentId && navigate(`/agents/${urlAgentId}`)}
                            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.04] text-sm font-medium text-white outline-none transition hover:border-acid/45 hover:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-acid/40"
                          >
                            <Pencil size={15} />
                            Editar agente
                          </button>
                        </section>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(true)}
                  className="flex h-full w-full flex-col items-center gap-3 py-4 text-steel outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40"
                  title="Abrir configuração"
                >
                  <PanelLeftOpen size={18} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] [writing-mode:vertical-rl]">configuração</span>
                </button>
              )}
            </aside>

            <section className="relative min-h-0 flex-1 bg-[radial-gradient(circle_at_18%_20%,rgba(199,255,61,.10),transparent_24%),linear-gradient(135deg,#080a09_0%,#0b1110_44%,#080808_100%)]">
              <ReactFlow
                className="h-full w-full"
                nodes={nodesForCanvas}
                edges={[]}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onNodeClick={(_, node) => selectArea(node.id)}
                onPaneClick={() => setSelectedAreaId(null)}
                nodesDraggable={isEditable}
                deleteKeyCode={null}
                fitView
                fitViewOptions={{ padding: 0.22 }}
              >
                <Background color="#26322e" gap={28} size={1} variant={BackgroundVariant.Dots} />
                <Controls className="!border !border-white/10 !bg-[#0b0f0d] !shadow-none [&_button]:!border-white/10 [&_button]:!bg-[#0b0f0d] [&_button]:!text-white" />
              </ReactFlow>
              {isEditable && (
                <div className="absolute right-6 top-6">
                  <button
                    type="button"
                    onClick={addContextArea}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-acid/35 bg-acid px-3.5 text-sm font-semibold text-black shadow-[0_12px_36px_rgba(199,255,61,.18)] outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-acid/50 active:scale-[.98]"
                  >
                    <Plus size={16} />
                    Adicionar escopo
                  </button>
                </div>
              )}
            </section>

            <aside
              className={clsx(
                "flex h-full min-h-0 shrink-0 flex-col border-l border-white/10 bg-[#090c0b] transition-[width] duration-200",
                isSimulatorOpen ? "w-[400px] max-xl:w-[340px]" : "w-12",
              )}
            >
              {isSimulatorOpen ? (
                <>
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">simulador</p>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
                          {conversationContext.length} contexto(s)
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={resetContext}
                        className="inline-flex h-8 items-center gap-2 rounded-md px-2 text-xs font-medium text-steel outline-none transition hover:bg-white/[.06] hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40"
                      >
                        <Eraser size={14} />
                        Limpar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSimulatorOpen(false)}
                        className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[.04] text-steel outline-none transition hover:border-acid/45 hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40"
                        title="Recolher simulador"
                      >
                        <PanelRightClose size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto p-4" ref={chatScrollRef}>
                    <div className="space-y-3">
                      {messages.map((message, index) => (
                        <div
                          key={`${message.role}-${index}`}
                          className={clsx(
                            "max-w-[94%] rounded-[7px] px-3.5 py-2.5 text-sm leading-6",
                            message.role === "user"
                              ? "ml-auto bg-acid text-black"
                              : "border border-white/10 bg-black/25 text-[#dce5df]",
                          )}
                        >
                          {message.content}
                        </div>
                      ))}
                      {isSending && (
                        <div className="flex items-center gap-2 text-sm text-steel">
                          <Loader2 className="animate-spin" size={16} />
                          recepção classificando e escopo respondendo
                        </div>
                      )}
                    </div>
                  </div>

                  <CollapsibleSection
                    title="Roteamento"
                    className="shrink-0 rounded-none border-0 border-t border-white/10 bg-transparent"
                    headerClassName="px-4 py-3"
                    bodyClassName="px-4 pb-3"
                    badge={<span className="font-mono text-[10px] text-steel">{conversationContext.length} contexto(s)</span>}
                  >
                    <div className="max-h-44 space-y-3 overflow-y-auto pr-1">
                      {trace.length === 0 ? (
                        <p className="text-xs leading-5 text-steel">O trace aparece quando a Recepção classifica uma mensagem.</p>
                      ) : (
                        trace.map((step, index) => (
                          <div key={`${step.node_id}-${index}`} className="rounded-md border border-white/10 bg-black/20 px-3 py-2">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-xs font-medium text-white">{step.label}</p>
                              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-acid">{step.decision}</span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-steel">{step.output}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </CollapsibleSection>

                  {toolRuns.length > 0 && (
                    <CollapsibleSection
                      title="Ferramentas (último turno)"
                      className="shrink-0 rounded-none border-0 border-t border-white/10 bg-transparent"
                      headerClassName="px-4 py-3"
                      bodyClassName="px-4 pb-3"
                      badge={<span className="font-mono text-[10px] text-steel">{toolRuns.length}</span>}
                    >
                      <div className="max-h-32 space-y-1.5 overflow-y-auto pr-1">
                        {toolRuns.map((run, index) => (
                          <div
                            key={`${run.label}-${index}`}
                            className={clsx(
                              "flex items-start gap-2 rounded border px-2.5 py-1.5 text-xs",
                              run.ok ? "border-acid/25 bg-acid/[.06] text-[#dce5df]" : "border-red-500/30 bg-red-500/10 text-red-200",
                            )}
                          >
                            <span className={clsx("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", run.ok ? "bg-acid" : "bg-red-400")} />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">{run.label}</p>
                              <p className="break-words text-steel">{run.info}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}

                  <form onSubmit={submit} className="shrink-0 border-t border-white/10 p-3">
                    <div className="flex items-end gap-2 rounded-[7px] border border-white/10 bg-black/25 p-2 focus-within:border-acid/60">
                      <textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }}
                        placeholder="Mensagem do cliente para a Recepção..."
                        aria-label="Mensagem do cliente para a Recepção"
                        rows={2}
                        className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-steel/70"
                      />
                      <button
                        type="submit"
                        disabled={isSending || input.trim().length === 0 || !receptionArea}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-acid text-black transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-acid/50 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40"
                        title="Testar atendimento"
                      >
                        {isSending ? <Loader2 className="animate-spin" size={17} /> : conversationContext.length === 0 ? <Play size={18} /> : <ArrowUp size={18} />}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(true)}
                  className="flex h-full w-full flex-col items-center gap-3 py-4 text-steel outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40"
                  title="Abrir simulador"
                >
                  <PanelRightOpen size={18} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] [writing-mode:vertical-rl]">simulador</span>
                </button>
              )}
            </aside>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
