-- ============================================
-- LOG DOG - SCHEMA DO BANCO DE DADOS (SUPABASE)
-- Distribuidora de Cosméticos Pet
-- ============================================

-- gen_random_uuid() vem do extension pgcrypto. No Supabase já vem habilitado,
-- mas garantimos aqui para portabilidade.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabela de Clientes (Pet Shops)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL DEFAULT 'SP',
  phone VARCHAR(20),
  email VARCHAR(255),
  last_purchase DATE,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0.00,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  replenishment_days INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Campanhas
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('promotion', 'replenishment', 'launch')),
  description TEXT,
  template TEXT NOT NULL,
  image_url TEXT,
  target_status TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Mensagens
-- O nome do cliente vem por JOIN com clients(name) — não denormalizamos
-- para que renomeações no cliente reflitam no histórico.
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'pending', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES para performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_clients_last_purchase ON clients(last_purchase);
CREATE INDEX IF NOT EXISTS idx_clients_priority ON clients(priority);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(type);

-- ============================================
-- VIEW: Status calculado do cliente
-- ============================================

CREATE OR REPLACE VIEW client_status_view AS
SELECT
  c.*,
  CASE
    WHEN c.last_purchase IS NULL THEN 'inactive'
    WHEN CURRENT_DATE - c.last_purchase <= 15 THEN 'active'
    WHEN CURRENT_DATE - c.last_purchase <= 30 THEN 'cooling'
    ELSE 'inactive'
  END AS computed_status,
  COALESCE(CURRENT_DATE - c.last_purchase, 999) AS days_since_purchase
FROM clients c;

-- ============================================
-- VIEW: Mensagens com nome do cliente (substitui a denormalização)
-- ============================================

CREATE OR REPLACE VIEW messages_with_client AS
SELECT
  m.*,
  c.name AS client_name,
  c.company AS client_company
FROM messages m
JOIN clients c ON c.id = m.client_id;

-- ============================================
-- FUNCTION: Atualizar updated_at automaticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clients_updated_at ON clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS campaigns_updated_at ON campaigns;
CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
-- A chave anon do Supabase é pública (vai no bundle do Next).
-- Sem RLS, qualquer um com a URL do app lê tudo. Ligar é obrigatório
-- mesmo no MVP. Política inicial: só usuários autenticados (qualquer
-- usuário autenticado tem acesso total — ferramenta interna).

ALTER TABLE clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages     ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['clients','products','orders','order_items','campaigns','messages']
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS authenticated_all ON %I; '
      'CREATE POLICY authenticated_all ON %I '
      'FOR ALL TO authenticated USING (true) WITH CHECK (true);',
      t, t
    );
  END LOOP;
END
$$;

-- As views (client_status_view, messages_with_client) herdam RLS das
-- tabelas base, então não precisam de policy própria.
