'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import LoadingPanel from '@/components/LoadingPanel';
import { useAuth } from '@/lib/auth-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return <LoadingPanel message="Verificando sessão..." />;
  }

  return <AppShell>{children}</AppShell>;
}
