'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';

type Mode = 'password' | 'magic';

export default function LoginPage() {
  const { user, loading, signIn, signInWithMagicLink } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    if (mode === 'password') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signInWithMagicLink(email);
      if (error) setError(error);
      else setInfo('Enviamos um link mágico para o seu e-mail. Verifique sua caixa de entrada.');
    }
    setSubmitting(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-primary)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            fontSize: 28,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(99,102,241,0.12)',
            borderRadius: 14,
          }}>🐕</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Log Dog</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Painel de Vendas</p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div style={{
            padding: 12,
            background: 'rgba(245,158,11,0.1)',
            borderRadius: 10,
            border: '1px solid rgba(245,158,11,0.2)',
            marginBottom: 16,
            fontSize: 12,
            color: '#fbbf24',
          }}>
            Modo demo (sem Supabase). O login é ignorado — você já está autenticado.
          </div>
        )}

        <div className="tabs" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className={`tab ${mode === 'password' ? 'active' : ''}`}
            onClick={() => { setMode('password'); setError(null); setInfo(null); }}
          >
            Senha
          </button>
          <button
            type="button"
            className={`tab ${mode === 'magic' ? 'active' : ''}`}
            onClick={() => { setMode('magic'); setError(null); setInfo(null); }}
          >
            Link mágico
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          {mode === 'password' && (
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Senha</label>
              <input
                id="login-password"
                className="form-input"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          )}

          {error && (
            <div style={{
              padding: '10px 12px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10,
              color: 'var(--status-inactive-fg)',
              fontSize: 13,
              marginBottom: 12,
            }}>
              {error}
            </div>
          )}

          {info && (
            <div style={{
              padding: '10px 12px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 10,
              color: 'var(--status-active-fg)',
              fontSize: 13,
              marginBottom: 12,
            }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={submitting || !isSupabaseConfigured}
          >
            {mode === 'password' ? <LogIn size={16} /> : <Mail size={16} />}
            {submitting ? 'Enviando...' : mode === 'password' ? 'Entrar' : 'Enviar link'}
          </button>
        </form>
      </div>
    </div>
  );
}
