import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
  side?: "right" | "left";
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = "420px",
  side = "right",
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className={cn(
              "absolute top-0 bottom-0 flex flex-col overflow-hidden",
              side === "right" ? "right-0" : "left-0"
            )}
            style={{
              width,
              background: "rgba(5, 14, 31, 0.98)",
              borderLeft: side === "right" ? "1px solid rgba(59,130,246,0.15)" : "none",
              borderRight: side === "left" ? "1px solid rgba(59,130,246,0.15)" : "none",
              backdropFilter: "blur(20px)",
            }}
          >
            {(title || subtitle) && (
              <div className="flex items-start justify-between p-5 border-b border-blue-500/10 flex-shrink-0">
                <div>
                  {title && (
                    <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
