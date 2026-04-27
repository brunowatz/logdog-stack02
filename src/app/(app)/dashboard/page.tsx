'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  ArrowRight,
  Phone,
  Flame,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/data-service';
import { formatCurrency, daysSinceDate } from '@/lib/utils';
import { DashboardStats } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import ClientAvatar from '@/components/ClientAvatar';
import { SkeletonCard, SkeletonRow } from '@/components/Skeleton';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Não foi possível carregar os dados do painel. Verifique sua conexão ou configuração.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Carregando seu painel...</p>
        </div>
        <div className="stat-grid">
          {[0,1,2,3].map(i => <SkeletonCard key={i} height={130} />)}
        </div>
        <div className="grid-2">
          <div className="card" style={{ padding: 0 }}>
            {[0,1,2,3].map(i => <SkeletonRow key={i} />)}
          </div>
          <div className="card" style={{ padding: 0 }}>
            {[0,1,2,3].map(i => <SkeletonRow key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
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
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral do seu time de vendas • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card green animate-in stagger-1">
          <div className="stat-card-icon" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--status-active-fg)' }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-card-value" style={{ color: 'var(--status-active-fg)' }}>{stats.active_clients}</div>
          <div className="stat-card-label">Clientes Ativos</div>
        </div>

        <div className="stat-card yellow animate-in stagger-2">
          <div className="stat-card-icon" style={{ background: 'rgba(234,179,8,0.18)', color: 'var(--status-cooling-fg)' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="stat-card-value" style={{ color: 'var(--status-cooling-fg)' }}>{stats.cooling_clients}</div>
          <div className="stat-card-label">Clientes Esfriando</div>
        </div>

        <div className="stat-card red animate-in stagger-3">
          <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--status-inactive-fg)' }}>
            <TrendingDown size={22} />
          </div>
          <div className="stat-card-value" style={{ color: 'var(--status-inactive-fg)' }}>{stats.inactive_clients}</div>
          <div className="stat-card-label">Clientes Inativos</div>
        </div>

        <div className="stat-card purple animate-in stagger-4">
          <div className="stat-card-icon" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--brand-primary-light)' }}>
            <DollarSign size={22} />
          </div>
          <div className="stat-card-value" style={{ color: 'var(--brand-primary-light)' }}>{formatCurrency(stats.total_revenue_month)}</div>
          <div className="stat-card-label">Faturamento (este mês)</div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card animate-in stagger-2">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} style={{ color: '#f97316' }} />
              <span className="card-title">Clientes para abordar hoje</span>
            </div>
            <Link href="/clients" className="btn btn-ghost btn-sm">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="client-list">
            {stats.contact_today.map((client, i) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="client-list-item" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ClientAvatar name={client.name} status={client.status} />
                  <div className="client-info">
                    <h4 title={client.name}>{client.name}</h4>
                    <p>{client.company} • {client.city}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={client.status} />
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {daysSinceDate(client.last_purchase)}d sem comprar
                    </div>
                  </div>
                  <span className="btn btn-primary btn-sm" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <Phone size={14} />
                    Contatar
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card animate-in stagger-3">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} style={{ color: 'var(--status-cooling-fg)' }} />
              <span className="card-title">Oportunidades de Venda</span>
              <span title="Estimativa = preço do produto sugerido × 3" style={{ display: 'flex' }}>
                <HelpCircle
                  size={14}
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Como o valor é estimado"
                />
              </span>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {stats.opportunities.length} oportunidades
            </span>
          </div>

          <div className="client-list">
            {stats.opportunities.map((opp) => (
              <Link
                key={opp.client.id}
                href={`/clients/${opp.client.id}?tab=suggestions`}
                style={{ textDecoration: 'none' }}
              >
                <div className="client-list-item">
                  <div
                    className="client-avatar"
                    style={{
                      background: 'rgba(234,179,8,0.18)',
                      color: 'var(--status-cooling-fg)',
                      fontSize: '18px',
                    }}
                    aria-hidden="true"
                  >
                    💰
                  </div>
                  <div className="client-info">
                    <h4 title={opp.client.name}>{opp.client.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {opp.suggestion}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{ fontSize: '14px', fontWeight: '700', color: 'var(--status-active-fg)' }}
                      title="Estimativa = preço × 3"
                    >
                      {formatCurrency(opp.estimated_value)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      estimado
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="card animate-in stagger-1" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
              <Users size={20} style={{ color: 'var(--brand-primary-light)' }} />
              <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brand-primary-light)' }}>
                {stats.total_clients}
              </span>
            </div>
            <span className="stat-card-label">Total de Clientes</span>
          </div>

          <div className="card animate-in stagger-2" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShoppingCart size={20} style={{ color: '#06b6d4' }} />
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#06b6d4' }}>
                {stats.total_orders_month}
              </span>
            </div>
            <span className="stat-card-label">Pedidos (este mês)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
