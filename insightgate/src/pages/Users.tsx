import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Plus, Edit, UserX, Search, Shield, Eye, UserCheck } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { mockUsers, mockGroups } from '../data/mockData';

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const roleColors: Record<string, 'purple' | 'info' | 'default'> = {
  Admin: 'purple',
  Gestor: 'info',
  Visualizador: 'default',
};

const groupColors: Record<string, string> = {
  Diretoria: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Financeiro: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Comercial: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Atendimento: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Operação: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  TI: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export function Users() {
  const { theme, addToast } = useApp();
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<'users' | 'groups'>('users');
  const [search, setSearch] = useState('');
  const [showNewUser, setShowNewUser] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Visualizador', groups: [] as string[], status: 'active' });
  const [newGroup, setNewGroup] = useState({ name: '', description: '', users: [] as string[], reports: [] as string[] });

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = () => {
    addToast(`Usuário "${newUser.name}" criado com sucesso!`, 'success');
    setShowNewUser(false);
    setNewUser({ name: '', email: '', role: 'Visualizador', groups: [], status: 'active' });
  };

  const handleCreateGroup = () => {
    addToast(`Grupo "${newGroup.name}" criado com sucesso!`, 'success');
    setShowNewGroup(false);
    setNewGroup({ name: '', description: '', users: [], reports: [] });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>Usuários e grupos</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie acessos e permissões do portal</p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => tab === 'users' ? setShowNewUser(true) : setShowNewGroup(true)}
        >
          {tab === 'users' ? 'Novo usuário' : 'Novo grupo'}
        </Button>
      </div>

      {/* Tabs */}
      <div className={cn('flex gap-1 p-1 rounded-xl w-fit', isDark ? 'bg-slate-800/60' : 'bg-slate-100')}>
        {(['users', 'groups'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t
                ? isDark ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30' : 'bg-white text-blue-600 shadow-sm border border-blue-200'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {t === 'users' ? 'Usuários' : 'Grupos'}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <>
          {/* Search */}
          <div className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border w-80',
            isDark ? 'glass-card border-slate-700/50' : 'bg-white border-slate-200'
          )}>
            <Search size={14} className="text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar usuário..."
              className={cn('bg-transparent text-sm outline-none flex-1', isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400')}
            />
          </div>

          {/* Users table */}
          <div className={cn('rounded-xl border overflow-hidden', isDark ? 'glass-card border-blue-500/10' : 'bg-white border-slate-200')}>
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-slate-700/50' : 'border-slate-100')}>
                  {['Usuário', 'Perfil', 'Grupos', 'Último acesso', 'Status', 'Relatórios', 'Ações'].map(h => (
                    <th key={h} className={cn('px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-500' : 'text-slate-400')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn('group transition-colors', isDark ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-500/20">
                          {user.avatar}
                        </div>
                        <div>
                          <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={roleColors[user.role]}>
                        {user.role === 'Admin' && <Shield size={10} className="mr-1" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.groups.map(g => (
                          <span key={g} className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium border', groupColors[g] || 'text-slate-400 bg-slate-500/10 border-slate-500/20')}>
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500 font-mono">{formatDateTime(user.lastAccess)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === 'active' ? 'success' : 'default'} dot>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Eye size={11} className="text-slate-500" />
                        <span className="text-sm text-slate-400">{user.reportsAllowed}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => addToast(`Editando ${user.name}...`, 'info')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="Editar"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => addToast(`${user.name} desativado.`, 'warning')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Desativar"
                        >
                          <UserX size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mockGroups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                'glass-card rounded-xl border p-5 hover:border-blue-500/30 transition-all cursor-pointer',
                isDark ? 'border-blue-500/10' : 'border-slate-200'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border',
                  groupColors[group.name] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                )}>
                  {group.name[0]}
                </div>
                <button
                  onClick={() => addToast(`Editando grupo "${group.name}"...`, 'info')}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                >
                  <Edit size={13} />
                </button>
              </div>

              <h3 className={cn('text-base font-semibold mb-1', isDark ? 'text-white' : 'text-slate-900')}>{group.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{group.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
                <div className="flex items-center gap-1.5">
                  <UsersIcon size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-500">{group.users} usuários</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-500">{group.reports} relatórios</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add group card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mockGroups.length * 0.07 }}
            onClick={() => setShowNewGroup(true)}
            className={cn(
              'rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center gap-3 transition-all h-44',
              isDark
                ? 'border-slate-700 hover:border-blue-500/40 text-slate-600 hover:text-blue-400'
                : 'border-slate-200 hover:border-blue-400 text-slate-400 hover:text-blue-500'
            )}
          >
            <Plus size={24} />
            <span className="text-sm font-medium">Novo grupo</span>
          </motion.button>
        </div>
      )}

      {/* New User Modal */}
      <Modal
        open={showNewUser}
        onClose={() => setShowNewUser(false)}
        title="Novo usuário"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowNewUser(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleCreateUser} disabled={!newUser.name || !newUser.email}>Criar usuário</Button>
          </>
        }
      >
        <div className="space-y-4">
          <ModalField label="Nome completo *">
            <input
              value={newUser.name}
              onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Maria Fernanda"
              className={inputClass(isDark)}
            />
          </ModalField>
          <ModalField label="Email *">
            <input
              type="email"
              value={newUser.email}
              onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
              placeholder="maria@empresa.com"
              className={inputClass(isDark)}
            />
          </ModalField>
          <ModalField label="Perfil">
            <select
              value={newUser.role}
              onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
              className={inputClass(isDark)}
            >
              <option>Visualizador</option>
              <option>Gestor</option>
              <option>Admin</option>
            </select>
          </ModalField>
          <ModalField label="Grupos">
            <div className="flex flex-wrap gap-2">
              {mockGroups.map(g => (
                <button
                  key={g.id}
                  onClick={() => setNewUser(p => ({
                    ...p,
                    groups: p.groups.includes(g.name) ? p.groups.filter(x => x !== g.name) : [...p.groups, g.name]
                  }))}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    newUser.groups.includes(g.name)
                      ? 'border-blue-500/50 bg-blue-500/15 text-blue-400'
                      : isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-200 text-slate-600'
                  )}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </ModalField>
          <ModalField label="Status">
            <div className="flex items-center gap-4">
              {['active', 'inactive'].map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={s} checked={newUser.status === s} onChange={() => setNewUser(p => ({ ...p, status: s }))} />
                  <span className="text-sm text-slate-400 capitalize">{s === 'active' ? 'Ativo' : 'Inativo'}</span>
                </label>
              ))}
            </div>
          </ModalField>
        </div>
      </Modal>

      {/* New Group Modal */}
      <Modal
        open={showNewGroup}
        onClose={() => setShowNewGroup(false)}
        title="Novo grupo"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowNewGroup(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleCreateGroup} disabled={!newGroup.name}>Criar grupo</Button>
          </>
        }
      >
        <div className="space-y-4">
          <ModalField label="Nome do grupo *">
            <input
              value={newGroup.name}
              onChange={e => setNewGroup(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Marketing"
              className={inputClass(isDark)}
            />
          </ModalField>
          <ModalField label="Descrição">
            <textarea
              value={newGroup.description}
              onChange={e => setNewGroup(p => ({ ...p, description: e.target.value }))}
              placeholder="Descreva o propósito do grupo..."
              rows={3}
              className={inputClass(isDark)}
            />
          </ModalField>
          <ModalField label="Usuários">
            <div className="space-y-2">
              {mockUsers.map(u => (
                <label key={u.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGroup.users.includes(u.id)}
                    onChange={e => setNewGroup(p => ({
                      ...p,
                      users: e.target.checked ? [...p.users, u.id] : p.users.filter(x => x !== u.id)
                    }))}
                  />
                  <span className="text-sm text-slate-400">{u.name}</span>
                  <span className="text-xs text-slate-600">({u.role})</span>
                </label>
              ))}
            </div>
          </ModalField>
        </div>
      </Modal>
    </motion.div>
  );
}

function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
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
