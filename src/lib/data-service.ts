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
      status: c.computed_status as any, // Usa a view do SQL
    }));
  }

  // Fallback para Mock
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
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    return data || [];
  }
  return mockOrders.filter(o => o.client_id === clientId);
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

  const index = mockCampaigns.findIndex((c: any) => c.id === id);
  if (index === -1) return undefined;
  mockCampaigns[index] = { ...mockCampaigns[index], ...updates };
  return mockCampaigns[index];
}

export async function sendMessage(clientId: string, content: string, campaignId?: string): Promise<Message> {
  const client = await getClientById(clientId);
  
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('messages').insert({
      client_id: clientId,
      client_name: client?.name || 'Desconhecido',
      campaign_id: campaignId || null,
      content,
      status: 'sent'
    }).select().single();

    if (error) throw error;
    return data;
  }

  // Mock
  return {
    id: `m${Date.now()}`,
    client_id: clientId,
    client_name: client?.name || 'Desconhecido',
    campaign_id: campaignId || null,
    content,
    status: 'sent',
    sent_at: new Date().toISOString(),
  };
}

// --- SUGESTÕES INTELIGENTES ---

export async function getSuggestionsForClient(clientId: string): Promise<Suggestion[]> {
  const orders = await getOrdersByClientId(clientId);
  const suggestions: Suggestion[] = [];

  if (orders.length === 0) return suggestions;

  const purchasedProductIds = new Set<string>();
  orders.forEach(order => {
    order.items.forEach(item => {
      purchasedProductIds.add(item.product_id);
    });
  });

  const lastOrder = [...orders].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  for (const item of lastOrder.items) {
    const product = await getProductById(item.product_id);
    if (product) {
      const daysSince = daysSinceDate(lastOrder.date);
      if (daysSince >= product.replenishment_days * 0.7) {
        suggestions.push({
          type: 'replenishment',
          product,
          reason: `Última compra há ${daysSince} dias. Reposição estimada: ${product.replenishment_days} dias.`,
        });
      }
    }
  }

  const allProducts = await getProducts();
  const complementaryMap: Record<string, string[]> = {
    'Banho': ['Tratamento', 'Perfumaria', 'Tosa'],
    'Tratamento': ['Banho', 'Tosa'],
    'Tosa': ['Banho', 'Tratamento'],
    'Perfumaria': ['Banho'],
    'Kits': [],
  };

  const purchasedCategories = new Set<string>();
  for (const pid of Array.from(purchasedProductIds)) {
    const p = await getProductById(pid);
    if (p) purchasedCategories.add(p.category);
  }

  purchasedCategories.forEach(cat => {
    const complementary = complementaryMap[cat] || [];
    complementary.forEach(compCat => {
      if (!purchasedCategories.has(compCat)) {
        const product = allProducts.find((p: any) => p.category === compCat && !purchasedProductIds.has(p.id));
        if (product) {
          suggestions.push({
            type: 'complementary',
            product,
            reason: `Cliente compra ${cat} mas nunca comprou ${compCat}. Boa oportunidade!`,
          });
        }
      }
    });
  });

  return suggestions.slice(0, 5);
}

// --- DASHBOARD STATS ---

export async function getDashboardStats(): Promise<DashboardStats> {
  const clients = await getClients();
  const activeClients = clients.filter(c => c.status === 'active');
  const coolingClients = clients.filter(c => c.status === 'cooling');
  const inactiveClients = clients.filter(c => c.status === 'inactive');

  const contactToday = [...clients]
    .filter(c => c.priority === 'high' || c.status === 'cooling' || c.status === 'inactive')
    .sort((a, b) => {
      const statusOrder = { inactive: 0, cooling: 1, active: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    })
    .slice(0, 8);

  const opportunities: DashboardStats['opportunities'] = [];
  for (const client of clients.filter(c => c.status !== 'inactive').slice(0, 15)) {
    const suggestions = await getSuggestionsForClient(client.id);
    if (suggestions.length > 0) {
      opportunities.push({
        client,
        suggestion: suggestions[0].reason,
        estimated_value: suggestions[0].product.price * 3,
      });
    }
  }

  // No Supabase real, isso seria uma query agregada por performance
  const totalRevenue = isSupabaseConfigured 
    ? 24500.50 // Placeholder para MVP se usar Supabase
    : mockOrders.reduce((sum, o) => sum + o.total, 0);

  return {
    total_clients: clients.length,
    active_clients: activeClients.length,
    cooling_clients: coolingClients.length,
    inactive_clients: inactiveClients.length,
    total_revenue_month: totalRevenue,
    total_orders_month: 42, 
    contact_today: contactToday,
    opportunities: opportunities.slice(0, 6),
  };
}

export function personalizeMessage(template: string, client: Client): string {
  // Nota: Esta função permanece síncrona pois usa dados já carregados do cliente
  const daysSince = daysSinceDate(client.last_purchase);
  return template
    .replace(/{nome}/g, client.name.split(' ')[0])
    .replace(/{tempo_sem_comprar}/g, String(daysSince))
    .replace(/{company}/g, client.company);
}
