# FitTrack

App mobile Android de acompanhamento integrado de dieta e treino, com painel web para
profissionais (personal trainers e nutricionistas) e módulo futuro de análise de
proporções corporais por IA (em standby, sem prazo).

Este README é o contexto de referência para desenvolvimento assistido por IA (Claude
Code). Fonte de verdade: `FitTrack_Documento_de_Requisitos_v1.pdf` e
`FitTrack_Decisoes_v2.pdf`. Qualquer conflito entre este documento e os PDFs deve ser
resolvido a favor dos PDFs — sinalize a divergência antes de prosseguir.

**Protótipo visual aprovado:** `FitTrack_-_Protótipo.html` (gerado no Claude Design).
Use-o como fonte de verdade para layout, hierarquia visual e microcopy em pt-BR de cada
tela. Trate-o como referência estática de UI — não como especificação de arquitetura de
código.

---

## 1. Visão geral do produto

O FitTrack centraliza dieta e treino em um único app. Atende dois públicos:
- **Usuários autônomos** que gerenciam sua própria rotina.
- **Usuários vinculados** a um personal trainer e/ou nutricionista, que recebem planos
  atribuídos por esses profissionais (somente leitura na estrutura, editável na
  execução).

Posicionamento: ponto intermediário entre apps casuais (foco único em calorias ou
treino) e plataformas profissionais complexas. Diferencial: dieta + treino +
acompanhamento profissional opcional na mesma ferramenta.

Contexto de negócio: o produto nasce como ferramenta de uso pessoal do fundador, sem
urgência de monetização, mas a arquitetura já contempla multi-usuário, vínculo
profissional-aluno e freemium desde o início — **não projetar como single-user**.

**Fase atual do projeto:** 4 — Desenvolvimento (Bloco 1: Fundação).
Fases 1 (Descoberta), 2 (Planejamento) e 3 (Design) estão concluídas.

---

## 2. Plataformas

| Plataforma | Stack | Público | Responsável |
|---|---|---|---|
| Mobile Android | Flutter/Dart | Usuário final + profissional em campo | Rafael |
| Painel Web | Next.js + React | Profissional no computador (dashboard de alunos, editor de treino/dieta, atribuição de planos) | Carlos |
| Backend | Django 5 + DRF | API REST única consumida por mobile e web | Amanda |
| Admin/Backoffice | Django Admin nativo | Gestão de usuários, alimentos, exercícios | Amanda |
| IA/ML (standby) | Python (TensorFlow, PyTorch, MediaPipe, OpenCV) | Análise de proporções corporais — desenvolvimento paralelo, sem prazo, sem dependência do roadmap principal | Pedro |

Web e mobile consomem a **mesma API REST** e compartilham o mesmo design system —
manter paridade de cores e tokens entre as duas plataformas.

---

## 3. Stack técnica completa

| Camada | Tecnologia | Observação |
|---|---|---|
| Mobile | Flutter / Dart | Android-first (API 26+), portabilidade iOS futura |
| State management | **Riverpod 2.x** | Decisão definitiva — Bloc foi descartado. `riverpod_generator` para code gen |
| Backend | Django 5 + DRF | Apps modulares por domínio |
| Banco | PostgreSQL | Índices compostos em tabelas de log/histórico |
| Cache / Filas | Redis + Celery | Broker + cache de queries frequentes |
| Painel Web | Next.js + React | Mesmo design system do mobile |
| Autenticação | JWT (SimpleJWT) | Access token 15min, refresh token persistente |
| Storage | S3-compatible (R2/Spaces) | Fotos de perfil e futuras fotos para IA |
| Push | Firebase Cloud Messaging | Padrão Android |
| Observabilidade | Sentry + logs estruturados | Desde o início, mobile e backend |
| Infra inicial | Railway ou Render | Migração para AWS/GCP ao escalar |
| IA/ML | Python — TensorFlow, PyTorch, MediaPipe, OpenCV | Standby, worker Celery dedicado (`ai_processing`) |

