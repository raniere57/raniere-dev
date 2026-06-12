import { API_URL } from "./api";

export type ProviderId = "gemini" | "deepseek" | "zai";

export type ModelOption = {
  id: string;
  label: string;
  tier: "preview" | "stable" | "legacy";
  note: string;
};

export type ProviderOption = {
  id: ProviderId;
  label: string;
  owner: string;
  status: "active";
};

export const PROVIDERS: ProviderOption[] = [
  {
    id: "gemini",
    label: "Gemini",
    owner: "Google",
    status: "active",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    owner: "DeepSeek",
    status: "active",
  },
  {
    id: "zai",
    label: "GLM",
    owner: "Z.ai",
    status: "active",
  },
];

export const GEMINI_MODELS: ModelOption[] = [
  {
    id: "gemini-3-pro-preview",
    label: "Gemini 3 Pro Preview",
    tier: "preview",
    note: "modelo mais novo para raciocínio e multimodal",
  },
  {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    tier: "stable",
    note: "raciocínio avançado e contexto longo",
  },
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    tier: "stable",
    note: "melhor equilíbrio entre custo, latência e qualidade",
  },
  {
    id: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash-Lite",
    tier: "stable",
    note: "baixo custo e baixa latência",
  },
  {
    id: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    tier: "stable",
    note: "modelo rápido para workflows cotidianos",
  },
  {
    id: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    tier: "legacy",
    note: "compatibilidade com áreas existentes",
  },
  {
    id: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
    tier: "legacy",
    note: "compatibilidade com automações antigas",
  },
  {
    id: "gemini-1.0-pro",
    label: "Gemini 1.0 Pro",
    tier: "legacy",
    note: "legado, mantenha apenas se uma area exigir",
  },
];

export const DEEPSEEK_MODELS: ModelOption[] = [
  {
    id: "deepseek-v4-flash",
    label: "DeepSeek V4 Flash",
    tier: "stable",
    note: "modelo rápido da família V4 para atendimento e automações",
  },
  {
    id: "deepseek-v4-pro",
    label: "DeepSeek V4 Pro",
    tier: "stable",
    note: "modelo V4 mais forte para raciocinio e casos complexos",
  },
];

export const GLM_MODELS: ModelOption[] = [
  {
    id: "glm-5.1",
    label: "GLM-5.1",
    tier: "preview",
    note: "flagship mais novo da família GLM",
  },
  {
    id: "glm-5",
    label: "GLM-5",
    tier: "stable",
    note: "modelo de raciocínio forte da geração 5",
  },
  {
    id: "glm-5-turbo",
    label: "GLM-5-Turbo",
    tier: "stable",
    note: "geração 5 com foco em velocidade",
  },
  {
    id: "glm-4.7",
    label: "GLM-4.7",
    tier: "stable",
    note: "robusto e econômico para casos complexos",
  },
  {
    id: "glm-4.7-flashx",
    label: "GLM-4.7-FlashX",
    tier: "stable",
    note: "rápido e barato da família 4.7",
  },
  {
    id: "glm-4.7-flash",
    label: "GLM-4.7-Flash",
    tier: "stable",
    note: "gratuito e rápido da família 4.7",
  },
  {
    id: "glm-4.6",
    label: "GLM-4.6",
    tier: "stable",
    note: "raciocínio forte e contexto longo (200K)",
  },
  {
    id: "glm-4.5",
    label: "GLM-4.5",
    tier: "stable",
    note: "modelo robusto para casos complexos",
  },
  {
    id: "glm-4.5-x",
    label: "GLM-4.5-X",
    tier: "stable",
    note: "flagship de alta velocidade",
  },
  {
    id: "glm-4.5-air",
    label: "GLM-4.5-Air",
    tier: "stable",
    note: "leve, bom equilíbrio entre custo e latência",
  },
  {
    id: "glm-4.5-airx",
    label: "GLM-4.5-AirX",
    tier: "stable",
    note: "versão Air de alta velocidade",
  },
  {
    id: "glm-4.5-flash",
    label: "GLM-4.5-Flash",
    tier: "stable",
    note: "rápido e gratuito, ideal para testes",
  },
  {
    id: "glm-4-32b-0414-128k",
    label: "GLM-4-32B-0414-128K",
    tier: "legacy",
    note: "geração 4 de baixo custo com contexto 128K",
  },
];

export const MODELS_BY_PROVIDER: Record<ProviderId, ModelOption[]> = {
  gemini: GEMINI_MODELS,
  deepseek: DEEPSEEK_MODELS,
  zai: GLM_MODELS,
};

export const DEFAULT_MODEL_ID = "gemini-2.5-flash";

export function getProviderModels(provider: ProviderId) {
  return MODELS_BY_PROVIDER[provider];
}

export function isProviderId(value: unknown): value is ProviderId {
  return value === "gemini" || value === "deepseek" || value === "zai";
}

export function getProviderLabel(provider: ProviderId) {
  const option = PROVIDERS.find((currentProvider) => currentProvider.id === provider);
  return option ? `${option.label} (${option.owner})` : provider;
}

// --- Status dos provedores (chaves ficam no backend) -------------------------

export type ProviderStatusMap = Record<ProviderId, boolean>;

export async function fetchProvidersStatus(): Promise<ProviderStatusMap> {
  const response = await fetch(`${API_URL}/ai/providers`);
  if (!response.ok) throw new Error(`Falha ao consultar provedores: ${response.status}`);
  const data = (await response.json()) as Array<{ id: string; configured: boolean }>;
  const map: ProviderStatusMap = { gemini: false, deepseek: false, zai: false };
  for (const item of data) {
    if (isProviderId(item.id)) map[item.id] = Boolean(item.configured);
  }
  return map;
}

/** Envia a chave ao backend (guardada no servidor). O browser não retém nada. */
export async function setProviderKey(provider: ProviderId, apiKey: string): Promise<void> {
  const response = await fetch(`${API_URL}/ai/providers/${provider}/key`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!response.ok) throw new Error(`Falha ao salvar a chave (${response.status}).`);
}

export async function clearProviderKey(provider: ProviderId): Promise<void> {
  await fetch(`${API_URL}/ai/providers/${provider}/key`, { method: "DELETE" });
}

export function getProviderForModel(modelId: string): ProviderId | null {
  for (const provider of PROVIDERS) {
    if (MODELS_BY_PROVIDER[provider.id].some((model) => model.id === modelId)) return provider.id;
  }
  return null;
}

