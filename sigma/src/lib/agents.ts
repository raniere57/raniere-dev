import type { Node } from "@xyflow/react";

import { API_URL } from "./api";
import { DEFAULT_MODEL_ID } from "./aiModels";
import { ERP_WIKI_TOOL_ID, OMNICHANNEL_TOOL_ID } from "./tools";
import type { FlowNodeData, FlowNodeKind } from "../types/flow";

export type AgentNode = Node<FlowNodeData>;

export type AgentVersion = {
  version: number;
  createdAt: string;
  note: string;
  nodes: AgentNode[];
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  /** Nós em edição (espelho de versions[cursor]); é o que o canvas edita. */
  draft: AgentNode[];
  /** Histórico linear de versões (cresce a cada alteração). */
  versions: AgentVersion[];
  /** Índice em `versions` da versão atualmente em edição (para undo/redo). */
  cursor: number;
  /** Número da versão publicada (em vigor na produção). */
  publishedVersion: number;
};

export type AgentStore = {
  agents: Agent[];
  activeAgentId: string | null;
};

const STORAGE_KEY = "sigma.agents";
const LEGACY_STORE_KEY = "flai.agents";
const LEGACY_DRAFT_KEY = "flai.contextAreasDraft";
const LEGACY_CONFIG_KEY = "flai.contextAreaConfigs";

