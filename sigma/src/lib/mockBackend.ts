// Camada de mock para o demo estático (raniere.dev/sigma).
// Intercepta window.fetch e responde aos endpoints da API Sigma com dados
// fictícios — nenhum backend, nenhuma chave, nenhum nome real de cliente.
import { API_URL } from "./api";

type Handler = (match: RegExpMatchArray, init?: RequestInit) => unknown;

interface Route {
  method: string;
  pattern: RegExp;
  handler: Handler;
}

const LATENCY_MS = 260;

// Resposta canned da IA: o parser do app espera um JSON com `reply`.
const CANNED_AI_REPLIES = [
  "Localizei seu cadastro. Sua fatura de junho está em aberto, com vencimento em 15/06. Quer que eu gere a 2ª via no WhatsApp?",
  "Verifiquei o plano contratado: 500 Mega, fidelidade até 03/2027. Posso registrar a solicitação de upgrade agora mesmo.",
  "Encontrei uma instabilidade na sua região, já em correção pela equipe técnica. Previsão de normalização em 2h. Deseja abrir um chamado para acompanhamento?",
];

let aiCallCount = 0;

// Operadora fictícia "NovaConecta" — nenhum dado ou nome de cliente real.
const INTEGRATIONS = [
  {
    name: "banco_erp",
    kind: "database",
    description: "Base de leitura do ERP: clientes, contratos, faturas e conexão.",
    has_secret: true,
    secret_label: "ERP_DATABASE_URL",
    engine: "postgresql",
    host: "db-erp.interno",
    port: 5432,
    database: "erp",
    user: "sigma_ro",
  },
  {
    name: "api_erp",
    kind: "api",
    description: "API REST do ERP para consultas oficiais, 2ª via, OS e ações.",
    has_secret: true,
    secret_label: "ERP_API_TOKEN",
    base_url: "https://api.erp.interno",
    auth_type: "oauth2",
    health_path: "/health",
  },
  {
    name: "banco_atendimento",
    kind: "database",
    description: "Histórico de conversas e tickets do atendimento omnichannel.",
    has_secret: true,
    secret_label: "ODS_DATABASE_URL",
    engine: "postgresql",
    host: "db-ods.interno",
    port: 5432,
    database: "atendimento",
    user: "sigma_ro",
  },
];

const TOOL_SAMPLE_ROWS = [
  { id: 4821, cliente: "Demo Cliente A", status: "ativo", plano: "500 Mega", fatura: "em aberto" },
  { id: 4822, cliente: "Demo Cliente B", status: "ativo", plano: "300 Mega", fatura: "paga" },
  { id: 4823, cliente: "Demo Cliente C", status: "suspenso", plano: "1 Giga", fatura: "em aberto" },
];

const routes: Route[] = [
  {
    method: "GET",
    pattern: /\/integrations$/,
    handler: () => INTEGRATIONS,
  },
  {
    method: "POST",
    pattern: /\/integrations\/([^/]+)\/test$/,
    handler: () => ({ ok: true, latency_ms: 38, detail: "Conexão estabelecida (demo)." }),
  },
  {
    method: "GET",
    pattern: /\/ai\/providers$/,
    handler: () => [
      { id: "gemini", configured: true },
      { id: "deepseek", configured: true },
      { id: "zai", configured: false },
    ],
  },
  {
    method: "PUT",
    pattern: /\/ai\/providers\/[^/]+\/key$/,
    handler: () => ({ ok: true }),
  },
  {
    method: "DELETE",
    pattern: /\/ai\/providers\/[^/]+\/key$/,
    handler: () => ({ ok: true }),
  },
  {
    method: "GET",
    pattern: /\/agents$/,
    // Os agentes do demo vivem no localStorage (seed); o backend "remoto" é vazio.
    handler: () => [],
  },
  {
    method: "PUT",
    pattern: /\/agents\/[^/]+$/,
    handler: () => ({ ok: true }),
  },
  {
    method: "DELETE",
    pattern: /\/agents\/[^/]+$/,
    handler: () => ({ ok: true }),
  },
  {
    method: "POST",
    pattern: /\/tools\/([^/]+)\/run$/,
    handler: () => ({ ok: true, data: TOOL_SAMPLE_ROWS, error: null }),
  },
  {
    method: "POST",
    pattern: /\/ai\/run$/,
    handler: () => {
      const reply = CANNED_AI_REPLIES[aiCallCount % CANNED_AI_REPLIES.length];
      aiCallCount += 1;
      const text = JSON.stringify({
        reply,
        decision: "reply",
        shouldClose: false,
        action: null,
      });
      return { ok: true, text };
    },
  },
];

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Instala o interceptador de fetch. Requisições para a API Sigma são
 * respondidas localmente; qualquer outra (fontes, assets) segue o fetch real.
 */
export function installMockBackend(): void {
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

    if (!url.startsWith(API_URL)) {
      return realFetch(input as RequestInfo, init);
    }

    const method = (init?.method ?? "GET").toUpperCase();
    const path = url.slice(API_URL.length);

    for (const route of routes) {
      if (route.method !== method) continue;
      const match = path.match(route.pattern);
      if (!match) continue;
      await delay(LATENCY_MS);
      return jsonResponse(route.handler(match, init));
    }

    // Endpoint não mapeado: responde vazio em vez de estourar erro de rede.
    await delay(LATENCY_MS);
    return jsonResponse({ ok: true });
  };
}
