import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured: boolean = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseUrl.includes('.')
);

// Em produção, o fallback silencioso para mock é um risco de divergência.
// Avisamos no console do browser, sem quebrar build/prerender.
if (
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'production' &&
  !isSupabaseConfigured
) {
  // eslint-disable-next-line no-console
  console.error(
    '[Log Dog] Supabase não está configurado em produção. ' +
      'Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'O app está usando dados mock — NÃO use assim em produção.'
  );
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