---

## 4. Arquitetura Backend (Django)

### 4.1 Estrutura de pastas

```
fittrack-backend/
  config/                  # projeto Django
    settings/base.py, dev.py, prod.py, test.py
    celery.py, urls.py, wsgi.py, asgi.py
  apps/                    # domínios de negócio
    users/                 # User, Profile, JWT auth
    body/                  # BodyMetric, cálculo TMB/macros
    workouts/               # Exercise, Workout, Session, SetLog
    diet/                  # Food, MealPlan, Meal, MealItem, MealLog
    professional/           # ProfessionalLink, Assignments, Verification
    chat/                   # ChatMessage, WebSocket consumer
    notifications/           # FCM, push, in-app
    core/                    # base models, mixins, exceptions, permissions
    shared/                  # pagination, throttles, middleware, utils
  tests/
```

### 4.2 Padrão interno por app (obrigatório em todos os apps)

Views **finas** — só validam, autorizam e serializam. Regra de negócio **nunca** em
views; vive em `services.py`. Queries complexas ficam em `selectors.py`.

```
apps/workouts/
  models.py       # ORM
  serializers.py   # DRF serializers
  views.py         # ViewSets (finos)
  services.py      # regras de negócio (NÃO em views)
  selectors.py     # queries complexas / aggregates
  tasks.py         # Celery tasks
  admin.py         # Django Admin customizado
  filters.py       # django-filter
  permissions.py   # permissões específicas
  urls.py
  signals.py
  migrations/
  tests/           # factories.py, test_models.py, test_services.py, test_views.py
```

### 4.3 Dependências principais

```
djangorestframework
djangorestframework-simplejwt   # JWT auth (access 15min + refresh)
django-cors-headers             # CORS para mobile e web
drf-spectacular                 # OpenAPI/Swagger automático
django-filter
celery[redis]
django-celery-beat              # tasks agendadas (sync TACO/OFF, notificações)
django-channels + daphne        # WebSocket para chat em tempo real
psycopg[binary]
django-storages + boto3         # S3-compatible para mídias
python-decouple                 # variáveis de ambiente (.env)
factory-boy + pytest-django     # testes
sentry-sdk
pillow
```

### 4.4 Decisões de banco de dados

- `User` customizado herdando `AbstractUser`, com campo `account_type`
  (`USER` / `TRAINER` / `NUTRITIONIST`).
- Soft delete em entidades sensíveis: `is_active` + `deleted_at`.
- Índices compostos `(user_id, created_at)` em todas as tabelas de log/histórico.
- Campos JSON para dados flexíveis (ex.: `Food.nutritional_data`).
- `BodyMetric` e `WorkoutSession` particionáveis por data ao escalar.

### 4.5 Endpoints principais (versionados em `/api/v1/`)

```
POST   /auth/register/                       Cadastro (usuário, personal, nutricionista)
POST   /auth/login/                          Login — retorna access + refresh JWT
POST   /auth/refresh/                        Renovar access token
POST   /auth/logout/                         Logout — invalida refresh token
GET/PATCH  /me/                              Perfil do usuário autenticado
GET/POST   /me/body-metrics/                 Histórico e nova medição de bioimpedância
GET/POST   /workouts/                        Listar e criar treinos
GET/PATCH/DELETE  /workouts/{id}/            Detalhe, editar, excluir treino
POST   /workouts/{id}/start-session/         Iniciar sessão de treino
PATCH  /workout-sessions/{id}/log-set/       Registrar série concluída
POST   /workout-sessions/{id}/finish/        Finalizar sessão
GET    /diet/foods/?q=                       Busca unificada TACO + Open Food Facts
GET/POST   /diet/meal-plans/                 Planos alimentares
POST   /diet/meals/{id}/mark-done/           Marcar refeição como concluída
POST   /professional/links/invite/           Profissional envia convite a usuário
POST   /professional/assignments/            Atribuir treino ou dieta a aluno
GET    /professional/students/               Lista de alunos vinculados (só profissionais)
GET/POST   /chat/threads/{id}/messages/      Mensagens do chat (REST + WebSocket)
```

