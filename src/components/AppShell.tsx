'use client';

import { useEffect, useState } from 'react';
import { Menu, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
      if (e.key === '/' && !isTypingTarget(e.target)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="mobile-topbar">
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={() => setPaletteOpen(true)}
          aria-label="Buscar"
        >
          <Search size={18} />
        </button>
      </div>

      <main className="main-content">
        <div className="cmdk-hint" onClick={() => setPaletteOpen(true)} role="button" tabIndex={0}>
          <Search size={14} />
          <span>Buscar clientes ou navegar</span>
          <kbd className="kbd">⌘K</kbd>
        </div>
        {children}
      </main>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}
