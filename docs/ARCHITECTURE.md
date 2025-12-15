# MindMate - Atom Engine 4.0

## Arquitetura do Sistema

**Versão:** 4.0.0-alpha.5  
**Data:** 2025-12-15  
**Status:** Core Engine + Debug Console + Inbox + MacroPicker + Dashboard + Ritual View + Project Sheet

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
│   │   ├── ProjectFab.tsx          # FAB flutuante
│   │   ├── QuickAddTaskModal.tsx   # Modal criação task
│   │   └── QuickAddMilestoneModal.tsx # Modal criação milestone
│   ├── layout/
│   │   ├── AppLayout.tsx           # Layout principal com auth
│   │   └── AppNavigation.tsx       # Nav sidebar/bottom
│   ├── AuthForm.tsx                # Formulário de login/signup
│   ├── EngineDebugConsole.tsx      # Console de debug (God Mode)
│   └── NavLink.tsx                 # Link de navegação
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
│   ├── RitualView.tsx              # Ritual imersivo (B.19)
│   └── NotFound.tsx                # 404
│
└── integrations/
    └── supabase/                   # Cliente Supabase (auto-gerado)
```

---

## 🗄️ Modelo de Dados

### Tabela: `items`

Baseado no Doc B.3 e B.9 - Single Table Design para todos os tipos de itens.

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | No | gen_random_uuid() | Chave primária |
| `user_id` | uuid | No | - | FK para auth.users |
| `title` | text | No | - | Título do item |
| `type` | item_type | No | 'task' | Tipo do item |
| `module` | text | Yes | - | Módulo (work, body, mind, etc) |
| `tags` | text[] | Yes | '{}' | Array de tags |
| `parent_id` | uuid | Yes | - | FK para item pai (subtasks) |
| `project_id` | uuid | Yes | - | FK para projeto container |
| `due_date` | date | Yes | - | Data de vencimento |
| `recurrence_rule` | text | Yes | - | Regra RRULE para recorrência |
| `ritual_slot` | ritual_slot | Yes | - | Slot de ritual |
| `completed` | boolean | No | false | Estado de conclusão |
| `completed_at` | timestamptz | Yes | - | Timestamp de conclusão |
| `notes` | text | Yes | - | Notas/conteúdo |
| `checklist` | jsonb | Yes | '[]' | Checklist leve |
| `project_status` | project_status | Yes | - | Status (apenas projetos) |
| `progress_mode` | progress_mode | Yes | 'auto' | Modo de progresso |
| `progress` | integer | Yes | 0 | Progresso 0-100 |
| `deadline` | date | Yes | - | Deadline (apenas projetos) |
| `milestones` | jsonb | Yes | '[]' | [DEPRECATED] Usar tabela project_milestones |
| `created_at` | timestamptz | No | now() | Criação |
| `updated_at` | timestamptz | No | now() | Atualização |

### Tabela: `project_milestones`

Milestones como entidades independentes (Doc B.9/B.13).

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | No | gen_random_uuid() | Chave primária |
| `project_id` | uuid | No | - | FK para items (projeto) |
| `user_id` | uuid | No | - | FK para auth.users |
| `title` | text | No | - | Título da milestone |
| `completed` | boolean | No | false | Estado de conclusão |
| `completed_at` | timestamptz | Yes | - | Timestamp de conclusão |
| `weight` | integer | No | 3 | Peso no cálculo de progresso |
| `due_date` | date | Yes | - | Data de entrega |
| `created_at` | timestamptz | No | now() | Criação |
| `updated_at` | timestamptz | No | now() | Atualização |

### Enums

```sql
-- Tipos de item
CREATE TYPE item_type AS ENUM (
  'project', 'task', 'habit', 'note', 
  'reflection', 'resource', 'list'
);

-- Slots de ritual
CREATE TYPE ritual_slot AS ENUM (
  'manha', 'meio_dia', 'noite'
);

-- Status de projeto
CREATE TYPE project_status AS ENUM (
  'draft', 'active', 'paused', 'completed', 'archived'
);