### 4.6 Tarefas Celery

- Recálculo de macros quando `BodyMetric` é atualizado.
- Push notifications: lembrete de refeição, treino, novo plano atribuído, mensagem do
  profissional.
- Sync incremental TACO + Open Food Facts (cron via `django-celery-beat`).
- Worker dedicado `ai_processing` (reservado para o módulo de IA — standby).

---

## 5. Arquitetura Mobile (Flutter)

### 5.1 State management: Riverpod 2.x (decisão final, não reverter)

Motivos: menos boilerplate, compile-safety nativa, code generation com
`riverpod_generator`, curva menor para dev solo.

### 5.2 Estrutura de pastas — Feature-First + Clean Architecture por feature

Cada feature contém suas três camadas (`data` / `domain` / `presentation`) de forma
independente. Mexer em `workouts` não deve tocar em `diet`.

```
fittrack-mobile/lib/
  core/
    config/          # env, constants
    network/          # Dio, interceptors, JWT refresh automático
    storage/           # Hive (offline), flutter_secure_storage (JWT)
    error/              # Failures, Exceptions padronizados
    router/              # go_router — rotas declarativas
    theme/                # ThemeData, tokens do design system
    widgets/               # widgets compartilhados entre features
  features/
    auth/               # login, cadastro, recuperação
    profile/             # perfil, dados físicos
    body_metrics/         # bioimpedância, histórico, gráficos
    workouts/              # criação, listagem, templates
    workout_session/        # execução (feature separada — lógica complexa)
    diet/                     # plano alimentar, busca de alimentos
    dashboard/                 # tela inicial, resumo diário
    professional/                # vínculo, convite, área do profissional
    chat/                          # chat profissional-aluno
  l10n/                             # i18n pt-BR
```

Padrão de feature (ex.: `workout_session/`):
`data/` (datasources remote+local, models freezed, repository impl) · `domain/`
(entities, repository abstract, usecases) · `presentation/` (providers Riverpod,
screens, widgets).

### 5.3 Pacotes essenciais

```
flutter_riverpod + riverpod_annotation + riverpod_generator   # state management + code gen
freezed + json_serializable + build_runner                     # models imutáveis + JSON
dio                                                              # HTTP client com JWT refresh automático
go_router                                                        # routing declarativo type-safe
hive + hive_flutter                                              # cache local + sessão offline-first
flutter_secure_storage                                            # armazenar JWT com segurança
fl_chart                                                          # gráficos de evolução corporal e carga
reorderable_list / reorderable_grid_view                          # drag and drop de exercícios
firebase_messaging                                                 # FCM — notificações push
connectivity_plus                                                   # detectar conexão para sync offline
flutter_local_notifications                                         # timer de descanso com notificação local
sentry_flutter                                                       # observabilidade mobile
image_picker + image_cropper                                         # foto de perfil + futuras fotos IA
permission_handler                                                     # permissões Android
intl                                                                     # formatação datas/números pt-BR
```

### 5.4 Estratégia offline-first (execução de treino) — regra crítica

**O app nunca pode travar na academia.** Toda sessão de treino é gravada em Hive em
tempo real durante a execução. Sincronização com backend ocorre em background quando a
conexão retorna (`connectivity_plus`). Se o app crashar, ao reabrir o use case
`resume_pending_session` detecta sessão pendente e oferece retomada. O usuário nunca
perde dados de treino por falta de sinal.

### 5.5 Dark mode

Obrigatório desde o início (não é opcional/toggle apenas — é o padrão funcional dado o
uso prolongado de tela na academia). Definido em `ThemeData` com os tokens do design
system abaixo.

---

## 6. Design System (Isabela — decisões definitivas)

