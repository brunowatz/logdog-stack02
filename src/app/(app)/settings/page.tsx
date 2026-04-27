'use client';

import { Settings, User, Bell, Shield, Database, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Gerencie as preferências da sua conta e do sistema</p>
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={18} style={{ color: 'var(--brand-primary-light)' }} />
                <span className="card-title">Perfil do Usuário</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input className="form-input" defaultValue="Vendedor Log Dog" />
            </div>
            
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input className="form-input" defaultValue="vendedor@logdog.com.br" />
            </div>

            <button className="btn btn-primary" style={{ marginTop: '8px' }}>
              <Save size={16} /> Salvar Alterações
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={18} style={{ color: '#facc15' }} />
                <span className="card-title">Notificações</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label className="checkbox-wrapper">
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '14px' }}>Alertas de clientes esfriando</span>
              </label>
              <label className="checkbox-wrapper">
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '14px' }}>Relatórios semanais de vendas</span>
              </label>
              <label className="checkbox-wrapper">
                <input type="checkbox" />
                <span style={{ fontSize: '14px' }}>Novos produtos no catálogo</span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={18} style={{ color: '#06b6d4' }} />
                <span className="card-title">Conexão com Banco de Dados</span>
              </div>
            </div>
            
            <div style={{ 
              padding: '12px', 
              background: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: '10px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '13px', fontWeight: '600' }}>
                <Shield size={14} /> Conectado ao Supabase
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Status: Sincronização em tempo real ativa
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Região do Servidor</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)' }}>
                <Globe size={16} style={{ color: 'var(--text-muted)' }} /> South America (Sao Paulo)
              </div>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ fontSize: '14px', color: '#f87171', marginBottom: '12px' }}>Zona de Perigo</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Ao limpar o cache do sistema, todos os dados locais serão removidos e recarregados do servidor.
            </p>
            <button className="btn btn-secondary" style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              Limpar Cache do Sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
