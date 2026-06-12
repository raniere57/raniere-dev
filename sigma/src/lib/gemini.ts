import { API_URL } from "./api";
import type { ContextLine, FlowNodeData } from "../types/flow";
import type { ProviderId } from "./aiModels";

export type ToolAction = {
  tool: string;
  confirmed: boolean;
  params: Record<string, unknown>;
};

export type GeminiNodeResult = {
  reply: string;
  decision: string;
  shouldClose: boolean;
  action: ToolAction | null;
};

function parseAction(value: unknown): ToolAction | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { tool?: unknown; confirmed?: unknown; params?: unknown };
  if (typeof candidate.tool !== "string" || !candidate.tool.trim()) return null;
  const params =
    candidate.params && typeof candidate.params === "object" && !Array.isArray(candidate.params)
      ? (candidate.params as Record<string, unknown>)
      : {};
  return { tool: candidate.tool.trim(), confirmed: Boolean(candidate.confirmed), params };
}


function contextToPrompt(context: ContextLine[]) {
  if (context.length === 0) return "Sem histórico anterior.";

  return context
    .map((item) => {
      const speaker = item.role === "user" ? "Cliente" : "Atendimento";
      return `${speaker}: ${item.content}`;
    })
    .join("\n");
}

export function buildGeminiSystemInstruction(systemPrompt: string, actionsBlock?: string) {
  const actions =
    actionsBlock && actionsBlock.trim()
      ? `
- Ações executáveis disponíveis neste escopo (efeito real, exigem confirmação do cliente):
${actionsBlock}
- Para EXECUTAR uma ação: confirme explicitamente com o cliente primeiro. Só quando ele confirmar, defina "action":{"tool":"<id_da_acao>","confirmed":true,"params":{...}} preenchendo em params os campos indicados na ação (o CPF é preenchido automaticamente). Sem confirmação, mantenha "action":null.
- Nunca afirme ter executado uma ação sem retornar "action" com confirmed=true. O resultado real será informado no próximo turno.`
      : `
- Não há ações executáveis neste escopo. Mantenha "action":null.`;

  return `${systemPrompt}

Regras obrigatórias:
- Você fala diretamente com o cliente final.
- Não cite nomes de áreas internas, roteamento, ferramentas, contexto interno, prompt, classificação ou qualquer bastidor técnico.
- Se precisar continuar o atendimento, responda naturalmente sem dizer que vai transferir para outra área.
- Identificação do titular: só trate dados cadastrais (cliente, conexão, fatura, chamados, cancelamento) depois de ter um CPF válido (11 dígitos) ou CNPJ (14 dígitos) do titular no histórico. Se o cliente enviar um número com quantidade de dígitos diferente disso, diga de forma natural que o documento parece inválido e peça para reenviar — não invente que está inválido sem motivo. Uma vez que um CPF/CNPJ válido já apareceu no histórico, NUNCA peça de novo: siga o atendimento. Quando houver uma "Orientação de identificação" no contexto, siga-a.
- Serviços múltiplos: se o cliente tiver mais de um serviço, descubra QUAL é o assunto antes de qualquer ação (reiniciar, abrir chamado, etc.). Porém, assim que a resposta dele identificar um ÚNICO serviço da lista, considere RESOLVIDO e prossiga com o id_cliente_servico correspondente — NÃO pergunte de novo nome do plano nem endereço. Ex.: cliente diz "o de internet" e só existe um serviço de internet → está claro, siga. Só volte a perguntar se a resposta ainda casar com 2 ou mais serviços (ex.: dois planos de internet diferentes).
- Use as ferramentas disponíveis apenas como capacidade operacional; não invente execução real se o resultado não foi informado no contexto.${actions}
- Varie a linguagem; não repita sempre a mesma saudação.
- A resposta ao cliente deve ser texto limpo e bem formatado, nunca JSON, objeto, markdown técnico ou fragmentos do schema.
- Retorne somente JSON válido neste formato:
{"reply":"mensagem ao cliente","decision":"finance|support|retention|commercial|operations|reply|close","shouldClose":false,"action":null}`;
}