### 6.1 Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| Primary (verde) | `#22C55E` | Ações de sucesso, confirmações, progresso, tab ativa |
| Primary Dark | `#15803D` | Headers, textos de destaque em fundo escuro |
| Accent (laranja) | `#F97316` | CTAs primários (Iniciar Treino), urgência, destaques |
| Background principal | `#0F172A` | Fundo principal do app (dark mode) |
| Background Card | `#111C2C` / `#1E293B` | Cards, containers secundários |
| Surface profundo | `#0C1220` | Telas dark profundas |
| Texto primário | `#F8FAFC` | Texto principal dark mode |
| Texto secundário | `#94A3B8` | Subtítulos, labels, metadados |
| Texto muted | `#64748B` / `#475569` | Placeholders, textos desativados |
| Success | `#22C55E` | Série concluída, refeição marcada, boa aderência |
| Warning | `#EAB308` | Aderência regular, alertas não críticos |
| Error | `#EF4444` | Aderência crítica, erros, validações |
| Blue accent | `#3B82F6` | Itens de nutricionista (diferenciar de personal) |

### 6.2 Tipografia

- **Inter** — UI geral, textos, labels, navegação.
- **Space Grotesk** — números grandes: reps, cargas, calorias, timers.

### 6.3 Espaçamento e border radius

- Espaçamento em múltiplos de 4: `4 / 8 / 12 / 16 / 24 / 32 / 48`.
- Border radius: padrão `12px` · inputs `8px` · botões grandes `24px` (pill) · cards
  `14–16px` · bottom sheets/modais `20–24px` no topo.

### 6.4 Navegação mobile — Bottom Nav (definitiva)

5 tabs, pt-BR, ícones SVG: **Início / Treino / Dieta / Evolução / Perfil**.
Tab ativa: `#22C55E`. Inativa: `#64748B`.
Chat **não** tem tab fixa — acessível via ícone no header quando há vínculo com
profissional ativo.

| Tab | Ícone | Ativo | Inativo |
|---|---|---|---|
| Início | Grid 2x2 | stroke `#22C55E` | stroke `#64748B` |
| Treino | Haltere (SVG custom) | fill `#22C55E` | fill `#64748B` |
| Dieta | Garfo/faca | stroke `#22C55E` | stroke `#64748B` |
| Evolução | Linha de pulso (ECG) | stroke `#22C55E` | stroke `#64748B` |
| Perfil | Silhueta de pessoa | stroke `#22C55E` | stroke `#64748B` |

### 6.5 Hierarquia visual de ações

| Ação | Estilo | Cor |
|---|---|---|
| CTA primário (Iniciar Treino, Salvar, Atribuir) | Pill grande, full width | bg `#F97316`, texto preto |
| CTA secundário (Confirmar, Enviar, Criar conta) | Pill grande, full width | bg `#22C55E`, texto preto |
| Ação terciária (Ver, Cancelar, Voltar) | Pill outline | borda `#334155`, texto `#94A3B8` |
| Ação destrutiva (Excluir, Desvincular) | Texto sem borda | `#EF4444` |
| FAB | Círculo 52px, sombra suave | bg `#22C55E` ou `#F97316` |

### 6.6 Regras visuais adicionais

- **Imagens de exercício:** sempre ícones SVG de grupo muscular, desenhados de forma
  consistente (elipse + linhas para peito/costas, formas geométricas para bíceps/tríceps
  etc.). **Nunca** fotos ou imagens geradas por IA — decisão tomada após o Stitch
  alucinar imagens incorretas (crucifixo, rato cartoon, homem de terno). Campo
  `image_url` na model `Exercise` permite substituição futura sem refatoração. Fonte
  alternativa futura: banco `wger` (open source, CC).
- **Diferenciação por tipo de profissional:** Personal Trainer = accent verde `#22C55E`
  + badge CREF verde. Nutricionista = accent azul `#3B82F6` + badge CRN azul.
- **Indicadores de aderência:** ≥80% = "Ótimo" `#22C55E` · 60–79% = "Regular" `#EAB308`
  · <60% = "Alerta" `#EF4444`.