export const DEFAULT_AREA_PROMPTS: Record<FlowNodeKind, string> = {
  reception:
    "Você é Aurora, recepcionista virtual da NovaConecta. Acolha o cliente em PT-BR, tom positivo, tratando por 'você'.\n\n" +
    "Sua função é identificar e classificar — não resolver casos especializados.\n" +
    "1. Confirme o CPF/CNPJ do titular quando ainda não houver no histórico. Valide 11 (CPF) ou 14 (CNPJ) dígitos; se já foi informado antes, reutilize e apenas confirme.\n" +
    "2. Com o cliente identificado, observe os dados retornados (plano, status da conexão, status do serviço): se houver bloqueio ou pendência financeira, direcione para o Financeiro mesmo que o cliente fale em 'internet caiu' — a causa provável é fatura.\n" +
    "3. Classifique o assunto para o escopo certo: Financeiro (fatura, 2ª via, débito, PIX, renegociação, desbloqueio), Suporte (lentidão, queda, equipamento, visita), Retenção (cancelamento, insatisfação), Comercial (planos, contratação, upgrade), Operação (ordem de serviço, acompanhamento, demais assuntos).\n" +
    "4. Continuidade: classifique pelo histórico inteiro, não pela última palavra. Se o cliente já está num fluxo (ex.: cancelamento → Retenção) e só responde a uma pergunta sua (ex.: o motivo é 'internet lenta'), mantenha o MESMO escopo — não pule para Suporte por palavra-chave. Só troque quando ele abrir um assunto novo.\n" +
    "5. Use o Omnichannel para interpretar mensagens curtas/ruído do canal e manter conversa natural; não copie menus ou templates do bot antigo.\n" +
    "Acolha, identifique e preserve o contexto. Não exponha o roteamento interno ao cliente.",
  finance:
    "Você é Aurora no Financeiro da NovaConecta. Resolva fatura, 2ª via, débitos, PIX, renegociação, desbloqueio e confirmação de pagamento. PT-BR, claro e cuidadoso com valores.\n\n" +
    "- 2ª via: ao enviar uma fatura, separe em blocos distintos — link/PDF do boleto, PIX copia-e-cola e linha digitável — para o cliente copiar cada um com facilidade.\n" +
    "- Débitos: liste faturas em aberto com vencimento e valor antes de qualquer ação.\n" +
    "- Renegociação: simule as opções (parcelas/desconto) e apresente; só efetive após confirmação explícita do cliente.\n" +
    "- Desbloqueio de confiança: depende do Perfil de Suspensão e da validação do ERP. Verifique elegibilidade antes de prometer; se inelegível, explique o motivo.\n" +
    "- Pagamento confirmado: se houver pagamento recente, informe que a conexão tende a restabelecer automaticamente e oriente reiniciar o equipamento.\n" +
    "- Use a Wiki do ERP quando precisar explicar status, faturas, PIX, suspensão, desbloqueio ou renegociação; dados reais do cliente vêm das tools operacionais.\n" +
    "- Use o Omnichannel para adaptar a fala ao jeito real do cliente pedir boleto, PIX, confirmação de pagamento ou desbloqueio; não copie templates literalmente.\n" +
    "Use apenas as ferramentas disponíveis; nunca invente valores, códigos ou execução que a tool não retornou.",
  support:
    "Você é Aurora no Suporte técnico da NovaConecta. Ajude com lentidão, queda de sinal, equipamento, visita técnica e abertura de chamado. PT-BR, objetivo, conduzindo a uma ação prática.\n\n" +
    "- Antes de abrir OS, oriente o reboot do equipamento (tirar da tomada, aguardar, recolocar) e confirme se resolveu.\n" +
    "- Reinício remoto só faz sentido quando a conexão/equipamento está online; se estiver offline, oriente energia/cabos e avalie OS.\n" +
    "- IMPORTANTE: se o cliente estiver bloqueado por pendência financeira, o problema de conexão é consequência da fatura — direcione ao Financeiro e NÃO abra ordem de serviço de 'internet caiu'.\n" +
    "- Evite OS duplicada: se já existir atendimento aberto para o contrato, informe o andamento em vez de abrir outro.\n" +
    "- Abra atendimento/OS apenas quando o diagnóstico remoto não resolver.\n" +
    "- Use a Wiki do ERP quando precisar explicar status de serviço, conexão online/offline, reinício remoto, atendimento ou OS; dados reais do cliente vêm das tools operacionais.\n" +
    "- Use o Omnichannel para traduzir relatos como luz vermelha, cai e volta, não abre WhatsApp, áudio ou print; responda com acolhimento antes dos passos técnicos.\n" +
    "Use apenas as ferramentas disponíveis; não invente protocolos ou status não retornados.",
  retention:
    "Você é Aurora na Retenção da NovaConecta. Atenda cancelamento, insatisfação e contratos cancelados com empatia, PT-BR.\n\n" +
    "- Entenda o motivo real antes de ofertar qualquer coisa.\n" +
    "- Apresente alternativas de retenção elegíveis (desconto, benefício) conforme o perfil; não aplique nada sem confirmação.\n" +
    "- Cancelamento só é formalizado após confirmação explícita do cliente; informe condições (fidelidade/multa) quando houver.\n" +
    "- Use o Omnichannel para manter tom humano em reclamações e evitar respostas defensivas ou engessadas.\n" +
    "Use apenas as ferramentas disponíveis.",
  commercial:
    "Você é Aurora no Comercial da NovaConecta. Ajude com planos, cobertura, contratação e upgrade. PT-BR, claro.\n\n" +
    "- Explique as opções (velocidade, preço, benefícios) de forma objetiva.\n" +
    "- Verifique viabilidade/cobertura antes de prometer instalação ou disponibilidade.\n" +
    "- Para upgrade, confirme o plano de destino e registre a solicitação.\n" +
    "- Use o Omnichannel para conduzir a coleta comercial em etapas naturais, sem despejar formulário inteiro de uma vez.\n" +
    "Use apenas as ferramentas disponíveis; não prometa disponibilidade sem consulta.",
  operations:
    "Você é Aurora na Operação da NovaConecta. Trate ordens de serviço, acompanhamento, incidências massivas e demais assuntos. PT-BR, objetivo.\n\n" +
    "- Em incidência massiva (falha que afeta uma região/área), informe o cliente que já há registro e que a equipe está atuando, sem abrir chamado individual desnecessário.\n" +
    "- Para OS existente, informe status e previsão.\n" +
    "- Assuntos que não se encaixam nos demais escopos: acolha, registre e encaminhe.\n" +
    "- Use a Wiki do ERP quando precisar explicar atendimento, protocolo, OS, status de serviço ou conexão; dados reais do cliente vêm das tools operacionais.\n" +
    "- Use o Omnichannel para lidar com continuidade, pedidos por atendente específico e mensagens curtas sem perder o histórico.\n" +
    "Use apenas as ferramentas disponíveis; mantenha o cliente informado sem inventar prazos.",
};

