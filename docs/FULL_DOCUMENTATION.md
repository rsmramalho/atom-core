# MindMate - Atom Engine 4.0
# Documentação Completa Consolidada

**Versão:** 4.0.0-alpha.10  
**Data:** 2025-12-16  
**Status:** Core Engine + Inbox + MacroPicker + Dashboard + Ritual + Project Sheet + Reflection Engine + Calendar Engine

---

# ÍNDICE

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Atalhos de Teclado](#atalhos-de-teclado)
4. [Arquitetura](#arquitetura)
5. [Modelo de Dados](#modelo-de-dados)
6. [Engines](#engines)
7. [API Reference](#api-reference)
8. [Rotas](#rotas)
9. [Design System](#design-system)
10. [Guia de Contribuição](#guia-de-contribuição)
11. [Changelog](#changelog)

---

# QUICK START

## 1. Crie uma Conta

Na tela de login, clique em **"Não tem conta? Cadastre-se"**

## 2. Explore as Features

```
🏠 Dashboard (/)
├── Focus Block - Itens com #focus
├── Today List - Vencimentos do dia
└── Ritual Banner - Hábitos do período

📥 Inbox (/inbox)
├── Captura rápida com parsing
├── Tokens: @hoje, @amanha, #tags
└── Promoção para projetos

📁 Projects (/projects)
├── Lista de projetos ativos
├── Filtros por módulo
└── Ordenação por nome/progresso/data

📋 Project Sheet (/projects/:id)
├── Trabalho - Tasks & Hábitos
├── Jornada - Timeline de Milestones
├── Notas - Recursos e anotações
└── Journal - Reflexões do projeto

📅 Calendar (/calendar)
├── Visualização Mensal/Semanal
├── Drag & Drop para reagendar
├── Filtros por tipo e módulo
└── Navegação por teclado e touch

🌅 Ritual View (/ritual)
├── Hábitos do período atual
├── Check-in com pergunta guiada
└── Salvamento automático de reflexão

📝 Journal (/journal)
├── Prompts por categoria
├── Busca full-text com highlight
├── Filtros por tag e período
└── Timeline visual de reflexões
```

---

# FEATURES

## 🧠 Parsing Engine

```
"Reunião com cliente @amanha #mod_work"
     ↓ parseInput()
{
  title: "Reunião com cliente",
  due_date: "2025-12-17",
  module: "work"
}
```

## 🌅 Ritual View com Check-in

Experiência imersiva para hábitos diários com reflexão integrada:

1. **Hábitos** - Complete seus hábitos do período
2. **Check-in** - Responda uma pergunta contextual
3. **Encerramento** - Reflexão salva automaticamente no Journal

| Período | Horário | Pergunta |
|---------|---------|----------|
| 🌅 Aurora | < 11:00 | "Qual é sua intenção para hoje?" |
| ☀️ Zênite | 11:00-17:00 | "Como está sendo seu dia até agora?" |
| 🌆 Crepúsculo | > 17:00 | "Como você encerra este ciclo?" |

## 📝 Journal (Reflection Engine)

Sistema de journaling com design zen:

- **Prompts Guiados** por categoria (Gratidão, Crescimento, Sentimentos, Metas, Aprendizado)
- **Busca Full-Text** com destaque dos termos
- **Filtros** por tags e período de tempo
- **Timeline Visual** conectando reflexões
- **Atalho /** para focar na busca

## 📅 Calendar Engine

Visualização e reagendamento de itens:

- **Visualizações:** Mensal (M) e Semanal (W)
- **Drag & Drop:** Arraste itens para reagendar
- **Filtros:** Por tipo (task, milestone, habit) e módulo
- **Overdue Section:** Itens atrasados em destaque
- **Navegação Touch:** Swipe com feedback visual

## 📋 Project Sheet

Gestão completa de projetos em 4 abas:

1. **Trabalho** - Tasks e Hábitos separados
2. **Jornada** - Timeline de Milestones (peso 3x)
3. **Notas** - Resources e Notes
4. **Journal** - Reflexões e decisões do projeto

---

# ATALHOS DE TECLADO

## Navegação Global

| Atalho | Ação |
|--------|------|
| `⌘K` / `Ctrl+K` | Command Palette |
| `⌘H` / `Ctrl+H` | Home |
| `⌘I` / `Ctrl+I` | Inbox |
| `⌘P` / `Ctrl+P` | Projetos |
| `⌘L` / `Ctrl+L` | Calendário |
| `⌘R` / `Ctrl+R` | Ritual |
| `⌘J` / `Ctrl+J` | Journal |
| `⌘N` / `Ctrl+N` | Novo Item |
| `Ctrl+Shift+E` | Debug Console |

## Calendário

| Atalho | Ação |
|--------|------|
| `M` | Visualização Mensal |
| `W` | Visualização Semanal |
| `←` | Mês/Semana anterior |
| `→` | Próximo mês/semana |
| `T` | Ir para hoje |
| `Swipe ← →` | Navegação mobile |

## Journal

| Atalho | Ação |
|--------|------|
| `/` | Focar na busca |
| `⌘Enter` / `Ctrl+Enter` | Salvar reflexão |

---

# ARQUITETURA

## 📁 Estrutura de Diretórios

```
src/
├── components/
│   ├── ui/                         # Componentes Shadcn (base)
│   ├── inbox/
│   │   ├── InboxItemCard.tsx       # Card de item no inbox
│   │   └── MacroPickerModal.tsx    # Modal de promoção (B.8)
│   ├── dashboard/
│   │   ├── FocusBlock.tsx          # Bloco de itens #focus
│   │   ├── RitualBanner.tsx        # Banner do ritual ativo
│   │   └── TodayList.tsx           # Lista do dia
│   ├── calendar/
│   │   ├── CalendarGrid.tsx        # Grid mensal
│   │   ├── WeekGrid.tsx            # Grid semanal
│   │   ├── CalendarFilters.tsx     # Filtros de tipo/módulo
│   │   ├── CalendarViewToggle.tsx  # Toggle mês/semana
│   │   └── DayDetailSheet.tsx      # Detalhe do dia
│   ├── projects/
│   │   └── ProjectCard.tsx         # Card de projeto na lista
│   ├── project-sheet/
│   │   ├── MilestonesPane.tsx      # Timeline de milestones
│   │   ├── WorkAreaPane.tsx        # Tasks & Hábitos
│   │   ├── NotesPane.tsx           # Notas & Recursos
│   │   ├── JournalPane.tsx         # Reflexões do projeto
│   │   ├── ProjectFab.tsx          # FAB flutuante
│   │   ├── QuickAddTaskModal.tsx   # Modal criação task
│   │   └── QuickAddMilestoneModal.tsx
│   ├── journal/
│   │   ├── JournalComposer.tsx     # Input de reflexões
│   │   ├── JournalFeed.tsx         # Timeline de reflexões
│   │   ├── JournalFilters.tsx      # Filtros por tag/período
│   │   └── index.ts                # Exports
│   ├── layout/
│   │   ├── AppLayout.tsx           # Layout principal com auth
│   │   ├── AppNavigation.tsx       # Nav sidebar/bottom
│   │   ├── CommandPalette.tsx      # Busca global (⌘K)
│   │   └── KeyboardShortcutsHelp.tsx
│   ├── empty-states/               # Estados vazios com ilustrações
│   ├── shared/                     # Componentes compartilhados
│   ├── AuthForm.tsx
│   ├── EngineDebugConsole.tsx
│   └── NavLink.tsx
│
├── hooks/
│   ├── useAtomItems.ts             # CRUD de itens via Supabase
│   ├── useCalendarItems.ts         # Itens do calendário
│   ├── useDashboardData.ts         # Filtros do dashboard (B.10)
│   ├── useMilestones.ts            # CRUD de milestones
│   ├── useProjectProgress.ts       # Cálculo de progresso híbrido
│   ├── useRitual.ts                # Lógica do ritual (B.19)
│   ├── useSwipe.ts                 # Gestos de swipe
│   ├── useDebugConsole.ts          # Controle do console
│   ├── useEngineLogger.ts          # Sistema de logs (Zustand)
│   └── use-toast.ts                # Toasts do sistema
│
├── lib/
│   ├── parsing-engine.ts           # Motor de parsing (B.7)
│   ├── dashboard-filters.ts        # Filtros do dashboard
│   ├── reflection-prompts.ts       # Prompts de reflexão
│   └── utils.ts                    # Utilitários (cn, etc)
│
├── types/
│   └── atom-engine.ts              # Tipos TypeScript do domínio
│
├── pages/
│   ├── Index.tsx                   # Dashboard principal
│   ├── Inbox.tsx                   # Inbox Engine UI (B.6)
│   ├── Projects.tsx                # Lista de projetos
│   ├── ProjectDetail.tsx           # Project Sheet (A.13)
│   ├── Calendar.tsx                # Calendário (B.4)
│   ├── RitualView.tsx              # Ritual imersivo (B.19)
│   ├── Journal.tsx                 # Página de reflexões
│   └── NotFound.tsx                # 404
│
└── integrations/
    └── supabase/                   # Cliente Supabase (auto-gerado)
```

## Arquitetura Visual

```
┌──────────────────────────────────────────────────────────────────┐
│                      PRESENTATION                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │Dashboard│ │  Inbox  │ │Projects │ │Calendar │ │ Journal │    │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘    │
├───────┼───────────┼───────────┼───────────┼───────────┼─────────┤
│       │     APPLICATION LAYER │           │           │          │
│  ┌────▼───────────▼───────────▼───────────▼───────────▼────┐    │
│  │                    Custom Hooks                          │    │
│  │  useDashboardData │ useCalendarItems │ useRitual │ etc   │    │
│  └──────────────────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │  Parsing  │ │ MacroPick │ │  Calendar │ │Reflection │        │
│  │  Engine   │ │  Engine   │ │  Engine   │ │  Engine   │        │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
├──────────────────────────────────────────────────────────────────┤
│                       DATA LAYER                                  │
│  ┌───────────────────────────────────────────────────────┐      │
│  │              Lovable Cloud (Supabase)                  │      │
│  │  ┌──────────────────────────────────────────────────┐ │      │
│  │  │  items (Single Table Design - inclui milestones) │ │      │
│  │  └──────────────────────────────────────────────────┘ │      │
│  └───────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

---

# MODELO DE DADOS

## Tabela: `items`

Single Table Design para todos os tipos de itens, incluindo milestones.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | Chave primária |
| `user_id` | uuid | FK para auth.users |
| `title` | text | Título do item |
| `type` | item_type | project, task, habit, note, reflection, resource, list |
| `module` | text | Módulo (work, body, mind, family, geral) |
| `tags` | text[] | Array de tags (inclui `#milestone` para milestones) |
| `parent_id` | uuid | FK para item pai |
| `project_id` | uuid | FK para projeto container |
| `due_date` | date | Data de vencimento |
| `ritual_slot` | ritual_slot | Slot de ritual (manha, meio_dia, noite) |
| `completed` | boolean | Estado de conclusão |
| `weight` | integer | Peso para cálculo de progresso (default: 1) |
| `notes` | text | Conteúdo/notas |
| `created_at` | timestamptz | Timestamp de criação |
| `updated_at` | timestamptz | Timestamp de atualização |

## Milestones (Single Table Design)

Milestones são items com tag `#milestone`:

| Propriedade | Valor |
|-------------|-------|
| `type` | 'task' |
| `tags` | Inclui '#milestone' |
| `weight` | 1-10 (padrão: 3) |
| `project_id` | UUID do projeto |

**Fórmula de Progresso:**
```
progresso = (soma_pesos_concluidos / soma_total_pesos) × 100%
```

## Enums

```sql
CREATE TYPE item_type AS ENUM (
  'project', 'task', 'habit', 'note', 
  'reflection', 'resource', 'list'
);

CREATE TYPE ritual_slot AS ENUM ('manha', 'meio_dia', 'noite');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE progress_mode AS ENUM ('auto', 'manual');
```

---

# ENGINES

## 1. Parsing Engine (B.7)

**Arquivo:** `src/lib/parsing-engine.ts`

Transforma texto cru em estrutura `ParsedInput`.

| Token | Exemplo | Resultado |
|-------|---------|-----------|
| `@hoje` | "Tarefa @hoje" | `due_date: today` |
| `@amanha` | "Tarefa @amanha" | `due_date: tomorrow` |
| `@ritual_manha` | "Meditar @ritual_manha" | `ritual_slot: "manha"`, `type: "habit"` |
| `#tag` | "Tarefa #urgente" | `tags: ["#urgente"]` |
| `#mod_*` | "Treino #mod_body" | `module: "body"` |

## 2. Inbox Engine (B.6)

**Arquivo:** `src/pages/Inbox.tsx`

Captura e processamento de itens brutos.

## 3. MacroPicker Engine (B.8)

**Arquivo:** `src/components/inbox/MacroPickerModal.tsx`

Modal de promoção de itens do inbox para projetos.

## 4. Dashboard Engine (B.10)

**Arquivo:** `src/hooks/useDashboardData.ts`

Filtros: focusItems, todayItems, overdueItems, ritualItems, projects.

## 5. Calendar Engine (B.4)

**Arquivo:** `src/pages/Calendar.tsx`

Visualização de itens no calendário com navegação avançada.

### Funcionalidades

- **Visualizações:** Mensal e Semanal
- **Filtros:** Por tipo (task, milestone, habit) e módulo
- **Drag & Drop:** Arrastar itens para reagendar
- **Overdue Section:** Itens atrasados destacados

### Navegação

| Método | Ação |
|--------|------|
| `M` | Visualização mensal |
| `W` | Visualização semanal |
| `←` / `→` | Mês/Semana anterior/próximo |
| `T` | Ir para hoje |
| Swipe | Navegação touch (mobile) |

### Hook useSwipe

```typescript
const { handlers, swipeState } = useSwipe({
  onSwipeLeft: () => { /* próximo */ },
  onSwipeRight: () => { /* anterior */ },
  threshold: 50,
});

// swipeState: { isSwiping, direction, offsetX, offsetY }
```

## 6. Ritual Engine (B.19)

**Arquivos:** `src/hooks/useRitual.ts`, `src/pages/RitualView.tsx`

Experiência imersiva para hábitos diários com check-in integrado.

### Fluxo do Ritual

```
1. Hábitos → Lista de hábitos do período com toggle de conclusão
2. Check-in → Pergunta contextual + textarea para reflexão
3. Encerramento → Retorna ao dashboard
```

## 7. Project Engine (B.9/B.13)

**Arquivos:** `src/hooks/useProjectProgress.ts`, `src/pages/ProjectDetail.tsx`

Gestão de projetos com milestones e Journal integrado.

## 8. Reflection Engine (B.11)

**Arquivos:** `src/pages/Journal.tsx`, `src/components/journal/*`

Sistema de journaling e reflexões.

### Características

- **Itens type='reflection'**: completed sempre false, due_date sempre null
- **Tags de Contexto**: #checkin, #mood:*, #ritual:*, #project:*
- **Timeline Visual**: Linha vertical conectando entradas
- **Filtros**: Por tag e por período (today, week, month, year)
- **Busca Full-Text**: Com highlight de termos encontrados
- **Prompts Guiados**: Perguntas por categoria

---

# API REFERENCE

## Tipos

### AtomItem

```typescript
interface AtomItem {
  id: string;
  user_id: string;
  title: string;
  type: ItemType;
  module: string | null;
  tags: string[];
  parent_id: string | null;
  project_id: string | null;
  due_date: string | null;
  recurrence_rule: string | null;
  ritual_slot: RitualSlot;
  completed: boolean;
  completed_at: string | null;
  weight: number | null;
  notes: string | null;
  checklist: ChecklistItem[];
  project_status: ProjectStatus | null;
  progress_mode: ProgressMode | null;
  progress: number | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}
```

### Enums TypeScript

```typescript
type ItemType = "project" | "task" | "habit" | "note" | "reflection" | "resource" | "list";
type RitualSlot = "manha" | "meio_dia" | "noite" | null;
type RitualPeriod = "aurora" | "zenite" | "crepusculo";
type ProjectStatus = "draft" | "active" | "paused" | "completed" | "archived";
type ProgressMode = "auto" | "manual";
type TimePeriod = "all" | "today" | "week" | "month" | "year";
```

## Hooks

### useAtomItems

```typescript
const { items, isLoading, createItem, updateItem, deleteItem } = useAtomItems();
```

### useCalendarItems

```typescript
const { items, itemsByDate, overdueItems, isLoading, refetch } = useCalendarItems(currentDate);
```

### useMilestones

```typescript
const { milestones, createMilestone, toggleComplete, deleteMilestone } = useMilestones(projectId);
```

### useProjectProgress

```typescript
const { progress, taskCount, milestoneCount } = useProjectProgress(projectItems, milestones);
```

### useDashboardData

```typescript
const { focusItems, todayItems, ritualItems, projects, toggleComplete } = useDashboardData();
```

### useRitual

```typescript
const { activePeriod, config, habits, progress, toggleHabit } = useRitual();
```

### useSwipe

```typescript
const { handlers, swipeState } = useSwipe({
  onSwipeLeft: () => {},
  onSwipeRight: () => {},
  threshold: 50,
});
```

---

# ROTAS

| Rota | Componente | Auth | Nav | Descrição |
|------|------------|------|-----|-----------|
| `/` | Index.tsx | ✅ | ✅ | Dashboard |
| `/inbox` | Inbox.tsx | ✅ | ✅ | Captura |
| `/projects` | Projects.tsx | ✅ | ✅ | Lista de projetos |
| `/projects/:id` | ProjectDetail.tsx | ✅ | ✅ | Project Sheet |
| `/calendar` | Calendar.tsx | ✅ | ✅ | Calendário |
| `/ritual` | RitualView.tsx | ✅ | ❌ | Ritual imersivo |
| `/journal` | Journal.tsx | ✅ | ✅ | Reflexões |

---

# DESIGN SYSTEM

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18.3 + Vite |
| **Linguagem** | TypeScript 5.0+ |
| **Styling** | Tailwind CSS 3.4 |
| **Backend** | Lovable Cloud (Supabase) |
| **State (Server)** | TanStack Query 5.x |
| **State (Client)** | Zustand 5.x |
| **Icons** | Lucide React |
| **Dates** | date-fns 3.x |
| **UI Components** | shadcn/ui |
| **Drag & Drop** | dnd-kit |

## Padrões de Código

### TypeScript

```typescript
// ✅ BOM - Tipagem explícita
const createItem = async (item: Omit<AtomItem, 'id'>): Promise<AtomItem> => {};

// ❌ RUIM - any
const createItem = async (item: any) => {};
```

### Tailwind CSS

```tsx
// ✅ BOM - Tokens semânticos
<div className="bg-background text-foreground border-border">

// ❌ RUIM - Cores diretas
<div className="bg-slate-900 text-white">
```

---

# GUIA DE CONTRIBUIÇÃO

## Fluxo de Trabalho

1. **Entenda o Contexto** - Leia a documentação relevante
2. **Planeje** - Qual engine será afetado? Precisa de nova tabela?
3. **Implemente** - Modelo → Hooks → Componentes
4. **Documente** - Atualize CHANGELOG

## Convenções de Commit

```
<tipo>(<escopo>): <descrição>

feat(calendar): add keyboard navigation
fix(parsing-engine): handle empty input
docs(api): add useSwipe documentation
```

## Debug Console (God Mode)

Use `Ctrl+Shift+E` para:

1. **Tab State**: Ver JSON dos items carregados
2. **Tab Logs**: Ver logs dos engines
3. **Tab Input Test**: Testar o Parsing Engine
4. **Tab Tokens**: Referência de tokens disponíveis

---

# CHANGELOG

## [4.0.0-alpha.10] - 2025-12-16

### Adicionado

#### Calendar Engine - Navegação Avançada
- **Atalhos de Teclado:** M (mensal), W (semanal), ← → (navegação), T (hoje)
- **Suporte a Touch/Swipe (Mobile):** Navegação por gestos
- **Feedback Visual:** Indicadores de seta durante swipe
- **Hook useSwipe:** Retorna `handlers` e `swipeState`

---

## [4.0.0-alpha.9] - 2025-12-16

### Adicionado
- **Single Table Design:** Milestones unificados na tabela `items`
- **Coluna `weight`:** Peso customizável (1-10x)
- **Tag `#milestone`:** Identificação de milestones

---

## [4.0.0-alpha.8] - 2025-12-15

### Adicionado
- **Reflection Engine (B.11):** Journal com prompts guiados
- **Check-in no Ritual:** Reflexão integrada ao fluxo
- **Busca Full-Text:** Com highlight de termos
- **Atalho ⌘J:** Acesso rápido ao Journal

---

## [4.0.0-alpha.7] - 2025-12-15

### Adicionado
- **Command Palette (⌘K):** Navegação rápida
- **Mobile Navigation:** Drawer sidebar
- **Ritual View Mobile:** Footer fixo

---

## [4.0.0-alpha.6] - 2025-12-15

### Adicionado
- **Empty States:** Ilustrações SVG customizadas
- **Confetti Celebration:** Ao completar todas as tasks
- **Haptic Feedback:** Vibração no drag & drop mobile

---

## [4.0.0-alpha.5] - 2025-12-15

### Adicionado
- **Project Sheet (A.13):** 4 abas completas
- **useMilestones Hook:** CRUD de milestones
- **useProjectProgress:** Cálculo híbrido

---

## [4.0.0-alpha.4] - 2025-12-15

### Adicionado
- **Ritual View (B.19):** Experiência imersiva
- **Detecção de Período:** Aurora, Zênite, Crepúsculo
- **useRitual Hook:** Lógica completa

---

## [4.0.0-alpha.3] - 2025-12-15

### Adicionado
- **Dashboard Engine (B.10):** Filtros organizados
- **Project Engine (B.9):** Lista e cards
- **AppNavigation:** Sidebar + Bottom nav

---

## [4.0.0-alpha.2] - 2025-12-15

### Adicionado
- **Inbox Engine (B.6):** Captura de itens
- **MacroPicker Engine (B.8):** Promoção de itens

---

## [4.0.0-alpha.1] - 2025-12-15

### Adicionado
- **Banco de Dados:** Tabela `items` com RLS
- **Parsing Engine (B.7):** Parser de linguagem natural
- **Debug Console:** God Mode para validação
- **Autenticação:** Login/Signup com Supabase

---

# STATUS DE IMPLEMENTAÇÃO

## ✅ Engines Implementados
- [x] Parsing Engine (B.7)
- [x] Inbox Engine (B.6)
- [x] MacroPicker Engine (B.8)
- [x] Dashboard Engine (B.10)
- [x] Calendar Engine (B.4)
- [x] Ritual Engine (B.19)
- [x] Project Engine (B.9/B.13)
- [x] Reflection Engine (B.11)

## ✅ UI Implementada
- [x] Dashboard com Focus/Today/Ritual
- [x] Inbox com captura rápida
- [x] Project Sheet com 4 abas
- [x] Calendar com drag & drop
- [x] Ritual View com Check-in
- [x] Journal com prompts e busca
- [x] Command Palette (⌘K)
- [x] Empty States ilustrados
- [x] Confetti de celebração

## 🔲 Próximas Etapas
- [ ] CRUD completo para reflexões
- [ ] Exportação do Journal em Markdown
- [ ] Recorrência de hábitos (RRULE)
- [ ] Notificações e lembretes
- [ ] Estatísticas e analytics
- [ ] PWA + Offline mode

---

<div align="center">

**MindMate - Atom Engine 4.0** 💚

</div>