- **Selo somente leitura:** planos atribuídos por profissional exibem selo com ícone de
  cadeado — borda `#22C55E`, background `#0F2A1A`, texto `#22C55E`. Aluno registra
  execução (reps, carga, comentário) mas não edita a estrutura do plano.

---

## 7. Modelo de dados (alto nível)

| Entidade | Descrição | Relacionamentos |
|---|---|---|
| User | Conta base com tipo (Usuário, Personal, Nutricionista) | 1:1 Profile |
| Profile | Perfil estendido: dados pessoais, foto, bio | 1:N BodyMetric |
| BodyMetric | Medição de bioimpedância com data | N:1 Profile |
| Workout | Treino criado (template ou ativo) | 1:N WorkoutExercise |
| WorkoutExercise | Exercício dentro de um treino, com séries/reps/carga planejados | N:1 Exercise; N:1 Workout |
| Exercise | Catálogo de exercícios | — |
| WorkoutSession | Execução de um treino em data/hora específica | N:1 Workout; 1:N SetLog |
| SetLog | Registro de cada série executada (reps, carga, concluída) | N:1 WorkoutSession; N:1 WorkoutExercise |
| MealPlan | Plano alimentar diário ou template | 1:N Meal |
| Meal | Refeição do dia (café, almoço...) | N:1 MealPlan; 1:N MealItem |
| MealItem | Alimento + quantidade dentro de refeição | N:1 Food; N:1 Meal |
| Food | Catálogo de alimentos (TACO + OFF + customizados) | — |
| MealLog | Registro de refeição concluída | N:1 Meal |
| ProfessionalLink | Vínculo aluno-profissional | N:1 User (aluno); N:1 User (profissional) |
| WorkoutAssignment | Atribuição de treino do profissional ao aluno | N:1 Workout; N:1 ProfessionalLink |
| DietAssignment | Atribuição de dieta do profissional ao aluno | N:1 MealPlan; N:1 ProfessionalLink |
| ChatMessage | Mensagem de chat entre aluno e profissional | N:1 ProfessionalLink |
| VerificationRequest | Solicitação de selo CRN/CREF | N:1 User |

### 7.1 Referência de implementação já validada (Amanda)

Os models e services abaixo já foram escritos e aprovados como referência de padrão de
código — seguir o mesmo estilo (type hints, `TextChoices`, `services.py` isolando regra
de negócio) em todo o backend:

```python
# apps/users/models.py
class AccountType(models.TextChoices):
    USER = "user", "Usuário"
    PERSONAL = "personal", "Personal Trainer"
    NUTRITIONIST = "nutritionist", "Nutricionista"

class Sex(models.TextChoices):
    MALE = "M", "Masculino"
    FEMALE = "F", "Feminino"

class Goal(models.TextChoices):
    WEIGHT_LOSS = "weight_loss", "Emagrecimento"
    HYPERTROPHY = "hypertrophy", "Hipertrofia"
    MAINTENANCE = "maintenance", "Manutenção"
    GENERAL_HEALTH = "general_health", "Saúde geral"

class ActivityLevel(models.TextChoices):
    SEDENTARY = "sedentary", "Sedentário"
    LIGHT = "light", "Levemente ativo"
    MODERATE = "moderate", "Moderadamente ativo"
    INTENSE = "intense", "Muito ativo"
    VERY_INTENSE = "very_intense", "Extremamente ativo"

ACTIVITY_FACTORS = {
    ActivityLevel.SEDENTARY: 1.2,
    ActivityLevel.LIGHT: 1.375,
    ActivityLevel.MODERATE: 1.55,
    ActivityLevel.INTENSE: 1.725,
    ActivityLevel.VERY_INTENSE: 1.9,
}
```

