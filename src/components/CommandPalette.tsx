'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { getClients } from '@/lib/data-service';
import { Client } from '@/types';
import StatusBadge from './StatusBadge';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard',          href: '/dashboard' },
  { label: 'Clientes',           href: '/clients' },
  { label: 'Campanhas',          href: '/campaigns' },
  { label: 'Enviar mensagem',    href: '/send' },
  { label: 'Mensagens enviadas', href: '/messages' },
  { label: 'Produtos',           href: '/products' },
  { label: 'Configurações',      href: '/settings' },
];

type ResultItem =
  | { kind: 'nav'; label: string; href: string }
  | { kind: 'client'; client: Client };

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIdx(0);
    setTimeout(() => inputRef.current?.focus(), 0);
    if (clients.length === 0) getClients().then(setClients);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const results: ResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const navMatches = NAV_ITEMS
      .filter(n => !q || n.label.toLowerCase().includes(q))
      .map(n => ({ kind: 'nav' as const, label: n.label, href: n.href }));
    if (!q) return navMatches.slice(0, 7);
    const clientMatches = clients
      .filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map(c => ({ kind: 'client' as const, client: c }));
    return [...clientMatches, ...navMatches];
  }, [query, clients]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx(i => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const item = results[activeIdx];
        if (item) navigateTo(item);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, results, activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  function navigateTo(item: ResultItem) {
    onClose();
    if (item.kind === 'nav') router.push(item.href);
    else router.push(`/clients/${item.client.id}`);
  }

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ alignItems: 'flex-start', paddingTop: '12vh' }}
      role="presentation"
    >
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar"
        style={{ width: '90%', maxWidth: 560, padding: 0, overflow: 'hidden' }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar clientes ou navegar..."
            aria-label="Buscar clientes ou navegar"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 15,
            }}
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <div style={{ maxHeight: 380, overflowY: 'auto', padding: 8 }}>
          {results.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Nada encontrado para “{query}”.
            </div>
          )}
          {results.map((item, idx) => {
            const active = idx === activeIdx;
            const base = {
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            } as React.CSSProperties;
            if (item.kind === 'nav') {
              return (
                <div
                  key={`nav-${item.href}`}
                  style={base}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => navigateTo(item)}
                >
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ flex: 1, fontSize: 14 }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ir para</span>
                </div>
              );
            }
            const c = item.client;
            return (
              <div
                key={`client-${c.id}`}
                style={base}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => navigateTo(item)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {c.company} • {c.city}/{c.state}
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          gap: 16,
          padding: '8px 16px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 11,
          color: 'var(--text-muted)',
        }}>
          <span><kbd className="kbd">↑↓</kbd> navegar</span>
          <span><kbd className="kbd">↵</kbd> abrir</span>
          <span><kbd className="kbd">esc</kbd> fechar</span>
        </div>
      </div>
    </div>
  );
}
