import { API_URL } from "./api";

export type ToolRunResult = {
  ok: boolean;
  data?: Record<string, unknown>[] | null;
  error?: string | null;
};

export async function runTool(toolId: string, params: Record<string, unknown>): Promise<ToolRunResult> {
  try {
    const response = await fetch(`${API_URL}/tools/${encodeURIComponent(toolId)}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ params }),
    });
    if (!response.ok) return { ok: false, error: `Falha na execução da tool (${response.status}).` };
    return (await response.json()) as ToolRunResult;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Falha ao chamar a tool." };
  }
}
