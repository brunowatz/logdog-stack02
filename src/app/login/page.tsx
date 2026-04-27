'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) setError(error);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-page, #0b0c10)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            fontSize: '28px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(99,102,241,0.12)',
            borderRadius: '14px',
          }}>🐕</div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Log Dog</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Painel de Vendas</p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div style={{
            padding: '12px',
            background: 'rgba(245,158,11,0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(245,158,11,0.2)',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#fbbf24',
          }}>
            Modo demo (sem Supabase). O login é ignorado — você já está autenticado.
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className="form-input"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className="form-input"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 12px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px',
              color: '#f87171',
              fontSize: '13px',
              marginBottom: '12px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={submitting || !isSupabaseConfigured}
          >
            <LogIn size={16} />
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