```python
# apps/body/models.py — BodyMetric
class BodyMetric(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="body_metrics")
    date = models.DateField(default=date.today)

    # Obrigatórios (RN14)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2)
    body_fat_pct = models.DecimalField(max_digits=5, decimal_places=2)

    # Opcionais (RN14)
    muscle_mass_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    visceral_fat = models.PositiveSmallIntegerField(null=True, blank=True)
    body_water_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    bmr_device = models.PositiveIntegerField(null=True, blank=True)

    # Calculados e armazenados (preservam histórico mesmo se perfil mudar)
    bmr_calculated = models.PositiveIntegerField()
    tdee = models.PositiveIntegerField()
    calorie_goal = models.PositiveIntegerField()
    protein_g = models.PositiveIntegerField()
    carbs_g = models.PositiveIntegerField()
    fat_g = models.PositiveIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "date"], name="unique_body_metric_per_day")
        ]
```

```python
# apps/body/services.py — cálculo de TMB/macros (RN01, RN02, RN03)
MACRO_RATIOS = {
    Goal.WEIGHT_LOSS:    {"carbs": 0.40, "protein": 0.40, "fat": 0.20},
    Goal.HYPERTROPHY:    {"carbs": 0.45, "protein": 0.30, "fat": 0.25},
    Goal.MAINTENANCE:    {"carbs": 0.50, "protein": 0.25, "fat": 0.25},
    Goal.GENERAL_HEALTH: {"carbs": 0.50, "protein": 0.25, "fat": 0.25},
}
CALORIE_ADJUSTMENTS = {
    Goal.WEIGHT_LOSS: -500, Goal.HYPERTROPHY: +500,
    Goal.MAINTENANCE: 0, Goal.GENERAL_HEALTH: 0,
}
# TMB via Mifflin-St Jeor; se bmr_device informado (bioimpedância), prevalece sobre o calculado.
# TDEE = TMB efetivo * fator de atividade. calorie_goal = max(1200, TDEE + ajuste do objetivo).
```

```python
# apps/workouts/models.py — Exercise / Workout / WorkoutExercise
class MuscleGroup(models.TextChoices):
    CHEST = "chest", "Peito"
    BACK = "back", "Costas"
    SHOULDERS = "shoulders", "Ombros"
    BICEPS = "biceps", "Bíceps"
    TRICEPS = "triceps", "Tríceps"
    FOREARMS = "forearms", "Antebraços"
    CORE = "core", "Core / Abdômen"
    GLUTES = "glutes", "Glúteos"
    QUADS = "quads", "Quadríceps"
    HAMSTRINGS = "hamstrings", "Posteriores de coxa"
    CALVES = "calves", "Panturrilhas"
    CARDIO = "cardio", "Cardio"
    FULL_BODY = "full_body", "Corpo todo"

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    muscle_group = models.CharField(max_length=20, choices=MuscleGroup.choices)
    icon_slug = models.SlugField(max_length=60, unique=True)  # referencia ícone SVG, nunca foto
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=True)
```

---

## 8. Regras de negócio (RN) — obrigatórias em toda implementação

| ID | Regra |
|---|---|
| RN01 | TMB via fórmula Mifflin-St Jeor por padrão. Se o usuário informar TMB pela bioimpedância, esse valor prevalece sobre o calculado. |
| RN02 | Distribuição padrão de macros por objetivo: emagrecimento 40C/40P/20G · hipertrofia 45C/30P/25G · manutenção 50C/25P/25G · saúde geral 50C/25P/25G. Ajustável pelo usuário ou nutricionista. |
| RN03 | Necessidade calórica diária = TMB × fator de atividade (sedentário 1.2, leve 1.375, moderado 1.55, intenso 1.725, muito intenso 1.9), ajustada em ±500 kcal conforme objetivo. |
| RN04 | Usuário vinculado a profissional **não pode editar** plano (treino ou dieta) atribuído por ele. Pode apenas registrar execução (reps, carga, comentário, marcação de refeição). |
| RN05 | Usuário pode estar vinculado a no máximo **1 personal trainer e 1 nutricionista** simultaneamente. |
| RN06 | Profissional não tem limite de alunos vinculados (limite comercial por assinatura é regra futura). |
| RN07 | Selo CRN/CREF concedido apenas após validação manual pelo Admin (documento + verificação no conselho regional). Validação automática via API é P3. |
| RN08 | Sessão de treino iniciada e não concluída fica como rascunho por 24h — depois é descartada ou consolidada com base nas séries já marcadas (decisão final na implementação). |
| RN09 | Plano alimentar de nutricionista é somente leitura para o aluno. Aluno marca refeição como concluída e comenta, mas não altera composição. |
| RN10 | Treino de personal é somente leitura na estrutura, mas o aluno pode ajustar reps e carga no momento da execução. |
| RN11 | Templates públicos importados viram cópia independente, livremente editável. |
| RN12 | Exclusão de conta remove dados pessoais (LGPD), mas mantém dados agregados anonimizados. |
| RN13 | Profissional sem assinatura mantém acesso gratuito mas perde capacidade de atribuir novos planos. Alunos vinculados perdem acesso premium 30 dias após cancelamento (regra futura). |
| RN14 | Bioimpedância exige no mínimo peso e % gordura corporal. Demais campos são opcionais. |

