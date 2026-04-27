-- ============================================
-- LOG DOG - SEED DATA
-- ============================================
-- IMPORTANTE: este script INSERE dados em tabelas com RLS habilitado.
-- Rode pelo SQL editor do Supabase (que usa o role `postgres`/superuser
-- e BYPASSA RLS) ou via service_role key. A anon key NÃO funciona aqui.
--
-- Os UUIDs abaixo são fixos (determinísticos) só para manter as relações
-- entre tabelas legíveis. Em produção, deixe o DEFAULT gen_random_uuid()
-- gerar IDs sozinho.
-- ============================================

-- 1. PRODUTOS
INSERT INTO products (id, name, category, price, replenishment_days, description) VALUES
('00000000-0000-0000-0000-0000000000a1', 'Shampoo Pet Brilho Intenso 5L', 'Banho', 189.90, 30, 'Shampoo profissional para alto rendimento.'),
('00000000-0000-0000-0000-0000000000a2', 'Shampoo Filhotes Suave 5L', 'Banho', 195.00, 45, 'Fórmula hipoalergênica para pets jovens.'),
('00000000-0000-0000-0000-0000000000a3', 'Condicionador Revitalizante 5L', 'Banho', 210.00, 40, 'Hidratação profunda pós-shampoo.'),
('00000000-0000-0000-0000-0000000000a4', 'Máscara Hidratação Argan 1kg', 'Tratamento', 120.00, 60, 'Tratamento intensivo para pelos danificados.'),
('00000000-0000-0000-0000-0000000000a5', 'Queratina Líquida Spray 500ml', 'Tratamento', 85.00, 90, 'Reconstrução capilar pet.'),
('00000000-0000-0000-0000-0000000000a6', 'Perfume Pet Summer Breeze 500ml', 'Perfumaria', 145.00, 120, 'Fragrância refrescante de longa duração.'),
('00000000-0000-0000-0000-0000000000a7', 'Perfume Pet Baby Powder 500ml', 'Perfumaria', 145.00, 120, 'Fragrância clássica de talco.'),
('00000000-0000-0000-0000-0000000000a8', 'Lâmina de Tosa 10 UltraEdge', 'Tosa', 250.00, 180, 'Aço carbono de alta precisão.'),
('00000000-0000-0000-0000-0000000000a9', 'Máquina de Tosa Profissional V5', 'Tosa', 1200.00, 365, 'Motor potente e silencioso.'),
('00000000-0000-0000-0000-0000000000aa', 'Kit Higiene Auricular 1L', 'Tratamento', 75.00, 60, 'Limpeza segura dos ouvidos.'),
('00000000-0000-0000-0000-0000000000ab', 'Shampoo Antisseborreico 500ml', 'Tratamento', 65.00, 30, 'Uso veterinário sob prescrição.'),
('00000000-0000-0000-0000-0000000000ac', 'Kit Promocional Banho e Tosa', 'Kits', 450.00, 30, 'Mix de shampoos e perfumes campeões.');

