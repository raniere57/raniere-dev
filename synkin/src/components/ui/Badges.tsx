import { cn } from "../../utils/cn";

export function StatusBadge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "violet" | "blue";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-white/5 text-slate-300 border-white/10 light:bg-slate-100 light:text-slate-700 light:border-slate-200",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30 light:bg-amber-50 light:text-amber-700 light:border-amber-200",
    danger: "bg-rose-500/15 text-rose-300 border-rose-500/30 light:bg-rose-50 light:text-rose-700 light:border-rose-200",
    info: "bg-sky-500/15 text-sky-300 border-sky-500/30 light:bg-sky-50 light:text-sky-700 light:border-sky-200",
    violet: "bg-violet-500/15 text-violet-300 border-violet-500/30 light:bg-violet-50 light:text-violet-700 light:border-violet-200",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30 light:bg-blue-50 light:text-blue-700 light:border-blue-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const color =
    score >= 80 ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" :
    score >= 60 ? "text-amber-300 border-amber-500/30 bg-amber-500/10" :
    score >= 40 ? "text-orange-300 border-orange-500/30 bg-orange-500/10" :
    "text-rose-300 border-rose-500/30 bg-rose-500/10";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums", color, className)}>
      {score}
    </span>
  );
}

export function AIBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300 light:bg-violet-50 light:text-violet-700", className)}>
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="currentColor"><path d="M12 2 9.5 7.5 4 9l4 4-1 6 5-2.5L17 19l-1-6 4-4-5.5-1.5z" /></svg>
      Sugerido por IA
    </span>
  );
}
