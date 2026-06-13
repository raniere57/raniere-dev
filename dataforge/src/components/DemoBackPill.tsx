import { ArrowLeft } from "lucide-react";

const RANIERE_HOME = "https://raniere.dev";

/**
 * Pílula flutuante para voltar ao portfólio raniere.dev de dentro do demo.
 * Discreta no canto, ganha destaque no hover.
 */
export function DemoBackPill() {
  return (
    <a
      href={RANIERE_HOME}
      className="group fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-[#0a1932]/90 px-3.5 py-2 text-xs text-slate-400 shadow-xl backdrop-blur-xl transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
      title="Voltar ao portfólio"
    >
      <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
      <span>
        <span className="text-cyan-400">raniere</span>.dev
      </span>
      <span className="ml-1 hidden text-slate-600 sm:inline">· demo</span>
    </a>
  );
}
