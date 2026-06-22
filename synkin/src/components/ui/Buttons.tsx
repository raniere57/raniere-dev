import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "violet";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  loading?: boolean;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, loading = false, children, disabled, ...props }, ref) => {
    const sizeClass = size === "sm" ? "h-8 px-3 text-xs" : size === "lg" ? "h-11 px-5 text-sm" : "h-9 px-4 text-sm";

    const variants: Record<string, string> = {
      primary: "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-blue-400 light:from-blue-600 light:to-blue-500",
      secondary: "bg-white/[0.06] text-slate-200 border border-white/10 hover:bg-white/[0.1] light:bg-white light:text-slate-700 light:border-slate-200 light:hover:bg-slate-50",
      ghost: "text-slate-300 hover:bg-white/[0.06] light:text-slate-600 light:hover:bg-slate-100",
      danger: "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 light:bg-rose-50 light:text-rose-700 light:border-rose-200",
      success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200",
      violet: "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md shadow-violet-500/20 hover:from-violet-500 hover:to-violet-400",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClass,
          variants[variant],
          glow && "shadow-[0_0_20px_rgba(10,102,194,0.4)]",
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
GlowButton.displayName = "GlowButton";
