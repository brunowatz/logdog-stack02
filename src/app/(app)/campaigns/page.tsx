'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Megaphone,
  X,
  Save,
  Tag,
  Repeat,
  Rocket,
} from 'lucide-react';
import { getCampaigns, createCampaign, updateCampaign } from '@/lib/data-service';
import { getCampaignTypeLabel, getCampaignTypeEmoji } from '@/lib/utils';
import { Campaign, CampaignType } from '@/types';
import Toast from '@/components/Toast';

const campaignGradients: Record<CampaignType, string> = {
  promotion: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
  replenishment: 'linear-gradient(135deg, #eab308 0%, #22c55e 100%)',
  launch: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
};

const campaignIcons: Record<CampaignType, string> = {
  promotion: '🏷️',
  replenishment: '🔄',
  launch: '🚀',
};

import { useEffect } from 'react';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
      setError('Não foi possível carregar as campanhas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<CampaignType>('promotion');
  const [formDescription, setFormDescription] = useState('');
  const [formTemplate, setFormTemplate] = useState('');
  const [formTargetStatus, setFormTargetStatus] = useState<string[]>(['active']);

  function resetForm() {
    setFormTitle('');
    setFormType('promotion');
    setFormDescription('');
    setFormTemplate('');
    setFormTargetStatus(['active']);
    setEditingCampaign(null);
  }

  function openCreate() {
    resetForm();
    setShowModal(true);
  }

  function openEdit(campaign: Campaign) {
    setEditingCampaign(campaign);
    setFormTitle(campaign.title);
    setFormType(campaign.type);
    setFormDescription(campaign.description);
    setFormTemplate(campaign.template);
    setFormTargetStatus(campaign.target_status);
    setShowModal(true);
  }

  async function handleSave() {
    if (!formTitle || !formTemplate) {
      setToast({ message: 'Preencha título e template da mensagem', type: 'error' });
      return;
    }

    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, {
          title: formTitle,
          type: formType,
          description: formDescription,
          template: formTemplate,
          target_status: formTargetStatus as Campaign['target_status'],
        });
        setToast({ message: 'Campanha atualizada com sucesso!', type: 'success' });
      } else {
        await createCampaign({
          title: formTitle,
          type: formType,
          description: formDescription,
          template: formTemplate,
          image_url: '',
          target_status: formTargetStatus as Campaign['target_status'],
          is_active: true,
        });
        setToast({ message: 'Campanha criada com sucesso!', type: 'success' });
      }

      await loadData();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setToast({ message: 'Erro ao salvar campanha', type: 'error' });
    }
  }

  function toggleTargetStatus(status: string) {
    setFormTargetStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  }

  if (loading) {
    return (
      <div className="animate-in" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Carregando campanhas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ marginBottom: '8px' }}>Erro ao carregar</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
        <button className="btn btn-primary" onClick={loadData}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Campanhas</h1>
          <p>Gerencie suas campanhas de marketing e mensagens</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Nova Campanha
        </button>
      </div>

      {/* Campaign Grid */}
      <div className="grid-3">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card animate-in">
            {/* Card Image Area */}
            <div
              className="campaign-card-image"
              style={{
                background: campaignGradients[campaign.type],
              }}
            >
              <span style={{ fontSize: '56px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                {campaignIcons[campaign.type]}
              </span>

              {/* Status badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: campaign.is_active ? 'rgba(34,197,94,0.9)' : 'rgba(107,114,128,0.9)',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
              }}>
                {campaign.is_active ? '✓ Ativa' : 'Inativa'}
              </div>
            </div>

            {/* Card Body */}
            <div className="campaign-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  className="campaign-type-badge"
                  style={{
                    background: campaign.type === 'promotion'
                      ? 'rgba(239,68,68,0.12)'
                      : campaign.type === 'launch'
                      ? 'rgba(99,102,241,0.12)'
                      : 'rgba(234,179,8,0.12)',
                    color: campaign.type === 'promotion'
                      ? '#f87171'
                      : campaign.type === 'launch'
                      ? '#818cf8'
                      : '#facc15',
                  }}
                >
                  {getCampaignTypeEmoji(campaign.type)} {getCampaignTypeLabel(campaign.type)}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
                {campaign.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                {campaign.description}
              </p>

              {/* Template preview */}
              <div style={{
                padding: '12px',
                background: 'var(--bg-surface)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                borderLeft: '3px solid var(--brand-primary)',
                lineHeight: '1.6',
              }}>
                &ldquo;{campaign.template.substring(0, 100)}...&rdquo;
              </div>

              {/* Target audience */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {campaign.target_status.map((status: any) => (
                  <span
                    key={status}
                    className={`status-badge ${status}`}
                    style={{ fontSize: '10px' }}
                  >
                    <span className="dot" />
                    {status === 'active' ? 'Ativos' : status === 'cooling' ? 'Esfriando' : 'Inativos'}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => openEdit(campaign)}
                >
                  <Edit size={14} /> Editar
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => window.location.href = '/send'}
                >
                  <Megaphone size={14} /> Usar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <h2>{editingCampaign ? '✏️ Editar Campanha' : '🆕 Nova Campanha'}</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Título</label>
              <input
                className="form-input"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="Ex: Reposição de Shampoo"
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  value={formType}
                  onChange={e => setFormType(e.target.value as CampaignType)}
                >
                  <option value="promotion">🏷️ Promoção</option>
                  <option value="replenishment">🔄 Reposição</option>
                  <option value="launch">🚀 Lançamento</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Público Alvo</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {(['active', 'cooling', 'inactive'] as const).map(status => (
                    <label key={status} className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={formTargetStatus.includes(status)}
                        onChange={() => toggleTargetStatus(status)}
                      />
                      <span style={{ fontSize: '13px' }}>
                        {status === 'active' ? '🟢 Ativos' : status === 'cooling' ? '🟡 Esfriando' : '🔴 Inativos'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição</label>
              <input
                className="form-input"
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Breve descrição da campanha..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Template de Mensagem</label>
              <textarea
                className="form-textarea"
                value={formTemplate}
                onChange={e => setFormTemplate(e.target.value)}
                placeholder="Use variáveis: {nome}, {produto}, {tempo_sem_comprar}, {company}"
                rows={4}
              />
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                background: 'var(--bg-surface)',
                borderRadius: '8px',
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}>
                💡 Variáveis disponíveis: <code style={{ color: 'var(--brand-primary-light)' }}>{'{nome}'}</code>, <code style={{ color: 'var(--brand-primary-light)' }}>{'{produto}'}</code>, <code style={{ color: 'var(--brand-primary-light)' }}>{'{tempo_sem_comprar}'}</code>, <code style={{ color: 'var(--brand-primary-light)' }}>{'{company}'}</code>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} /> {editingCampaign ? 'Salvar Alterações' : 'Criar Campanha'}
              </button>
            </div>
          </div>
        </div>
      )}

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