-- Modo de progresso
CREATE TYPE progress_mode AS ENUM ('auto', 'manual');
```

### RLS Policies

Todas as operações verificam: `auth.uid() = user_id`

---

## ⚙️ Engines Implementadas

### 1. Parsing Engine (B.7)

**Arquivo:** `src/lib/parsing-engine.ts`

Transforma texto cru em estrutura `ParsedInput`.

#### Tokens Suportados

| Token | Tipo | Exemplo | Resultado |
|-------|------|---------|-----------|
| `@hoje` | Temporal | "Tarefa @hoje" | `due_date: "2025-12-15"` |
| `@amanha` | Temporal | "Tarefa @amanha" | `due_date: "2025-12-16"` |
| `@ritual_manha` | Ritual | "Meditar @ritual_manha" | `ritual_slot: "manha"`, `type: "habit"` |
| `@ritual_meio_dia` | Ritual | "Almoço @ritual_meio_dia" | `ritual_slot: "meio_dia"` |
| `@ritual_noite` | Ritual | "Journaling @ritual_noite" | `ritual_slot: "noite"` |
| `@who:nome` | Contexto | "Reunião @who:andre" | `tags: ["#who:andre"]` |
| `@where:local` | Contexto | "Compras @where:mercado" | `tags: ["#where:mercado"]` |
| `#tag` | Tag | "Tarefa #urgente" | `tags: ["#urgente"]` |
| `#mod_modulo` | Módulo | "Treino #mod_body" | `module: "body"` |

---

### 2. Inbox Engine (B.6)

**Arquivo:** `src/pages/Inbox.tsx`

Tela de captura e processamento de itens brutos.

| Feature | Descrição |
|---------|-----------|
| Quick Capture | Input no topo com parsing automático |
| Inbox Filter | Exibe apenas itens com `#inbox` tag |
| Auto-refresh | Lista atualiza ao criar/processar |
| Process Button | Abre MacroPicker para promoção |

---

### 3. MacroPicker Engine (B.8)

**Arquivo:** `src/components/inbox/MacroPickerModal.tsx`

Modal de promoção de itens do inbox para projetos.

| Elemento | Função |
|----------|--------|
| Type Buttons | Escolher: Task, Habit, Note, Project |
| Ritual Selector | Só para Habit: Manhã, Meio-dia, Noite |
| Project Combobox | Selecionar projeto existente |
| Create Project | Criar novo projeto inline |
| Suggestions | Badges de projetos do mesmo módulo |
| Confirm Button | Só habilita com projeto selecionado |

---

### 4. Dashboard Engine (B.10)

**Arquivo:** `src/hooks/useDashboardData.ts`

Filtros e organização para o dashboard principal.

| Filtro | Descrição |
|--------|-----------|
| `focusItems` | Itens com tag `#focus` |
| `todayItems` | Due date <= hoje (exclui rituais) |
| `overdueItems` | Due date < hoje |
| `ritualItems` | Hábitos com ritual_slot do período |
| `projects` | Projetos ativos com progresso |

---

### 5. Ritual Engine (B.11/B.19)

**Arquivos:** `src/hooks/useRitual.ts`, `src/pages/RitualView.tsx`

Experiência imersiva para hábitos diários.

#### Detecção de Período

| Período | Horário | Cor Principal |
|---------|---------|---------------|
| Aurora (Manhã) | < 11:00 | `#FFD9A0` (laranja/amarelo) |
| Zênite (Meio-dia) | 11:00 - 17:00 | `#FFF7C2` (amarelo brilhante) |
| Crepúsculo (Noite) | > 17:00 | `#D4C0E8` (roxo/azul) |

#### Componentes

- **Header:** Ícone de sol + frase motivacional do período
- **Habit Cards:** Cards grandes com toggle de conclusão
- **Footer:** Botão "Encerrar Ritual" → volta ao dashboard
- **Debug Selector:** Override de período para testes

---

### 6. Project Engine (B.9/B.13)

**Arquivos:** `src/hooks/useProjectProgress.ts`, `src/hooks/useMilestones.ts`, `src/pages/ProjectDetail.tsx`

