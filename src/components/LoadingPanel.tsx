'use client';

interface LoadingPanelProps {
  message?: string;
}

export default function LoadingPanel({ message = 'Carregando...' }: LoadingPanelProps) {
  return (
    <div className="animate-in" style={{ padding: '80px 40px', textAlign: 'center' }}>
      <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
      <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
    </div>
  );
}
