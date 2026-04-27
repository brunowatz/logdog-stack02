'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Send,
  Package,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/campaigns', label: 'Campanhas', icon: Megaphone },
  { href: '/send', label: 'Enviar Mensagem', icon: Send },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const initial = (user?.email ?? 'V').charAt(0).toUpperCase();
  const displayEmail = user?.email ?? 'Equipe Comercial';

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🐕</div>
        <div>
          <h1>Log Dog</h1>
          <span>Painel de Vendas</span>
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}

        <div className="sidebar-section-label" style={{ marginTop: '24px' }}>Sistema</div>
        <Link href="/products" className={`sidebar-link ${pathname === '/products' ? 'active' : ''}`}>
          <Package />
          Produtos
          <span className="sidebar-badge">12</span>
        </Link>
        <Link href="/settings" className={`sidebar-link ${pathname === '/settings' ? 'active' : ''}`}>
          <Settings />
          Configurações
        </Link>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '700',
          color: 'white',
        }}>
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Vendedor
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {displayEmail}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          title="Sair"
          className="btn-ghost btn-icon"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
