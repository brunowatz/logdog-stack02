'use client';

import { useEffect, useState } from 'react';
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
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getProducts } from '@/lib/data-service';

const navItems = [
  { href: '/dashboard', label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/clients',   label: 'Clientes',         icon: Users },
  { href: '/campaigns', label: 'Campanhas',        icon: Megaphone },
  { href: '/send',      label: 'Enviar Mensagem',  icon: Send },
  { href: '/messages',  label: 'Mensagens',        icon: MessageSquare },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    getProducts().then(p => setProductCount(p.length));
  }, []);

  // Fecha o drawer mobile quando navega.
  useEffect(() => { onMobileClose?.(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const initial = (user?.email ?? 'V').charAt(0).toUpperCase();
  const displayEmail = user?.email ?? 'Equipe Comercial';

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🐕</div>
        <div>
          <h1>Log Dog</h1>
          <span>Painel de Vendas</span>
        </div>
      </div>

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
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}

        <div className="sidebar-section-label" style={{ marginTop: '24px' }}>Sistema</div>
        <Link
          href="/products"
          className={`sidebar-link ${pathname === '/products' ? 'active' : ''}`}
          aria-current={pathname === '/products' ? 'page' : undefined}
        >
          <Package />
          Produtos
          {productCount !== null && <span className="sidebar-badge">{productCount}</span>}
        </Link>
        <Link
          href="/settings"
          className={`sidebar-link ${pathname === '/settings' ? 'active' : ''}`}
          aria-current={pathname === '/settings' ? 'page' : undefined}
        >
          <Settings />
          Configurações
        </Link>
      </nav>

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
          <div
            title={displayEmail}
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {displayEmail}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sair"
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
