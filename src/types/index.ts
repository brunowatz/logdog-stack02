// ============================================
// TIPOS DO SISTEMA LOG DOG
// ============================================

export type ClientStatus = 'active' | 'cooling' | 'inactive';

export interface Client {
  id: string;
  name: string;
  company: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  last_purchase: string; // ISO date
  total_orders: number;
  total_spent: number;
  status: ClientStatus;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  replenishment_days: number; // dias médios para reposição
}

export interface Order {
  id: string;
  client_id: string;
  date: string;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export type CampaignType = 'promotion' | 'replenishment' | 'launch';

export interface Campaign {
  id: string;
  title: string;
  type: CampaignType;
  description: string;
  template: string;
  image_url: string;
  target_status: ClientStatus[];
  created_at: string;
  is_active: boolean;
}

export interface Message {
  id: string;
  client_id: string;
  campaign_id: string | null;
  content: string;
  status: 'sent' | 'pending' | 'failed';
  sent_at: string;
  // Vem da view messages_with_client (JOIN), não da tabela.
  client_name?: string;
  client_company?: string;
}

export interface Suggestion {
  type: 'replenishment' | 'complementary';
  product: Product;
  reason: string;
}

export interface DashboardStats {
  total_clients: number;
  active_clients: number;
  cooling_clients: number;
  inactive_clients: number;
  total_revenue_month: number;
  total_orders_month: number;
  contact_today: Client[];
  opportunities: Array<{
    client: Client;
    suggestion: string;
    estimated_value: number;
  }>;
}
