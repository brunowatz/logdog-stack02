// ============================================
// CAMADA DE DADOS - LOG DOG
// Implementação híbrida: Supabase (Produção) + Mock (Desenvolvimento)
// ============================================

import { Client, Product, Order, Campaign, Message, DashboardStats, Suggestion } from '@/types';
import { mockClients, mockProducts, mockOrders, mockCampaigns, mockMessages } from './mock-data';
import { getClientStatus, daysSinceDate } from './utils';
import { supabase, isSupabaseConfigured } from './supabase';

// --- CLIENTES ---

export async function getClients(): Promise<Client[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('client_status_view')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }

    return data.map((c: any) => ({
      ...c,
      status: c.computed_status as any,
    }));
  }

  return mockClients.map(c => ({
    ...c,
    status: getClientStatus(c.last_purchase),
  }));
}

export async function getClientById(id: string): Promise<Client | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('client_status_view')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return undefined;
    return { ...data, status: data.computed_status as any };
  }

  const client = mockClients.find(c => c.id === id);
  if (!client) return undefined;
  return { ...client, status: getClientStatus(client.last_purchase) };
}

// --- PRODUTOS ---

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('products').select('*').eq('is_active', true);
    return data || [];
  }
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    return data || undefined;
  }
  return mockProducts.find(p => p.id === id);
}

// --- PEDIDOS ---

export async function getOrdersByClientId(clientId: string): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    return data || [];
  }
  return mockOrders.filter(o => o.client_id === clientId);
}

