'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  ArrowRight,
  Phone,
  Flame,
  Zap,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/data-service';
import { formatCurrency, daysSinceDate } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
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
      <div className="animate-in" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Carregando dados do painel...</p>
      </div>
    );
  }

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
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral do seu time de vendas • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card green animate-in stagger-1">
          <div className="stat-card-icon" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-card-value" style={{ color: '#4ade80' }}>{stats.active_clients}</div>
          <div className="stat-card-label">Clientes Ativos</div>
        </div>

        <div className="stat-card yellow animate-in stagger-2">
          <div className="stat-card-icon" style={{ background: 'rgba(234,179,8,0.12)', color: '#facc15' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="stat-card-value" style={{ color: '#facc15' }}>{stats.cooling_clients}</div>
          <div className="stat-card-label">Clientes Esfriando</div>
        </div>

        <div className="stat-card red animate-in stagger-3">
          <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
            <TrendingDown size={22} />
          </div>
          <div className="stat-card-value" style={{ color: '#f87171' }}>{stats.inactive_clients}</div>
          <div className="stat-card-label">Clientes Inativos</div>
        </div>

        <div className="stat-card purple animate-in stagger-4">
          <div className="stat-card-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
            <DollarSign size={22} />
          </div>
          <div className="stat-card-value" style={{ color: '#818cf8' }}>{formatCurrency(stats.total_revenue_month)}</div>
          <div className="stat-card-label">Faturamento (30 dias)</div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Clientes para abordar hoje */}
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
            {stats.contact_today.map((client: any, i: number) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="client-list-item" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div
                    className="client-avatar"
                    style={{
                      background: client.status === 'inactive'
                        ? 'rgba(239,68,68,0.15)'
                        : client.status === 'cooling'
                        ? 'rgba(234,179,8,0.15)'
                        : 'rgba(34,197,94,0.15)',
                      color: client.status === 'inactive'
                        ? '#f87171'
                        : client.status === 'cooling'
                        ? '#facc15'
                        : '#4ade80',
                    }}
                  >
                    {client.name.charAt(0)}
                  </div>
                  <div className="client-info">
                    <h4>{client.name}</h4>
                    <p>{client.company} • {client.city}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={client.status} />
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {daysSinceDate(client.last_purchase)}d sem comprar
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/clients/${client.id}`;
                    }}
                    style={{ flexShrink: 0 }}
                  >
                    <Phone size={14} />
                    Contatar
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Oportunidades de venda */}
        <div className="card animate-in stagger-3">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} style={{ color: '#eab308' }} />
              <span className="card-title">Oportunidades de Venda</span>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {stats.opportunities.length} oportunidades
            </span>
          </div>

          <div className="client-list">
            {stats.opportunities.map((opp: any, i: number) => (
              <Link
                key={opp.client.id}
                href={`/clients/${opp.client.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="client-list-item">
                  <div
                    className="client-avatar"
                    style={{
                      background: 'rgba(234,179,8,0.12)',
                      color: '#facc15',
                      fontSize: '18px',
                    }}
                  >
                    💰
                  </div>
                  <div className="client-info">
                    <h4>{opp.client.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {opp.suggestion}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#4ade80',
                    }}>
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

      {/* Quick stats row */}
      <div style={{ marginTop: '24px' }}>
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
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
            <span className="stat-card-label">Pedidos (30 dias)</span>
          </div>

          <div className="card animate-in stagger-3" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
              <MessageSquare size={20} style={{ color: '#22c55e' }} />
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#22c55e' }}>
                {stats.contact_today.length}
              </span>
            </div>
            <span className="stat-card-label">Contatos Pendentes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