---

## 9. Requisitos não-funcionais (RNF) — restrições de engenharia

- **Performance:** telas principais ≤2s em 4G · 95% das requisições da API em ≤300ms ·
  execução de treino funciona offline com sincronização posterior · cálculo de
  macros/calorias é instantâneo (client-side ou cache).
- **Segurança:** LGPD completo (consentimento, direito ao esquecimento, exportação de
  dados) · senhas com bcrypt custo mínimo 12 · JWT com access 15min + refresh · HTTPS
  exclusivo (TLS 1.2+) · rate limiting em login/cadastro/recuperação · dados de
  bioimpedância e fotos são dados sensíveis, criptografados em repouso · logs de
  auditoria no Django Admin.
- **Usabilidade:** mobile-first com gestos nativos Android · acessibilidade WCAG AA,
  suporte a TalkBack · usuário novo registra primeiro treino em ≤3min · telas críticas
  (execução de treino) usáveis com uma só mão.
- **Compatibilidade:** Android 8.0 (API 26)+ · retrato prioritário · resolução mínima
  360×640 · iOS fora do MVP mas Flutter mantém portabilidade.
- **Escalabilidade:** arquitetura multi-tenant desde o início · tarefas pesadas em
  Celery · cache Redis para queries frequentes · migração AWS/GCP sem refatoração
  estrutural.
- **Disponibilidade:** 99% uptime no MVP · modo offline obrigatório na execução de
  treino.
- **Manutenibilidade:** Clean Architecture no mobile · apps modulares por domínio no
  backend · cobertura mínima de testes: **70% backend, 50% mobile** (lógica de
  negócio) · OpenAPI/Swagger automático (drf-spectacular) · CI/CD com lint + testes +
  build (GitHub Actions).
- **Conformidade:** LGPD · políticas da Google Play (incluindo Health Apps Policy) ·
  estrutura preparada para GDPR.

---

## 10. Inventário de telas (30 mobile + 5 web)

Todas as telas mobile em pt-BR, dark mode, 5 tabs na bottom nav (Início / Treino / Dieta
/ Evolução / Perfil). Ver `FitTrack_-_Protótipo.html` para o layout final aprovado de
cada uma.

**Autenticação:** Splash · Onboarding (boas-vindas) · Seleção de tipo de conta ·
Cadastro · Login · Recuperação de senha · Onboarding de objetivo.

**Perfil & dados físicos:** Perfil · Dados físicos · Nova medição de bioimpedância ·
Histórico de evolução corporal (gráficos) · Configurações.

**Início:** Dashboard — CTA "Iniciar Treino", anel de calorias, macros
(Prot/Carb/Gord), refeições registradas, atalhos "Adicionar Refeição" / "Registrar
Peso".