Gestão de projetos com milestones independentes.

#### Conceito de Milestones

- **Milestones** são "Capítulos" ou "Âncoras Narrativas" do projeto
- Entidades independentes (não agrupam tasks)
- Peso padrão: 3x (tasks = 1x)
- Completar milestone = "Salto Narrativo" no progresso

#### Cálculo de Progresso (Smart Weighting)

```
Progresso = (Soma Pesos Concluídos / Soma Pesos Totais) * 100

Onde:
- Cada Task = peso 1
- Cada Milestone = peso 3 (padrão)
```

#### Project Sheet (A.13)

Layout em blocos verticais:

1. **Header:** Título, módulo, status, barra de progresso
2. **Jornada (Milestones):** Timeline visual com diamantes
3. **Mesa de Trabalho:** Tasks e Hábitos separados
4. **Notas & Recursos:** Items type=note ou resource
5. **FAB:** Botão flutuante → "Nova Task" ou "Nova Milestone"

---

## 🔧 Hooks

### useAtomItems
```typescript
const { items, isLoading, createItem, updateItem, deleteItem } = useAtomItems();
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
const { currentPeriod, ritualHabits, pendingCount, toggleHabit } = useRitual();
```

### useEngineLogger
```typescript
const { logs, addLog, clearLogs } = useEngineLogger();
```

### useDebugConsole
```typescript
const { isOpen, toggle, open, close } = useDebugConsole();
```

---

## 🖥️ Rotas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Index.tsx | Dashboard principal |
| `/inbox` | Inbox.tsx | Captura e processamento |
| `/projects` | Projects.tsx | Lista de projetos |
| `/projects/:id` | ProjectDetail.tsx | Project Sheet |
| `/ritual` | RitualView.tsx | Ritual imersivo (sem nav) |

---

## 🎨 Design System

**Tema:** Terminal/Hacker (dark mode) + Cores de Ritual

### Cores Console

| Token | HSL | Uso |
|-------|-----|-----|
| `--background` | 220 20% 8% | Fundo principal |
| `--console` | 220 20% 10% | Fundo do console |
| `--console-accent` | 142 70% 50% | Verde destaque |
| `--primary` | 142 70% 45% | Ações principais |

### Cores Ritual

| Token | Hex | Período |
|-------|-----|---------|
| `--ritual-aurora` | #FFD9A0 | Manhã |
| `--ritual-zenite` | #FFF7C2 | Meio-dia |
| `--ritual-crepusculo` | #D4C0E8 | Noite |

### Fonte

```css
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
```

---

## 📋 Roadmap

### ✅ Implementado (v4.0.0-alpha.5)

- [x] Modelo de dados (items + project_milestones)
- [x] Tipos TypeScript completos
- [x] Parsing Engine (B.7)
- [x] Inbox Engine (B.6)
- [x] MacroPicker Engine (B.8) com Ritual Slot
- [x] Dashboard Engine (B.10)
- [x] Ritual View (B.19) - Experiência imersiva
- [x] Project Sheet (A.13) - Milestones independentes
- [x] Sistema de navegação (sidebar/bottom nav)
- [x] Debug Console (God Mode)
- [x] Autenticação básica + RLS

### 🔲 Próximas Etapas

- [ ] Recorrência de hábitos (RRULE)
- [ ] Reflection Engine (B.11)
- [ ] Notificações e lembretes
- [ ] Realtime sync aprimorado
- [ ] Estatísticas e analytics

---

## 🔗 Referências

- **Doc A.13** - Project Sheet UI
- **Doc A.19** - Ritual View UI
- **Doc B.3** - Modelo de Dados Core
- **Doc B.6** - Inbox Engine
- **Doc B.7** - Parsing Engine
- **Doc B.8** - MacroPicker Engine
- **Doc B.9** - ProjectMeta & Progress
- **Doc B.10** - Dashboard Engine
- **Doc B.11** - Reflection Engine
- **Doc B.13** - Project Sheet Logic
- **Doc B.19** - Ritual Engine