export async function createOrder(input: {
  client_id: string;
  items: Array<{ product_id: string; quantity: number }>;
  notes?: string;
}): Promise<Order> {
  const products = await getProducts();
  const lineItems = input.items
    .map(i => {
      const p = products.find(pp => pp.id === i.product_id);
      if (!p) return null;
      return {
        product_id: p.id,
        product_name: p.name,
        quantity: i.quantity,
        unit_price: p.price,
        total: Number((p.price * i.quantity).toFixed(2)),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const total = Number(lineItems.reduce((s, i) => s + i.total, 0).toFixed(2));

  if (isSupabaseConfigured && supabase) {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({ client_id: input.client_id, total, status: 'completed', notes: input.notes ?? null })
      .select()
      .single();
    if (error) throw error;

    if (lineItems.length > 0) {
      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(lineItems.map(li => ({ order_id: order.id, ...li })));
      if (itemsErr) throw itemsErr;
    }

    // Atualiza last_purchase do cliente.
    await supabase
      .from('clients')
      .update({ last_purchase: order.date })
      .eq('id', input.client_id);

    return { ...order, items: lineItems.map((li, idx) => ({ id: `tmp${idx}`, order_id: order.id, ...li })) };
  }

  const newOrder: Order = {
    id: `o${Date.now()}`,
    client_id: input.client_id,
    date: new Date().toISOString().split('T')[0],
    total,
    status: 'completed',
    items: lineItems.map((li, idx) => ({
      id: `oi${Date.now()}_${idx}`,
      order_id: `o${Date.now()}`,
      ...li,
    })),
  };
  mockOrders.unshift(newOrder);
  return newOrder;
}

export async function getMessages(): Promise<Message[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('messages_with_client')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(200);
    if (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
    return data || [];
  }
  return mockMessages;
}

async function getAllOrdersWithItems(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('date', { ascending: false });
    return data || [];
  }
  return mockOrders;
}

// --- CAMPANHAS ---

export async function getCampaigns(): Promise<Campaign[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('campaigns').select('*').eq('is_active', true);
    return data || [];
  }
  return mockCampaigns;
}

export async function createCampaign(campaign: Omit<Campaign, 'id' | 'created_at'>): Promise<Campaign> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('campaigns').insert(campaign).select().single();
    if (error) throw error;
    return data;
  }

  // Mutação de módulo: aceitável só em dev (em produção lançamos no supabase.ts).
  const newCampaign: Campaign = {
    ...campaign,
    id: `camp${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
  };
  mockCampaigns.push(newCampaign);
  return newCampaign;
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('campaigns').update(updates).eq('id', id).select().single();
    if (error) return undefined;
    return data;
  }

  const index = mockCampaigns.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  mockCampaigns[index] = { ...mockCampaigns[index], ...updates };
  return mockCampaigns[index];
}

export async function sendMessage(clientId: string, content: string, campaignId?: string): Promise<Message> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('messages').insert({
      client_id: clientId,
      campaign_id: campaignId || null,
      content,
      status: 'sent',
    }).select().single();

    if (error) throw error;
    return data;
  }

  const client = await getClientById(clientId);
  return {
    id: `m${Date.now()}`,
    client_id: clientId,
    client_name: client?.name,
    campaign_id: campaignId || null,
    content,
    status: 'sent',
    sent_at: new Date().toISOString(),
  };
}

// --- SUGESTÕES INTELIGENTES ---

const COMPLEMENTARY_MAP: Record<string, string[]> = {
  Banho: ['Tratamento', 'Perfumaria', 'Tosa'],
  Tratamento: ['Banho', 'Tosa'],
  Tosa: ['Banho', 'Tratamento'],
  Perfumaria: ['Banho'],
  Kits: [],
};

function buildSuggestions(orders: Order[], products: Product[]): Suggestion[] {
  if (orders.length === 0) return [];

  const productById = new Map(products.map(p => [p.id, p]));
  const purchasedProductIds = new Set<string>();
  orders.forEach(o => o.items.forEach(i => purchasedProductIds.add(i.product_id)));

  const suggestions: Suggestion[] = [];
  const lastOrder = orders.reduce((latest, o) =>
    new Date(o.date).getTime() > new Date(latest.date).getTime() ? o : latest
  );

  for (const item of lastOrder.items) {
    const product = productById.get(item.product_id);
    if (!product) continue;
    const daysSince = daysSinceDate(lastOrder.date);
    if (daysSince >= product.replenishment_days * 0.7) {
      suggestions.push({
        type: 'replenishment',
        product,
        reason: `Última compra há ${daysSince} dias. Reposição estimada: ${product.replenishment_days} dias.`,
      });
    }
  }

  const purchasedCategories = new Set<string>();
  for (const pid of purchasedProductIds) {
    const p = productById.get(pid);
    if (p) purchasedCategories.add(p.category);
  }

  purchasedCategories.forEach(cat => {
    const complementary = COMPLEMENTARY_MAP[cat] || [];
    complementary.forEach(compCat => {
      if (purchasedCategories.has(compCat)) return;
      const product = products.find(p => p.category === compCat && !purchasedProductIds.has(p.id));
      if (product) {
        suggestions.push({
          type: 'complementary',
          product,
          reason: `Cliente compra ${cat} mas nunca comprou ${compCat}. Boa oportunidade!`,
        });
      }
    });
  });

  return suggestions.slice(0, 5);
}

export async function getSuggestionsForClient(clientId: string): Promise<Suggestion[]> {
  const [orders, products] = await Promise.all([
    getOrdersByClientId(clientId),
    getProducts(),
  ]);
  return buildSuggestions(orders, products);
}

// --- DASHBOARD STATS ---

async function getMonthlyMetrics(): Promise<{ revenue: number; orderCount: number }> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartIso = monthStart.toISOString().split('T')[0];

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('total')
      .gte('date', monthStartIso)
      .eq('status', 'completed');

    if (error || !data) return { revenue: 0, orderCount: 0 };
    return {
      revenue: data.reduce((sum, o: { total: number }) => sum + Number(o.total), 0),
      orderCount: data.length,
    };
  }

  const monthlyOrders = mockOrders.filter(o => o.date >= monthStartIso && o.status === 'completed');
  return {
    revenue: monthlyOrders.reduce((sum, o) => sum + o.total, 0),
    orderCount: monthlyOrders.length,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // Busca tudo em paralelo, sem N+1.
  const [clients, products, allOrders, monthly] = await Promise.all([
    getClients(),
    getProducts(),
    getAllOrdersWithItems(),
    getMonthlyMetrics(),
  ]);

  const activeClients = clients.filter(c => c.status === 'active');
  const coolingClients = clients.filter(c => c.status === 'cooling');
  const inactiveClients = clients.filter(c => c.status === 'inactive');

  const contactToday = [...clients]
    .filter(c => c.priority === 'high' || c.status === 'cooling' || c.status === 'inactive')
    .sort((a, b) => {
      const order = { inactive: 0, cooling: 1, active: 2 } as const;
      return order[a.status] - order[b.status];
    })
    .slice(0, 8);

  // Agrupa pedidos por cliente uma única vez.
  const ordersByClient = new Map<string, Order[]>();
  for (const o of allOrders) {
    const arr = ordersByClient.get(o.client_id) ?? [];
    arr.push(o);
    ordersByClient.set(o.client_id, arr);
  }

  const opportunities: DashboardStats['opportunities'] = [];
  for (const client of clients) {
    if (client.status === 'inactive') continue;
    if (opportunities.length >= 6) break;
    const orders = ordersByClient.get(client.id) ?? [];
    const suggestions = buildSuggestions(orders, products);
    if (suggestions.length === 0) continue;
    opportunities.push({
      client,
      suggestion: suggestions[0].reason,
      estimated_value: suggestions[0].product.price * 3,
    });
  }

  return {
    total_clients: clients.length,
    active_clients: activeClients.length,
    cooling_clients: coolingClients.length,
    inactive_clients: inactiveClients.length,
    total_revenue_month: monthly.revenue,
    total_orders_month: monthly.orderCount,
    contact_today: contactToday,
    opportunities,
  };
}

export function personalizeMessage(
  template: string,
  client: Client,
  product?: Pick<Product, 'name'>
): string {
  const daysSince = daysSinceDate(client.last_purchase);
  return template
    .replace(/{nome}/g, client.name.split(' ')[0])
    .replace(/{tempo_sem_comprar}/g, String(daysSince))
    .replace(/{company}/g, client.company)
    .replace(/{produto}/g, product?.name ?? 'seus produtos preferidos');
}
