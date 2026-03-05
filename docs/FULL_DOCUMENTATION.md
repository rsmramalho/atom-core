# MindMate - Atom Engine 4.0
# Documentação Completa Consolidada

**Versão:** 4.0.0-beta.0  
**Data:** 2026-03-05  
**Status:** ✅ **Beta** - Collaboration + Push + AI + Zod Validation

> Esta versão representa o marco estável do Atom Engine 4.0, com todas as funcionalidades core
> implementadas e testadas. Refatoração arquitetural completa: auth centralizada, Landing componentizada (9 seções),
> AppNavigation modularizada, QueryClient otimizado, 6 deps Radix adicionais removidas.

---

# ÍNDICE

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Atalhos de Teclado](#atalhos-de-teclado)
4. [Arquitetura](#arquitetura)
5. [Modelo de Dados](#modelo-de-dados)
6. [Engines](#engines)
7. [Integrity Guards (B.3)](#integrity-guards-b3)
8. [API Reference](#api-reference)
9. [Rotas](#rotas)
10. [Design System](#design-system)
11. [Guia de Contribuição](#guia-de-contribuição)
12. [Testes & CI/CD](#testes--cicd) ⭐ NOVO
13. [Changelog](#changelog)

## Documentos Relacionados

| Documento | Descrição |
|-----------|-----------|
| [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) | Resumo executivo de 1 página |
| [FORK_GUIDE.md](./FORK_GUIDE.md) | Guia completo para configurar ambiente de desenvolvimento a partir do milestone |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Checklist para deploy em produção |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Visão geral da arquitetura |
| [API.md](./API.md) | Referência de API |
| [CHANGELOG.md](./CHANGELOG.md) | Histórico de versões |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guia de contribuição |

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

📋 Listas (/lists)
├── Grid de cards estilo Keep
├── Cores personalizadas (18 opções)
├── Drag & Drop para reordenar
└── Ações: duplicar, limpar, excluir

📊 Estatísticas (/analytics) ⭐ NOVO
├── Cards de resumo (tarefas, streaks, projetos)
├── Comparativo semanal (vs semana anterior)
├── Gráfico de atividade semanal
├── Evolução de streaks (30 dias)
└── Distribuição por módulo
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
- **Exportação Multi-formato** 
  - Markdown (.md) - Texto formatado
  - JSON (.json) - Dados estruturados
  - PDF (via impressão) - Documento formatado

## 📊 Analytics Dashboard ⭐ NOVO

Estatísticas e métricas de produtividade:

- **Cards de Resumo:** Tarefas concluídas, maior streak, projetos ativos, reflexões
- **Comparativo Semanal:** Esta semana vs semana anterior com indicadores de variação
- **Atividade Semanal:** Gráfico de barras com tarefas concluídas por dia
- **Evolução de Streaks:** Gráfico de linha dos 3 hábitos mais ativos (30 dias)
- **Distribuição por Módulo:** Gráfico pizza de itens por categoria
- **Taxa de Conclusão:** Progresso geral de tarefas

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

## 📋 List Engine ⭐ NOVO

Listas rápidas para organizar itens simples (compras, filmes, ideias):

- **Cores Personalizadas:** 18 opções de cores via picker
- **Grid Layout:** Estilo Google Keep
- **Drag & Drop:** Reordenação de itens
- **Ações Rápidas:** Duplicar, limpar concluídos, excluir
- **Hierarquia:** Listas são `type='list'`, itens são tasks com `parent_id`
- **Isolamento:** Itens de listas não aparecem no Dashboard Today

## 🔥 Habit Streaks

Sistema de gamificação para hábitos:

- **StreakBadge:** Badge visual mostrando dias consecutivos
- **HabitHeatmap:** Calendário de histórico de conclusões
- **Métricas:** Streak atual, maior streak, % conclusão mensal

## 📶 Offline Sync ⭐ NOVO

Sistema robusto de sincronização offline com PWA:

- **Network Status:** Detecção automática de conectividade
- **Offline Queue:** Operações salvas em IndexedDB quando offline
- **Auto-Sync:** Sincronização automática ao reconectar
- **Cache Local:** Dados salvos em localStorage para leitura offline
- **Indicador Visual:** Badge flutuante com status de pendências
- **Gestão de Pendências:** Modal para visualizar/cancelar operações

## 🔔 Notificações e Lembretes ⭐ NOVO

Sistema de lembretes via Web Notifications API:

- **Permissão do Navegador:** Solicitação de permissão com UI amigável
- **Lembretes Configuráveis:** Tarefas atrasadas, para hoje, para amanhã
- **Notificações Agrupadas:** Resumo diário evitando spam
- **Configurações Persistentes:** Preferências salvas em localStorage
- **Controle Individual:** Liga/desliga cada tipo de lembrete

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
| `⌘⇧L` | **Listas** ⭐ NOVO |
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
│   │   ├── InboxItemCardSkeleton.tsx # Skeleton loading
│   │   └── MacroPickerModal.tsx    # Modal de promoção (B.8)
│   ├── dashboard/
│   │   ├── FocusBlock.tsx          # Bloco de itens #focus
│   │   ├── RitualBanner.tsx        # Banner do ritual ativo
│   │   └── TodayList.tsx           # Lista do dia
│   ├── calendar/
│   │   ├── CalendarGrid.tsx        # Grid mensal
│   │   ├── CalendarGridSkeleton.tsx # Skeleton loading
│   │   ├── WeekGrid.tsx            # Grid semanal
│   │   ├── DayCell.tsx             # Célula do dia
│   │   ├── CalendarItem.tsx        # Item no calendário
│   │   ├── CalendarFilters.tsx     # Filtros tipo/módulo
│   │   └── OverdueSection.tsx      # Itens atrasados
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
│   ├── landing/                      # ⭐ Landing page componentizada (alpha.22)
│   │   ├── HeroSection.tsx          # Hero com CTA principal
│   │   ├── PillarSection.tsx        # 3 Pilares (Capturar, Organizar, Refletir)
│   │   ├── AgnosticSection.tsx      # Agnóstico de metodologia
│   │   ├── FeaturesSection.tsx      # Features operacionais e zen
│   │   ├── BenefitsSection.tsx      # Benefícios com terminal animado
│   │   ├── DeveloperSection.tsx     # Para desenvolvedores (fork-friendly)
│   │   ├── FAQSection.tsx           # Perguntas frequentes
│   │   ├── CTASection.tsx           # CTA final
│   │   ├── LandingNav.tsx           # Navbar da landing
│   │   ├── LandingFooter.tsx        # Footer da landing
│   │   ├── DemoModal.tsx            # Modal de demonstração
│   │   └── shared.tsx               # Componentes compartilhados (FeatureCard, etc.)
│   ├── layout/                      # ⭐ Refatorado (alpha.22)
│   │   ├── AppLayout.tsx            # Layout com auth centralizada (único ponto)
│   │   ├── AppNavigation.tsx        # Nav compositor (~270 linhas)
│   │   ├── NavItemList.tsx          # Lista de links de navegação (extraído)
│   │   ├── SyncStatus.tsx           # Indicador de sincronização (extraído)
│   │   ├── SidebarActions.tsx       # Ações: debug, cache, backup, logout (extraído)
│   │   ├── CommandPalette.tsx       # Busca global (⌘K)
│   │   ├── KeyboardShortcutsHelp.tsx # Modal de atalhos
│   │   └── PageTransition.tsx       # AnimatePresence wrapper (forwardRef)
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
│   ├── useCurrentUser.ts            # ⭐ Cache de sessão (alpha.23)
│   ├── useAtomItems.ts             # CRUD de itens via Supabase
│   ├── useDashboardData.ts         # Filtros do dashboard (B.10)
│   ├── useCalendarItems.ts         # Items para calendário
│   ├── useMilestones.ts            # CRUD de milestones
│   ├── useProjectProgress.ts       # Cálculo de progresso híbrido
│   ├── useRitual.ts                # Lógica do ritual (B.19)
│   ├── useRecurrence.ts            # Virtual projection
│   ├── useNetworkStatus.ts         # Detecção online/offline
│   ├── useOfflineSync.ts           # Sync queue management
│   ├── useNotifications.ts         # Web Notifications API (in-app)
│   ├── usePushNotifications.ts     # ⭐ Web Push via VAPID (alpha.25)
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
│   ├── Landing.tsx                  # Compositor da landing (importa 9 seções)
│   ├── Index.tsx                    # Dashboard (assume autenticado)
│   ├── Inbox.tsx                    # Inbox Engine UI (B.6)
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

## Arquitetura de Autenticação (alpha.23)

### Fluxo Otimizado

```
AppLayout.tsx
  └── supabase.auth.onAuthStateChange()  ← Única fonte de verdade
        │
        ▼
useCurrentUser.ts (cache global)
  ├── cachedUser (variável módulo)       ← Sync, sem rede
  ├── useCurrentUser() hook              ← Para componentes React
  └── getCurrentUserId() async           ← Para queries/mutations
        │
        ▼
  Hooks de dados (sem getUser() redundante)
  ├── useAtomItems.ts     → getCurrentUserId()
  ├── useCalendarItems.ts → getCurrentUserId()
  ├── useMilestones.ts    → getCurrentUserId()
  └── useRitual.ts        → getCurrentUserId()
```

### Antes vs Depois

| Métrica | alpha.22 | alpha.23 |
|---------|----------|----------|
| Chamadas `getUser()` por página | 3-7 (async, rede) | 0 (cache síncrono) |
| Listeners `onAuthStateChange` | Duplicados em páginas | 1 central + 1 cache |
| Auth em `Inbox.tsx` | Estado local + useEffect | Nenhum (hook resolve) |

### API

```typescript
// Em componentes React
const user = useCurrentUser(); // User | null (reativo)

// Em funções de query/mutation
const userId = await getCurrentUserId(); // string (throws se não autenticado)
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
CREATE TYPE progress_mode AS ENUM ('auto', 'manual', 'milestone');
```

## Types (Fase 5: Type Safety) ⭐ NOVO

### `src/types/auth.ts`

Tipos centralizados para autenticação:

```typescript
// Interface completa baseada no schema Supabase Auth
interface UserProfile {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string | null;
  phone: string;
  // ... metadata completa
}

// Re-export do tipo Supabase para consistência
import type { User } from '@supabase/supabase-js';
export type { User };

// Tipagem de erros de autenticação
interface AuthError {
  message: string;
  status?: number;
  code?: string;
}
```

### `src/types/database.ts`

Tipos para mapeamento seguro de rows do banco:

```typescript
// Tipo bruto da tabela items
type ItemsRow = Tables<'items'>;

// Versão tipada com conversões seguras
interface TypedItemsRow {
  id: string;
  user_id: string;
  title: string;
  type: ItemType;
  tags: string[] | null;
  ritual_slot: RitualSlot | null;
  checklist: ChecklistItem[] | null;
  // ... todas as propriedades tipadas
}

// Helper para casting seguro
function asTypedRow(row: ItemsRow): TypedItemsRow;

// Tipos de onboarding
type OnboardingProgressRow = Tables<'onboarding_progress'>;
type OnboardingAnalyticsRow = Tables<'onboarding_analytics'>;

// Tipo para payloads de update
type UpdatePayload = Record<string, string | number | boolean | null | Json | string[]>;

// Tipo para logs do debug console
interface EngineLogEntry {
  timestamp: string;
  engine: string;
  action: string;
  details?: Record<string, unknown>;
}
```

### Zero Any Policy

A Fase 5 eliminou todos os 15 usos de `any` encontrados na auditoria:

| Categoria | Arquivos Corrigidos |
|-----------|---------------------|
| **Auth State** | `Index.tsx`, `Inbox.tsx`, `AppLayout.tsx`, `AuthForm.tsx` |
| **DB Mappers** | `useAtomItems.ts`, `useMilestones.ts`, `useCalendarItems.ts` |
| **UI Components** | `FocusBlock.tsx`, `OnboardingContext.tsx`, `EngineDebugConsole.tsx`, `RecurrencePickerModal.tsx` |
| **Engine** | `recurrence-engine.ts` |

**Validação:**
- ✅ `grep ': any'` → 0 ocorrências em produção
- ✅ `grep 'as any'` → 1 ocorrência (intencional em teste)
- ✅ Build TypeScript sem erros

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

## 7. Project Engine (B.9/A.18) - Inteligência de Projetos

**Arquivos:** `src/hooks/useProjectProgress.ts`, `src/pages/ProjectDetail.tsx`, `src/components/project-sheet/ProjectStatusDropdown.tsx`, `src/components/project-sheet/ProjectSettingsModal.tsx`

Gestão de projetos com State Machine e Progress Engine Híbrido.

### State Machine (Ciclo de Vida)

```
┌────────┐     ┌────────┐     ┌───────────┐
│  Draft │ ──▶ │ Active │ ──▶ │ Completed │
└────────┘     └───┬────┘     └─────┬─────┘
                   │                │
                   ▼                ▼
              ┌────────┐      ┌──────────┐
              │ Paused │      │ Archived │
              └────────┘      └──────────┘
```

| Status | Ícone | Comportamento |
|--------|-------|---------------|
| `draft` | ⬜ | Projeto em planejamento |
| `active` | ▶️ | Projeto ativo - itens contam para estatísticas |
| `paused` | ⏸️ | Projeto pausado - **itens NÃO contam para estatísticas globais** |
| `completed` | ✅ | Projeto concluído - **confetti animation** + criação de tasks travada |
| `archived` | 📦 | Projeto arquivado - criação de tasks travada |

**Regras de Negócio:**
- Projetos `paused` são excluídos de `calculateGlobalProgress()`
- Transição para `completed` dispara celebração visual (Confetti)
- Projetos `completed` ou `archived` bloqueiam criação de novas tasks/milestones

### Progress Engine Híbrido (A.18)

Três modos de cálculo de progresso configuráveis por projeto:

| Modo | Fórmula | Uso |
|------|---------|-----|
| `auto` | `(Tasks + Milestones concluídos) / Total * 100` | Padrão - considera tudo |
| `milestone` | `(Soma pesos milestones concluídos) / Soma total pesos * 100` | Ignora tasks - só milestones |
| `manual` | Valor definido pelo usuário (0-100) | Controle total do progresso |

**Hook useProjectProgress:**
```typescript
const result = useProjectProgress(projectItems, {
  mode: 'auto' | 'milestone' | 'manual',
  manualProgress: 50, // usado apenas no modo manual
});

// Retorno:
{
  progress: number;           // 0-100
  totalWeight: number;        // Soma de pesos
  completedWeight: number;    // Pesos concluídos
  taskCount: number;          // Total de tasks
  taskCompletedCount: number; // Tasks concluídas
  milestoneCount: number;     // Total de milestones
  milestoneCompletedCount: number; // Milestones concluídas
  mode: ProgressMode;         // Modo ativo
}
```

**Componentes UI:**
- `ProjectStatusDropdown`: Dropdown com ícones e confirmação para transições sensíveis
- `ProjectSettingsModal`: Modal para configurar modo de progresso e valor manual

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

## 9. Offline Sync Engine ⭐ NOVO

**Arquivos:** `src/hooks/useOfflineSync.ts`, `src/hooks/useNetworkStatus.ts`, `src/lib/offline-queue.ts`, `src/lib/local-cache.ts`, `src/components/pwa/*`

Sistema de sincronização offline com suporte a PWA.

### Arquitetura Multi-Camada

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │PendingIndicator │  │PendingOpsModal  │                   │
│  └────────┬────────┘  └────────┬────────┘                   │
├───────────┼────────────────────┼────────────────────────────┤
│           │    CONTEXT LAYER   │                            │
│  ┌────────▼────────────────────▼────────┐                   │
│  │       OfflineSyncProvider            │                   │
│  │  (useOfflineSync + useNetworkStatus) │                   │
│  └──────────────────────────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                     DATA LAYER                               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │  IndexedDB    │  │  localStorage │  │ Service Worker│   │
│  │ (offline-queue│  │ (local-cache) │  │   (Workbox)   │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Hooks e Funções

| Hook/Função | Arquivo | Descrição |
|-------------|---------|-----------|
| `useNetworkStatus()` | `useNetworkStatus.ts` | Detecta conectividade via `navigator.onLine` e eventos |
| `useOfflineSync()` | `useOfflineSync.ts` | Hook principal: queue, sync, pendingCount |
| `addToQueue()` | `offline-queue.ts` | Adiciona operação à fila IndexedDB |
| `getQueuedOperations()` | `offline-queue.ts` | Lista operações pendentes |
| `removeFromQueue()` | `offline-queue.ts` | Remove operação da fila |
| `clearQueue()` | `offline-queue.ts` | Limpa todas as operações |
| `saveToLocalCache()` | `local-cache.ts` | Salva items no localStorage |
| `getFromLocalCache()` | `local-cache.ts` | Recupera items do cache |

### Fluxo de Operações

```
ONLINE:
  Operação → Supabase → Sucesso → Atualiza cache local

OFFLINE:
  Operação → addToQueue() → IndexedDB → Toast "Salvo offline"
                                     ↓
  Conexão restaurada → syncPendingOperations() → Processa fila
                                               ↓
                     Sucesso → removeFromQueue() + Toast "Sincronizado"
                     Falha   → updateRetryCount() (max 3 tentativas)
```

### Componentes UI

| Componente | Descrição |
|------------|-----------|
| `NetworkStatusIndicator` | Badge mostrando online/offline |
| `PendingIndicator` | Botão flutuante com contagem de pendências, pulsa após 30s |
| `PendingOperationsModal` | Modal para visualizar/cancelar operações pendentes |

### Estratégias de Cache (Service Worker)

```javascript
// vite.config.ts - vite-plugin-pwa
runtimeCaching: [
  {
    urlPattern: /supabase\.co\/rest\/v1/,
    handler: 'NetworkFirst',
    options: { networkTimeoutSeconds: 10 }
  },
  {
    urlPattern: /fonts\.googleapis\.com/,
    handler: 'CacheFirst',
    options: { expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } }
  },
  {
    urlPattern: /\.(png|jpg|jpeg|svg|gif)$/,
    handler: 'CacheFirst',
    options: { expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 } }
  }
]
```

---

# INTEGRITY GUARDS (B.3)

O Atom Engine implementa guardas de integridade críticas que garantem a consistência semântica dos dados. Estas regras são aplicadas na camada de dados e não podem ser contornadas pela UI.

## 1. Reflection Lock (Trava de Reflexão)

**Regra:** Itens com `type === 'reflection'` NUNCA podem ter `completed = true`.

**Justificativa:** Reflexões são itens não-acionáveis por natureza. Elas representam pensamentos, sentimentos e insights - não tarefas a serem concluídas.

**Implementação:**
```typescript
// src/hooks/useAtomItems.ts - updateMutation
if (payload.completed === true) {
  const { data: existingItem } = await supabase
    .from("items")
    .select("type")
    .eq("id", id)
    .single();
  
  if (existingItem?.type === "reflection") {
    throw new Error("Reflections cannot be marked as completed.");
  }
}
```

**UI:** O JournalFeed e JournalEntry não renderizam checkboxes de conclusão.

## 2. Milestone Isolation (Isolamento de Milestones)

**Regra:** Itens com tag `#milestone` são EXCLUÍDOS de listas operacionais (Inbox, Today, Focus, Calendar geral). Eles só aparecem em contextos de projeto.

**Justificativa:** Milestones representam marcos de projeto, não tarefas do dia-a-dia. Misturá-los com tarefas operacionais polui a visão diária do usuário.

**Implementação:**
```typescript
// src/lib/dashboard-filters.ts
export function isMilestone(item: AtomItem): boolean {
  return item.tags?.some((tag) => tag.toLowerCase() === "#milestone") || false;
}

export function isOperationalItem(item: AtomItem): boolean {
  if (item.type === "reflection") return false;
  if (isMilestone(item)) return false;
  return true;
}

// Aplicado em filterFocus(), filterToday(), useCalendarItems()
```

**Locais afetados:**
| Função/Hook | Comportamento |
|-------------|---------------|
| `filterFocus()` | Exclui milestones |
| `filterToday()` | Exclui milestones e reflections |
| `useCalendarItems()` | Filtra milestones de `items` e `overdueItems` |
| `Inbox.tsx` | Exclui itens com `#milestone` da lista |

## 3. Atomic MacroPicker Cleanup

**Regra:** Ao promover um item do Inbox para Projeto, a tag `#inbox` é removida na MESMA operação que adiciona o `project_id`.

**Justificativa:** Garante atomicidade da transição. O item nunca fica em estado inconsistente (com #inbox E project_id ao mesmo tempo).

**Implementação:**
```typescript
// src/pages/Inbox.tsx - handlePromote
// Remove #inbox tag
let updatedTags = item.tags.filter(t => t.toLowerCase() !== "#inbox");

// Add #macro:ProjectName tag
updatedTags = [...updatedTags, `#macro:${projectName.replace(/\s+/g, "_")}`];

// Single atomic update
await updateItem({
  id: itemId,
  type: newType,
  project_id: projectId,
  tags: updatedTags,  // ← Tags já limpas
  ritual_slot: ritualSlot || null,
  module: finalModule,
});
```

## Testes de Integridade

Arquivo: `src/lib/dashboard-filters.test.ts`

```typescript
describe("Integrity Guards (Engine B.3)", () => {
  // isMilestone - 5 testes
  // isOperationalItem - 5 testes  
  // Milestone Isolation in filterFocus - 2 testes
  // Milestone Isolation in filterToday - 3 testes
  // Reflection Lock - 3 testes
  // Edge Cases - 3 testes
});
```

Total: **21 testes de integridade**

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
type ProgressMode = "auto" | "manual" | "milestone";
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
const { 
  progress, 
  totalWeight,
  completedWeight,
  taskCount, 
  taskCompletedCount,
  milestoneCount,
  milestoneCompletedCount,
  mode 
} = useProjectProgress(projectItems, {
  mode: 'auto',       // 'auto' | 'milestone' | 'manual'
  manualProgress: 0,  // usado apenas no modo 'manual'
});
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
| `/` | Landing.tsx | ❌ | ❌ | Landing page de marketing |
| `/app` | Index.tsx | ✅ | ✅ | Dashboard principal |
| `/inbox` | Inbox.tsx | ✅ | ✅ | Captura |
| `/projects` | Projects.tsx | ✅ | ✅ | Lista de projetos |
| `/projects/:id` | ProjectDetail.tsx | ✅ | ✅ | Project Sheet |
| `/calendar` | Calendar.tsx | ✅ | ✅ | Calendário |
| `/ritual` | RitualView.tsx | ✅ | ❌ | Ritual imersivo |
| `/journal` | Journal.tsx | ✅ | ✅ | Reflexões |
| `/lists` | Lists.tsx | ✅ | ✅ | Listas rápidas |
| `/analytics` | Analytics.tsx | ✅ | ✅ | Métricas e estatísticas |
| `/install` | Install.tsx | ❌ | ❌ | Guia de instalação PWA |
| `/privacy` | Privacy.tsx | ❌ | ❌ | Política de privacidade |

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

## Micro-Animações (Fase 6) ⭐ NOVO

### Classes Utilitárias

```css
/* Cards interativos */
.card-interactive {
  @apply transition-all duration-200 ease-out cursor-pointer
         hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20
         active:scale-[0.99] active:shadow-sm;
}

/* Hover com elevação */
.hover-lift {
  @apply transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md;
}

/* Hover com escala */
.hover-scale {
  @apply transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98];
}

/* Hover com glow */
.hover-glow {
  @apply transition-shadow duration-200 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)];
}

/* Efeito de press */
.press-effect {
  @apply transition-transform duration-100 active:scale-[0.97];
}
```

### Componentes Animados

| Componente | Animação |
|------------|----------|
| **Button** | `active:scale-[0.98]` + `hover:shadow-md` |
| **Card** | Variant `CardInteractive` com lift + shadow |
| **Checkbox** | Hover glow + zoom no check icon |
| **Switch** | Hover glow + thumb shadow on checked |
| **Badge** | Variant `interactive` com scale |
| **Progress** | Transição suave de 500ms |

### Keyframes Customizados

```typescript
// tailwind.config.ts
keyframes: {
  "btn-press": { "50%": { transform: "scale(0.97)" } },
  "card-lift": { to: { transform: "translateY(-2px) scale(1.01)" } },
  "pulse-soft": { "50%": { opacity: "0.8" } },
  "shimmer": { to: { backgroundPosition: "200% 0" } },
}
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

# TESTES & CI/CD

## Visão Geral

O MindMate possui uma suíte de testes abrangente com integração contínua via GitHub Actions.

## Tipos de Testes

### 1. Testes Unitários (Vitest)

```bash
npm run test
```

- **150+ testes** cobrindo:
  - Parsing Engine (tokens temporais, contexto, módulos)
  - Dashboard filters (filterFocus, filterToday, filterRitual)
  - Cálculo de progresso de projetos
  - Offline queue (IndexedDB)
  - Integrity guards (arquitetura)

### 2. Testes E2E (Playwright)

```bash
npx playwright test
```

**Projetos disponíveis:**

| Projeto | Comando | Descrição |
|---------|---------|-----------|
| `public` | `--project=public` | Fluxos não autenticados |
| `authenticated` | `--project=authenticated` | Fluxos com login |
| `mobile` | `--project=mobile` | Viewport mobile (Pixel 5) |
| `visual` | `--project=visual` | Regressão visual |

**Nota:** Os testes E2E **não requerem** `SUPABASE_SERVICE_ROLE_KEY`. Usam signup/login normal com auto-confirmação de email habilitada.

### 3. Testes Visuais

```bash
npx playwright test --project=visual --update-snapshots
```

- Capturam screenshots de páginas e componentes
- Comparam com baselines armazenadas
- Detectam regressões visuais automaticamente

## CI/CD com GitHub Actions

O workflow `.github/workflows/test.yml` executa automaticamente em push/PR:

### Jobs

| Job | Descrição | Quando |
|-----|-----------|--------|
| **Unit Tests** | Vitest + coverage | Sempre |
| **E2E Tests** | Playwright (public, authenticated, mobile) | Sempre |
| **Visual Regression** | Screenshots comparativos | Apenas `main` |

### Configuração

```yaml
# Não requer secrets para testes E2E!
# Auto-confirm está habilitado no Supabase Auth
```

### Artefatos

Em caso de falha, o workflow faz upload de:
- `playwright-report/` - Relatório HTML completo
- `e2e-screenshots/` - Screenshots de diferenças visuais
- `coverage/` - Relatório de cobertura

## Executando Localmente

```bash
# Instalar dependências
npm install
npx playwright install

# Rodar testes unitários
npm run test

# Rodar testes E2E
npx playwright test --project=public
npx playwright test --project=authenticated

# Ver relatório HTML
npx playwright show-report
```

---

# CHANGELOG

## [4.0.0-alpha.21] - 2026-03-04

### Removido

#### Code Audit & Cleanup 🧹
- **17 Componentes UI não utilizados:** resizable, input-otp, carousel, drawer, hover-card, menubar, navigation-menu, toggle-group, sidebar, pagination, breadcrumb, table, aspect-ratio, avatar, alert, form, use-toast (duplicata)
- **6 Dependências npm:** react-resizable-panels, input-otp, embla-carousel-react, vaul, @hookform/resolvers, react-hook-form
- **Arquivos órfãos:** `public/placeholder.svg`, `src/hooks/use-mobile.tsx`

### Verificado
- Zero erros de build
- Todas as páginas testadas end-to-end
- Nenhuma regressão funcional

---

## [4.0.0-alpha.19] - 2025-12-17

### Adicionado

#### Fase 6: Performance & UX ⭐ NOVO

##### Error Handling
- **ErrorBoundary Global:** Componente class-based com fallback UI elegante
- **Botões de Recuperação:** "Tentar novamente", "Voltar ao início", "Recarregar"
- **Detalhes Técnicos:** Collapsible em modo dev com stack trace

##### Loading States
- **Suspense Boundaries:** Todas as rotas com React.Suspense
- **PageLoader:** Componente de loading com animação Framer Motion
- **Skeleton Components:**
  - `ProjectCardSkeleton` / `ProjectCardSkeletonGrid`
  - `InboxItemCardSkeleton` / `InboxItemCardSkeletonList`
  - `CalendarGridSkeleton`

##### Performance Optimizations
- **React.lazy:** Pages secundárias lazy-loaded (Inbox, Projects, Calendar, etc.)
- **React.memo:** Aplicado em `ProjectCard`, `InboxItemCard`, `CalendarItem`
- **Lazy SVG Illustrations:** Empty-states com ilustrações lazy-loaded

##### Page Transitions
- **AnimatePresence:** Wrapper de rotas com animações de entrada/saída
- **PageTransition:** Fade + slide (200ms) em todas as navegações
- **Smooth UX:** Transições consistentes entre todas as páginas

##### Micro-Animações
- **Buttons:** `active:scale-[0.98]` + `hover:shadow-md` em todos os variants
- **Cards:** Nova classe `.card-interactive` com lift + shadow
- **CardInteractive:** Novo componente exportado de card.tsx
- **Checkbox:** Hover glow + zoom animation no check icon
- **Switch:** Hover glow + thumb shadow quando checked
- **Badge:** Novo variant `interactive` com scale
- **Progress:** Transição suave de 500ms com gradient no 100%

##### CSS Utilities (index.css)
- `.hover-lift` - Elevação suave no hover
- `.hover-scale` - Escala sutil no hover
- `.hover-glow` - Glow com cor primária
- `.press-effect` - Feedback de press
- `.card-interactive` - Combinação completa para cards
- `.badge-interactive` - Para badges clicáveis
- `.icon-btn-hover` - Para botões de ícone
- `.attention-pulse` - Pulse suave para chamar atenção

##### Tailwind Keyframes (tailwind.config.ts)
- `btn-press` - Animação de botão pressionado
- `card-lift` - Elevação de card
- `pulse-soft` - Pulse suave
- `shimmer` - Efeito shimmer para loading

### Técnico

- **Build:** Zero erros TypeScript
- **Testes:** 150+ testes unitários não afetados (mudanças são UI-only)
- **Bundle:** Lazy loading reduz tamanho inicial

---

## [4.0.0-alpha.25] - 2026-03-04 🔔 PUSH NOTIFICATIONS

> **Web Push Notifications com VAPID Keys** - Lembretes mesmo com o app fechado

### Adicionado

#### Push Notifications Architecture
- **`push_subscriptions` table** — Armazena endpoints e chaves de encriptação por usuário
- **`usePushNotifications` hook** — Subscribe/unsubscribe via PushManager API
- **`send-push-notification` Edge Function** — Envia push via VAPID/WebCrypto
- **`check-due-tasks` Edge Function** — Cron job (3h) verifica tarefas vencidas
- **`sw-push.js`** — Handler de `push` e `notificationclick` no Service Worker
- **Botão "Enviar teste"** — Dispara push de teste ao próprio usuário via edge function

### Alterado
- **NotificationSettings UI** — Novo toggle "Push Notifications" com status visual + botão de teste
- **Service Worker** — `importScripts` para push handler
- **supabase/config.toml** — Edge functions com `verify_jwt = false`

### Infraestrutura
- Tabela `push_subscriptions` com RLS
- Cron via `pg_cron` + `pg_net` a cada 3 horas
- VAPID keys como secrets no backend

---

### Adicionado

#### Fase 6: Performance & UX Polish
- **ErrorBoundary Global:** Componente de fallback elegante com opções retry/home/reload
- **Suspense Boundaries:** Em todas as rotas com PageLoader contextual
- **Skeleton Components:** ProjectCardSkeleton, InboxItemCardSkeleton, CalendarGridSkeleton
- **React.memo:** Aplicado em ProjectCard, InboxItemCard, CalendarItem
- **React.lazy:** Carregamento lazy para páginas secundárias
- **PageTransition:** AnimatePresence com fade + slide (200ms)
- **Micro-animações:** Buttons, cards, checkboxes, switches, badges, progress bars
- **Ritual View Polish:** Empty state, step transitions, completion feedback

---

## [4.0.0-alpha.24] - 2026-03-04 🔍 CODE AUDIT

> **Auditoria de código** - Fix de anti-patterns React, tradução de UI

### Corrigido

#### useMemo Side-Effect Anti-Pattern (`JournalFeed.tsx`)
- Duas chamadas `useMemo` usadas para disparar side effects (callbacks do parent) substituídas por `useEffect`
- `useMemo` é para memoização de valores; side effects devem usar `useEffect`

### Alterado

#### AuthForm Traduzido para Português
- Labels: Email → E-mail, Password → Senha
- Botões: Login → Entrar, Sign Up → Cadastrar
- Toasts: "Welcome back!" → "Bem-vindo de volta!"
- Links: "Need an account?" → "Não tem conta?"

### Documentado
- `OnboardingContext.tsx` mantém `getUser()` próprio (renderiza fora do AppLayout)
- 3º listener `onAuthStateChange` documentado como dívida técnica conhecida

---

## [4.0.0-alpha.23] - 2026-03-04 ⚡ AUTH OPTIMIZATION

> **Otimização de autenticação** - Hook useCurrentUser elimina chamadas redundantes de getUser()

### Adicionado

#### useCurrentUser Hook (`src/hooks/useCurrentUser.ts`)
- Hook leve que cacheia o usuário da sessão auth
- `getCurrentUserId()` - função async para uso em queries/mutations
- Listener global de `onAuthStateChange` inicializado uma única vez
- Fallback para `getSession()` caso o cache não esteja populado

### Alterado

#### Auth Removida do Inbox.tsx
- Removido `user` state, `useEffect` com `getUser()`, import de `supabase`
- Removido guard `!user` do `handleCapture` (o hook `createItem` já gerencia auth)
- Removido import de `User` type (não mais necessário)

#### Hooks Otimizados (7 chamadas getUser() eliminadas)
- `useAtomItems.ts` — `createItem` usa `getCurrentUserId()` em vez de `getUser()`
- `useCalendarItems.ts` — 3 queries usam `getCurrentUserId()`
- `useMilestones.ts` — query + mutation usam `getCurrentUserId()`
- `useRitual.ts` — query usa `getCurrentUserId()`

### Performance
```
Antes: 7x supabase.auth.getUser() (chamadas de rede async)
Depois: getCurrentUserId() (leitura de cache sync, fallback getSession)
```

---

## [4.0.0-alpha.18] - 2025-12-17

### Adicionado

#### Fase 5: Type Safety Completa
- **Zero Any Policy:** Eliminados todos os 15 usos de `any` em produção
- **Auth Types:** `src/types/auth.ts` com tipagem completa de usuário
- **Database Types:** `src/types/database.ts` com mapeamento seguro de rows
- **Score:** 50/50 - Type Safety completa

---

## [4.0.0-alpha.17] - 2025-12-17

### Adicionado

#### CI/CD Completo
- **GitHub Actions:** Workflow com 3 jobs (unit, E2E, visual)
- **E2E sem service_role_key:** Testes usam signup/login normal
- **Auto-confirm habilitado:** Emails de teste confirmados automaticamente
- **Artefatos de falha:** Upload de relatórios e screenshots

#### PWA Branding Completo
- **Ícones PWA:** 8 tamanhos regenerados (72x72 até 512x512) com design do átomo verde
- **Favicon SVG:** Atualizado com design consistente do átomo com glow
- **iOS Splash Screens:** 7 tamanhos para iPhone e iPad
  - iPhone SE (640x1136)
  - iPhone 8/7/6 (750x1334)
  - iPhone XR/11 (828x1792)
  - iPhone 12/13/14 (1170x2532)
  - iPad Mini/Air (1536x2048)
  - iPad Pro 11" (1668x2388)
  - iPad Pro 12.9" (2048x2732)
- **Meta Tags:** Links apple-touch-startup-image no index.html

### Corrigido

#### Bug Crítico: Tela Preta no Mobile
- **AnimatePresence:** Corrigido uso incorreto no InstallPrompt.tsx
- **Causa:** Condição de renderização fora do AnimatePresence causava React Error #310
- **Solução:** Condição movida para dentro do AnimatePresence com key no motion.div

### Alterado

#### Testes E2E Simplificados
- **Fixture atualizado:** Usa signup/login normal em vez de Admin API
- **Sem dependência externa:** Não precisa de `SUPABASE_SERVICE_ROLE_KEY`
- **README atualizado:** Instruções simplificadas

---

## [4.0.0-alpha.16] - 2025-12-17 (RC Final)

### Adicionado

#### Analytics Dashboard
- **Página de Estatísticas:** Nova rota `/analytics` com visão geral de produtividade
- **Cards de Resumo:** Tarefas concluídas, maior streak ativo, projetos ativos, reflexões
- **Comparativo Semanal:** Esta semana vs semana anterior com indicadores de variação (↑ ↓)
- **Gráfico de Atividade:** Barras com tarefas concluídas nos últimos 7 dias
- **Evolução de Streaks:** Gráfico de linha mostrando progressão dos 3 hábitos mais ativos (30 dias)
- **Distribuição por Módulo:** Gráfico pizza de itens por categoria (Work, Body, Mind, Family)
- **Taxa de Conclusão:** Progress bar com percentual de tarefas concluídas
- **Navegação:** Link "Estatísticas" adicionado ao menu lateral

#### Testes de Arquitetura e Integridade
- **architecture-audit.test.ts:** Suite completa de testes para validar regras de isolamento
- **50+ testes** cobrindo: List Isolation, Reflection Lock, Milestone Isolation, Type Isolation
- **Edge cases:** Tags case-insensitive, combinações complexas, null-safety
- **Cobertura de filtros:** Focus, Today, Ritual, Projects, Split Today/Overdue

#### Testes de Offline Queue (IndexedDB)
- **offline-queue.test.ts:** 20+ testes de integração com IndexedDB mockado
- **fake-indexeddb:** Dependência adicionada para testes de IndexedDB
- **Cobertura:** FIFO ordering, retry count, data integrity, sync simulation
- **Edge cases:** Queue vazia, operações paralelas, dados complexos

### Corrigido

#### Blind Spot: List Isolation
- **isOperationalItem:** Corrigido para excluir itens com `parent_id` (pertencentes a listas)
- **Impacto:** Itens de lista não vazam mais para Dashboard Today/Focus

#### Tipagem para Build de Produção
- **useNotifications:** Guard SSR corrigido em `isSupported`
- **test/setup.ts:** Mocks adicionados para IndexedDB, Notification API, matchMedia, vibrate

---

## [4.0.0-alpha.15] - 2025-12-17

### Adicionado

#### Offline Sync Engine (PWA)
- **Network Status Detection:** Hook `useNetworkStatus` para detecção de conectividade
- **Offline Queue:** Sistema de fila em IndexedDB (`offline-queue.ts`) para operações offline
- **Auto-Sync:** Sincronização automática quando conexão é restaurada
- **Local Cache:** Cache em localStorage (`local-cache.ts`) para leitura offline
- **Service Worker:** vite-plugin-pwa com estratégias NetworkFirst (API) e CacheFirst (assets)

#### UI de Sincronização
- **NetworkStatusIndicator:** Badge mostrando status online/offline
- **PendingIndicator:** Indicador flutuante com contagem de operações pendentes
- **PendingOperationsModal:** Modal para visualizar e gerenciar operações pendentes
- **Animação de Pulso:** Indicador pulsa quando operações estão pendentes há mais de 30s

#### Gestão de Operações Pendentes
- **Cancelamento Individual:** Botão para cancelar operação específica
- **Cancelamento em Massa:** Botão "Cancelar Todas" com confirmação via AlertDialog
- **Atualização Automática:** Contador atualiza em tempo real após cancelamentos
- **Retry Count:** Tracking de tentativas com limite máximo (MAX_RETRIES = 3)

#### Hooks e Contexto
- **useOfflineSync:** Hook principal para sincronização offline
- **OfflineSyncProvider:** Context provider para estado global de sync
- **updatePendingCount:** Função exposta para atualização manual do contador

#### Exportação do Journal (Multi-formato)
- **Markdown (.md):** Texto formatado com agrupamento por data
- **JSON (.json):** Dados estruturados para backup/importação
- **PDF (Imprimir):** Documento formatado via diálogo de impressão
- **Filtros aplicados:** Exporta apenas reflexões filtradas quando filtros ativos
- **journal-export.ts:** Utilitário com funções de conversão e download

#### Sistema de Notificações
- **useNotifications Hook:** Gerencia permissões e configurações de notificação
- **NotificationManager:** Componente background que verifica tarefas pendentes
- **NotificationSettings:** Popover com configurações de lembretes
- **Lembretes:** Tarefas atrasadas, para hoje, para amanhã (configuráveis)
- **Anti-spam:** Notificações agrupadas, máximo 1x por hora

---

## [4.0.0-alpha.11] - 2025-12-16

### Adicionado

#### Integrity Guards (B.3) - Correções Críticas
- **Reflection Lock:** Guard em `useAtomItems` que impede `completed=true` para reflections
- **Milestone Isolation:** Filtros em `filterFocus`, `filterToday`, `useCalendarItems`, `Inbox` que excluem itens com `#milestone`
- **Atomic MacroPicker:** Remoção de `#inbox` na mesma operação que adiciona `project_id`
- **Helper Functions:** `isMilestone()` e `isOperationalItem()` em `dashboard-filters.ts`
- **21 Testes de Integridade:** Validação completa das guardas

---

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
- [x] Integrity Guards (B.3)
- [x] **List Engine** ⭐ NOVO
- [x] **Recurrence Engine (B.5)** ⭐ NOVO

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
- [x] **Listas com cores personalizadas**
- [x] **Habit Streaks + Heatmap**
- [x] **PWA + Offline Sync**
- [x] **Exportação Journal Multi-formato**
- [x] **Notificações e Lembretes**
- [x] **Analytics Dashboard**
- [x] **Testes de Arquitetura (50+ tests)**
- [x] **Testes Offline Queue (IndexedDB)**
- [x] **PWA Branding Completo (ícones + splash screens)**
- [x] **CI/CD com GitHub Actions (unit + E2E + visual)**
- [x] **Zero Any Policy - Type Safety Completa**
- [x] **ErrorBoundary + Suspense Boundaries** ⭐ NOVO
- [x] **Skeleton Loading Components** ⭐ NOVO
- [x] **React.lazy + React.memo Optimizations** ⭐ NOVO
- [x] **Page Transitions com AnimatePresence** ⭐ NOVO
- [x] **Micro-animações em UI Components** ⭐ NOVO
- [x] **Code Audit & Cleanup (17 UI components, 6 deps removidos)**
- [x] **Auth Centralizada no AppLayout (único ponto)** ⭐ NOVO
- [x] **Landing Componentizada (9 seções modulares)** ⭐ NOVO
- [x] **AppNavigation Modularizada (NavItemList, SyncStatus, SidebarActions)** ⭐ NOVO
- [x] **QueryClient Otimizado (staleTime 5min, retry 2)** ⭐ NOVO
- [x] **Onboarding Scoped (só renderiza autenticado)** ⭐ NOVO
- [x] **6 Deps Radix Adicionais Removidas** ⭐ NOVO
- [x] **useCurrentUser Hook - Auth Cache Síncrono** ⭐ alpha.23
- [x] **Code Audit - useMemo fix + AuthForm i18n** ⭐ alpha.24
- [x] **Push Notifications - VAPID + Service Worker + Edge Functions** ⭐ alpha.25

## 🔲 Próximas Etapas
- [ ] Colaboração multi-usuário
- [ ] Widgets nativos (Android/iOS)

---

<div align="center">

**MindMate - Atom Engine 4.0** 💚

</div>
