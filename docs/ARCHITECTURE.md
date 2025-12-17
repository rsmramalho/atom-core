# MindMate - Atom Engine 4.0

## Arquitetura do Sistema

**Versão:** 4.0.0-alpha.19  
**Data:** 2025-12-17  
**Status:** Production Ready - All Core Engines + PWA + Offline + Analytics

---

## 📁 Estrutura de Diretórios

```
src/
├── components/
│   ├── ui/                         # Componentes Shadcn (base)
│   ├── inbox/
│   │   ├── InboxItemCard.tsx       # Card de item no inbox
│   │   ├── InboxItemCardSkeleton.tsx # Skeleton loading
│   │   └── MacroPickerModal.tsx    # Modal de promoção (B.8)
│   ├── dashboard/
│   │   ├── FocusBlock.tsx          # Bloco de itens #focus
│   │   ├── RitualBanner.tsx        # Banner do ritual ativo
│   │   └── TodayList.tsx           # Lista do dia
│   ├── projects/
│   │   ├── ProjectCard.tsx         # Card de projeto na lista
│   │   └── ProjectCardSkeleton.tsx # Skeleton loading
│   ├── project-sheet/
│   │   ├── MilestonesPane.tsx      # Timeline de milestones
│   │   ├── WorkAreaPane.tsx        # Tasks & Hábitos
│   │   ├── NotesPane.tsx           # Notas & Recursos
│   │   ├── JournalPane.tsx         # Reflexões do projeto
│   │   ├── ProjectFab.tsx          # FAB flutuante
│   │   ├── ProjectSettingsModal.tsx # Config de progresso
│   │   ├── ProjectStatusDropdown.tsx # State machine UI
│   │   ├── QuickAddTaskModal.tsx   # Modal criação task
│   │   └── QuickAddMilestoneModal.tsx
│   ├── calendar/
│   │   ├── CalendarGrid.tsx        # Grid mensal
│   │   ├── CalendarGridSkeleton.tsx # Skeleton loading
│   │   ├── WeekGrid.tsx            # Grid semanal
│   │   ├── DayCell.tsx             # Célula do dia
│   │   ├── CalendarItem.tsx        # Item no calendário
│   │   ├── CalendarFilters.tsx     # Filtros tipo/módulo
│   │   └── OverdueSection.tsx      # Itens atrasados
│   ├── journal/
│   │   ├── JournalComposer.tsx     # Input de reflexões
│   │   ├── JournalFeed.tsx         # Timeline de reflexões
│   │   ├── JournalFilters.tsx      # Filtros por tag/período
│   │   └── index.ts
│   ├── lists/
│   │   ├── ListCard.tsx            # Card de lista
│   │   ├── ListDetailModal.tsx     # Modal de edição
│   │   ├── QuickAddListModal.tsx   # Criação rápida
│   │   └── index.ts
│   ├── notifications/
│   │   ├── NotificationManager.tsx # Gerenciador de notificações
│   │   ├── NotificationSettings.tsx # Config de preferências
│   │   └── index.ts
│   ├── pwa/
│   │   ├── InstallPrompt.tsx       # Prompt de instalação
│   │   ├── NetworkStatusIndicator.tsx # Badge online/offline
│   │   ├── OfflineSyncContext.tsx  # Context de sync
│   │   ├── PendingIndicator.tsx    # Indicador de pendências
│   │   ├── PendingOperationsModal.tsx # Lista de operações
│   │   └── index.ts
│   ├── onboarding/
│   │   ├── WelcomeModal.tsx        # Modal de boas-vindas
│   │   ├── TourOverlay.tsx         # Tour guiado
│   │   ├── FirstStepsChecklist.tsx # Checklist gamificado
│   │   ├── OnboardingContext.tsx   # State management
│   │   └── index.ts
│   ├── layout/
│   │   ├── AppLayout.tsx           # Layout principal com auth
│   │   ├── AppNavigation.tsx       # Nav sidebar/bottom
│   │   ├── CommandPalette.tsx      # Busca global (⌘K)
│   │   ├── KeyboardShortcutsHelp.tsx # Modal de atalhos
│   │   └── PageTransition.tsx      # AnimatePresence wrapper
│   ├── empty-states/               # Estados vazios com ilustrações
│   ├── shared/
│   │   ├── ErrorBoundary.tsx       # Error handling global
│   │   ├── PageLoader.tsx          # Loading states
│   │   ├── Confetti.tsx            # Celebração
│   │   ├── DeleteConfirmDialog.tsx # Confirmação de exclusão
│   │   ├── EditItemModal.tsx       # Edição de itens
│   │   ├── HabitHeatmap.tsx        # Visualização de streaks
│   │   ├── ItemContextMenu.tsx     # Menu de contexto
│   │   ├── RecurrencePickerModal.tsx # Config de recorrência
│   │   ├── StreakBadge.tsx         # Badge de streak
│   │   └── TagGlossary.tsx         # Referência de tags
│   ├── AuthForm.tsx
│   ├── EngineDebugConsole.tsx
│   └── NavLink.tsx
│
├── hooks/
│   ├── useAtomItems.ts             # CRUD de itens via Supabase
│   ├── useDashboardData.ts         # Filtros do dashboard (B.10)
│   ├── useCalendarItems.ts         # Items para calendário
│   ├── useMilestones.ts            # CRUD de milestones
│   ├── useProjectProgress.ts       # Cálculo de progresso híbrido
│   ├── useRitual.ts                # Lógica do ritual (B.19)
│   ├── useRecurrence.ts            # Virtual projection
│   ├── useNetworkStatus.ts         # Detecção online/offline
│   ├── useOfflineSync.ts           # Sync queue management
│   ├── useNotifications.ts         # Web Notifications API
│   ├── useSwipe.ts                 # Touch/swipe gestures
│   ├── useDebugConsole.ts          # Controle do console
│   ├── useEngineLogger.ts          # Sistema de logs (Zustand)
│   └── use-toast.ts                # Toasts do sistema
│
├── lib/
│   ├── parsing-engine.ts           # Motor de parsing (B.7)
│   ├── dashboard-filters.ts        # Filtros do dashboard
│   ├── recurrence-engine.ts        # RRULE projection
│   ├── reflection-prompts.ts       # Prompts de reflexão
│   ├── journal-export.ts           # Export MD/JSON/PDF
│   ├── offline-queue.ts            # IndexedDB queue
│   ├── local-cache.ts              # localStorage cache
│   └── utils.ts                    # Utilitários (cn, etc)
│
├── types/
│   ├── atom-engine.ts              # Tipos do domínio
│   ├── auth.ts                     # Tipos de autenticação
│   └── database.ts                 # Tipos de mapeamento DB
│
├── pages/
│   ├── Index.tsx                   # Dashboard principal
│   ├── Inbox.tsx                   # Inbox Engine UI (B.6)
│   ├── Projects.tsx                # Lista de projetos
│   ├── ProjectDetail.tsx           # Project Sheet (A.13)
│   ├── Calendar.tsx                # Calendário (B.4)
│   ├── RitualView.tsx              # Ritual imersivo (B.19)
│   ├── Journal.tsx                 # Página de reflexões
│   ├── Lists.tsx                   # List Engine
│   ├── Analytics.tsx               # Dashboard de métricas
│   ├── Install.tsx                 # Guia de instalação PWA
│   ├── Privacy.tsx                 # Política de privacidade
│   └── NotFound.tsx                # 404
│
└── integrations/
    └── supabase/                   # Cliente Supabase (auto-gerado)
```

