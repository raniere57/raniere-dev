import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { useApp } from "../../state/AppContext";
import { cn } from "../../utils/cn";

const iconMap = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  info: <Info className="h-5 w-5 text-sky-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  error: <XCircle className="h-5 w-5 text-rose-400" />,
};

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-xl",
              "bg-slate-900/90 border-white/10",
              "light:bg-white/95 light:border-slate-200 light:shadow-slate-200/60"
            )}
          >
            <div className="mt-0.5">{iconMap[t.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-50 light:text-slate-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-slate-400 light:text-slate-600">{t.description}</p>}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-slate-500 hover:text-slate-300 light:hover:text-slate-700 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
