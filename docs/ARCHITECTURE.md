# MindMate - Atom Engine 4.0

## Arquitetura do Sistema

**Versão:** 4.0.0-alpha.14  
**Data:** 2025-12-16  
**Status:** Core Engine + Inbox + MacroPicker + Dashboard + Ritual + Project Sheet + Reflection Engine + Project Intelligence + **List Engine** + **Habit Streaks**

---

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
│   ├── projects/
│   │   └── ProjectCard.tsx         # Card de projeto na lista
│   ├── project-sheet/
│   │   ├── MilestonesPane.tsx      # Timeline de milestones
│   │   ├── WorkAreaPane.tsx        # Tasks & Hábitos
│   │   ├── NotesPane.tsx           # Notas & Recursos
│   │   ├── JournalPane.tsx         # Reflexões do projeto ⭐ NOVO
│   │   ├── ProjectFab.tsx          # FAB flutuante
│   │   ├── QuickAddTaskModal.tsx   # Modal criação task
│   │   └── QuickAddMilestoneModal.tsx
│   ├── journal/                    # ⭐ NOVO - Reflection Engine
│   │   ├── JournalComposer.tsx     # Input de reflexões
│   │   ├── JournalFeed.tsx         # Timeline de reflexões
│   │   ├── JournalFilters.tsx      # Filtros por tag/período
│   │   └── index.ts                # Exports
│   ├── layout/
│   │   ├── AppLayout.tsx           # Layout principal com auth
│   │   ├── AppNavigation.tsx       # Nav sidebar/bottom
│   │   ├── CommandPalette.tsx      # Busca global (⌘K)
│   │   └── KeyboardShortcutsHelp.tsx # Modal de atalhos
│   ├── empty-states/               # Estados vazios com ilustrações
│   ├── shared/                     # Componentes compartilhados
│   ├── AuthForm.tsx
│   ├── EngineDebugConsole.tsx
│   └── NavLink.tsx
│
├── hooks/
│   ├── useAtomItems.ts             # CRUD de itens via Supabase
│   ├── useDashboardData.ts         # Filtros do dashboard (B.10)
│   ├── useMilestones.ts            # CRUD de milestones
│   ├── useProjectProgress.ts       # Cálculo de progresso híbrido
│   ├── useRitual.ts                # Lógica do ritual (B.19)
│   ├── useDebugConsole.ts          # Controle do console
│   ├── useEngineLogger.ts          # Sistema de logs (Zustand)
│   └── use-toast.ts                # Toasts do sistema
│
├── lib/
│   ├── parsing-engine.ts           # Motor de parsing (B.7)
│   ├── dashboard-filters.ts        # Filtros do dashboard
│   ├── reflection-prompts.ts       # Prompts de reflexão ⭐ NOVO
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
│   ├── Lists.tsx                   # List Engine ⭐ NOVO
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
| `type` | item_type | Tipo: project, task, habit, note, **reflection**, resource, list |
| `module` | text | Módulo (work, body, mind, family, geral) |
| `tags` | text[] | Array de tags (inclui #milestone para milestones) |
| `parent_id` | uuid | FK para item pai |
| `project_id` | uuid | FK para projeto container |
| `due_date` | date | Data de vencimento |
| `ritual_slot` | ritual_slot | Slot de ritual (manha, meio_dia, noite) |
| `completed` | boolean | Estado de conclusão |
| `notes` | text | Conteúdo/notas |
| `weight` | integer | Peso para progresso (default: 1, milestones: 3) |
| `order_index` | integer | Índice para ordenação drag & drop |
| `project_status` | project_status | Status do projeto (apenas type='project') |
| `progress_mode` | progress_mode | Modo de cálculo de progresso |
| `progress` | integer | Progresso manual (0-100) |
| `deadline` | date | Deadline do projeto |
| `created_at` | timestamptz | Timestamp de criação |
| `updated_at` | timestamptz | Timestamp de atualização |

### Milestones (Single Table Design)

Milestones são items com `type='task'` e tag `#milestone`. Não há tabela separada.

```typescript
// Exemplo de milestone
{
  type: "task",
  tags: ["#milestone", "#work"],
  weight: 3, // Peso maior que tasks normais
  project_id: "uuid-do-projeto"
}
```

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
1. Hábitos → Lista de hábitos do período com toggle de conclusão
2. Check-in → Pergunta contextual + textarea para reflexão
3. Encerramento → Retorna ao dashboard
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

**Regras Visuais:**
- Pausado: opacity-60, borda amber
- Concluído: confetti + toast com sugestão de reflexão
- Arquivado: opacity-50, borda slate

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

### 7. Reflection Engine (B.11) ⭐ NOVO

**Arquivos:** `src/pages/Journal.tsx`, `src/components/journal/*`

Sistema de journaling e reflexões.

#### Características

- **Itens type='reflection'**: completed sempre false, due_date sempre null
- **Tags de Contexto**: #checkin, #mood:*, #ritual:*, #project:*
- **Timeline Visual**: Linha vertical conectando entradas
- **Filtros**: Por tag e por período (today, week, month, year)
- **Busca Full-Text**: Com highlight de termos encontrados
- **Prompts Guiados**: Perguntas por categoria para inspirar

#### Prompts de Reflexão

**Categorias:**
- Gratidão (Heart)
- Crescimento (TrendingUp)
- Sentimentos (Smile)
- Metas (Target)
- Aprendizado (Lightbulb)
- Geral (Sparkles)

**Prompts de Projeto:**
- "Qual decisão importante foi tomada aqui?"
- "O que está bloqueando o progresso?"
- "Qual ideia surgiu para este projeto?"

---

## 🖥️ Rotas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Index.tsx | Dashboard principal |
| `/inbox` | Inbox.tsx | Captura e processamento |
| `/projects` | Projects.tsx | Lista de projetos |
| `/projects/:id` | ProjectDetail.tsx | Project Sheet |
| `/ritual` | RitualView.tsx | Ritual imersivo (sem nav) |
| `/journal` | Journal.tsx | Página de reflexões ⭐ NOVO |

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` / `Ctrl+K` | Command Palette |
| `⌘H` / `Ctrl+H` | Ir para Home |
| `⌘I` / `Ctrl+I` | Ir para Inbox |
| `⌘P` / `Ctrl+P` | Ir para Projetos |
| `⌘R` / `Ctrl+R` | Ir para Ritual |
| `⌘J` / `Ctrl+J` | Ir para Journal ⭐ NOVO |
| `⌘N` / `Ctrl+N` | Novo Item |
| `Ctrl+Shift+E` | Debug Console |
| `/` | Focar busca (Journal) ⭐ NOVO |

---

## 📋 Roadmap

### ✅ Implementado (v4.0.0-alpha.14)

- [x] Modelo de dados (Single Table Design)
- [x] Tipos TypeScript completos
- [x] Parsing Engine (B.7)
- [x] Inbox Engine (B.6)
- [x] MacroPicker Engine (B.8)
- [x] Dashboard Engine (B.10)
- [x] Ritual View (B.19) com Check-in
- [x] Project Sheet (A.13) com aba Journal
- [x] Reflection Engine (B.11)
- [x] Calendar Engine (B.4) com navegação avançada
- [x] **Project Intelligence (B.9)** - State Machine + Progress Híbrido
- [x] **WorkArea Drag & Drop** - Conversão de tipo task↔hábito
- [x] **Ritual Slot via Context Menu** - Edição rápida de período
- [x] **Visual Badges** - Status de projeto e ritual slot
- [x] **List Engine** ⭐ NOVO - Listas rápidas com cores personalizadas
- [x] **Habit Streaks** ⭐ NOVO - Badge de streak + Heatmap de histórico
- [x] **Recurrence Engine (B.5)** ⭐ NOVO - Suporte a RRULE
- [x] Sistema de navegação + Command Palette
- [x] Debug Console (God Mode)
- [x] Autenticação + RLS

### 🔲 Próximas Etapas

- [ ] Gráfico de evolução de progresso
- [ ] Alertas de deadline para milestones
- [ ] Dashboard de métricas globais
- [ ] Exportação do Journal em Markdown
- [ ] Notificações e lembretes
- [ ] Estatísticas e analytics
