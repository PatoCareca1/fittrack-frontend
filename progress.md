# Progress — fittrack-frontend

Última atualização: 2026-07-01

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

## O que falta / decisões pendentes

1. **Backend `professional` não existe.** `fittrack-backend/apps/` hoje só tem `users`,
   `body`, `workouts`, `diet`. Sem esse app (vínculo aluno-profissional, atribuições,
   `GET /professional/students/` etc.), o painel não tem API real para consumir.
2. **Sem guarda de autenticação nas rotas do painel** — `/dashboard` e as demais são
   acessíveis direto, sem checar token. Precisa de um middleware ou layout guard antes
   de ir para produção.
3. **Estratégia de sessão no web não é definitiva.** Hoje é `localStorage` (simples,
   mas exposto a XSS). Decisão em aberto: cookie httpOnly via route handler proxy no
   Next.js vs. manter `localStorage` com mitigação (CSP, sanitização). Precisa alinhar
   com Amanda (backend) antes de implementar de vez.
4. Sem testes automatizados ainda (RNF07 pede cobertura mínima de 50% no mobile / 70%
   no backend — o painel web não tem meta definida nos documentos, mas não tem nenhum
   teste hoje).
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
