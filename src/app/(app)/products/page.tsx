'use client';

import { useState, useEffect, useMemo } from 'react';
import { Package, Search, Filter, Plus, ArrowUpDown, Tag, Clock } from 'lucide-react';
import { getProducts } from '@/lib/data-service';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError('Não foi possível carregar a lista de produtos.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  if (loading) {
    return (
      <div className="animate-in" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Carregando catálogo de produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ marginBottom: '8px' }}>Erro ao carregar</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Produtos</h1>
          <p>Catálogo completo de cosméticos e acessórios pet</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        <div className="search-bar" style={{ flex: 1, minWidth: '300px' }}>
          <Search />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: categoryFilter === cat ? 'var(--brand-primary)' : 'var(--bg-card)',
                color: categoryFilter === cat ? 'white' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-3">
        {filteredProducts.map((product, i) => (
          <div 
            key={product.id} 
            className="card animate-in" 
            style={{ 
              animationDelay: `${i * 0.05}s`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--brand-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Package size={24} />
              </div>
              <span style={{
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                alignSelf: 'flex-start',
              }}>
                {product.category}
              </span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
              {product.name}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', flex: 1 }}>
              {product.description}
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: 'auto',
            }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--brand-primary-light)' }}>
                  {formatCurrency(product.price)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <Clock size={12} /> Reposição: {product.replenishment_days} dias
                </div>
              </div>
              <button className="btn btn-secondary btn-icon" title="Editar">
                <Tag size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente ajustar os termos da sua busca.</p>
        </div>
      )}
    </div>
  );
}