export const DEFAULT_AREAS: AgentNode[] = [
  {
    id: "reception",
    type: "sigmaNode",
    position: { x: 80, y: 190 },
    data: {
      label: "Recepção",
      kind: "reception",
      role: "reception",
      status: "idle",
      model: DEFAULT_MODEL_ID,
      description: "Recebe, acolhe e classifica o assunto do cliente.",
      systemPrompt: DEFAULT_AREA_PROMPTS.reception,
      tools: [OMNICHANNEL_TOOL_ID, "consultar_cliente_erp"],
    },
  },
  {
    id: "finance",
    type: "sigmaNode",
    position: { x: 390, y: 80 },
    data: {
      label: "Financeiro",
      kind: "finance",
      role: "specialist",
      status: "idle",
      model: DEFAULT_MODEL_ID,
      description: "Faturas, débitos, segunda via e pagamentos.",
      systemPrompt: DEFAULT_AREA_PROMPTS.finance,
      tools: [OMNICHANNEL_TOOL_ID, ERP_WIKI_TOOL_ID, "consultar_cliente_erp", "consultar_faturas_erp"],
    },
  },
  {
    id: "support",
    type: "sigmaNode",
    position: { x: 390, y: 250 },
    data: {
      label: "Suporte",
      kind: "support",
      role: "specialist",
      status: "idle",
      model: DEFAULT_MODEL_ID,
      description: "Conexão, equipamento, chamado e visita técnica.",
      systemPrompt: DEFAULT_AREA_PROMPTS.support,
      tools: [OMNICHANNEL_TOOL_ID, ERP_WIKI_TOOL_ID, "consultar_cliente_erp"],
    },
  },
  {
    id: "retention",
    type: "sigmaNode",
    position: { x: 700, y: 80 },
    data: {
      label: "Retenção",
      kind: "retention",
      role: "specialist",
      status: "idle",
      model: DEFAULT_MODEL_ID,
      description: "Cancelamento, negociação e recuperação.",
      systemPrompt: DEFAULT_AREA_PROMPTS.retention,
      tools: [OMNICHANNEL_TOOL_ID, "consultar_cliente_erp"],
    },
  },
  {
    id: "commercial",
    type: "sigmaNode",
    position: { x: 700, y: 250 },
    data: {
      label: "Comercial",
      kind: "commercial",
      role: "specialist",
      status: "idle",
      model: DEFAULT_MODEL_ID,
      description: "Planos, cobertura, contratação e upgrade.",
      systemPrompt: DEFAULT_AREA_PROMPTS.commercial,
      tools: [OMNICHANNEL_TOOL_ID, "consultar_cliente_erp"],
    },
  },
];

function nowIso() {
  return new Date().toISOString();
}

