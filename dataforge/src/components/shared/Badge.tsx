import React from "react";
import { cn } from "../../utils/cn";

type BadgeVariant = "success" | "error" | "warning" | "info" | "purple" | "cyan" | "neutral" | "running";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  warning: "bg-amber-400",
  info: "bg-blue-400",
  purple: "bg-violet-400",
  cyan: "bg-cyan-400",
  neutral: "bg-slate-400",
  running: "bg-blue-400",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className,
  dot = true,
  size = "sm",
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full flex-shrink-0",
            dotColors[variant],
            variant === "running" && "status-running"
          )}
        />
      )}
      {children}
    </span>
  );
};

export function getStatusBadge(status: string): React.ReactElement {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    connected: { variant: "success", label: "Conectado" },
    active: { variant: "success", label: "Ativo" },
    success: { variant: "success", label: "Sucesso" },
    pass: { variant: "success", label: "Passou" },
    available: { variant: "success", label: "Disponível" },
    error: { variant: "error", label: "Erro" },
    fail: { variant: "error", label: "Falha" },
    warning: { variant: "warning", label: "Alerta" },
    pending: { variant: "warning", label: "Pendente" },
    outdated: { variant: "warning", label: "Desatualizado" },
    paused: { variant: "neutral", label: "Pausado" },
    syncing: { variant: "running", label: "Sincronizando" },
    running: { variant: "running", label: "Executando" },
    scheduled: { variant: "info", label: "Agendado" },
    critical: { variant: "error", label: "Crítico" },
    high: { variant: "warning", label: "Alto" },
    medium: { variant: "info", label: "Médio" },
    low: { variant: "neutral", label: "Baixo" },
  };
  const cfg = map[status] ?? { variant: "neutral" as BadgeVariant, label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
