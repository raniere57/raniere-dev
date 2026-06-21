import React from 'react';
import type { Channel } from '../../data/mockData';
import { ChannelIcon } from './ChannelIcon';

const channelConfig: Record<Channel, { label: string; className: string }> = {
  whatsapp: { label: 'WhatsApp', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  instagram: { label: 'Instagram', className: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
  facebook: { label: 'Facebook', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  site: { label: 'Site', className: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
  telefone: { label: 'Telefone', className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
};

interface ChannelBadgeProps {
  channel: Channel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({ channel, showLabel = true, size = 'sm' }) => {
  const config = channelConfig[channel];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.className} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      <ChannelIcon channel={channel} size={size === 'sm' ? 12 : 14} />
      {showLabel && config.label}
    </span>
  );
};

export const channelColors: Record<Channel, string> = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  facebook: '#1877F2',
  site: '#94a3b8',
  telefone: '#f59e0b',
};
