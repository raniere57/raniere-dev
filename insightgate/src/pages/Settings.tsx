import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Building, Palette, Shield, Clock, Download,
  Star, AlertCircle, RefreshCw, CheckCircle, Eye, EyeOff, Info, Save
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const tabs = [
  { id: 'general', label: 'Geral', icon: <Building size={15} /> },
  { id: 'powerbi', label: 'Power BI', icon: <RefreshCw size={15} /> },
  { id: 'privacy', label: 'Privacidade', icon: <Shield size={15} /> },
];

export function Settings() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('general');
  const [showSecret, setShowSecret] = useState(false);
  const [testing, setTesting] = useState(false);

  const [general, setGeneral] = useState({
    orgName: 'Empresa Demo Ltda.',
    defaultTheme: 'dark',
    accessPolicy: 'group',
    sessionTimeout: '60',
    requireTerm: true,
    allowExport: true,
    allowFavorites: true,
    allowReport: true,
  });

  const [pbiSettings, setPbiSettings] = useState({
    connectionMode: 'api',
    tenantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    clientId: 'f9e8d7c6-b5a4-3210-fedc-ba0987654321',
    clientSecret: '••••••••••••••••••••••••••',
  });

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      addToast('Conexão testada com sucesso! API Power BI respondendo (simulado).', 'success');
    }, 1500);
  };

  const handleSave = () => {
    addToast('Configurações salvas com sucesso!', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Configurações</h1>
          <p className="text-slate-500 text-sm mt-1">Configure o portal InsightGate para sua organização</p>
        </div>
        <Button icon={<Save size={16} />} onClick={handleSave}>Salvar alterações</Button>
      </div>

      {/* Tabs */}
      <div className={cn('flex gap-1 p-1 rounded-xl w-fit', isDark ? 'bg-slate-800/60' : 'bg-slate-100')}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === t.id
                ? isDark ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30' : 'bg-white text-blue-600 shadow-sm border border-blue-200'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {activeTab === 'general' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Section title="Organização" isDark={isDark}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nome da organização" isDark={isDark}>
                <input
                  value={general.orgName}
                  onChange={e => setGeneral(p => ({ ...p, orgName: e.target.value }))}
                  className={inputClass(isDark)}
                />
              </FormField>
              <FormField label="Tema padrão" isDark={isDark}>
                <select
                  value={general.defaultTheme}
                  onChange={e => setGeneral(p => ({ ...p, defaultTheme: e.target.value }))}
                  className={inputClass(isDark)}
                >
                  <option value="dark">Dark (padrão)</option>
                  <option value="light">Light</option>
                </select>
              </FormField>
            </div>
          </Section>

          <Section title="Política de acesso" isDark={isDark}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Política de acesso padrão" isDark={isDark}>
                <select
                  value={general.accessPolicy}
                  onChange={e => setGeneral(p => ({ ...p, accessPolicy: e.target.value }))}
                  className={inputClass(isDark)}
                >
                  <option value="group">Por grupo</option>
                  <option value="user">Por usuário</option>
                  <option value="open">Aberto (todos os usuários)</option>
                </select>
              </FormField>
              <FormField label="Tempo de sessão (minutos)" isDark={isDark}>
                <input
                  type="number"
                  value={general.sessionTimeout}
                  onChange={e => setGeneral(p => ({ ...p, sessionTimeout: e.target.value }))}
                  className={inputClass(isDark)}
                />
              </FormField>
            </div>
          </Section>

          <Section title="Funcionalidades do portal" isDark={isDark}>
            <div className="space-y-3">
              {[
                { key: 'requireTerm', label: 'Exigir aceite de termo antes de abrir relatório', icon: <Shield size={14} /> },
                { key: 'allowExport', label: 'Permitir exportação de relatórios (PDF, PPTX)', icon: <Download size={14} /> },
                { key: 'allowFavorites', label: 'Permitir que usuários favoritiem relatórios', icon: <Star size={14} /> },
                { key: 'allowReport', label: 'Permitir que usuários reportem problemas', icon: <AlertCircle size={14} /> },
              ].map(item => (
                <label key={item.key} className={cn(
                  'flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all',
                  (general as any)[item.key]
                    ? isDark ? 'border-blue-500/30 bg-blue-500/5' : 'border-blue-300 bg-blue-50'
                    : isDark ? 'border-slate-700/50 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{item.icon}</span>
                    <span className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>{item.label}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={(general as any)[item.key]}
                      onChange={e => setGeneral(p => ({ ...p, [item.key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={cn(
                      'w-10 h-6 rounded-full transition-all',
                      (general as any)[item.key] ? 'bg-blue-600' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                    )}>
                      <div className={cn(
                        'w-4 h-4 bg-white rounded-full absolute top-1 transition-all',
                        (general as any)[item.key] ? 'left-5' : 'left-1'
                      )} />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {/* Power BI tab */}
      {activeTab === 'powerbi' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Section title="Modo de conexão" isDark={isDark}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'link', label: 'Manual por link público', desc: 'Cole o link embed manualmente para cada relatório' },
                { value: 'api', label: 'API Power BI (simulada)', desc: 'Integração via Service Principal para metadados e refresh' },
              ].map(mode => (
                <button
                  key={mode.value}
                  onClick={() => setPbiSettings(p => ({ ...p, connectionMode: mode.value }))}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all',
                    pbiSettings.connectionMode === mode.value
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : isDark ? 'border-slate-700 bg-slate-800/30 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <p className={cn('text-sm font-semibold mb-1', isDark ? 'text-white' : 'text-slate-900')}>{mode.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{mode.desc}</p>
                  {pbiSettings.connectionMode === mode.value && (
                    <div className="mt-2"><Badge variant="info">Ativo</Badge></div>
                  )}
                </button>
              ))}
            </div>
          </Section>

          {pbiSettings.connectionMode === 'api' && (
            <Section title="Credenciais API (simuladas)" isDark={isDark}>
              <div className={cn(
                'flex items-start gap-3 p-4 rounded-xl border mb-4',
                isDark ? 'bg-blue-500/5 border-blue-500/15 text-blue-300/70' : 'bg-blue-50 border-blue-200 text-blue-800'
              )}>
                <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Estas são credenciais fictícias para demonstração. Em produção, use um Azure AD Service Principal com permissões na API Power BI.
                </p>
              </div>
              <div className="space-y-4">
                <FormField label="Tenant ID" isDark={isDark}>
                  <input
                    value={pbiSettings.tenantId}
                    onChange={e => setPbiSettings(p => ({ ...p, tenantId: e.target.value }))}
                    className={cn(inputClass(isDark), 'font-mono text-xs')}
                  />
                </FormField>
                <FormField label="Client ID (Application ID)" isDark={isDark}>
                  <input
                    value={pbiSettings.clientId}
                    onChange={e => setPbiSettings(p => ({ ...p, clientId: e.target.value }))}
                    className={cn(inputClass(isDark), 'font-mono text-xs')}
                  />
                </FormField>
                <FormField label="Client Secret" isDark={isDark}>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={pbiSettings.clientSecret}
                      onChange={e => setPbiSettings(p => ({ ...p, clientSecret: e.target.value }))}
                      className={cn(inputClass(isDark), 'font-mono text-xs pr-10')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </FormField>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Button variant="ghost" size="sm" loading={testing} icon={<CheckCircle size={14} />} onClick={handleTest}>
                  Testar conexão
                </Button>
                <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={() => addToast('Workspaces sincronizados!', 'success')}>
                  Sincronizar workspaces
                </Button>
              </div>
            </Section>
          )}
        </motion.div>
      )}

      {/* Privacy tab */}
      {activeTab === 'privacy' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className={cn(
            'p-5 rounded-xl border',
            isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'
          )}>
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className={cn('text-sm font-semibold mb-2', isDark ? 'text-amber-300' : 'text-amber-800')}>
                  Limitação importante — Leia com atenção
                </p>
                <p className={cn('text-sm leading-relaxed', isDark ? 'text-amber-200/70' : 'text-amber-800/80')}>
                  Relatórios publicados na web continuam públicos pelo link original. O InsightGate adiciona uma camada de portal, organização, auditoria e governança, mas não substitui Power BI Embedded para dados sensíveis.
                  Qualquer pessoa com o link original pode acessar o relatório diretamente, sem autenticação no portal.
                </p>
              </div>
            </div>
          </div>

          <Section title="Termo de responsabilidade" isDark={isDark}>
            <FormField label="Texto do termo exibido ao usuário" isDark={isDark}>
              <textarea
                rows={5}
                defaultValue={`Ao acessar este relatório, você confirma estar ciente de que:\n\n1. Este relatório está disponível em link público do Power BI;\n2. O InsightGate gerencia acessos dentro do portal, mas não garante restrição fora dele;\n3. Este relatório não deve conter dados pessoais sensíveis sem criptografia adequada;\n4. Seu acesso está sendo registrado para fins de auditoria interna.`}
                className={inputClass(isDark)}
              />
            </FormField>
          </Section>

          <Section title="Retenção de logs" isDark={isDark}>
            <FormField label="Período de retenção do histórico de acessos" isDark={isDark}>
              <select defaultValue="90" className={inputClass(isDark)}>
                <option value="30">30 dias</option>
                <option value="60">60 dias</option>
                <option value="90">90 dias</option>
                <option value="180">180 dias</option>
                <option value="365">1 ano</option>
              </select>
            </FormField>
          </Section>

          <Section title="Visibilidade do link original" isDark={isDark}>
            <div className={cn(
              'flex items-start gap-3 p-4 rounded-xl border',
              isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-200'
            )}>
              <Info size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className={cn('text-sm font-medium mb-1', isDark ? 'text-white' : 'text-slate-900')}>
                  Ocultar link original da interface do usuário
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  O link do Power BI pode ser ocultado da UI do portal, mas isso não impede acesso externo ao link original. 
                  Esta é uma medida cosmética de governança, não de segurança técnica.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm text-slate-400">Ocultar link embed da interface do usuário final</span>
                </label>
              </div>
            </div>
          </Section>
        </motion.div>
      )}
    </motion.div>
  );
}

function Section({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <div className={cn('glass-card rounded-xl border p-5', isDark ? 'border-blue-500/10' : 'border-slate-200')}>
      <h3 className={cn('font-semibold mb-4', isDark ? 'text-white' : 'text-slate-900')}>{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, children, isDark }: { label: string; children: React.ReactNode; isDark: boolean }) {
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
