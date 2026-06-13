import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  accent?: "blue" | "cyan" | "purple" | "emerald" | "amber" | "red";
  className?: string;
  delay?: number;
}

const accentMap = {
  blue: {
    icon: "bg-blue-500/10 text-blue-400",
    glow: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.15)",
  },
  cyan: {
    icon: "bg-cyan-500/10 text-cyan-400",
    glow: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.15)",
  },
  purple: {
    icon: "bg-violet-500/10 text-violet-400",
    glow: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.15)",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-400",
    glow: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.15)",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-400",
    glow: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.15)",
  },
  red: {
    icon: "bg-red-500/10 text-red-400",
    glow: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.15)",
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  accent = "blue",
  className,
  delay = 0,
}) => {
  const a = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("metric-card glass-card rounded-xl p-4 cursor-default", className)}
      style={{
        background: `rgba(5, 14, 31, 0.7)`,
        border: `1px solid ${a.border}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 20px ${a.glow}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", a.icon)}>{icon}</div>
        {trend && (
          <span
            className={cn(
              "text-[11px] font-medium px-1.5 py-0.5 rounded",
              trend.up
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-red-400 bg-red-500/10"
            )}
          >
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-100 leading-none">{value}</p>
      <p className="text-xs text-slate-400 mt-1.5 font-medium">{label}</p>
      {subtext && <p className="text-[11px] text-slate-500 mt-1">{subtext}</p>}
    </motion.div>
  );
};
