@AGENTS.md

# Log Dog — notas para o agente

## Páginas além do `executar.md`

O spec original lista: `/dashboard`, `/clients`, `/clients/[id]`, `/campaigns`, `/send`.
O projeto adiciona duas páginas extras (úteis no MVP, mantidas intencionalmente):

- `/products` — catálogo navegável de produtos. Usado para conferir SKUs e preços
  antes de registrar um pedido manualmente. Hoje é só leitura.
- `/settings` — preferências do usuário e status da conexão Supabase. Hoje é
  majoritariamente UI placeholder (não persiste alterações ainda).

## Auth e dados

- Auth é client-side via `@supabase/supabase-js` + `useAuth()` (`src/lib/auth-context.tsx`).
  O gate em `src/app/(app)/layout.tsx` redireciona para `/login` se não houver sessão.
- Em modo dev sem Supabase configurado, `AuthProvider` injeta um `MOCK_USER` para
  não bloquear o fluxo.
- A real proteção de dados vem do RLS em `supabase/schema.sql` — sem login,
  nenhuma query passa, mesmo se o gate no layout for burlado.

## Banco

- IDs são `uuid` em todas as tabelas. O seed usa UUIDs literais determinísticos
  só pra manter as relações legíveis; em produção o `DEFAULT gen_random_uuid()`
  cuida disso.
- `messages.client_name` foi removido — use a view `messages_with_client` se
  precisar do nome via JOIN.
- Roda `seed.sql` pelo SQL editor do Supabase (role `postgres`, bypassa RLS) ou
  via service_role key. A anon key não funciona ali.