---

## 🗄️ Modelo de Dados

### Tabela: `items` (Single Table Design)

Todos os tipos de itens em uma única tabela (Doc B.3, B.9).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | Chave primária |
| `user_id` | uuid | FK para auth.users |
| `title` | text | Título do item |
| `type` | item_type | Tipo: project, task, habit, note, reflection, resource, list |
| `module` | text | Módulo (work, body, mind, family, geral) |
| `tags` | text[] | Array de tags (inclui #milestone para milestones) |
| `parent_id` | uuid | FK para item pai |
| `project_id` | uuid | FK para projeto container |
| `due_date` | date | Data de vencimento |
| `recurrence_rule` | text | RRULE string para recorrência |
| `completion_log` | jsonb | Array de datas de conclusão (recorrência) |
| `ritual_slot` | ritual_slot | Slot de ritual (manha, meio_dia, noite) |
| `completed` | boolean | Estado de conclusão |
| `completed_at` | timestamptz | Timestamp de conclusão |
| `notes` | text | Conteúdo/notas |
| `checklist` | jsonb | Checklist items |
| `weight` | integer | Peso para progresso (default: 1, milestones: 3) |
| `order_index` | integer | Índice para ordenação drag & drop |
| `project_status` | project_status | Status do projeto (apenas type='project') |
| `progress_mode` | progress_mode | Modo de cálculo de progresso |
| `progress` | integer | Progresso manual (0-100) |
| `deadline` | date | Deadline do projeto |
| `created_at` | timestamptz | Timestamp de criação |
| `updated_at` | timestamptz | Timestamp de atualização |

### Tabelas Auxiliares

#### `onboarding_progress`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `user_id` | uuid | FK para auth.users |
| `has_completed_welcome` | boolean | Modal de boas-vindas visto |
| `has_completed_tour` | boolean | Tour guiado concluído |
| `show_checklist` | boolean | Exibir checklist |
| `checklist_progress` | jsonb | Progresso do checklist |

#### `onboarding_analytics`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `user_id` | uuid | FK para auth.users |
| `event_type` | text | Tipo do evento |
| `event_data` | jsonb | Dados do evento |
| `created_at` | timestamptz | Timestamp |

### Enums

```sql
CREATE TYPE item_type AS ENUM (
  'project', 'task', 'habit', 'note', 
  'reflection', 'resource', 'list'
);

CREATE TYPE ritual_slot AS ENUM ('manha', 'meio_dia', 'noite');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE progress_mode AS ENUM ('auto', 'milestone', 'manual');
```

---

## ⚙️ Engines Implementadas

### 1. Parsing Engine (B.7)

**Arquivo:** `src/lib/parsing-engine.ts`

Transforma texto cru em estrutura `ParsedInput`.

| Token | Exemplo | Resultado |
|-------|---------|-----------|
| `@hoje` | "Tarefa @hoje" | `due_date: today` |
| `@amanha` | "Tarefa @amanha" | `due_date: tomorrow` |
| `@ritual_manha` | "Meditar @ritual_manha" | `ritual_slot: "manha"`, `type: "habit"` |
| `#tag` | "Tarefa #urgente" | `tags: ["#urgente"]` |
| `#mod_*` | "Treino #mod_body" | `module: "body"` |

---

### 2. Inbox Engine (B.6)

**Arquivo:** `src/pages/Inbox.tsx`

Captura e processamento de itens brutos.

---

### 3. MacroPicker Engine (B.8)

**Arquivo:** `src/components/inbox/MacroPickerModal.tsx`

Modal de promoção de itens do inbox para projetos.

---

### 4. Dashboard Engine (B.10)

**Arquivo:** `src/hooks/useDashboardData.ts`

Filtros: focusItems, todayItems, overdueItems, ritualItems, projects.

---

### 5. Ritual Engine (B.19)

**Arquivos:** `src/hooks/useRitual.ts`, `src/pages/RitualView.tsx`

Experiência imersiva para hábitos diários com check-in integrado.

#### Fluxo do Ritual

```
1. Intro → Tela de boas-vindas com período
2. Hábitos → Lista de hábitos do período com toggle de conclusão
3. Check-in → Pergunta contextual + textarea para reflexão
4. Encerramento → Retorna ao dashboard
```

#### Check-in por Período

| Período | Pergunta |
|---------|----------|
| Aurora | "Qual é sua intenção para hoje?" |
| Zênite | "Como está sendo seu dia até agora?" |
| Crepúsculo | "Como você encerra este ciclo?" |

---

### 6. Project Engine (B.9/B.13) - Project Intelligence

**Arquivos:** `src/hooks/useProjectProgress.ts`, `src/pages/ProjectDetail.tsx`

Gestão de projetos com State Machine, Progress Engine Híbrido e Journal integrado.

#### State Machine (Ciclo de Vida)

| Status | Descrição | Transições Válidas |
|--------|-----------|-------------------|
| `draft` | Rascunho inicial | → active, archived |
| `active` | Em andamento | → paused, completed, archived |
| `paused` | Suspenso (excluído de métricas) | → active, archived |
| `completed` | Finalizado (bloqueado) | → archived, active |
| `archived` | Histórico | → active |

#### Progress Engine Híbrido

| Modo | Fórmula | Uso |
|------|---------|-----|
| `auto` | (Tasks + Milestones concluídos) / Total * 100 | Default |
| `milestone` | Apenas milestones (ignora tasks) | Projetos orientados a entregas |
| `manual` | Valor definido pelo usuário (0-100) | Controle total |

#### Abas da Project Sheet

1. **Trabalho** - Tasks e Hábitos (com drag & drop para conversão de tipo)
2. **Jornada** - Timeline de Milestones
3. **Notas** - Notes e Resources
4. **Journal** - Reflexões do projeto

---

### 7. Reflection Engine (B.11)

**Arquivos:** `src/pages/Journal.tsx`, `src/components/journal/*`

Sistema de journaling e reflexões.

#### Características

- **Itens type='reflection'**: completed sempre false, due_date sempre null
- **Tags de Contexto**: #checkin, #mood:*, #ritual:*, #project:*
- **Timeline Visual**: Linha vertical conectando entradas
- **Filtros**: Por tag e por período (today, week, month, year)
- **Busca Full-Text**: Com highlight de termos encontrados
- **Prompts Guiados**: Perguntas por categoria para inspirar
- **Export**: Markdown, JSON, PDF

---

### 8. Calendar Engine (B.4)

**Arquivos:** `src/pages/Calendar.tsx`, `src/components/calendar/*`

Visualização temporal de items com due_date.

#### Características

- **Views**: Mensal e semanal com toggle (M/W keys)
- **Navegação**: Arrows, swipe, keyboard shortcuts
- **Drag & Drop**: Reschedule entre dias
- **Overdue Section**: Items atrasados em destaque
- **Filtering**: Por tipo e módulo
- **Virtual Recurrence**: Projeção de instâncias recorrentes

---

### 9. List Engine

**Arquivos:** `src/pages/Lists.tsx`, `src/components/lists/*`

Listas rápidas estilo Google Keep.

#### Características

- **Cores Personalizadas**: 18 opções via picker
- **Drag & Drop**: Reordenação de items
- **Ações**: Duplicar, limpar concluídos, excluir
- **Hierarquia**: Listas são containers, items são tasks com parent_id
- **Isolamento**: Items NÃO aparecem no Dashboard (a menos que tenham due_date)

---

### 10. Recurrence Engine (B.5)

**Arquivos:** `src/lib/recurrence-engine.ts`, `src/hooks/useRecurrence.ts`

Suporte a padrões de repetição complexos.

#### Características

- **RRULE Support**: Biblioteca rrule para padrões complexos
- **Virtual Projection**: Instâncias projetadas sem persistir no DB
- **Completion Log**: JSONB array para tracking de conclusões
- **Presets**: Diário, semanal (dias específicos), mensal

---

### 11. Notification Engine

**Arquivos:** `src/hooks/useNotifications.ts`, `src/components/notifications/*`

Sistema de lembretes via Web Notifications API.

#### Características

- **Tipos**: Tasks hoje, amanhã, atrasadas
- **Permissões**: Request via settings
- **Periódico**: Check a cada hora
- **Browser Native**: Sem necessidade de VAPID keys

---

### 12. Offline Engine (PWA)

**Arquivos:** `src/lib/offline-queue.ts`, `src/lib/local-cache.ts`, `src/hooks/useOfflineSync.ts`

Suporte a uso offline com sync automático.

#### Camadas

1. **Network Detection**: useNetworkStatus hook + UI indicator
2. **Service Worker**: vite-plugin-pwa com NetworkFirst/CacheFirst strategies
3. **Offline Queue**: IndexedDB para mutations pendentes
4. **Local Cache**: localStorage para leitura offline

---

## 🖥️ Rotas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Index.tsx | Dashboard principal |
| `/inbox` | Inbox.tsx | Captura e processamento |
| `/projects` | Projects.tsx | Lista de projetos |
| `/projects/:id` | ProjectDetail.tsx | Project Sheet |
| `/calendar` | Calendar.tsx | Visualização temporal |
| `/ritual` | RitualView.tsx | Ritual imersivo (sem nav) |
| `/journal` | Journal.tsx | Página de reflexões |
| `/lists` | Lists.tsx | Listas rápidas |
| `/analytics` | Analytics.tsx | Métricas e estatísticas |
| `/install` | Install.tsx | Guia de instalação PWA |
| `/privacy` | Privacy.tsx | Política de privacidade |

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` / `Ctrl+K` | Command Palette |
| `⌘H` / `Ctrl+H` | Ir para Home |
| `⌘I` / `Ctrl+I` | Ir para Inbox |
| `⌘P` / `Ctrl+P` | Ir para Projetos |
| `⌘L` / `Ctrl+L` | Ir para Calendário |
| `⌘R` / `Ctrl+R` | Ir para Ritual |
| `⌘J` / `Ctrl+J` | Ir para Journal |
| `⌘N` / `Ctrl+N` | Novo Item |
| `⌘/` / `Ctrl+/` | Tag Glossary |
| `Ctrl+Shift+E` | Debug Console |
| `/` | Focar busca (Journal) |
| `M` | View mensal (Calendar) |
| `W` | View semanal (Calendar) |
| `←` `→` | Navegar períodos (Calendar) |
| `T` | Ir para hoje (Calendar) |

---

## 🎨 Performance & UX (Fase 6)

### Error Handling

- **ErrorBoundary**: Wrapper global com fallback elegante
- **Retry/Home/Reload**: Opções de recuperação

### Loading States

- **Suspense Boundaries**: Em todas as rotas
- **PageLoader**: Mensagens contextuais por rota
- **Skeletons**: ProjectCard, InboxItemCard, CalendarGrid

### Optimizations

- **React.memo**: ProjectCard, InboxItemCard, CalendarItem
- **React.lazy**: Páginas secundárias (Analytics, Install, Privacy)
- **Lazy SVGs**: Ilustrações em empty states

### Animations

- **Page Transitions**: AnimatePresence com fade + slide (200ms)
- **Micro-animations**:
  - Buttons: active:scale-[0.98], hover:shadow-md
  - Cards: hover-lift + shadow transition
  - Checkboxes: hover-glow + zoom check icon
  - Switches: hover-glow + thumb shadow
  - Badges: interactive variant com scale
  - Progress bars: 500ms transition + gradient

---

## 🔒 Type Safety (Fase 5)

### Zero Any Policy

- **Nenhum `: any` ou `as any`** em código de produção
- **Score de Auditoria**: 50/50

### Tipos Centralizados

```typescript
// src/types/auth.ts
export interface UserProfile { ... }
export type User = SupabaseUser;
export interface AuthError { ... }

// src/types/database.ts
export type ItemsRow = Tables<'items'>;
export type TypedItemsRow = { ... };
export function asTypedRow(row: ItemsRow): TypedItemsRow;
```

---

## 📋 Roadmap

### ✅ Implementado (v4.0.0-alpha.19)

- [x] Modelo de dados (Single Table Design)
- [x] Tipos TypeScript completos (Zero Any Policy)
- [x] Parsing Engine (B.7)
- [x] Inbox Engine (B.6)
- [x] MacroPicker Engine (B.8)
- [x] Dashboard Engine (B.10)
- [x] Ritual View (B.19) com Check-in e animações
- [x] Project Sheet (A.13) com aba Journal
- [x] Reflection Engine (B.11) com export
- [x] Calendar Engine (B.4) com navegação avançada
- [x] Project Intelligence (B.9) - State Machine + Progress Híbrido
- [x] List Engine - Listas rápidas
- [x] Habit Streaks - Badge + Heatmap
- [x] Recurrence Engine (B.5) - RRULE support
- [x] Notification Engine - Web Notifications API
- [x] Offline Engine - PWA com sync
- [x] Analytics Dashboard - Métricas e gráficos
- [x] Onboarding System - Welcome + Tour + Checklist
- [x] Performance & UX - ErrorBoundary, Suspense, Skeletons
- [x] Micro-animations - Buttons, cards, checkboxes
- [x] Sistema de navegação + Command Palette
- [x] Debug Console (God Mode)
- [x] Autenticação + RLS

### 🔲 Próximas Etapas

- [ ] Push Notifications (VAPID)
- [ ] Colaboração multi-usuário
- [ ] Widgets nativos (Android/iOS)
- [ ] API pública
- [ ] Temas customizáveis
