export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type TraceStep = {
  node_id: string;
  label: string;
  decision: string;
  output: string;
  status: string;
};
