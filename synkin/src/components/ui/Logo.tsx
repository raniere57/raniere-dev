import { cn } from "../../utils/cn";

export function SynkinLogo({ size = 32, className, showText = true }: { size?: number; className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 shadow-lg shadow-blue-500/30"
        style={{ width: size, height: size }}
      >
        {/* "in" stylized glifo */}
        <svg viewBox="0 0 24 24" className="text-white" style={{ width: size * 0.6, height: size * 0.6 }} fill="currentColor">
          <circle cx="6.5" cy="5.5" r="1.8" />
          <rect x="5" y="9" width="3" height="10" rx="0.5" />
          <path d="M11 5h3v2.2c.6-1.1 2-2.5 4-2.5 3 0 4 2 4 4.5V19h-3v-4.5c0-1.4-.5-2.4-2-2.4s-2.5 1-2.5 2.5V19h-3.5V5z" />
        </svg>
        <div className="absolute inset-0 rounded-xl opacity-50 blur-md bg-gradient-to-br from-blue-500 to-violet-500 -z-10" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Synkin
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide">LinkedIn com estratégia e IA</span>
        </div>
      )}
    </div>
  );
}
