import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, Eye, EyeOff, KeyRound, Loader2, RefreshCw, Save, ShieldCheck, Sparkles } from "lucide-react";
import clsx from "clsx";

import {
  PROVIDERS,
  clearProviderKey,
  fetchProvidersStatus,
  getProviderModels,
  setProviderKey,
  type ProviderId,
} from "../lib/aiModels";

export function ModelSettingsScreen() {
  const [status, setStatus] = useState<Record<ProviderId, boolean>>({ gemini: false, deepseek: false, zai: false });
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  const load = useCallback(async () => {
    setState("loading");
    try {
      setStatus(await fetchProvidersStatus());
      setState("loaded");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_18%_12%,rgba(199,255,61,.10),transparent_24%),linear-gradient(135deg,#070908_0%,#0d1210_52%,#080808_100%)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid">modelos</p>
            <h2 className="mt-2 text-2xl font-semibold">Provedores de IA</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-steel">
              Cadastre a chave de cada provedor aqui. Ela é enviada e guardada <strong className="text-white">no servidor</strong> —
              o navegador não armazena nada e a chave nunca volta para o front.
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

        <div className="mt-5 flex items-start gap-2 rounded-md border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-steel">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-acid" />
          <p>O chat chama o provedor pelo backend; a chave não trafega para o navegador nem fica no DevTools.</p>
        </div>

        {state === "loading" ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-steel">
            <Loader2 className="animate-spin" size={16} />
            Carregando provedores…
          </div>
        ) : state === "error" ? (
          <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Não foi possível consultar os provedores — verifique se o backend está no ar.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {PROVIDERS.map((provider) => (
              <ProviderCard
                key={provider.id}
                providerId={provider.id}
                label={provider.label}
                owner={provider.owner}
                configured={status[provider.id]}
                onChanged={load}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type ProviderCardProps = {
  providerId: ProviderId;
  label: string;
  owner: string;
  configured: boolean;
  onChanged: () => void;
};

function ProviderCard({ providerId, label, owner, configured, onChanged }: ProviderCardProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const valid = apiKey.trim().length >= 12;

  const handleSave = useCallback(async () => {
    if (!valid) {
      setFeedback({ ok: false, text: "Cole uma chave válida." });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      await setProviderKey(providerId, apiKey.trim());
      setApiKey(""); // nunca retém no front
      setFeedback({ ok: true, text: "Chave salva no servidor." });
      onChanged();
    } catch (error) {
      setFeedback({ ok: false, text: error instanceof Error ? error.message : "Falha ao salvar." });
    } finally {
      setSaving(false);
    }
  }, [apiKey, providerId, valid, onChanged]);

  const handleDisconnect = useCallback(async () => {
    setSaving(true);
    try {
      await clearProviderKey(providerId);
      setApiKey("");
      setFeedback({ ok: true, text: "Provedor desconectado." });
      onChanged();
    } finally {
      setSaving(false);
    }
  }, [providerId, onChanged]);

  return (
    <div className="rounded-[10px] border border-white/10 bg-[#0a0e0c]/86 p-5 shadow-node backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-acid">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold text-white">{label}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{owner}</span>
              <span
                className={clsx(
                  "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]",
                  configured ? "bg-acid/15 text-acid" : "bg-white/[.06] text-steel",
                )}
              >
                {configured ? "conectado" : "não conectado"}
              </span>
            </div>
            <p className="mt-1 text-sm leading-5 text-steel">{getProviderModels(providerId).length} modelos disponíveis para os escopos.</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`key-${providerId}`} className="mb-2 flex items-center gap-2 text-xs font-medium text-steel">
          <KeyRound size={13} />
          API Key {configured && <span className="font-mono text-[10px] text-acid">(já configurada — cole uma nova para trocar)</span>}
        </label>
        <div className="relative">
          <input
            id={`key-${providerId}`}
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder={`Cole a chave do ${label}`}
            className="h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 pr-10 font-mono text-sm text-white outline-none transition placeholder:text-steel/65 hover:border-white/20 focus:border-acid/70 focus:ring-2 focus:ring-acid/15"
          />
          <button
            type="button"
            onClick={() => setShowKey((current) => !current)}
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-steel outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40"
            title={showKey ? "Ocultar" : "Mostrar"}
          >
            {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !apiKey}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-acid/35 bg-acid px-3.5 text-sm font-semibold text-black outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-acid/50 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
          Salvar chave
        </button>
        {configured && (
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={saving}
            className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-steel outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-acid/40 disabled:opacity-50"
          >
            Desconectar
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={clsx(
            "mt-4 flex items-start gap-2 rounded-md border px-3.5 py-2.5 text-sm",
            feedback.ok ? "border-acid/30 bg-acid/10 text-acid" : "border-red-500/30 bg-red-500/10 text-red-200",
          )}
        >
          {feedback.ok ? <Check size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
          <p className="break-words">{feedback.text}</p>
        </div>
      )}
    </div>
  );
}
