# Deploy na Vercel

O projeto está preparado para Vercel como uma SPA React/Vite com uma função Node.js para a API Express/tRPC.

## Configuração

- **Build Command:** `pnpm build:vercel`
- **Output Directory:** `dist/public`
- **Função API:** `api/[...path].ts`
- **Runtime:** Node.js 22
- **Fallback SPA:** configurado em `vercel.json`

## Variáveis de ambiente

Configure no projeto Vercel as variáveis usadas pelo backend, especialmente:

- `DATABASE_URL` — conexão MySQL compatível com Drizzle;
- `MILLENIUM_ADMIN_CODE` — código do painel administrativo (o código padrão do desenvolvimento não deve ser usado em produção);
- variáveis `MANUS_*` — necessárias somente se o login OAuth da plataforma for utilizado no deploy.

O banco precisa ter as migrações Drizzle aplicadas antes de receber candidaturas. O frontend continua chamando `/api/trpc` no mesmo domínio, sem CORS adicional.
