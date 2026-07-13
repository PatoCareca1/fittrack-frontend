# Progress — fittrack-frontend

Última atualização: 2026-07-13

## Papel deste repo

Painel web (Next.js) para profissionais (personal trainers e nutricionistas) — ver
`README.md` seção 2 e `FitTrack_Decisoes_v2.pdf` seções 1 e 6.2 para o inventário
completo de telas. O app mobile (Flutter) e o backend (Django) vivem em repos
separados (`fittrack-mobile`, `fittrack-backend`).

## O que já está pronto

### Login Profissional (Web01) — `/login`
- Layout split (proposta de valor à esquerda + form à direita) em desktop, empilhado
  mobile-first em telas estreitas.
- Ligado de verdade ao backend: `POST /api/v1/auth/login/` via `src/lib/api.ts`.
- Guarda tokens em `localStorage` (`src/lib/auth.ts`) — solução provisória, ver
  pendências abaixo.

### Painel autenticado — route group `(panel)`
Sidebar fixa de 200px no desktop, drawer com hambúrguer no mobile
(`src/components/panel/PanelShell.tsx`). Itens de navegação: Dashboard, Meus Alunos,
Templates, Chat, Relatórios.

| Tela | Rota | Status |
|---|---|---|
| Dashboard Profissional (Web02) | `/dashboard` | Pronta — métricas + tabela de alunos (vira cards em mobile) |
| Meus Alunos | `/alunos` | Pronta — reaproveita o mesmo `StudentList` do dashboard |
| Perfil Completo do Aluno (Web03) | `/alunos/[id]` | Pronta — header + tabs Evolução (gráficos 2x2 em SVG próprio) / Treinos / Dieta / Histórico / Chat |
| Editor de Treino (Web04) | `/alunos/[id]/treinos/[workoutId]` | Pronta — lista reordenável (drag&drop nativo + botões ▲▼ em touch) + biblioteca lateral filtrável |
| Editor de Plano Alimentar (Web05) | `/alunos/[id]/dieta/[planId]` | Pronta — grid de refeições, macro total em tempo real, busca inline de alimento |
| Templates | `/templates` | Placeholder "em construção" — sem especificação de conteúdo nos PDFs ainda |
| Relatórios | `/relatorios` | Placeholder "em construção" — idem |
| Chat (lista agregada) | `/chat` | Extra não numerado no Web01-05; lista conversas e linka para a aba Chat do aluno |

Todos os dados de aluno, treino, dieta e chat vêm de `src/lib/mock-data.ts` — não há
API real por trás dessas telas ainda (só o login consome o backend de verdade).

### Sessão 2026-07-13 — lacunas obrigatórias do brief (contexto do protótipo web aprovado)

Chegou o protótipo dedicado do painel web (`FitTrack - Painel Profissional.html`,
`.dc` do Claude Design). As telas existentes já batiam estruturalmente com ele; o escopo
desta sessão foi **só as peças que faltavam** (as telas em si não foram reescritas):

- **Contexto Personal (verde) vs Nutricionista (azul)** — dirigido por `account_type`.
  - `src/lib/account.ts` (módulo puro): `getAccountType()` lê `localStorage`
    (`fittrack_account_type`), default vindo da persona mock; derivações puras de rótulo
    (`studentsNavLabel` "Meus Alunos"/"Meus Pacientes", `studentNoun`, `newStudentLabel`),
    cor (`badgeColor`, `accentHex`) e credencial (`credentialPrefix` CREF/CRN).
  - `AccountProvider` (`src/components/panel/AccountProvider.tsx`) resolve o tipo no
    cliente sem mismatch de hidratação (default no 1º render, `localStorage` no `useEffect`).
  - Accent contextual via CSS var `--color-context-accent` (verde default; azul em
    `[data-account-type="nutritionist"]`, setado no root do `PanelShell`). O item ativo da
    Sidebar aplica a var por **style inline** (não por utilitário Tailwind — um token
    `@theme` auto-referente gera utilitário de forma inconsistente entre dev e prod).
  - Sidebar (label), footer (nome/credencial/cor do badge via `resolveProfessional`) e os
    títulos de Dashboard/Meus Alunos passam a refletir o contexto.
- **Guarda de rota do painel** — `RequireAuth` (`src/components/panel/RequireAuth.tsx`)
  envolve o `(panel)/layout.tsx`; sem access token → `router.replace("/login")`. MVP
  client-side (token em `localStorage`); decisão de sessão httpOnly segue em aberto.
