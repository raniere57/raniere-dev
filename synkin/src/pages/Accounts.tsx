import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/Buttons";
import { StatusBadge } from "../components/ui/Badges";
import { useApp } from "../state/AppContext";
import { linkedinAccounts } from "../data/mockData";
import { cn } from "../utils/cn";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { LinkedinIcon } from "../components/layout/LinkedinIcon";

const statusConfig: Record<string, { label: string; icon: React.ElementType; variant: "success" | "warning" | "danger" }> = {
  conectada: { label: "Conectada", icon: CheckCircle2, variant: "success" },
  expirada: { label: "Expirada", icon: XCircle, variant: "danger" },
  pendente: { label: "Pendente", icon: Clock, variant: "warning" },
};

export function AccountsPage() {
  const { pushToast, setActiveAccountId, activeAccountId } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50 light:text-slate-900">Contas LinkedIn</h2>
          <p className="mt-1 text-sm text-slate-400">Gerencie contas conectadas e permissões (todas simuladas)</p>
        </div>
        <GlowButton variant="violet" onClick={() => pushToast({ title: "OAuth simulado", description: "Em produção, abriria o fluxo OAuth do LinkedIn.", type: "info" })}>
          <Plus className="h-4 w-4" /> Conectar conta LinkedIn
        </GlowButton>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {linkedinAccounts.map((acc, i) => {
          const cfg = statusConfig[acc.status];
          const StatusIcon = cfg.icon;
          const isActive = acc.id === activeAccountId;

          return (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard padding="none" hover className={cn("overflow-hidden", isActive && "ring-1 ring-blue-500/40")}>
                {/* Cover gradient */}
                <div className={cn("h-20 bg-gradient-to-br", acc.avatarColor)} />

                <div className="px-5 pb-5">
                  <div className="-mt-10 flex items-end justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-slate-900 bg-slate-900 text-base font-bold text-white shadow-lg light:border-white light:bg-slate-900">
                      {acc.initials}
                    </div>
                    <StatusBadge variant={cfg.variant}>
                      <StatusIcon className="h-3 w-3" /> {cfg.label}
                    </StatusBadge>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-50 light:text-slate-900">{acc.name}</h3>
                      <LinkedinIcon className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">{acc.industry} · {acc.type === "pessoal" ? "Conta pessoal" : "Página empresa"}</p>
                    <p className="mt-1.5 text-xs text-slate-300 light:text-slate-700 line-clamp-2">{acc.headline}</p>
                  </div>

                  {acc.status === "conectada" && (
                    <>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 text-center light:border-slate-200 light:bg-slate-50">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Seguidores</p>
                          <p className="mt-0.5 text-base font-bold text-slate-100 light:text-slate-900 tabular-nums">{(acc.followers / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 text-center light:border-slate-200 light:bg-slate-50">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">SSI</p>
                          <p className="mt-0.5 text-base font-bold text-slate-100 light:text-slate-900 tabular-nums">{acc.ssi}</p>
                        </div>
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 text-center light:border-slate-200 light:bg-slate-50">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Posts/mês</p>
                          <p className="mt-0.5 text-base font-bold text-slate-100 light:text-slate-900 tabular-nums">{acc.postsThisMonth}</p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 light:border-slate-200 light:bg-slate-50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Permissões concedidas
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 light:text-emerald-700">Ler perfil</span>
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 light:text-emerald-700">Ler inbox</span>
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 light:text-emerald-700">Publicar</span>
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 light:text-emerald-700">Comentar</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {!isActive && (
                          <GlowButton size="sm" variant="secondary" onClick={() => { setActiveAccountId(acc.id); pushToast({ title: "Conta ativa alterada", description: `Trocando para ${acc.name}`, type: "success" }); }}>
                            Tornar ativa
                          </GlowButton>
                        )}
                        {isActive && <StatusBadge variant="blue" className="!text-[10px]">Conta ativa</StatusBadge>}
                        <GlowButton size="sm" variant="ghost" onClick={() => pushToast({ title: "Reconectando...", type: "info" })}>
                          <RefreshCw className="h-3.5 w-3.5" /> Reconectar
                        </GlowButton>
                        <GlowButton size="sm" variant="ghost" onClick={() => pushToast({ title: "Conta desconectada (simulação)", type: "info" })}>
                          <Trash2 className="h-3.5 w-3.5" /> Desconectar
                        </GlowButton>
                      </div>
                    </>
                  )}

                  {acc.status === "pendente" && (
                    <div className="mt-4 space-y-2">
                      <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-2.5 light:border-amber-200 light:bg-amber-50/40">
                        <p className="text-[11px] text-slate-200 light:text-slate-800">
                          <strong className="text-amber-300 light:text-amber-700">Aguardando OAuth</strong> · clique para concluir a conexão.
                        </p>
                      </div>
                      <GlowButton size="sm" variant="violet" className="w-full" onClick={() => pushToast({ title: "OAuth simulado concluído", type: "success" })}>
                        <LinkedinIcon className="h-3.5 w-3.5" /> Concluir conexão
                      </GlowButton>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}

        {/* Empty slot */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: linkedinAccounts.length * 0.05 }}
          onClick={() => pushToast({ title: "OAuth simulado", description: "Em produção, abriria o fluxo OAuth do LinkedIn.", type: "info" })}
          className="group flex h-full min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-blue-500/30 hover:bg-blue-500/[0.04] light:border-slate-200 light:bg-slate-50 light:hover:bg-blue-50/40"
        >
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-500 group-hover:bg-blue-500/15 group-hover:text-blue-400 light:bg-white">
              <Plus className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-300 light:text-slate-700">Conectar nova conta</p>
            <p className="mt-1 text-[11px] text-slate-500">OAuth simulado (demo)</p>
          </div>
        </motion.button>
      </div>

      {/* Info banner */}
      <GlassCard padding="md" className="border-blue-500/20 bg-blue-500/[0.04] light:bg-blue-50/40 light:border-blue-200/60">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-100 light:text-slate-900">Princípio do Synkin</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300 light:text-slate-700">
              Em produção, todas as ações que saem para o LinkedIn (publicar, comentar, curtir, enviar mensagem, enviar convite) exigem aprovação humana explícita — mesmo que a permissão tenha sido concedida. A IA é copiloto, não piloto.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