export function makeAgentId() {
  return `agent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function cloneNodes(nodes: AgentNode[]): AgentNode[] {
  return JSON.parse(JSON.stringify(nodes)) as AgentNode[];
}

const LEGACY_NODE_TYPE = "flaiNode";
const NODE_TYPE = "sigmaNode";

/** Migra o tipo de nó da marca antiga (flaiNode) para o atual (sigmaNode). */
function migrateNodeTypes(nodes: AgentNode[]): AgentNode[] {
  return nodes.map((node) => (node.type === LEGACY_NODE_TYPE ? { ...node, type: NODE_TYPE } : node));
}

export function latestVersionNumber(agent: Agent): number {
  return agent.versions.reduce((max, version) => Math.max(max, version.version), 0);
}

export function versionLabel(version: number): string {
  return `v${version}`;
}

/** Versão em edição (cursor). */
export function currentVersionNumber(agent: Agent): number {
  return agent.versions[agent.cursor]?.version ?? latestVersionNumber(agent);
}

export function agentDisplayName(agent: Agent): string {
  return agent.name;
}

/** Assinatura estrutural (só os dados do escopo; ignora posição/seleção). */
function nodesSignature(nodes: AgentNode[]): string {
  return JSON.stringify(
    [...nodes]
      .map((node) => ({ id: node.id, data: node.data }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
}

function clampIndex(value: number, max: number): number {
  if (Number.isNaN(value)) return max;
  return Math.min(Math.max(value, 0), Math.max(max, 0));
}

/** Backfill de campos novos (cursor/publishedVersion) em agentes antigos. */
export function normalizeAgent(agent: Agent): Agent {
  const rawVersions =
    Array.isArray(agent.versions) && agent.versions.length > 0
      ? agent.versions
      : [{ version: 1, createdAt: agent.createdAt, note: "Versão inicial", nodes: cloneNodes(agent.draft ?? []) }];
  const versions = rawVersions.map((version) => ({ ...version, nodes: migrateNodeTypes(version.nodes) }));
  const cursor = typeof agent.cursor === "number" ? clampIndex(agent.cursor, versions.length - 1) : versions.length - 1;
  const latest = versions.reduce((max, version) => Math.max(max, version.version), 0);
  const publishedVersion = typeof agent.publishedVersion === "number" ? agent.publishedVersion : latest;
  const draft = migrateNodeTypes(
    Array.isArray(agent.draft) && agent.draft.length > 0 ? agent.draft : cloneNodes(versions[cursor].nodes),
  );
  return { ...agent, versions, cursor, publishedVersion, draft };
}

export function createAgent(name: string, description: string, nodes: AgentNode[]): Agent {
  const stamp = nowIso();
  const cleanNodes = cloneNodes(nodes).map((node) => ({ ...node, selected: false }));

  return {
    id: makeAgentId(),
    name,
    description,
    status: "active",
    createdAt: stamp,
    updatedAt: stamp,
    draft: cleanNodes,
    cursor: 0,
    publishedVersion: 1,
    versions: [
      {
        version: 1,
        createdAt: stamp,
        note: "Versão inicial",
        nodes: cloneNodes(cleanNodes),
      },
    ],
  };
}

function readLegacyNodes(): AgentNode[] | null {
  if (typeof window === "undefined") return null;

  const rawDraft = window.localStorage.getItem(LEGACY_DRAFT_KEY);
  if (!rawDraft) return null;

  try {
    const parsed = JSON.parse(rawDraft) as { nodes?: AgentNode[] };
    if (!Array.isArray(parsed.nodes) || parsed.nodes.length === 0) return null;

    const rawConfig = window.localStorage.getItem(LEGACY_CONFIG_KEY);
    const configs = rawConfig ? (JSON.parse(rawConfig) as Record<string, Partial<FlowNodeData>>) : {};

    return migrateNodeTypes(parsed.nodes).map((node) => ({
      ...node,
      selected: false,
      data: {
        ...node.data,
        model: configs[node.id]?.model ?? node.data.model,
        systemPrompt: configs[node.id]?.systemPrompt ?? node.data.systemPrompt,
        tools: configs[node.id]?.tools ?? node.data.tools,
        description: configs[node.id]?.description ?? node.data.description,
      },
    }));
  } catch {
    return null;
  }
}

function emptyStore(): AgentStore {
  return { agents: [], activeAgentId: null };
}

export function loadStore(): AgentStore {
  if (typeof window === "undefined") return emptyStore();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AgentStore;
      if (Array.isArray(parsed.agents)) return { ...parsed, agents: parsed.agents.map(normalizeAgent) };
    } catch {
      // fall through to migration
    }
  }

  // Migração do store antigo (marca flai → sigma).
  const legacyRaw = window.localStorage.getItem(LEGACY_STORE_KEY);
  if (legacyRaw) {
    try {
      const parsed = JSON.parse(legacyRaw) as AgentStore;
      if (Array.isArray(parsed.agents)) {
        saveStore(parsed);
        return parsed;
      }
    } catch {
      // fall through to seed
    }
  }

  const legacyNodes = readLegacyNodes();
  const seedAgent = createAgent("Atendimento Padrão", "Fluxo de atendimento ao cliente da NovaConecta.", legacyNodes ?? DEFAULT_AREAS);
  const store: AgentStore = { agents: [seedAgent], activeAgentId: seedAgent.id };
  saveStore(store);
  return store;
}

export function saveStore(store: AgentStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// --- Persistência no backend (fonte da verdade) -----------------------------

export async function fetchAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_URL}/agents`);
  if (!response.ok) throw new Error(`Falha ao carregar agentes: ${response.status}`);
  const agents = (await response.json()) as Agent[];
  return agents.map(normalizeAgent);
}