- **Testes (RNF07, meta 50%)** — Vitest + jsdom + Testing Library. Lógica extraída para
  módulos puros e testada: `src/lib/{account,macros,workout}.ts`, `adherenceLevel`/
  `resolveProfessional` (mock-data), `auth`, `api`, e render de `AdherenceBadge`.
  `npm run coverage` → 33 testes, ~98% de statements (bem acima de 50%). `vitest.setup.ts`
  instala um polyfill de `localStorage` (jsdom aqui tem origem opaca e não o expõe).
- **Login** — botão "Continuar com Google" **visual-only** (desabilitado; backend só tem
  JWT e-mail/senha, README §4.5) + link placeholder "Criar conta profissional". Persiste
  `account_type` do login quando o backend passar a devolvê-lo (`api.ts` já aceita o campo).

Scripts novos: `npm run test`, `npm run test:watch`, `npm run coverage`.
Nota: o `claude_design` MCP (`/design-login`) não roda em sessão não-interativa; o `.dc`
local foi usado como fonte de verdade visual.

## O que falta / decisões pendentes

1. **Backend `professional` existe desde 2026-07-02** (vínculo por convite,
   `GET /professional/students/`, atribuição de treino — ver
   `fittrack-backend/progress.md`). Próximo passo aqui: substituir o mock do
   dashboard/lista de alunos por chamadas reais via `src/lib/api.ts`. O app `diet` também
   existe desde 2026-07-03 (planos aninhados, busca TACO, atribuição de dieta via
   `/professional/diet-assignments/`) — o editor de plano alimentar (Web05) já tem
   API real para consumir.
2. ~~**Sem guarda de autenticação nas rotas do painel**~~ — ✅ resolvido em 2026-07-13
   (`RequireAuth` no `(panel)/layout.tsx`). Ainda é guard client-side; para produção,
   avaliar `middleware`/cookie httpOnly junto do item 3.
3. **Estratégia de sessão no web não é definitiva.** Hoje é `localStorage` (simples,
   mas exposto a XSS). Decisão em aberto: cookie httpOnly via route handler proxy no
   Next.js vs. manter `localStorage` com mitigação (CSP, sanitização). Precisa alinhar
   com Amanda (backend) antes de implementar de vez.
4. ~~Sem testes automatizados ainda~~ — ✅ resolvido em 2026-07-13 (Vitest, 33 testes,
   ~98% de cobertura nos módulos de lógica; meta de 50% atingida com folga). Próximo:
   ampliar para os componentes de tela conforme forem ligados à API real.
5. `/templates` e `/relatorios` não têm conteúdo especificado no
   `FitTrack_Decisoes_v2.pdf` (só aparecem citados na estrutura da sidebar) — ficaram
   como placeholder até existir uma decisão de produto sobre o que exibem.

## Decisões/simplificações tomadas durante o desenvolvimento

- Next.js 16 + React 19 + Tailwind v4 (config CSS-first via `@theme`, sem
  `tailwind.config.js`).
- `params` e `searchParams` são `Promise` nas páginas — breaking change do App Router
  nesta versão (ver `node_modules/next/dist/docs/01-app/` antes de mexer em rotas).
- Drag & drop do Editor de Treino usa HTML5 nativo (`draggable`, sem lib externa) +
  botões ▲▼ como fallback, já que drag & drop nativo não é confiável em touch.
- Gráficos de evolução são um `LineChart` em SVG próprio
  (`src/components/panel/LineChart.tsx`) — decisão consciente de não adicionar uma lib
  de charts para 4 gráficos simples.
- Cada aluno mockado tem no máximo 1 treino + 1 plano atribuído; alunos sem plano
  mostram um empty state (cobre o caso real de "ainda não atribuído" sem inflar o mock).

## Como retomar

1. Ler `README.md` (contexto completo do produto) e, se precisar revalidar escopo do
   painel, `FitTrack_Decisoes_v2.pdf` seção 6.2 (inventário de telas web).
2. `npm run dev` — se a porta 3000 estiver ocupada por outro processo na máquina, o
   Next sobe sozinho em 3001.
3. Próximo passo natural é escolher entre: (a) implementar o app `professional` no
   `fittrack-backend` para o painel parar de depender de mock, ou (b) fechar a decisão
   de sessão/auth (item 3 acima) e adicionar o guard de rotas antes de seguir com mais
   telas.
