import { cn } from "../../utils/cn";
import { ArrowUp, ArrowDown } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;
  icon: React.ReactNode;
  accent?: "blue" | "violet" | "emerald" | "amber" | "rose";
  hint?: string;
}

const accents: Record<string, string> = {
  blue: "from-blue-500/20 to-blue-500/5 text-blue-300 ring-blue-500/30 light:from-blue-100 light:to-blue-50 light:text-blue-600",
  violet: "from-violet-500/20 to-violet-500/5 text-violet-300 ring-violet-500/30 light:from-violet-100 light:to-violet-50 light:text-violet-600",
  emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 ring-emerald-500/30 light:from-emerald-100 light:to-emerald-50 light:text-emerald-600",
  amber: "from-amber-500/20 to-amber-500/5 text-amber-300 ring-amber-500/30 light:from-amber-100 light:to-amber-50 light:text-amber-600",
  rose: "from-rose-500/20 to-rose-500/5 text-rose-300 ring-rose-500/30 light:from-rose-100 light:to-rose-50 light:text-rose-600",
};

export function MetricCard({ label, value, delta, icon, accent = "blue", hint }: MetricCardProps) {
  return (
    <GlassCard padding="md" hover className="group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-400 light:text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-50 light:text-slate-900 tabular-nums">{value}</p>
          <div className="mt-2 flex items-center gap-2">
            {typeof delta === "number" && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                  delta >= 0
                    ? "bg-emerald-500/15 text-emerald-300 light:bg-emerald-50 light:text-emerald-700"
                    : "bg-rose-500/15 text-rose-300 light:bg-rose-50 light:text-rose-700"
                )}
              >
                {delta >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(delta)}%
              </span>
            )}
            {hint && <span className="text-[11px] text-slate-500 light:text-slate-500">{hint}</span>}
          </div>
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ring-1", accents[accent])}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}