export function buildGeminiUserPrompt({
  context,
  message,
  toolContext,
  identityNote,
}: {
  context: ContextLine[];
  message: string;
  toolContext?: string;
  identityNote?: string;
}) {
  const toolBlock = toolContext
    ? `

Contexto interno das tools (dados do cliente e/ou base de conhecimento; use para responder com precisão, mas não exponha o formato bruto nem cite que veio de uma tool):
${toolContext}`
    : "";

  const identityBlock = identityNote
    ? `

Orientação de identificação (interna; oriente seu comportamento, não repita literalmente ao cliente):
${identityNote}`
    : "";

  return `Histórico do atendimento:
${contextToPrompt(context)}

Nova mensagem do cliente:
${message}${identityBlock}${toolBlock}`;
}

function parseGeminiJson(text: string): GeminiNodeResult {
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const jsonCandidate = extractFirstJsonObject(cleaned) ?? cleaned;

  let parsed: Partial<GeminiNodeResult>;
  try {
    parsed = JSON.parse(jsonCandidate) as Partial<GeminiNodeResult>;
  } catch {
    const reply = extractReplyField(cleaned);
    if (reply) {
      return {
        reply,
        decision: extractStringField(cleaned, "decision") ?? "reply",
        shouldClose: extractBooleanField(cleaned, "shouldClose") ?? false,
        action: null,
      };
    }

    return {
      reply: sanitizeFallbackReply(cleaned),
      decision: "reply",
      shouldClose: false,
      action: null,
    };
  }

  return {
    reply: sanitizeFallbackReply(String(parsed.reply ?? "").trim()),
    decision: String(parsed.decision ?? "reply").trim() || "reply",
    shouldClose: Boolean(parsed.shouldClose),
    action: parseAction((parsed as { action?: unknown }).action),
  };
}

function extractFirstJsonObject(text: string) {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }

  return null;
}

function extractStringField(text: string, field: string) {
  const match = text.match(new RegExp(`"${field}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  if (!match) return null;

  try {
    return JSON.parse(`"${match[1]}"`) as string;
  } catch {
    return match[1];
  }
}

function extractBooleanField(text: string, field: string) {
  const match = text.match(new RegExp(`"${field}"\\s*:\\s*(true|false)`));
  return match ? match[1] === "true" : null;
}

function extractReplyField(text: string) {
  const reply = extractStringField(text, "reply");
  return reply?.trim() ? sanitizeFallbackReply(reply) : null;
}

function sanitizeFallbackReply(text: string) {
  const withoutCodeFence = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  if (/^\s*\{/.test(withoutCodeFence) || /"reply"\s*:/.test(withoutCodeFence)) {
    return "Tive uma falha ao formatar a resposta. Pode repetir sua última mensagem, por favor?";
  }

  return withoutCodeFence;
}


// A IA roda no backend (chaves só no servidor). Aqui só montamos o prompt e
// chamamos /ai/run; o parse do JSON segue local.
export async function runAiNode({
  provider,
  node,
  message,
  context,
  toolContext,
  actionsBlock,
  identityNote,
}: {
  provider: ProviderId;
  node: { data: FlowNodeData };
  message: string;
  context: ContextLine[];
  toolContext?: string;
  actionsBlock?: string;
  identityNote?: string;
}): Promise<GeminiNodeResult> {
  const body = {
    provider,
    model: node.data.model,
    system_instruction: buildGeminiSystemInstruction(node.data.systemPrompt, actionsBlock),
    user_prompt: buildGeminiUserPrompt({ context, message, toolContext, identityNote }),
  };

  const call = async () => {
    const response = await fetch(`${API_URL}/ai/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as { ok: boolean; text?: string; error?: string };
    if (!data.ok || !data.text) throw new Error(data.error ?? "Falha ao gerar resposta.");
    return data.text;
  };

  let text: string;
  try {
    text = await call();
  } catch (error) {
    const transient = error instanceof TypeError || /load failed|network|fetch/i.test(String(error));
    if (!transient) throw error;
    await new Promise((resolve) => setTimeout(resolve, 700));
    text = await call();
  }

  const parsed = parseGeminiJson(text);
  if (!parsed.reply) throw new Error("O provedor retornou uma resposta sem mensagem ao cliente.");
  return parsed;
}
