# Plano — Millenium Middleman

## Objetivo
Criar um site responsivo para o servidor de Discord **millenium**, com uma página pública de apresentação e candidatura ao cargo de Middleman, além de uma área administrativa protegida pelo código `99!-@Mulra`.

## Produto e fluxos
- A página pública explica o programa de Middleman, responsabilidades, critérios e processo de análise.
- O formulário coleta ID/tag do Discord, idade/faixa etária, experiência, disponibilidade, motivação, confiança, cenários de conflito, referências e informações adicionais.
- Ao enviar, a candidatura é validada, persistida no banco e confirmada com um protocolo.
- A aba Admin começa bloqueada; o código correto libera o painel administrativo no cliente e autoriza as consultas administrativas no servidor.
- O painel mostra cargos de Middleman, lista de Middlemen cadastrados e candidaturas recebidas, com filtro por status e possibilidade de atualizar o status.
- A primeira versão não acessa a API do Discord; o modelo de dados e os endpoints deixam a integração futura possível.

## Arquitetura
- **Frontend:** React + Vite + Tailwind no starter `web-db-user`, com navegação de uma única página e painel condicional.
- **Backend:** Express + tRPC, com procedimentos públicos para candidatura e procedimentos de painel protegidos por validação de código.
- **Persistência:** MySQL gerenciado via Drizzle. Tabelas `middlemanRoles`, `middlemen` e `applications`, mantendo `users` do starter.
- **Fallback de desenvolvimento:** se a conexão ainda não estiver disponível, o frontend mantém candidaturas de demonstração localmente para permitir visualizar a experiência; o envio real comunica erro quando a API não consegue persistir.
- **Segurança:** o código é validado no servidor; o frontend não decide sozinho se o painel está autorizado. O código padrão é o fornecido pelo proprietário e pode ser substituído por `MILLENIUM_ADMIN_CODE` em ambiente protegido.

## Design e identidade
- Direção aprovada: **Terminal de Confiança**.
- Base escura azul-petróleo, acentos verde-luminoso, cartões delimitados e tipografia Space Grotesk.
- Símbolo próprio: monograma geométrico M + escudo, usado no cabeçalho e favicon.
- Layout com hero assimétrico, indicadores de confiança, formulário em cartões e painel com densidade operacional.

## Rotas e entrega
- `/` — página pública e formulário de candidatura.
- `/admin` — aba de administração dentro da mesma aplicação, com autenticação por código.
- `/404` — fallback do starter.
- `/manus-routes.json` — manifesto estático exigido pelo WebDev.
- Desenvolvimento e publicação usam frontend estático servido pelo Express e API em `/api/trpc`; `/api/health` é o health check. As respostas de candidaturas e do painel são privadas e não devem ser compartilhadas em cache.

## Verificação
- `pnpm check` para TypeScript.
- `pnpm test` para os testes existentes e novos testes de validação do domínio, se necessários.
- `pnpm build` para garantir frontend e servidor compiláveis.
- Verificação HTTP do `/api/health` e `/manus-routes.json` com o servidor em execução.
