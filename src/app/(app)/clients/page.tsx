'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, MessageSquare, ArrowUpDown } from 'lucide-react';
import { getClients } from '@/lib/data-service';
import { formatCurrency, formatDate, daysSinceDate } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import ClientAvatar from '@/components/ClientAvatar';
import LoadingPanel from '@/components/LoadingPanel';
import EmptyState from '@/components/EmptyState';
import { Client, ClientStatus } from '@/types';

export default function ClientsPage() {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'last_purchase' | 'total_spent'>('last_purchase');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getClients();
        setAllClients(data);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setError('Não foi possível carregar a lista de clientes.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredClients = useMemo(() => {
    if (loading || error) return [];
    let result = [...allClients];

    // Filtro de busca
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }

    // Filtro de status
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Ordenação
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === 'last_purchase') {
        cmp = new Date(a.last_purchase).getTime() - new Date(b.last_purchase).getTime();
      } else if (sortBy === 'total_spent') {
        cmp = a.total_spent - b.total_spent;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [allClients, search, statusFilter, sortBy, sortDir]);

  function toggleSort(field: 'name' | 'last_purchase' | 'total_spent') {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  }

  const statusCounts = useMemo(() => ({
    all: allClients.length,
    active: allClients.filter(c => c.status === 'active').length,
    cooling: allClients.filter(c => c.status === 'cooling').length,
    inactive: allClients.filter(c => c.status === 'inactive').length,
  }), [allClients]);

  if (loading) return <LoadingPanel message="Carregando lista de clientes..." />;

  if (error) {
    return (
      <div className="animate-in" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ marginBottom: '8px' }}>Erro ao carregar</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Clientes</h1>
          <p>{allClients.length} pet shops cadastrados</p>
        </div>
      </div>

      {/* Filters bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Search */}
        <div className="search-bar" style={{ flex: 1, minWidth: '240px' }}>
          <Search />
          <input
            type="text"
            placeholder="Buscar por nome, empresa ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '4px',
          border: '1px solid var(--border-subtle)',
        }}>
          {(['all', 'active', 'cooling', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: statusFilter === s ? '600' : '500',
                background: statusFilter === s ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: statusFilter === s ? 'var(--brand-primary-light)' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {s === 'all' && '📋 Todos'}
              {s === 'active' && '🟢 Ativos'}
              {s === 'cooling' && '🟡 Esfriando'}
              {s === 'inactive' && '🔴 Inativos'}
              <span style={{
                fontSize: '11px',
                background: statusFilter === s ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: statusFilter === s ? 'white' : 'var(--text-muted)',
                padding: '1px 7px',
                borderRadius: '8px',
                fontWeight: '600',
              }}>
                {statusCounts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '280px' }}>
                  <button
                    onClick={() => toggleSort('name')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'inherit', font: 'inherit', display: 'flex',
                      alignItems: 'center', gap: '4px',
                    }}
                  >
                    Cliente / Empresa
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th>Cidade</th>
                <th>
                  <button
                    onClick={() => toggleSort('last_purchase')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'inherit', font: 'inherit', display: 'flex',
                      alignItems: 'center', gap: '4px',
                    }}
                  >
                    Última Compra
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th>Status</th>
                <th>
                  <button
                    onClick={() => toggleSort('total_spent')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'inherit', font: 'inherit', display: 'flex',
                      alignItems: 'center', gap: '4px',
                    }}
                  >
                    Total Gasto
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ClientAvatar name={client.name} status={client.status} size={38} fontSize={14} />
                      <div style={{ minWidth: 0 }}>
                        <div title={client.name} style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {client.name}
                        </div>
                        <div title={client.company} style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {client.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{client.city}/{client.state}</span>
                  </td>
                  <td>
                    <div>
                      <span style={{ fontWeight: '500' }}>{formatDate(client.last_purchase)}</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {daysSinceDate(client.last_purchase)} dias atrás
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={client.status} />
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: 'var(--brand-primary-light)' }}>
                      {formatCurrency(client.total_spent)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link href={`/clients/${client.id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} />
                        Ver
                      </Link>
                      <Link href={`/clients/${client.id}`} className="btn btn-primary btn-sm">
                        <MessageSquare size={14} />
                        Mensagem
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <EmptyState
            icon="🔍"
            title="Nenhum cliente encontrado"
            description="Tente ajustar os filtros de busca."
            action={
              search || statusFilter !== 'all'
                ? { label: 'Limpar filtros', onClick: () => { setSearch(''); setStatusFilter('all'); } }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