**Treino:** Meus Treinos · Criar Treino · Adicionar Exercício · Configurar Exercício ·
Explorar Rotinas (templates) · Detalhe do Treino (ícones SVG de grupo muscular) ·
Execução do Exercício (timer, marcação de série, reordenar) · Reordenar exercícios
(drag & drop).

**Dieta:** Plano de Refeições · Buscar Alimento (TACO + Open Food Facts) · Adicionar
Refeição · Detalhe de refeição (macros por alimento).

**Vínculo profissional:** Meus Profissionais · Aceitar Convite · Chat Profissional
(via header, sem tab fixa) · Plano Atribuído (selo somente leitura).

**Web (Next.js — Carlos):** Login profissional · Dashboard profissional · Perfil do
aluno · Editor de treino · Editor de plano alimentar.

---

## 11. Fora do escopo do MVP

- iOS.
- Pagamentos in-app.
- **Módulo de IA de análise de proporções corporais** — em desenvolvimento paralelo e
  separado, será integrado ao backend via Celery quando pronto. **Sem data definida e
  sem impacto no roadmap do app principal.** Não subestimar nem remover do produto —
  tratar como feature real em roadmap próprio.
- Validação automática de credenciais CRN/CREF via API externa.
- Marketplace de templates premium (registrado como requisito futuro).

Monetização (freemium / assinatura profissional / acesso premium por vínculo) está
**definida mas não é bloqueante** para o MVP — implementar a estrutura de dados de
forma que suporte isso sem refatoração, mas não construir os fluxos de cobrança agora.

---

## 12. Roadmap de execução (por prioridade, sem prazos rígidos)

Cada bloco só começa quando o anterior estiver funcional o suficiente para depender
dele.

1. **Fundação (P0) — EM ANDAMENTO:** arquitetura backend/mobile, ambiente e
   repositório, design system inicial, autenticação completa, perfil + dados físicos +
   bioimpedância.
2. **Core (P0):** módulo de treino completo (criação, execução, histórico), base de
   exercícios pré-cadastrada, módulo de dieta completo (TACO + Open Food Facts, plano
   alimentar, marcação de refeições), cálculo automático de calorias/macros.
3. **Dashboard (P0/P1):** resumo diário, gráficos de evolução corporal, histórico
   detalhado de sessões e refeições.
4. **Multi-usuário (P1/P2):** vínculo profissional-aluno, atribuição de planos, página
   de gerenciamento de alunos, chat interno, notificações push.
5. **Templates e Backoffice (P2):** templates importáveis, customizações do Django
   Admin, painel React/Next.js de métricas.
6. **Mercado (P3):** monetização (freemium + assinatura), marketplace de templates,
   validação automática CRN/CREF, publicação na Play Store + ASO.
7. **IA (paralelo, sem dependência):** módulo de análise de proporções corporais.

---

## 13. Como este README deve ser usado pelo Claude Code

- Trate as seções 3–9 (stack, arquitetura, design system, modelo de dados, RN, RNF)
  como **restrições obrigatórias**, não sugestões.
- Ao gerar código backend, siga exatamente o padrão de pastas e a separação
  views/services/selectors da seção 4.
- Ao gerar código mobile, siga a estrutura feature-first + clean architecture da seção
  5, com Riverpod — nunca Bloc/Provider legado.
- Ao gerar UI (mobile ou web), aplique os tokens exatos da seção 6 (cores em hex,
  tipografia, radius, espaçamento) e valide contra `FitTrack_-_Protótipo.html`.
- Nunca gere imagens/fotos para exercícios — sempre ícones SVG por grupo muscular
  (seção 6.6).
- Se uma decisão necessária não estiver coberta aqui nem nos PDFs, **sinalize
  explicitamente** e pergunte antes de assumir — não é permitido inventar premissa em
  regra de negócio, cálculo de macros/TMB, ou modelo de dados.
- Comece pelo **Bloco 1 — Fundação** (seção 12), respeitando as entregas já atribuídas
  por responsável (Amanda: backend/models · Rafael: mobile/auth · Isabela: tokens já
  definidos nesta seção 6).
