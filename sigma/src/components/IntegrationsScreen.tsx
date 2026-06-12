import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Database, Loader2, Lock, Plug, RefreshCw, Zap } from "lucide-react";
import clsx from "clsx";

import { getIntegrations, testIntegration, type IntegrationSummary, type IntegrationTestResult } from "../lib/integrations";

type TestState = {
  status: "idle" | "running" | "done";
  result?: IntegrationTestResult;
};

export function IntegrationsScreen() {
  const [integrations, setIntegrations] = useState<IntegrationSummary[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [loadError, setLoadError] = useState<string>("");
  const [tests, setTests] = useState<Record<string, TestState>>({});

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const data = await getIntegrations();
      setIntegrations(data);
      setLoadState("loaded");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha ao carregar integrações.");
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runTest = useCallback(async (name: string) => {
    setTests((current) => ({ ...current, [name]: { status: "running" } }));
    try {
      const result = await testIntegration(name);
      setTests((current) => ({ ...current, [name]: { status: "done", result } }));
    } catch (error) {
      setTests((current) => ({
        ...current,
        [name]: { status: "done", result: { ok: false, error: error instanceof Error ? error.message : "Falha no teste." } },
      }));
    }
  }, []);

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_18%_12%,rgba(199,255,61,.10),transparent_24%),linear-gradient(135deg,#070908_0%,#0d1210_52%,#080808_100%)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid">integrações</p>
            <h2 className="mt-2 text-2xl font-semibold">Fontes de dados e APIs</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-steel">
              Conexões usadas pelas tools dos escopos. O cadastro e a edição acontecem no backend (em código); aqui você
              visualiza e testa cada conexão.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[.04] px-3.5 text-sm font-medium text-white outline-none transition hover:border-acid/45 hover:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-acid/40"
          >
            <RefreshCw size={15} />
            Recarregar
          </button>
        </div>

        {loadState === "loading" ? (
          <div className="mt-10 flex items-center gap-2 text-sm text-steel">
            <Loader2 className="animate-spin" size={16} />
            Carregando integrações…
          </div>
        ) : loadState === "error" ? (
          <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {loadError} — verifique se o backend está no ar.
          </div>
        ) : integrations.length === 0 ? (
          <div className="mt-8 rounded-md border border-white/10 bg-black/20 px-4 py-6 text-sm text-steel">
            Nenhuma integração cadastrada.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.name}
                integration={integration}
                test={tests[integration.name] ?? { status: "idle" }}
                onTest={() => runTest(integration.name)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type IntegrationCardProps = {
  integration: IntegrationSummary;
  test: TestState;
  onTest: () => void;
};

function IntegrationCard({ integration, test, onTest }: IntegrationCardProps) {
  const isDatabase = integration.kind === "database";
  const Icon = isDatabase ? Database : Plug;

  const rows: Array<{ label: string; value: string }> = isDatabase
    ? [
        { label: "Engine", value: integration.engine ?? "—" },
        { label: "Host", value: `${integration.host ?? "—"}:${integration.port ?? "—"}` },
        { label: "Banco", value: integration.database ?? "—" },
        { label: "Usuário", value: integration.user ?? "—" },
      ]
    : [
        { label: "Base URL", value: integration.base_url ?? "—" },
        { label: "Auth", value: integration.auth_type ?? "—" },
        { label: "Health", value: integration.health_path ?? "—" },
      ];

  return (
    <div className="rounded-[10px] border border-white/10 bg-[#0a0e0c]/86 p-5 shadow-node backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-acid">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-mono text-sm font-semibold text-white">{integration.name}</h3>
              <span className="rounded-full bg-acid/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-acid">
                {isDatabase ? "banco" : "api"}
              </span>
            </div>
            <p className="mt-1 text-sm leading-5 text-steel">{integration.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onTest}
          disabled={test.status === "running"}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-acid/35 bg-acid px-3.5 text-sm font-semibold text-black outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-acid/50 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {test.status === "running" ? <Loader2 className="animate-spin" size={15} /> : <Zap size={15} />}
          Testar conexão
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 max-sm:grid-cols-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 border-b border-white/5 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{row.label}</span>
            <span className="truncate font-mono text-xs text-[#dce5df]">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 border-b border-white/5 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{integration.secret_label}</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#dce5df]">
            <Lock size={12} className={integration.has_secret ? "text-acid" : "text-steel"} />
            {integration.has_secret ? "•••••••• (definida)" : "não definida"}
          </span>
        </div>
      </div>

      {test.status === "done" && test.result && (
        <div
          className={clsx(
            "mt-4 flex items-start gap-2 rounded-md border px-3.5 py-2.5 text-sm",
            test.result.ok ? "border-acid/30 bg-acid/10 text-acid" : "border-red-500/30 bg-red-500/10 text-red-200",
          )}
        >
          {test.result.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
          <div className="min-w-0">
            {test.result.ok ? (
              <p>
                Conexão OK
                {typeof test.result.latency_ms === "number" ? ` · ${test.result.latency_ms} ms` : ""}
                {test.result.detail ? ` · ${test.result.detail}` : ""}
              </p>
            ) : (
              <p className="break-words">Falha: {test.result.error ?? "erro desconhecido"}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
