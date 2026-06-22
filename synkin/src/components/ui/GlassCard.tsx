import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "blue" | "violet" | "none";
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, glow = "none", hover = false, padding = "md", ...props }, ref) => {
    const padClass = padding === "none" ? "" : padding === "sm" ? "p-4" : padding === "lg" ? "p-7" : "p-5";
    const glowClass = glow === "blue" ? "ring-1 ring-blue-500/30 shadow-[0_0_30px_rgba(10,102,194,0.18)]" : glow === "violet" ? "ring-1 ring-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.18)]" : "";

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border backdrop-blur-xl",
          "bg-white/[0.04] border-white/[0.06]",
          "light:bg-white/70 light:border-slate-200/60 light:shadow-sm",
          padClass,
          hover && "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-0.5 light:hover:bg-white light:hover:border-slate-300",
          glowClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
