import { API_URL } from "./api";

export type IntegrationKind = "database" | "api";

export type IntegrationSummary = {
  name: string;
  kind: IntegrationKind;
  description: string;
  has_secret: boolean;
  secret_label: string;
  // database
  engine?: string | null;
  host?: string | null;
  port?: number | null;
  database?: string | null;
  user?: string | null;
  // api
  base_url?: string | null;
  auth_type?: string | null;
  health_path?: string | null;
};

export type IntegrationTestResult = {
  ok: boolean;
  latency_ms?: number | null;
  detail?: string | null;
  error?: string | null;
};

export async function getIntegrations(): Promise<IntegrationSummary[]> {
  const response = await fetch(`${API_URL}/integrations`);
  if (!response.ok) throw new Error(`Falha ao listar integrações: ${response.status}`);
  return response.json() as Promise<IntegrationSummary[]>;
}

export async function testIntegration(name: string): Promise<IntegrationTestResult> {
  const response = await fetch(`${API_URL}/integrations/${encodeURIComponent(name)}/test`, { method: "POST" });
  if (!response.ok && response.status !== 200) {
    if (response.status === 404) throw new Error("Integração não encontrada.");
  }
  return response.json() as Promise<IntegrationTestResult>;
}
