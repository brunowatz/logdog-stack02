'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, ClipboardList } from 'lucide-react';
import Modal from './Modal';
import { Product } from '@/types';
import { createOrder, getProducts } from '@/lib/data-service';
import { formatCurrency } from '@/lib/utils';

interface RegisterOrderModalProps {
  open: boolean;
  clientId: string;
  clientName: string;
  onClose: () => void;
  onCreated: () => void;
}

interface LineDraft {
  product_id: string;
  quantity: number;
}

export default function RegisterOrderModal({
  open,
  clientId,
  clientName,
  onClose,
  onCreated,
}: RegisterOrderModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [lines, setLines] = useState<LineDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLines([]);
    if (products.length === 0) getProducts().then(setProducts);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function addLine() {
    if (products.length === 0) return;
    setLines(prev => [...prev, { product_id: products[0].id, quantity: 1 }]);
  }

  function updateLine(idx: number, patch: Partial<LineDraft>) {
    setLines(prev => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  function removeLine(idx: number) {
    setLines(prev => prev.filter((_, i) => i !== idx));
  }

  const total = lines.reduce((sum, l) => {
    const p = products.find(p => p.id === l.product_id);
    return sum + (p ? p.price * l.quantity : 0);
  }, 0);

  async function handleSubmit() {
    if (lines.length === 0) {
      setError('Adicione ao menos um produto.');
      return;
    }
    if (lines.some(l => l.quantity < 1)) {
      setError('Quantidade mínima é 1.');
      return;
    }
    setSubmitting(true);
    try {
      await createOrder({ client_id: clientId, items: lines });
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao registrar pedido.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar pedido"
      maxWidth={620}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={submitting || lines.length === 0}
          >
            <ClipboardList size={16} />
            {submitting ? 'Salvando...' : `Registrar (${formatCurrency(total)})`}
          </button>
        </>
      }
    >
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Cliente: <strong style={{ color: 'var(--text-primary)' }}>{clientName}</strong>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {lines.length === 0 && (
          <div style={{
            padding: 16,
            background: 'var(--bg-surface)',
            borderRadius: 10,
            fontSize: 13,
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}>
            Nenhum item ainda. Clique em “Adicionar produto”.
          </div>
        )}

        {lines.map((line, idx) => {
          const product = products.find(p => p.id === line.product_id);
          const lineTotal = product ? product.price * line.quantity : 0;
          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 100px 36px',
                gap: 8,
                alignItems: 'center',
                padding: 10,
                background: 'var(--bg-surface)',
                borderRadius: 10,
              }}
            >
              <select
                className="form-select"
                value={line.product_id}
                onChange={e => updateLine(idx, { product_id: e.target.value })}
                aria-label="Produto"
                style={{ padding: '8px 36px 8px 12px', fontSize: 13 }}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input
                className="form-input"
                type="number"
                min={1}
                value={line.quantity}
                onChange={e => updateLine(idx, { quantity: Math.max(1, parseInt(e.target.value || '1', 10)) })}
                aria-label="Quantidade"
                style={{ padding: '8px 12px', fontSize: 13 }}
              />
              <div style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>
                {formatCurrency(lineTotal)}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => removeLine(idx)}
                aria-label="Remover item"
                style={{ width: 36, height: 36 }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>
        <Plus size={14} /> Adicionar produto
      </button>

      {error && (
        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10,
          color: 'var(--status-inactive-fg)',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {lines.length > 0 && (
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total do pedido</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--status-active-fg)' }}>
            {formatCurrency(total)}
          </span>
        </div>
      )}
    </Modal>
  );
}
