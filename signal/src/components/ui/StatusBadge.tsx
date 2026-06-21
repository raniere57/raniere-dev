import React from 'react';
import type { ConversationStatus } from '../../data/mockData';

const statusConfig: Record<ConversationStatus, { label: string; className: string }> = {
  aberta: { label: 'Aberta', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  aguardando: { label: 'Aguardando', className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  resolvida: { label: 'Resolvida', className: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
};

export const StatusBadge: React.FC<{ status: ConversationStatus }> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};
