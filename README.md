# TaskFlow - Gerenciador de Tarefas

Um gerenciador de tarefas feito para portfolio e uso pessoal. O foco esta em UX, engenharia e deploy rapido, com uma visao Kanban e modo lista, filtros inteligentes, autenticacao segura e integracao completa com Supabase.

![Preview](https://placehold.co/1200x700/png?text=TaskFlow+Preview)

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth + RLS)
- Zod + React Hook Form
- Playwright (e2e) e Vitest (unit)

## Funcionalidades

- Cadastro, login e logout com Supabase Auth
- CRUD de projetos e tarefas
- Kanban (Todo / Doing / Done) e modo lista
- Atualizacao rapida de status via botoes (drag & drop opcional)
- Filtros por status, prioridade, projeto e vencidas
- Busca por titulo e descricao
- Estados de loading/empty/error e toasts

## Setup local

1. Instale as dependencias:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha com suas chaves do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Rode o SQL no Supabase (ver `supabase.sql`) para criar tabelas e politicas RLS.

5. Inicie o projeto:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Supabase (SQL + RLS)

O arquivo `supabase.sql` inclui:

- tabelas `projects` e `tasks`
- constraints e defaults
- trigger de `updated_at`
- RLS ativado com policies para restringir acesso ao usuario autenticado

## Estrutura

```
src/
  app/              # rotas (App Router)
  components/       # UI e componentes de dominio
  lib/              # supabase, validacoes, helpers
  services/         # chamadas fetch para API
```

## API (Route Handlers)

Endpoints principais em `src/app/api`:

- `GET/POST /api/projects`
- `PATCH/DELETE /api/projects/:id`
- `GET/POST /api/tasks`
- `PATCH/DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

Todos retornam o formato padrao:

```json
{ "success": true, "data": {} }
```

ou

```json
{ "success": false, "error": { "message": "..." } }
```

## Testes

Unit tests:

```bash
npm run test:unit
```

E2E (Playwright):

```bash
E2E_EMAIL=seu@email.com E2E_PASSWORD=suasenha npm run test:e2e
```

## Deploy na Vercel

1. Crie um projeto na Vercel e conecte o repositorio.
2. Configure as variaveis de ambiente do Supabase.
3. Deploy.

## PWA (instalavel no celular)

O app ja inclui `manifest.webmanifest` e icones em `public/icons`. Para instalar:

- Android/Chrome: abra o site e use "Adicionar a tela inicial".
- iOS/Safari: Share -> "Add to Home Screen".

Observacao: os icones sao SVG. Para suporte maximo (especialmente iOS), substitua por PNGs 192x192 e 512x512.

## Decisoes de arquitetura

- API server-side com Route Handlers para proteger RLS e manter respostas padronizadas.
- Validacao com Zod no client e no server, garantindo consistencia.
- Camadas claras: `lib` para infraestrutura, `services` para API client, `components` para UI.
- Supabase Auth integrado no middleware para proteger rotas.

## Proximos passos (sugestoes)

- Drag & drop no Kanban com @dnd-kit
- Notificacoes para tarefas vencidas
- Tags e etiquetas por projeto
