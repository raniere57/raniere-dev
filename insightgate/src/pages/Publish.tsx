import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, ChevronRight, Link, Users, Shield, Settings,
  Send, AlertTriangle, Eye, Copy, Upload, Tag, User, Calendar, FileText
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockUsers, mockGroups } from '../data/mockData';

const steps = [
  { id: 1, label: 'Informações', icon: <FileText size={16} /> },
  { id: 2, label: 'Link Power BI', icon: <Link size={16} /> },
  { id: 3, label: 'Acessos', icon: <Users size={16} /> },
  { id: 4, label: 'Governança', icon: <Shield size={16} /> },
  { id: 5, label: 'Publicar', icon: <Send size={16} /> },
];

const categories = ['Financeiro', 'Comercial', 'Atendimento', 'Operação', 'Diretoria'];
const sensitivities = [
  { value: 'public', label: 'Público', desc: 'Visível para todos os usuários do portal', color: 'info' },
  { value: 'internal', label: 'Interno', desc: 'Visível apenas para grupos com permissão', color: 'purple' },
  { value: 'attention', label: 'Atenção', desc: 'Dados que exigem revisão antes de compartilhar', color: 'warning' },
] as const;

interface FormData {
  name: string;
  description: string;
  category: string;
  tags: string;
  responsible: string;
  sensitivity: string;
  confirmed: boolean;
  link: string;
  selectedUsers: string[];
  selectedGroups: string[];
  expiration: string;
  allowFavorite: boolean;
  requireTerm: boolean;
  refreshFrequency: string;
  workspace: string;
  dataset: string;
  technicalResponsible: string;
  reviewDate: string;
  internalNotes: string;
}

