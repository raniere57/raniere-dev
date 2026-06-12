export type ContextLine = {
  id: string;
  role: "user" | "area";
  content: string;
  areaId?: string;
  areaLabel?: string;
};

export type FlowNodeKind = "reception" | "finance" | "support" | "retention" | "commercial" | "operations";

export type FlowNodeData = {
  label: string;
  kind: FlowNodeKind;
  status: "idle" | "running" | "completed";
  model: string;
  systemPrompt: string;
  description: string;
  tools: string[];
  role: "reception" | "specialist";
};
