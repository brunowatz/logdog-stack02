'use client';

import { ClientStatus } from '@/types';

const COLORS: Record<ClientStatus, { bg: string; fg: string }> = {
  active:   { bg: 'rgba(34,197,94,0.15)',  fg: '#4ade80' },
  cooling:  { bg: 'rgba(234,179,8,0.18)',  fg: '#fde047' },
  inactive: { bg: 'rgba(239,68,68,0.15)',  fg: '#f87171' },
};

interface ClientAvatarProps {
  name: string;
  status: ClientStatus;
  size?: number;
  fontSize?: number;
}

export default function ClientAvatar({ name, status, size = 44, fontSize = 16 }: ClientAvatarProps) {
  const c = COLORS[status];
  return (
    <div
      className="client-avatar"
      style={{
        width: size,
        height: size,
        fontSize,
        background: c.bg,
        color: c.fg,
      }}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
