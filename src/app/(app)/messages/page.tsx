'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Search, Filter } from 'lucide-react';
import { getMessages } from '@/lib/data-service';
import { Message } from '@/types';
import LoadingPanel from '@/components/LoadingPanel';
import EmptyState from '@/components/EmptyState';

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins} min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  const days = Math.floor(hrs / 24);
  return `${days}d atrás`;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');

  useEffect(() => {
    getMessages().then(m => {
      setMessages(m);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter(m => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (!q) return true;
      return (
        m.content.toLowerCase().includes(q) ||
        (m.client_name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [messages, search, statusFilter]);

  if (loading) return <LoadingPanel message="Carregando histórico de mensagens..." />;

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>Mensagens enviadas</h1>
        <p>{messages.length} mensagens no histórico</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search />
          <input
            type="text"
            placeholder="Buscar por cliente ou conteúdo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', borderRadius: 12, padding: 4, border: '1px solid var(--border-subtle)' }}>
          {(['all', 'sent', 'failed', 'pending'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="btn btn-ghost btn-sm"
              style={{
                background: statusFilter === s ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: statusFilter === s ? 'var(--brand-primary-light)' : 'var(--text-muted)',
                fontWeight: statusFilter === s ? 600 : 500,
              }}
            >
              {s === 'all' ? 'Todas' : s === 'sent' ? 'Enviadas' : s === 'failed' ? 'Falharam' : 'Pendentes'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Nenhuma mensagem encontrada"
          description={search || statusFilter !== 'all' ? 'Tente limpar os filtros.' : 'Quando você enviar mensagens elas aparecem aqui.'}
          action={
            (search || statusFilter !== 'all')
              ? { label: 'Limpar filtros', onClick: () => { setSearch(''); setStatusFilter('all'); } }
              : undefined
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(m => (
            <div key={m.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MessageSquare size={16} style={{ color: 'var(--brand-primary-light)' }} />
                  <Link
                    href={`/clients/${m.client_id}`}
                    style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                  >
                    {m.client_name ?? 'Cliente'}
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`status-badge ${m.status === 'sent' ? 'active' : m.status === 'failed' ? 'inactive' : 'cooling'}`} style={{ fontSize: 11 }}>
                    <span className="dot" />
                    {m.status === 'sent' ? 'Enviada' : m.status === 'failed' ? 'Falhou' : 'Pendente'}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }} title={new Date(m.sent_at).toLocaleString('pt-BR')}>
                    {relativeTime(m.sent_at)}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: 26 }}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
