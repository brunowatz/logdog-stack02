'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Send,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Users,
  Megaphone,
  Eye,
  X,
  Check,
} from 'lucide-react';
import {
  getCampaigns,
  getClients,
  personalizeMessage,
  sendMessage,
} from '@/lib/data-service';
import { daysSinceDate, getStatusLabel, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Campaign, Client } from '@/types';

type Step = 1 | 2 | 3 | 4;

export default function SendPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelSendRef = useRef(false);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      const [campaignsData, clientsData] = await Promise.all([
        getCampaigns(),
        getClients()
      ]);
      setCampaigns(campaignsData.filter(c => c.is_active));
      setAllClients(clientsData);
      setLoading(false);
    }
    loadData();
  }, []);

  // Clientes sugeridos com base na campanha selecionada
  const suggestedClients = useMemo(() => {
    if (!selectedCampaign) return allClients;
    return allClients.filter(c =>
      selectedCampaign.target_status.includes(c.status)
    );
  }, [selectedCampaign, allClients]);

  // Auto-selecionar clientes sugeridos quando campanha muda
  function handleSelectCampaign(campaign: Campaign) {
    setSelectedCampaign(campaign);
    const suggested = allClients.filter(c =>
      campaign.target_status.includes(c.status)
    );
    setSelectedClients(new Set(suggested.map(c => c.id)));
    setStep(2);
  }

  function toggleClient(clientId: string) {
    setSelectedClients(prev => {
      const next = new Set(prev);
      if (next.has(clientId)) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedClients(new Set(suggestedClients.map(c => c.id)));
  }

  function deselectAll() {
    setSelectedClients(new Set());
  }

  async function performSend() {
    if (!selectedCampaign || selectedClients.size === 0) return;
    cancelSendRef.current = false;
    setIsSending(true);
    const clientIds = Array.from(selectedClients);
    let count = 0;

    for (const clientId of clientIds) {
      if (cancelSendRef.current) break;
      const client = allClients.find(c => c.id === clientId);
      if (client && selectedCampaign) {
        try {
          const message = personalizeMessage(selectedCampaign.template, client);
          await sendMessage(client.id, message, selectedCampaign.id);
        } catch (err) {
          console.error(`Erro ao enviar para ${client.name}:`, err);
        }
      }
      count++;
      setSentCount(count);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsSending(false);
    setStep(4);
  }

  function cancelSending() {
    cancelSendRef.current = true;
  }

  // Indeterminate state no checkbox de cabeçalho.
  useEffect(() => {
    if (!headerCheckboxRef.current) return;
    const total = suggestedClients.length;
    const sel = suggestedClients.filter(c => selectedClients.has(c.id)).length;
    headerCheckboxRef.current.indeterminate = sel > 0 && sel < total;
  }, [selectedClients, suggestedClients]);

  const getPreviewMessage = (client: Client) => {
    if (!selectedCampaign) return '';
    return personalizeMessage(selectedCampaign.template, client);
  };

  if (loading) {
    return <div className="animate-in" style={{ padding: '40px', textAlign: 'center' }}>Carregando assistente de envio...</div>;
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <h1>Enviar Mensagens</h1>
        <p>Envie mensagens personalizadas para seus clientes</p>
      </div>

      {/* Steps indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        marginBottom: '32px',
        padding: '16px 24px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
      }}>
        {[
          { num: 1, label: 'Selecionar Campanha', icon: <Megaphone size={16} /> },
          { num: 2, label: 'Destinatários', icon: <Users size={16} /> },
          { num: 3, label: 'Preview', icon: <Eye size={16} /> },
          { num: 4, label: 'Enviado', icon: <CheckCircle size={16} /> },
        ].map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: s.num < step ? 'pointer' : 'default',
                opacity: step >= s.num ? 1 : 0.4,
              }}
              onClick={() => {
                if (s.num < step && s.num !== 4) setStep(s.num as Step);
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: step >= s.num
                  ? step === s.num
                    ? 'var(--brand-primary)'
                    : 'rgba(34,197,94,0.15)'
                  : 'var(--bg-surface)',
                color: step >= s.num
                  ? step === s.num
                    ? 'white'
                    : '#4ade80'
                  : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
              }}>
                {step > s.num ? <Check size={16} /> : s.icon}
              </div>
              <span style={{
                fontSize: '13px',
                fontWeight: step === s.num ? '600' : '500',
                color: step >= s.num ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
                {s.label}
              </span>
            </div>
            {i < 3 && (
              <div style={{
                flex: 1,
                height: '2px',
                background: step > s.num ? '#4ade80' : 'var(--border-subtle)',
                margin: '0 16px',
                borderRadius: '1px',
                transition: 'all 0.3s ease',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Selecionar Campanha */}
      {step === 1 && (
        <div className="animate-in">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            📣 Selecione uma campanha
          </h2>
          <div className="grid-2">
            {campaigns.map((campaign: any) => (
              <div
                key={campaign.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: selectedCampaign?.id === campaign.id
                    ? '2px solid var(--brand-primary)'
                    : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => handleSelectCampaign(campaign)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: campaign.type === 'promotion'
                      ? 'linear-gradient(135deg, #ef4444, #f97316)'
                      : campaign.type === 'launch'
                      ? 'linear-gradient(135deg, #6366f1, #06b6d4)'
                      : 'linear-gradient(135deg, #eab308, #22c55e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                  }}>
                    {campaign.type === 'promotion' ? '🏷️' : campaign.type === 'launch' ? '🚀' : '🔄'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {campaign.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {campaign.description}
                    </p>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {campaign.target_status.map((s: any) => (
                        <span key={s} className={`status-badge ${s}`} style={{ fontSize: '10px' }}>
                          <span className="dot" />
                          {getStatusLabel(s)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Destinatários */}
      {step === 2 && (
        <div className="animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              👥 Selecione os destinatários
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={selectAll}>Selecionar todos</button>
              <button className="btn btn-ghost btn-sm" onClick={deselectAll}>Limpar</button>
              <span style={{
                padding: '6px 14px',
                background: 'rgba(99,102,241,0.12)',
                color: 'var(--brand-primary-light)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
              }}>
                {selectedClients.size} selecionados
              </span>
            </div>
          </div>

          {/* Selected campaign info */}
          {selectedCampaign && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px',
            }}>
              <Megaphone size={16} style={{ color: 'var(--brand-primary-light)' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Campanha: <strong style={{ color: 'var(--text-primary)' }}>{selectedCampaign.title}</strong>
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                • Público-alvo: {selectedCampaign.target_status.map(s => getStatusLabel(s)).join(', ')}
              </span>
            </div>
          )}

          {/* Clients list */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      aria-label="Selecionar todos"
                      checked={suggestedClients.length > 0 && selectedClients.size === suggestedClients.length}
                      onChange={() => selectedClients.size === suggestedClients.length ? deselectAll() : selectAll()}
                      style={{ accentColor: 'var(--brand-primary)' }}
                    />
                  </th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Última Compra</th>
                  <th>Dias sem Comprar</th>
                </tr>
              </thead>
              <tbody>
                {suggestedClients.map((client: any) => (
                  <tr
                    key={client.id}
                    style={{
                      cursor: 'pointer',
                      background: selectedClients.has(client.id) ? 'rgba(99,102,241,0.06)' : 'transparent',
                    }}
                    onClick={() => toggleClient(client.id)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedClients.has(client.id)}
                        onChange={() => toggleClient(client.id)}
                        style={{ accentColor: 'var(--brand-primary)' }}
                      />
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{client.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{client.company}</div>
                      </div>
                    </td>
                    <td><StatusBadge status={client.status} /></td>
                    <td style={{ fontSize: '13px' }}>{formatDate(client.last_purchase)}</td>
                    <td>
                      <span style={{
                        fontWeight: '600',
                        color: daysSinceDate(client.last_purchase) > 30
                          ? '#f87171'
                          : daysSinceDate(client.last_purchase) > 15
                          ? '#facc15'
                          : '#4ade80',
                      }}>
                        {daysSinceDate(client.last_purchase)} dias
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              <ChevronLeft size={16} /> Voltar
            </button>
            <button
              className="btn btn-primary"
              disabled={selectedClients.size === 0}
              onClick={() => setStep(3)}
              style={{ opacity: selectedClients.size === 0 ? 0.5 : 1 }}
            >
              Próximo: Preview <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && selectedCampaign && (
        <div className="animate-in">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            👁️ Preview das Mensagens
          </h2>

          <div style={{
            padding: '16px',
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Campanha:</span>
              <span style={{ fontWeight: '600', marginLeft: '8px' }}>{selectedCampaign.title}</span>
            </div>
            <div style={{
              padding: '6px 14px',
              background: 'rgba(99,102,241,0.12)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--brand-primary-light)',
            }}>
              {selectedClients.size} destinatários
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
            {allClients
              .filter(c => selectedClients.has(c.id))
              .map((client: any) => (
                <div key={client.id} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: 'rgba(99,102,241,0.12)',
                        color: '#818cf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px',
                      }}>
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{client.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{client.phone}</div>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleClient(client.id)}
                      style={{ color: 'var(--status-inactive)' }}
                    >
                      <X size={14} /> Remover
                    </button>
                  </div>
                  <div className="message-preview" style={{ margin: 0 }}>
                    {getPreviewMessage(client)}
                  </div>
                </div>
              ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              <ChevronLeft size={16} /> Voltar
            </button>
            {isSending ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Enviando {sentCount}/{selectedClients.size}...
                </span>
                <button className="btn btn-secondary btn-sm" onClick={cancelSending}>
                  Cancelar envio
                </button>
              </div>
            ) : (
              <button className="btn btn-success btn-lg" onClick={() => setConfirmOpen(true)}>
                <Send size={18} />
                Enviar para {selectedClients.size} clientes
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Enviado! */}
      {step === 4 && (
        <div className="animate-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(34,197,94,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle size={40} style={{ color: '#22c55e' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            Mensagens Enviadas! 🎉
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>
            {sentCount} mensagens foram enviadas com sucesso
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={() => { setStep(1); setSelectedCampaign(null); setSelectedClients(new Set()); setSentCount(0); }}
            >
              Enviar outra campanha
            </button>
            <Link className="btn btn-secondary" href="/messages">
              Ver mensagens enviadas
            </Link>
            <button
              className="btn btn-primary"
              onClick={() => router.push('/dashboard')}
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar envio em massa"
        message={
          <>
            Você está prestes a enviar <strong>{selectedClients.size} mensagens</strong>
            {selectedCampaign ? <> pela campanha <strong>“{selectedCampaign.title}”</strong></> : null}.
            <br /><br />
            Essa ação não pode ser desfeita. Verifique o preview antes de continuar.
          </>
        }
        confirmLabel={`Enviar ${selectedClients.size} mensagens`}
        cancelLabel="Voltar"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); performSend(); }}
      />

      {/* Toast */}
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