export function Publish() {
  const { theme, addToast, setCurrentPage } = useApp();
  const isDark = theme === 'dark';
  const [step, setStep] = useState(1);
  const [linkValid, setLinkValid] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(false);
  const [published, setPublished] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    tags: '',
    responsible: '',
    sensitivity: '',
    confirmed: false,
    link: '',
    selectedUsers: [],
    selectedGroups: [],
    expiration: '',
    allowFavorite: true,
    requireTerm: false,
    refreshFrequency: '',
    workspace: '',
    dataset: '',
    technicalResponsible: '',
    reviewDate: '',
    internalNotes: '',
  });

  const update = (k: keyof FormData, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const validateLink = () => {
    setValidating(true);
    setLinkValid(null);
    setTimeout(() => {
      setValidating(false);
      setLinkValid(form.link.includes('powerbi.com') || form.link.startsWith('https://'));
    }, 1500);
  };

  const handlePublish = () => {
    setPublished(true);
    addToast(`"${form.name || 'Relatório'}" publicado com sucesso no portal!`, 'success');
  };

  const canProceed = () => {
    if (step === 1) return form.name && form.category && form.sensitivity && form.confirmed;
    if (step === 2) return form.link && linkValid;
    if (step === 3) return true;
    if (step === 4) return true;
    return true;
  };

  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
        >
          <CheckCircle size={40} className="text-emerald-400" />
        </motion.div>
        <h2 className={cn('text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
          Relatório publicado!
        </h2>
        <p className="text-slate-500 mb-8 max-w-md">
          "{form.name || 'Novo Relatório'}" foi publicado no portal e está disponível para os usuários com permissão.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => { setStep(1); setPublished(false); setForm({ name: '', description: '', category: '', tags: '', responsible: '', sensitivity: '', confirmed: false, link: '', selectedUsers: [], selectedGroups: [], expiration: '', allowFavorite: true, requireTerm: false, refreshFrequency: '', workspace: '', dataset: '', technicalResponsible: '', reviewDate: '', internalNotes: '' }); }}>
            Publicar outro
          </Button>
          <Button onClick={() => setCurrentPage('reports')}>Ver relatórios</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Publicar relatório</h1>
        <p className="text-slate-500 text-sm mt-1">Siga o fluxo guiado para publicar um relatório Power BI no portal</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                step === s.id
                  ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30'
                  : s.id < step
                    ? 'text-emerald-400 cursor-pointer hover:bg-emerald-500/10'
                    : 'text-slate-600 cursor-not-allowed'
              )}
            >
              {s.id < step ? <CheckCircle size={14} /> : s.icon}
              <span className="hidden sm:block">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronRight size={14} className={cn('flex-1 mx-1', s.id < step ? 'text-emerald-500/50' : 'text-slate-700')} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className={cn('glass-card rounded-2xl border p-6', isDark ? 'border-blue-500/10' : 'border-slate-200')}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Informações básicas</h2>

              <FormField label="Nome do relatório *">
                <input
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Ex: Visão Financeira 2024"
                  className={inputClass(isDark)}
                />
              </FormField>

              <FormField label="Descrição">
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Descreva o objetivo e o conteúdo do relatório..."
                  rows={3}
                  className={inputClass(isDark)}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Categoria *">
                  <select value={form.category} onChange={e => update('category', e.target.value)} className={inputClass(isDark)}>
                    <option value="">Selecionar...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>

                <FormField label="Responsável">
                  <select value={form.responsible} onChange={e => update('responsible', e.target.value)} className={inputClass(isDark)}>
                    <option value="">Selecionar...</option>
                    {mockUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </FormField>
              </div>

              <FormField label="Tags (separadas por vírgula)">
                <input
                  value={form.tags}
                  onChange={e => update('tags', e.target.value)}
                  placeholder="financeiro, mensal, board..."
                  className={inputClass(isDark)}
                />
              </FormField>

              <FormField label="Nível de sensibilidade *">
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {sensitivities.map(s => (
                    <button
                      key={s.value}
                      onClick={() => update('sensitivity', s.value)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all',
                        form.sensitivity === s.value
                          ? 'border-blue-500/50 bg-blue-500/10'
                          : isDark ? 'border-slate-700 bg-slate-800/30 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <Badge variant={s.color as any} className="mb-2">{s.label}</Badge>
                      <p className="text-xs text-slate-500 leading-snug">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </FormField>

              <div className={cn(
                'flex items-start gap-3 p-4 rounded-xl border',
                isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'
              )}>
                <input
                  type="checkbox"
                  id="confirm"
                  checked={form.confirmed}
                  onChange={e => update('confirmed', e.target.checked)}
                  className="mt-1 cursor-pointer"
                />
                <label htmlFor="confirm" className="text-sm text-amber-300/80 cursor-pointer leading-relaxed">
                  Confirmo que este relatório não contém dados sensíveis, pois será usado com link público do Power BI. Relatórios com dados pessoais ou financeiros críticos devem utilizar Power BI Embedded.
                </label>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Link público Power BI</h2>

              <div className={cn(
                'p-4 rounded-xl border flex items-start gap-3',
                isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'
              )}>
                <AlertTriangle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300/80">
                  O InsightGate exibirá este relatório dentro do portal via iframe, mas o link original continua público. Qualquer pessoa com o link original pode acessá-lo diretamente.
                </p>
              </div>

              <FormField label="Link público ou iframe do Power BI *">
                <div className="flex gap-2">
                  <input
                    value={form.link}
                    onChange={e => { update('link', e.target.value); setLinkValid(null); }}
                    placeholder="https://app.powerbi.com/view?r=..."
                    className={cn(inputClass(isDark), 'flex-1')}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={validateLink}
                    loading={validating}
                    disabled={!form.link}
                  >
                    Validar
                  </Button>
                </div>
                {linkValid === true && (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle size={12} /> Link válido e acessível</p>
                )}
                {linkValid === false && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertTriangle size={12} /> Link inválido ou inacessível</p>
                )}
              </FormField>

              {/* Preview mockado */}
              {form.link && linkValid && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('rounded-xl border overflow-hidden', isDark ? 'border-blue-500/20' : 'border-slate-200')}
                >
                  <div className={cn(
                    'flex items-center justify-between px-4 py-2 border-b text-xs',
                    isDark ? 'bg-slate-800/50 border-slate-700/50 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                  )}>
                    <span>Preview — {form.name || 'Relatório'}</span>
                    <div className="flex items-center gap-2">
                      <Eye size={12} />
                      <span>Visualização dentro do portal</span>
                    </div>
                  </div>
                  <div className={cn(
                    'h-48 flex flex-col items-center justify-center gap-3',
                    isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800/50' : 'bg-gradient-to-br from-slate-100 to-slate-50'
                  )}>
                    <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                      <FileText size={28} className="text-yellow-400" />
                    </div>
                    <div className="text-center">
                      <p className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{form.name || 'Nome do relatório'}</p>
                      <p className="text-xs text-slate-500 mt-1">Iframe do Power BI será exibido aqui para usuários com acesso</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Acessos no portal</h2>

              <FormField label="Usuários com acesso">
                <div className="space-y-2">
                  {mockUsers.map(u => (
                    <label key={u.id} className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                      form.selectedUsers.includes(u.id)
                        ? 'border-blue-500/40 bg-blue-500/10'
                        : isDark ? 'border-slate-700/50 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                    )}>
                      <input
                        type="checkbox"
                        checked={form.selectedUsers.includes(u.id)}
                        onChange={e => update('selectedUsers', e.target.checked ? [...form.selectedUsers, u.id] : form.selectedUsers.filter((id: string) => id !== u.id))}
                        className="cursor-pointer"
                      />
                      <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                        {u.avatar}
                      </div>
                      <div>
                        <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email} · {u.role}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Grupos com acesso">
                <div className="flex flex-wrap gap-2">
                  {mockGroups.map(g => (
                    <button
                      key={g.id}
                      onClick={() => update('selectedGroups', form.selectedGroups.includes(g.id) ? form.selectedGroups.filter((id: string) => id !== g.id) : [...form.selectedGroups, g.id])}
                      className={cn(
                        'px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                        form.selectedGroups.includes(g.id)
                          ? 'border-blue-500/50 bg-blue-500/15 text-blue-400'
                          : isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Expiração do acesso">
                  <input
                    type="date"
                    value={form.expiration}
                    onChange={e => update('expiration', e.target.value)}
                    className={inputClass(isDark)}
                  />
                </FormField>

                <FormField label="Opções">
                  <div className="space-y-2 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.allowFavorite} onChange={e => update('allowFavorite', e.target.checked)} />
                      <span className="text-sm text-slate-400">Permitir favorito</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.requireTerm} onChange={e => update('requireTerm', e.target.checked)} />
                      <span className="text-sm text-slate-400">Exigir aceite de termo</span>
                    </label>
                  </div>
                </FormField>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Governança</h2>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Frequência esperada de atualização">
                  <select value={form.refreshFrequency} onChange={e => update('refreshFrequency', e.target.value)} className={inputClass(isDark)}>
                    <option value="">Selecionar...</option>
                    <option>Por hora</option>
                    <option>Diária</option>
                    <option>Semanal</option>
                    <option>Quinzenal</option>
                    <option>Mensal</option>
                    <option>Manual</option>
                  </select>
                </FormField>

                <FormField label="Workspace relacionado">
                  <select value={form.workspace} onChange={e => update('workspace', e.target.value)} className={inputClass(isDark)}>
                    <option value="">Selecionar...</option>
                    {['Financeiro BI', 'Comercial BI', 'Atendimento BI', 'Operação BI', 'Diretoria BI'].map(w => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Dataset relacionado">
                  <input value={form.dataset} onChange={e => update('dataset', e.target.value)} placeholder="Ex: DS_Financeiro_2024" className={inputClass(isDark)} />
                </FormField>

                <FormField label="Responsável técnico">
                  <select value={form.technicalResponsible} onChange={e => update('technicalResponsible', e.target.value)} className={inputClass(isDark)}>
                    <option value="">Selecionar...</option>
                    {mockUsers.filter(u => u.role !== 'Visualizador').map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </FormField>

                <FormField label="Data de revisão programada">
                  <input type="date" value={form.reviewDate} onChange={e => update('reviewDate', e.target.value)} className={inputClass(isDark)} />
                </FormField>
              </div>

              <FormField label="Observações internas">
                <textarea
                  value={form.internalNotes}
                  onChange={e => update('internalNotes', e.target.value)}
                  rows={3}
                  placeholder="Notas para a equipe técnica..."
                  className={inputClass(isDark)}
                />
              </FormField>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Resumo e publicação</h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Nome', value: form.name || '—' },
                  { label: 'Categoria', value: form.category || '—' },
                  { label: 'Responsável', value: form.responsible || '—' },
                  { label: 'Sensibilidade', value: form.sensitivity || '—' },
                  { label: 'Usuários', value: `${form.selectedUsers.length} selecionados` },
                  { label: 'Grupos', value: `${form.selectedGroups.length} selecionados` },
                  { label: 'Freq. atualização', value: form.refreshFrequency || '—' },
                  { label: 'Workspace', value: form.workspace || '—' },
                ].map(item => (
                  <div key={item.label} className={cn(
                    'p-3 rounded-xl border',
                    isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-200'
                  )}>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">{item.label}</p>
                    <p className={cn('text-sm font-medium mt-0.5', isDark ? 'text-white' : 'text-slate-900')}>{item.value}</p>
                  </div>
                ))}
              </div>

              {form.link && (
                <div className={cn('p-3 rounded-xl border', isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-200')}>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1">Link Power BI</p>
                  <p className="text-xs text-blue-400 font-mono truncate">{form.link}</p>
                </div>
              )}

              <div className={cn(
                'p-4 rounded-xl border',
                isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Tudo pronto para publicar</span>
                </div>
                <p className="text-xs text-slate-500">
                  O relatório será disponibilizado no portal para os usuários e grupos selecionados.
                  O monitoramento de acesso será iniciado automaticamente.
                </p>
              </div>

              <Button
                className="w-full justify-center py-3"
                size="lg"
                icon={<Send size={18} />}
                onClick={handlePublish}
              >
                Publicar no portal
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < 5 && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Voltar
          </Button>
          <Button
            size="sm"
            onClick={() => setStep(s => Math.min(5, s + 1))}
            disabled={!canProceed()}
            icon={<ChevronRight size={14} />}
          >
            Próximo
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  return (
    <div className="space-y-1.5">
      <label className={cn('text-xs font-semibold uppercase tracking-wide', isDark ? 'text-slate-400' : 'text-slate-500')}>
        {label}
      </label>
      {children}
    </div>
  );
}

function inputClass(isDark: boolean) {
  return cn(
    'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all',
    isDark
      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500/50'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400'
  );
}
