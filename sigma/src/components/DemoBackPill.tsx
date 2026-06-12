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
      className="group fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2 rounded-full border border-line bg-panel/90 px-3.5 py-2 font-mono text-xs text-steel/80 shadow-node backdrop-blur transition-colors hover:border-acid hover:text-acid"
      title="Voltar ao portfólio"
    >
      <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
      <span>
        <span className="text-acid">raniere</span>.dev
      </span>
      <span className="ml-1 hidden text-steel/40 sm:inline">· demo</span>
    </a>
  );
}