export async function putAgent(agent: Agent): Promise<void> {
  await fetch(`${API_URL}/agents/${encodeURIComponent(agent.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agent),
  });
}

export async function deleteAgentRemote(agentId: string): Promise<void> {
  await fetch(`${API_URL}/agents/${encodeURIComponent(agentId)}`, { method: "DELETE" });
}

const putTimers: Record<string, ReturnType<typeof setTimeout>> = {};

/** PUT com debounce (drafts mudam a cada tecla/arraste). */
export function schedulePutAgent(agent: Agent, delay = 800) {
  clearTimeout(putTimers[agent.id]);
  putTimers[agent.id] = setTimeout(() => {
    putAgent(agent).catch(() => {});
  }, delay);
}

export function getActiveAgent(store: AgentStore): Agent | null {
  return store.agents.find((agent) => agent.id === store.activeAgentId) ?? null;
}

export function updateAgentDraft(store: AgentStore, agentId: string, nodes: AgentNode[]): AgentStore {
  return {
    ...store,
    agents: store.agents.map((agent) =>
      agent.id === agentId
        ? { ...agent, draft: cloneNodes(nodes).map((node) => ({ ...node, selected: false })), updatedAt: nowIso() }
        : agent,
    ),
  };
}

/**
 * Auto-versão: grava `nodes` como uma nova versão se houver mudança estrutural
 * em relação à versão atual (cursor). Se o cursor não está no topo (após undo),
 * a história à frente é descartada antes de anexar — comportamento padrão de undo.
 */
export function commitAutoVersion(store: AgentStore, agentId: string, nodes: AgentNode[]): AgentStore {
  return {
    ...store,
    agents: store.agents.map((agent) => {
      if (agent.id !== agentId) return agent;

      const current = agent.versions[agent.cursor];
      const cleanNodes = cloneNodes(nodes).map((node) => ({ ...node, selected: false }));
      if (current && nodesSignature(current.nodes) === nodesSignature(cleanNodes)) return agent;

      const kept = agent.versions.slice(0, agent.cursor + 1);
      const nextVersion = (kept[kept.length - 1]?.version ?? 0) + 1;
      const versions = [
        ...kept,
        { version: nextVersion, createdAt: nowIso(), note: `Alteração ${versionLabel(nextVersion)}`, nodes: cloneNodes(cleanNodes) },
      ];

      return { ...agent, draft: cleanNodes, versions, cursor: versions.length - 1, updatedAt: nowIso() };
    }),
  };
}

/** Move o cursor (undo: dir=-1, redo: dir=+1) e carrega a versão no draft. */
export function stepVersion(store: AgentStore, agentId: string, dir: -1 | 1): AgentStore {
  return {
    ...store,
    agents: store.agents.map((agent) => {
      if (agent.id !== agentId) return agent;
      const target = clampIndex(agent.cursor + dir, agent.versions.length - 1);
      if (target === agent.cursor) return agent;
      return { ...agent, cursor: target, draft: cloneNodes(agent.versions[target].nodes), updatedAt: nowIso() };
    }),
  };
}

/** Carrega uma versão específica no editor (cursor) sem criar nova versão. */
export function jumpToVersion(store: AgentStore, agentId: string, version: number): AgentStore {
  return {
    ...store,
    agents: store.agents.map((agent) => {
      if (agent.id !== agentId) return agent;
      const index = agent.versions.findIndex((entry) => entry.version === version);
      if (index === -1 || index === agent.cursor) return agent;
      return { ...agent, cursor: index, draft: cloneNodes(agent.versions[index].nodes), updatedAt: nowIso() };
    }),
  };
}

/** Publica (põe em vigor) a versão informada, ou a versão em edição. */
export function publishVersion(store: AgentStore, agentId: string, version?: number): AgentStore {
  return {
    ...store,
    agents: store.agents.map((agent) => {
      if (agent.id !== agentId) return agent;
      const target = version ?? currentVersionNumber(agent);
      if (target === agent.publishedVersion) return agent;
      return { ...agent, publishedVersion: target, updatedAt: nowIso() };
    }),
  };
}

export function setAgentStatus(store: AgentStore, agentId: string, status: Agent["status"]): AgentStore {
  return {
    ...store,
    agents: store.agents.map((agent) =>
      agent.id === agentId ? { ...agent, status, updatedAt: nowIso() } : agent,
    ),
  };
}

export function renameAgent(store: AgentStore, agentId: string, name: string, description: string): AgentStore {
  return {
    ...store,
    agents: store.agents.map((agent) =>
      agent.id === agentId ? { ...agent, name, description, updatedAt: nowIso() } : agent,
    ),
  };
}

export function addAgent(store: AgentStore, agent: Agent): AgentStore {
  return { ...store, agents: [...store.agents, agent], activeAgentId: agent.id };
}

// --- Diff between two version snapshots --------------------------------------

export type AreaFieldChange = {
  label: string;
  before: string;
  after: string;
};

export type AreaDiff = {
  id: string;
  label: string;
  change: "added" | "removed" | "changed" | "unchanged";
  fields: AreaFieldChange[];
};

const DIFF_FIELDS: Array<{ key: keyof FlowNodeData; label: string }> = [
  { key: "label", label: "Nome" },
  { key: "kind", label: "Tipo" },
  { key: "model", label: "Modelo" },
  { key: "description", label: "Descrição" },
  { key: "systemPrompt", label: "Prompt" },
  { key: "tools", label: "Tools" },
];

function fieldValue(data: FlowNodeData, key: keyof FlowNodeData): string {
  const value = data[key];
  if (Array.isArray(value)) return value.join(", ") || "—";
  return String(value ?? "—");
}

export function diffVersions(before: AgentNode[], after: AgentNode[]): AreaDiff[] {
  const beforeMap = new Map(before.map((node) => [node.id, node]));
  const afterMap = new Map(after.map((node) => [node.id, node]));
  const ids = new Set([...beforeMap.keys(), ...afterMap.keys()]);

  const diffs: AreaDiff[] = [];

  for (const id of ids) {
    const beforeNode = beforeMap.get(id);
    const afterNode = afterMap.get(id);

    if (!beforeNode && afterNode) {
      diffs.push({ id, label: afterNode.data.label, change: "added", fields: [] });
      continue;
    }
    if (beforeNode && !afterNode) {
      diffs.push({ id, label: beforeNode.data.label, change: "removed", fields: [] });
      continue;
    }
    if (!beforeNode || !afterNode) continue;

    const fields: AreaFieldChange[] = [];
    for (const { key, label } of DIFF_FIELDS) {
      const before_ = fieldValue(beforeNode.data, key);
      const after_ = fieldValue(afterNode.data, key);
      if (before_ !== after_) fields.push({ label, before: before_, after: after_ });
    }

    diffs.push({
      id,
      label: afterNode.data.label,
      change: fields.length > 0 ? "changed" : "unchanged",
      fields,
    });
  }

  return diffs.sort((a, b) => a.label.localeCompare(b.label));
}

export function diffSummary(diffs: AreaDiff[]): string {
  const added = diffs.filter((diff) => diff.change === "added").length;
  const removed = diffs.filter((diff) => diff.change === "removed").length;
  const changed = diffs.filter((diff) => diff.change === "changed").length;

  const parts: string[] = [];
  if (added) parts.push(`${added} adicionada(s)`);
  if (removed) parts.push(`${removed} removida(s)`);
  if (changed) parts.push(`${changed} alterada(s)`);
  return parts.length > 0 ? parts.join(" · ") : "Sem alterações";
}
