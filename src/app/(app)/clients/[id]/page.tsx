'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  Send,
  Repeat,
  Sparkles,
  Package,
  ClipboardList,
} from 'lucide-react';
import {
  getClientById,
  getOrdersByClientId,
  getSuggestionsForClient,
  sendMessage,
  personalizeMessage,
  getCampaigns,
} from '@/lib/data-service';
import { formatCurrency, formatDate, daysSinceDate, getStatusColor } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import ClientAvatar from '@/components/ClientAvatar';
import LoadingPanel from '@/components/LoadingPanel';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import RegisterOrderModal from '@/components/RegisterOrderModal';
import { Campaign, Client, Order, Suggestion } from '@/types';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const search = useSearchParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const initialTab = search.get('tab') === 'suggestions' ? 'suggestions' : 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'suggestions'>(initialTab);

  async function loadAll() {
    setLoading(true);
    const [clientData, ordersData, suggestionsData, campaignsData] = await Promise.all([
      getClientById(clientId),
      getOrdersByClientId(clientId),
      getSuggestionsForClient(clientId),
      getCampaigns(),
    ]);
    setClient(clientData ?? null);
    setOrders(ordersData);
    setSuggestions(suggestionsData);
    setCampaigns(campaignsData);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [clientId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <LoadingPanel message="Carregando detalhes do cliente..." />;

  if (!client) {
    return (
      <EmptyState
        icon="😕"
        title="Cliente não encontrado"
        description="O cliente solicitado não existe."
        action={{ label: 'Voltar para Clientes', onClick: () => router.push('/clients') }}
      />
    );
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await sendMessage(client.id, messageText);
      setShowMessageModal(false);
      setMessageText('');
      setToast({ message: `Mensagem enviada para ${client.name}!`, type: 'success' });
    } catch {
      setToast({ message: 'Erro ao enviar mensagem', type: 'error' });
    }
  };

  const handleUseCampaign = (template: string) => {
    setMessageText(personalizeMessage(template, client));
    setShowMessageModal(true);
  };

  const daysSince = daysSinceDate(client.last_purchase);

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 24 }}>
        <Link href="/clients" className="btn btn-ghost" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Voltar para Clientes
        </Link>
      </div>

      <div className="card" style={{ marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${getStatusColor(client.status)}, var(--brand-primary))`,
        }} />

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <ClientAvatar name={client.name} status={client.status} size={80} fontSize={32} />

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>{client.name}</h1>
              <StatusBadge status={client.status} />
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {client.company}
            </p>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
              {client.phone && (
                <a href={`tel:${client.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'inherit', textDecoration: 'none' }}>
                  <Phone size={14} /> {client.phone}
                </a>
              )}
              {client.email && (
                <a href={`mailto:${client.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'inherit', textDecoration: 'none' }}>
                  <Mail size={14} /> {client.email}
                </a>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} /> {client.city}/{client.state}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowMessageModal(true)}
            >
              <MessageSquare size={16} /> Enviar Mensagem
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setShowOrderModal(true)}
            >
              <ClipboardList size={16} /> Registrar Pedido
            </button>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="stat-card blue">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Calendar size={18} style={{ color: '#06b6d4' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Última Compra
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{formatDate(client.last_purchase)}</div>
          <div
            style={{
              fontSize: 12,
              marginTop: 4,
              color: daysSince > 30 ? 'var(--status-inactive-fg)' : daysSince > 15 ? 'var(--status-cooling-fg)' : 'var(--status-active-fg)',
              fontWeight: 600,
            }}
          >
            {daysSince} dias atrás
          </div>
        </div>

        <div className="stat-card purple">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <ShoppingCart size={18} style={{ color: 'var(--brand-primary-light)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total de Pedidos
            </span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--brand-primary-light)' }}>{client.total_orders}</div>
        </div>

        <div className="stat-card green">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <DollarSign size={18} style={{ color: 'var(--status-active-fg)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Gasto
            </span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--status-active-fg)' }}>{formatCurrency(client.total_spent)}</div>
        </div>

        <div className="stat-card yellow">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Sparkles size={18} style={{ color: 'var(--status-cooling-fg)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Sugestões
            </span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--status-cooling-fg)' }}>{suggestions.length}</div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart size={14} style={{ marginRight: 6 }} />
              Histórico de Pedidos
              <span className="tab-badge">{orders.length}</span>
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              <Sparkles size={14} style={{ marginRight: 6 }} />
              Sugestões
              <span className="tab-badge">{suggestions.length}</span>
            </button>
          </div>

          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.length === 0 ? (
                <EmptyState
                  icon="📦"
                  title="Nenhum pedido encontrado"
                  description="Quando este cliente fizer uma compra, ela aparece aqui."
                  action={{ label: 'Registrar primeiro pedido', onClick: () => setShowOrderModal(true) }}
                />
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="card">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}>
                      <div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          Pedido #{String(order.id).slice(0, 8).toUpperCase()}
                        </span>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {formatDate(order.date)}
                        </div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--status-active-fg)' }}>
                        {formatCurrency(order.total)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 12px',
                            background: 'var(--bg-surface)',
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Package size={14} style={{ color: 'var(--brand-primary-light)' }} />
                            <span>{item.product_name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-secondary)' }}>
                            <span>{item.quantity}× {formatCurrency(item.unit_price)}</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {formatCurrency(item.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {suggestions.length === 0 ? (
                <EmptyState icon="💡" title="Nenhuma sugestão no momento" />
              ) : (
                suggestions.map((sug, i) => (
                  <div key={i} className="suggestion-card">
                    <div
                      className="suggestion-icon"
                      style={{
                        background: sug.type === 'replenishment'
                          ? 'rgba(234,179,8,0.18)'
                          : 'rgba(99,102,241,0.12)',
                        color: sug.type === 'replenishment' ? 'var(--status-cooling-fg)' : 'var(--brand-primary-light)',
                      }}
                    >
                      {sug.type === 'replenishment' ? <Repeat size={18} /> : <Sparkles size={18} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: sug.type === 'replenishment' ? 'var(--status-cooling-fg)' : 'var(--brand-primary-light)',
                        marginBottom: 4,
                      }}>
                        {sug.type === 'replenishment' ? '🔄 Possível Reposição' : '✨ Produto Complementar'}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                        {sug.product.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {sug.reason}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--status-active-fg)', marginTop: 8 }}>
                        {formatCurrency(sug.product.price)}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setMessageText(
                          personalizeMessage(
                            `Olá {nome}! Vi que você pode precisar repor {produto}. Posso te enviar uma proposta?`,
                            client,
                            sug.product
                          )
                        );
                        setShowMessageModal(true);
                      }}
                    >
                      <Send size={14} />
                      Oferecer
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">📣 Campanhas Disponíveis</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {campaigns.filter(c => c.is_active).map((campaign) => (
                <button
                  key={campaign.id}
                  type="button"
                  onClick={() => handleUseCampaign(campaign.template)}
                  style={{
                    padding: 14,
                    background: 'var(--bg-surface)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: campaign.type === 'promotion'
                      ? 'rgba(239,68,68,0.12)'
                      : campaign.type === 'launch'
                      ? 'rgba(99,102,241,0.12)'
                      : 'rgba(234,179,8,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {campaign.type === 'promotion' ? '🏷️' : campaign.type === 'launch' ? '🚀' : '🔄'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{campaign.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{campaign.description}</div>
                  </div>
                  <Send size={14} style={{ color: 'var(--brand-primary-light)' }} />
                </button>
              ))}
            </div>
          </div>

          {client.status !== 'active' && (
            <div className="card" style={{ borderLeft: '3px solid var(--brand-primary)' }}>
              <div className="card-header">
                <span className="card-title">💬 Sugestão de Mensagem</span>
              </div>
              <div className="message-preview">
                {client.status === 'inactive'
                  ? `Oi ${client.name.split(' ')[0]}! Sentimos sua falta 😢 Faz ${daysSince} dias que não fazemos negócio. Separei condições especiais pra ${client.company}. Posso te mandar?`
                  : `Fala ${client.name.split(' ')[0]}! 🐾 Vi que faz ${daysSince} dias desde a última compra. Tem novidade chegando! Quer dar uma olhada?`
                }
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const text = client.status === 'inactive'
                    ? `Oi ${client.name.split(' ')[0]}! Sentimos sua falta 😢 Faz ${daysSince} dias que não fazemos negócio. Separei condições especiais pra ${client.company}. Posso te mandar?`
                    : `Fala ${client.name.split(' ')[0]}! 🐾 Vi que faz ${daysSince} dias desde a última compra. Tem novidade chegando! Quer dar uma olhada?`;
                  setMessageText(text);
                  setShowMessageModal(true);
                }}
              >
                <Send size={16} /> Usar esta mensagem
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="📩 Enviar Mensagem"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSendMessage}>
              <Send size={16} /> Enviar Mensagem
            </button>
          </>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 12,
            background: 'var(--bg-surface)',
            borderRadius: 10,
          }}>
            <ClientAvatar name={client.name} status={client.status} size={36} fontSize={14} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{client.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{client.phone}</div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="msg-text">Mensagem</label>
          <textarea
            id="msg-text"
            className="form-textarea"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            rows={5}
          />
        </div>
      </Modal>

      <RegisterOrderModal
        open={showOrderModal}
        clientId={client.id}
        clientName={client.name}
        onClose={() => setShowOrderModal(false)}
        onCreated={() => {
          setToast({ message: 'Pedido registrado com sucesso!', type: 'success' });
          loadAll();
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
