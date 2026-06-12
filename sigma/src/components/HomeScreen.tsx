import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Cpu,
  Library,
  Plug,
  Wrench,
} from "lucide-react";
import clsx from "clsx";

import type { Agent } from "../lib/agents";
import { TOOL_CATALOG } from "../lib/tools";
import { MODELS_BY_PROVIDER, PROVIDERS, fetchProvidersStatus } from "../lib/aiModels";
import { getIntegrations } from "../lib/integrations";
import { knowledgeArticleCount } from "../lib/knowledge";

type HomeScreenProps = {
  agents: Agent[];
  onNavigate: (path: string) => void;
};

type Resource = {
  id: string;
  index: string;
  name: string;
  kicker: string;
  desc: string;
  icon: ReactNode;
  accent: string;
  metric: string;
  metricLabel: string;
  path?: string;
  soon?: boolean;
};

const TOTAL_MODELS = Object.values(MODELS_BY_PROVIDER).reduce((sum, list) => sum + list.length, 0);

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function HomeScreen({ agents, onNavigate }: HomeScreenProps) {
  const now = useClock();
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [integrationsCount, setIntegrationsCount] = useState<number | null>(null);
  const [providersReady, setProvidersReady] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    getIntegrations()
      .then((list) => alive && setIntegrationsCount(list.length))
      .catch(() => alive && setIntegrationsCount(null));
    fetchProvidersStatus()
      .then((status) => alive && setProvidersReady(Object.values(status).filter(Boolean).length))
      .catch(() => alive && setProvidersReady(null));
    return () => {
      alive = false;
    };
  }, []);

  // Spotlight segue o cursor pela viewport inteira (camada fixed → coords diretas).
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const el = spotlightRef.current;
      if (!el) return;
      el.style.setProperty("--mx", `${event.clientX}px`);
      el.style.setProperty("--my", `${event.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const activeAgents = agents.filter((agent) => agent.status === "active").length;

  const resources = useMemo<Resource[]>(
    () => [
      {
        id: "agents",
        index: "01",
        name: "Agentes",
        kicker: "organizações de atendimento",
        desc: "Construa, versione e publique fluxos autônomos por escopo.",
        icon: <Bot size={20} />,
        accent: "#c7ff3d",
        metric: String(activeAgents),
        metricLabel: activeAgents === 1 ? "ativo" : "ativos",
        path: "/agents",
      },
      {
        id: "tools",
        index: "02",
        name: "Tools",
        kicker: "capacidades executáveis",
        desc: "Ações reais que a IA aciona — consultas e operações.",
        icon: <Wrench size={20} />,
        accent: "#ff6b35",
        metric: String(TOOL_CATALOG.length),
        metricLabel: "no catálogo",
        path: "/tools",
      },
      {
        id: "integrations",
        index: "03",
        name: "Integrações",
        kicker: "fontes de dados",
        desc: "Bancos e APIs que alimentam as tools, com credenciais no servidor.",
        icon: <Plug size={20} />,
        accent: "#36e3c9",
        metric: integrationsCount === null ? "—" : String(integrationsCount),
        metricLabel: "conectadas",
        path: "/integrations",
      },
      {
        id: "models",
        index: "04",
        name: "Modelos de IA",
        kicker: "motores de raciocínio",
        desc: "Provedores e modelos. Cada escopo escolhe o seu.",
        icon: <Cpu size={20} />,
        accent: "#5fb2ff",
        metric: providersReady === null ? "—" : `${providersReady}/${PROVIDERS.length}`,
        metricLabel: "provedores prontos",
        path: "/models",
      },
      {
        id: "kb",
        index: "05",
        name: "Base de conhecimento",
        kicker: "memória do atendimento",
        desc: "O que a IA sabe além das tools — wiki do ERP e curadoria.",
        icon: <Library size={20} />,
        accent: "#f4c95d",
        metric: String(knowledgeArticleCount()),
        metricLabel: "artigos",
        path: "/knowledge",
      },
    ],
    [activeAgents, integrationsCount, providersReady],
  );

  const clock = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const day = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  return (
    <section className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#050706] text-white">
      {/* ---- atmosphere ---- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-40%] h-[120vh] w-[120vh] -translate-x-1/2 home-aurora opacity-50 [background:conic-gradient(from_0deg,rgba(199,255,61,.16),transparent_22%,rgba(54,227,201,.12)_42%,transparent_60%,rgba(255,107,53,.12)_78%,transparent_92%,rgba(199,255,61,.16))] [filter:blur(60px)]" />
        <div className="absolute inset-0 home-grid opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acid/60 to-transparent home-scanline" />
        <div className="absolute inset-0 opacity-[.04] mix-blend-soft-light home-grain" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#050706] to-transparent" />
      </div>
      <div ref={spotlightRef} className="pointer-events-none fixed inset-0 z-0 home-spotlight" />

      {/* ---- content (cabe em uma viewport) ---- */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col px-6 py-5 md:px-10 md:py-6">
        {/* top strip */}
        <header className="home-reveal flex shrink-0 items-center justify-between gap-4" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-acid text-black shadow-[0_0_26px_rgba(199,255,61,.45)]">
              <BrainCircuit size={16} />
            </div>
            <span className="font-display text-base font-semibold tracking-tight">Sigma</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
            <span className="hidden sm:inline">{day}</span>
            <span className="tabular-nums text-white/85">{clock}</span>
            <span className="flex items-center gap-1.5 rounded-full border border-acid/25 bg-acid/10 px-2.5 py-1 text-acid">
              <span className="h-1.5 w-1.5 rounded-full bg-acid home-blink shadow-[0_0_10px_rgba(199,255,61,.9)]" />
              operacional
            </span>
          </div>
        </header>

        {/* hero */}
        <div className="flex flex-1 flex-col justify-center py-6">
          <p
            className="home-reveal font-mono text-[11px] uppercase tracking-[0.44em] text-acid/80"
            style={{ animationDelay: "140ms" }}
          >
            Plataforma de atendimento autônomo
          </p>

          <div className="relative mt-3">
            <h1
              aria-hidden
              className="home-wordmark-glow pointer-events-none absolute inset-0 select-none font-display text-[clamp(3.5rem,12vw,10rem)] font-extrabold leading-[0.8] tracking-[-0.045em] text-acid"
            >
              SIGMA
            </h1>
            <h1
              className="home-reveal relative bg-gradient-to-br from-white via-white to-[#9fb39a] bg-clip-text font-display text-[clamp(3.5rem,12vw,10rem)] font-extrabold leading-[0.8] tracking-[-0.045em] text-transparent"
              style={{ animationDelay: "120ms" }}
            >
              SIGMA
            </h1>
          </div>

          <p
            className="home-reveal mt-6 max-w-2xl text-[15px] leading-7 text-steel md:text-base"
            style={{ animationDelay: "220ms" }}
          >
            O centro de operações do atendimento por IA. Tudo que a inteligência usa para resolver um
            cliente — agentes, ferramentas, integrações e modelos — em um só lugar.
          </p>

          <div
            className="home-reveal mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-steel"
            style={{ animationDelay: "300ms" }}
          >
            <Telemetry value={String(activeAgents)} label="agentes" />
            <span className="text-white/15">/</span>
            <Telemetry value={String(TOOL_CATALOG.length)} label="tools" />
            <span className="text-white/15">/</span>
            <Telemetry value={integrationsCount === null ? "—" : String(integrationsCount)} label="integrações" />
            <span className="text-white/15">/</span>
            <Telemetry value={String(TOTAL_MODELS)} label="modelos" />
          </div>
        </div>

        {/* resource portals */}
        <div className="grid shrink-0 grid-cols-2 gap-2.5 lg:grid-cols-5">
          {resources.map((resource, index) => (
            <button
              key={resource.id}
              type="button"
              disabled={resource.soon}
              onClick={() => resource.path && onNavigate(resource.path)}
              style={{ "--accent": resource.accent, animationDelay: `${340 + index * 65}ms` } as CSSProperties}
              className={clsx(
                "home-card home-reveal group flex min-h-[210px] flex-col rounded-[14px] border border-white/10 bg-white/[.025] p-5 text-left outline-none transition-[transform,border-color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-acid/40",
                resource.soon ? "cursor-default opacity-65" : "cursor-pointer",
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className="grid h-10 w-10 place-items-center rounded-[10px] border border-white/10 bg-black/30"
                  style={{ color: resource.accent }}
                >
                  {resource.icon}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">{resource.index}</span>
              </div>

              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-white">{resource.name}</h3>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">{resource.kicker}</p>
              <p className="mt-2 text-[12.5px] leading-[1.4] text-steel/85">{resource.desc}</p>

              <div className="mt-auto flex items-end justify-between pt-4">
                <span className="flex items-baseline gap-1">
                  <span
                    className="font-display text-xl font-bold leading-none"
                    style={{ color: resource.soon ? undefined : resource.accent }}
                  >
                    {resource.metric}
                  </span>
                  {resource.metricLabel && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-steel">{resource.metricLabel}</span>
                  )}
                </span>
                {!resource.soon && <ArrowUpRight className="home-card-arrow text-steel" size={18} />}
              </div>
            </button>
          ))}
        </div>

        <footer
          className="home-reveal mt-4 flex shrink-0 items-center justify-between border-t border-white/[.06] pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30"
          style={{ animationDelay: "720ms" }}
        >
          <span>Sigma · console interno</span>
          <span>plataforma de atendimento por IA</span>
        </footer>
      </div>
    </section>
  );
}

function Telemetry({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-display text-base font-bold tabular-nums text-white">{value}</span>
      <span>{label}</span>
    </span>
  );
}