-- 2. CLIENTES
-- Datas variam para demonstrar status (ativo/esfriando/inativo).
INSERT INTO clients (id, name, company, city, state, phone, email, last_purchase, total_orders, total_spent, priority) VALUES
('00000000-0000-0000-0000-0000000000c1', 'Maria Silva',     'Pet Charmoso',          'São Paulo',      'SP', '(11) 98888-7777', 'contato@petcharmoso.com',   CURRENT_DATE - INTERVAL '5 days',  12,  4500.00, 'high'),
('00000000-0000-0000-0000-0000000000c2', 'João Santos',     'Banho do Totó',         'Campinas',       'SP', '(19) 97777-6666', 'joao@banhototo.com.br',     CURRENT_DATE - INTERVAL '10 days',  8,  2800.00, 'medium'),
('00000000-0000-0000-0000-0000000000c3', 'Ana Oliveira',    'Pet Shop Amigão',       'São Bernardo',   'SP', '(11) 96666-5555', 'ana@amigao.com',            CURRENT_DATE - INTERVAL '18 days', 15,  6200.00, 'high'),
('00000000-0000-0000-0000-0000000000c4', 'Ricardo Lima',    'Cão & Gato Estética',   'Santo André',    'SP', '(11) 95555-4444', 'ricardo@caoegato.com',      CURRENT_DATE - INTERVAL '22 days',  5,  1500.00, 'low'),
('00000000-0000-0000-0000-0000000000c5', 'Beatriz Costa',   'Peluagem VIP',          'Santos',         'SP', '(13) 94444-3333', 'vendas@peluagemvip.com',    CURRENT_DATE - INTERVAL '35 days', 20,  8900.00, 'high'),
('00000000-0000-0000-0000-0000000000c6', 'Marcos Rocha',    'Pet Station',           'Jundiaí',        'SP', '(11) 93333-2222', 'marcos@petstation.com',     CURRENT_DATE - INTERVAL '40 days',  3,   850.00, 'medium'),
('00000000-0000-0000-0000-0000000000c7', 'Fernanda Lima',   'Bicho Mimado',          'Sorocaba',       'SP', '(15) 92222-1111', 'fernanda@bichomimado.com',  CURRENT_DATE - INTERVAL '2 days',  25, 12500.00, 'high'),
('00000000-0000-0000-0000-0000000000c8', 'Paulo Souza',     'Mega Pet',              'Guarulhos',      'SP', '(11) 91111-0000', 'paulo@megapet.com',         CURRENT_DATE - INTERVAL '28 days',  6,  2100.00, 'medium'),
('00000000-0000-0000-0000-0000000000c9', 'Carla Mendes',    'Estética Animal',       'Osasco',         'SP', '(11) 90000-9999', 'carla@esteticaanimal.com',  CURRENT_DATE - INTERVAL '12 days', 10,  3400.00, 'medium'),
('00000000-0000-0000-0000-0000000000ca', 'Roberto Almeida', 'Dog Style',             'Ribeirão Preto', 'SP', '(16) 99999-8888', 'roberto@dogstyle.com',      CURRENT_DATE - INTERVAL '45 days',  4,  1200.00, 'low');

-- 3. PEDIDOS (Exemplos)
INSERT INTO orders (id, client_id, date, total, status) VALUES
('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000c1', CURRENT_DATE - INTERVAL '5 days',  379.80, 'completed'),
('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000c3', CURRENT_DATE - INTERVAL '18 days', 500.00, 'completed'),
('00000000-0000-0000-0000-0000000000d3', '00000000-0000-0000-0000-0000000000c5', CURRENT_DATE - INTERVAL '35 days', 1200.00,'completed'),
('00000000-0000-0000-0000-0000000000d4', '00000000-0000-0000-0000-0000000000c7', CURRENT_DATE - INTERVAL '2 days',  145.00, 'completed');

-- 4. ITENS DO PEDIDO
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total) VALUES
('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000a1', 'Shampoo Pet Brilho Intenso 5L',     2,  189.90,  379.80),
('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000a8', 'Lâmina de Tosa 10 UltraEdge',       2,  250.00,  500.00),
('00000000-0000-0000-0000-0000000000d3', '00000000-0000-0000-0000-0000000000a9', 'Máquina de Tosa Profissional V5',   1, 1200.00, 1200.00),
('00000000-0000-0000-0000-0000000000d4', '00000000-0000-0000-0000-0000000000a6', 'Perfume Pet Summer Breeze 500ml',   1,  145.00,  145.00);

-- 5. CAMPANHAS
INSERT INTO campaigns (id, title, type, description, template, target_status) VALUES
('00000000-0000-0000-0000-0000000000e1', 'Reposição de Shampoo',     'replenishment', 'Campanha focada em clientes que compraram shampoo há mais de 20 dias.', 'Olá {nome}, tudo bem? Notamos que já faz {tempo_sem_comprar} dias desde sua última compra de {produto}. Gostaria de garantir a reposição com 10% de desconto?', '{cooling,inactive}'),
('00000000-0000-0000-0000-0000000000e2', 'Lançamento Perfumaria',    'launch',        'Apresentação da nova linha de fragrâncias de outono.',                  'Oi {nome}! A {company} acaba de receber nossa nova linha de perfumes de Outono. São fragrâncias exclusivas que seus clientes vão amar. Podemos agendar uma demonstração?', '{active,cooling}'),
('00000000-0000-0000-0000-0000000000e3', 'Promoção Estética Pet',    'promotion',     'Desconto em equipamentos de tosa para clientes fiéis.',                 'Olá {nome}, temos uma oferta especial para a {company}. Máquinas de tosa e lâminas com 20% OFF esta semana. Aproveite!', '{active}'),
('00000000-0000-0000-0000-0000000000e4', 'Recuperação de Clientes',  'replenishment', 'Oferta agressiva para clientes inativos há mais de 30 dias.',           'Sentimos sua falta, {nome}! Faz tempo que não nos falamos. Preparamos uma condição imbatível para você voltar a abastecer a {company}. Vamos conversar?', '{inactive}');
