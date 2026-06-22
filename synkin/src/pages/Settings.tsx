import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/Buttons";
import { StatusBadge, AIBadge } from "../components/ui/Badges";
import { useApp } from "../state/AppContext";
import { cn } from "../utils/cn";
import {
  User,
  Bell,
  Sparkles,
  Plug,
  ShieldCheck,
  Lock,
  Sun,
  Moon,
  Check,
  MessageSquare,
  Mail,
  Smartphone,
  Save,
} from "lucide-react";

const tabs = [
  { id: "perfil", label: "Perfil Synkin", icon: User },
  { id: "notif", label: "Notificações", icon: Bell },
  { id: "ia", label: "Preferências de IA", icon: Sparkles },
  { id: "integ", label: "Integrações", icon: Plug },
];

export function SettingsPage() {
  const { theme, toggleTheme, pushToast } = useApp();
  const [activeTab, setActiveTab] = useState("perfil");
  const [tone, setTone] = useState("profissional");
  const [notif, setNotif] = useState({ email: true, push: true, sms: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-50 light:text-slate-900">Configurações</h2>
        <p className="mt-1 text-sm text-slate-400">Personalize sua experiência Synkin</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Tabs */}
        <div>
          <GlassCard padding="sm">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    activeTab === t.id ? "bg-blue-500/10 text-blue-300 light:bg-blue-50 light:text-blue-700" : "text-slate-300 hover:bg-white/5 light:text-slate-700 light:hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </GlassCard>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {activeTab === "perfil" && (
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Perfil Synkin</h3>
              <p className="mt-1 text-xs text-slate-500">Informações da sua conta Synkin (não da conta LinkedIn)</p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-base font-bold text-white">RR</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100 light:text-slate-900">Raniere Rodrigues Gomes</p>
                    <p className="text-xs text-slate-500">usuario@demo.synkin</p>
                    <button className="mt-1.5 text-[11px] font-semibold text-blue-400 hover:text-blue-300">Alterar foto</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">Nome completo</label>
                    <input defaultValue="Raniere Rodrigues Gomes" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500/50 light:border-slate-200 light:bg-white" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">E-mail</label>
                    <input defaultValue="usuario@demo.synkin" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500/50 light:border-slate-200 light:bg-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">Bio interna (para a IA te conhecer melhor)</label>
                    <textarea
                      rows={3}
                      defaultValue="Engenheiro de software focado em dados e IA aplicada a produto B2B. Ajudo times técnicos a construir plataformas que escalam."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500/50 light:border-slate-200 light:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-slate-300">Tema</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => theme === "light" && toggleTheme()}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                        theme === "dark" ? "border-blue-500/50 bg-blue-500/10 text-blue-300" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 light:border-slate-200 light:bg-slate-50"
                      )}
                    >
                      <Moon className="h-3.5 w-3.5" /> Escuro
                    </button>
                    <button
                      onClick={() => theme === "dark" && toggleTheme()}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                        theme === "light" ? "border-blue-500/50 bg-blue-500/10 text-blue-300" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 light:border-slate-200 light:bg-slate-50"
                      )}
                    >
                      <Sun className="h-3.5 w-3.5" /> Claro
                    </button>
                  </div>
                </div>

                <GlowButton size="sm" onClick={() => pushToast({ title: "Configurações salvas", type: "success" })}>
                  <Save className="h-3.5 w-3.5" /> Salvar alterações
                </GlowButton>
              </div>
            </GlassCard>
          )}

          {activeTab === "notif" && (
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Notificações</h3>
              <p className="mt-1 text-xs text-slate-500">Quando e como você quer ser avisado</p>

              <div className="mt-5 space-y-3">
                {[
                  { id: "email", label: "E-mail", desc: "Resumo diário de pendências e oportunidades", icon: Mail },
                  { id: "push", label: "Push no navegador", desc: "Aviso instantâneo de ações de alta prioridade", icon: Smartphone },
                  { id: "sms", label: "SMS (somente leads quentes)", desc: "Avisos críticos via WhatsApp/SMS", icon: MessageSquare },
                ].map((n) => {
                  const Icon = n.icon;
                  const on = notif[n.id as keyof typeof notif];
                  return (
                    <div key={n.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 light:border-slate-200 light:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-100 light:text-slate-900">{n.label}</p>
                          <p className="text-[11px] text-slate-500">{n.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotif({ ...notif, [n.id]: !on })}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-colors",
                          on ? "bg-blue-600" : "bg-white/10 light:bg-slate-200"
                        )}
                      >
                        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5" : "translate-x-0.5")} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {activeTab === "ia" && (
            <div className="space-y-4">
              <GlassCard glow="violet">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 light:bg-violet-100">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-100 light:text-slate-900">Princípio Synkin · sempre ativo</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400 light:text-slate-700">
                      A IA <strong>nunca</strong> publica, comenta, curte ou envia mensagem sozinha. Cada ação exige aprovação humana explícita. Esse é o DNA do produto.
                    </p>
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 light:border-violet-200 light:bg-violet-50">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-violet-400" />
                        <span className="text-sm font-semibold text-slate-100 light:text-slate-900">Exigir aprovação humana</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge variant="violet">Sempre ON</StatusBadge>
                        <button disabled className="relative h-6 w-11 cursor-not-allowed rounded-full bg-violet-600 opacity-50">
                          <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Tom padrão</h3>
                  <AIBadge />
                </div>
                <p className="text-xs text-slate-500">Como a IA escreve quando você não sobrescreve</p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { id: "profissional", label: "Profissional", desc: "Direto, claro" },
                    { id: "storytelling", label: "Storytelling", desc: "Casos e narrativa" },
                    { id: "provocador", label: "Provocador", desc: "Hot takes" },
                    { id: "educativo", label: "Educativo", desc: "Didático, técnico" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-colors",
                        tone === t.id ? "border-blue-500/50 bg-blue-500/10 light:bg-blue-50" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] light:border-slate-200 light:bg-slate-50"
                      )}
                    >
                      <p className="text-sm font-semibold text-slate-100 light:text-slate-900">{t.label}</p>
                      <p className="text-[10px] text-slate-500">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Comportamentos</h3>
                <div className="mt-4 space-y-2.5">
                  {[
                    { label: "Sugerir comentários automaticamente", on: true },
                    { label: "Detectar oportunidades de engajamento", on: true },
                    { label: "Resumir threads longas", on: true },
                    { label: "Classificar leads por temperatura", on: true },
                    { label: "Gerar primeiras versões de posts", on: true },
                    { label: "Recomendar horários de postagem", on: true },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5 light:border-slate-200 light:bg-slate-50">
                      <p className="text-sm text-slate-200 light:text-slate-800">{b.label}</p>
                      <span className="inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-blue-600 p-0.5">
                        <span className="ml-auto h-4 w-4 rounded-full bg-white shadow" />
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === "integ" && (
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-50 light:text-slate-900">Integrações</h3>
              <p className="mt-1 text-xs text-slate-500">Conecte Synkin às suas ferramentas (todas simuladas)</p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { name: "HubSpot", desc: "Sync de leads quentes", status: "conectada", color: "from-orange-500 to-rose-500" },
                  { name: "Pipedrive", desc: "Funil comercial", status: "conectada", color: "from-emerald-500 to-cyan-500" },
                  { name: "Slack", desc: "Alertas de leads", status: "conectada", color: "from-violet-500 to-fuchsia-500" },
                  { name: "Google Calendar", desc: "Agendamento de posts", status: "desconectada", color: "from-blue-500 to-sky-500" },
                  { name: "Notion", desc: "Notas e SOPs", status: "desconectada", color: "from-slate-500 to-slate-700" },
                  { name: "Zapier", desc: "Automações", status: "desconectada", color: "from-amber-500 to-orange-500" },
                ].map((i, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 light:border-slate-200 light:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-white", i.color)}>
                        {i.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-100 light:text-slate-900">{i.name}</p>
                        <p className="text-[10px] text-slate-500">{i.desc}</p>
                      </div>
                    </div>
                    {i.status === "conectada" ? (
                      <StatusBadge variant="success">
                        <Check className="h-3 w-3" /> Conectada
                      </StatusBadge>
                    ) : (
                      <GlowButton size="sm" variant="secondary">Conectar</GlowButton>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
