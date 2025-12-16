# MindMate - Atom Engine 4.0
# Documentação Completa

**Versão:** 4.0.0-alpha.8  
**Data:** 2025-12-15  
**Gerado em:** 2025-12-16

---

# ÍNDICE

1. [README](#readme)
2. [ARQUITETURA](#arquitetura)
3. [API REFERENCE](#api-reference)
4. [CHANGELOG](#changelog)
5. [CONTRIBUTING](#contributing)

---

# README

## ✨ O que há de novo na v4.0.0-alpha.8

### 📝 Reflection Engine (Fase 3)

- **Página Journal** (`/journal`) - Espaço zen para reflexões
- **Prompts Guiados** - Perguntas por categoria para inspirar
- **Busca Full-Text** - Encontre reflexões rapidamente com highlight
- **Check-in no Ritual** - Reflexão integrada ao fluxo de hábitos
- **Journal no Projeto** - Aba dedicada para decisões e ideias
- **Atalho ⌘J** - Acesso rápido ao diário

---

## 🚀 Quick Start

### 1. Crie uma Conta

Na tela de login, clique em **"Não tem conta? Cadastre-se"**

### 2. Explore as Features

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

### 3. Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` | Command Palette |
| `⌘H` | Home |
| `⌘I` | Inbox |
| `⌘P` | Projetos |
| `⌘R` | Ritual |
| `⌘J` | Journal |
| `⌘N` | Novo Item |
| `/` | Buscar no Journal |
| `Ctrl+Shift+E` | Debug Console |

---

## ✨ Features

### 🧠 Parsing Engine

```
"Reunião com cliente @amanha #mod_work"
     ↓ parseInput()
{
  title: "Reunião com cliente",
  due_date: "2025-12-16",
  module: "work"
}
```

### 🌅 Ritual View com Check-in

Experiência imersiva para hábitos diários, agora com reflexão integrada:

1. **Hábitos** - Complete seus hábitos do período
2. **Check-in** - Responda uma pergunta contextual
3. **Encerramento** - Reflexão salva automaticamente no Journal

| Período | Horário | Pergunta |
|---------|---------|----------|
| 🌅 Aurora | < 11:00 | "Qual é sua intenção para hoje?" |
| ☀️ Zênite | 11:00-17:00 | "Como está sendo seu dia até agora?" |
| 🌆 Crepúsculo | > 17:00 | "Como você encerra este ciclo?" |

### 📝 Journal (Reflection Engine)

Sistema de journaling com design zen:

- **Prompts Guiados** por categoria (Gratidão, Crescimento, Sentimentos, Metas, Aprendizado)
- **Busca Full-Text** com destaque dos termos
- **Filtros** por tags e período de tempo
- **Timeline Visual** conectando reflexões
- **Atalho /** para focar na busca

### 📋 Project Sheet

Gestão completa de projetos em 4 abas:

1. **Trabalho** - Tasks e Hábitos separados
2. **Jornada** - Timeline de Milestones (peso 3x)
3. **Notas** - Resources e Notes
4. **Journal** - Reflexões e decisões do projeto

---

## 🛠️ Stack Tecnológica

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

---

## ✅ Status de Implementação

### Engines
- [x] Parsing Engine (B.7)
- [x] Inbox Engine (B.6)
- [x] MacroPicker Engine (B.8)
- [x] Dashboard Engine (B.10)
- [x] Ritual Engine (B.19)
- [x] Project Engine (B.9/B.13)
- [x] Reflection Engine (B.11)

### UI
- [x] Dashboard com Focus/Today/Ritual
- [x] Inbox com captura rápida
- [x] Project Sheet com 4 abas
- [x] Ritual View com Check-in
- [x] Journal com prompts e busca
- [x] Command Palette (⌘K)
- [x] Empty States ilustrados
- [x] Confetti de celebração

---

## 🔲 Roadmap

### Próximas Etapas
- [ ] CRUD completo para reflexões
- [ ] Exportação do Journal em Markdown
- [ ] Recorrência de hábitos (RRULE)
- [ ] Notificações e lembretes
- [ ] Estatísticas e analytics
- [ ] PWA + Offline mode

---

## 🏗️ Arquitetura Visual

```
┌──────────────────────────────────────────────────────────────┐
│                      PRESENTATION                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │Dashboard│ │  Inbox  │ │Projects │ │ Ritual  │ │ Journal │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │
├───────┼───────────┼───────────┼───────────┼───────────┼──────┤
│       │     APPLICATION LAYER │           │           │      │
│  ┌────▼───────────▼───────────▼───────────▼───────────▼────┐ │
│  │                    Custom Hooks                          │ │
│  │  useDashboardData │ useMilestones │ useRitual │ useAtom  │ │
│  └──────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │  Parsing  │ │ MacroPick │ │  Project  │ │Reflection │     │
│  │  Engine   │ │  Engine   │ │  Engine   │ │  Engine   │     │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
├───────────────────────────────────────────────────────────────┤
│                       DATA LAYER                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │              Lovable Cloud (Supabase)                  │   │
│  │  ┌──────────┐  ┌──────────────────────┐               │   │
│  │  │  items   │  │  project_milestones  │               │   │
│  │  └──────────┘  └──────────────────────┘               │   │
│  └───────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

---
---
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
│   ├── journal/                    # Reflection Engine
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
│   ├── RitualView.tsx              # Ritual imersivo (B.19)
│   ├── Journal.tsx                 # Página de reflexões
│   └── NotFound.tsx                # 404
│
└── integrations/
    └── supabase/                   # Cliente Supabase (auto-gerado)
```

---

## 🗄️ Modelo de Dados

### Tabela: `items`

Single Table Design para todos os tipos de itens (Doc B.3, B.9).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | Chave primária |
| `user_id` | uuid | FK para auth.users |
| `title` | text | Título do item |
| `type` | item_type | Tipo: project, task, habit, note, reflection, resource, list |
| `module` | text | Módulo (work, body, mind, etc) |
| `tags` | text[] | Array de tags |
| `parent_id` | uuid | FK para item pai |
| `project_id` | uuid | FK para projeto container |
| `due_date` | date | Data de vencimento |
| `ritual_slot` | ritual_slot | Slot de ritual (manha, meio_dia, noite) |
| `completed` | boolean | Estado de conclusão |
| `notes` | text | Conteúdo/notas |
| `created_at` | timestamptz | Timestamp de criação |
| `updated_at` | timestamptz | Timestamp de atualização |

### Tabela: `project_milestones`

Milestones como entidades independentes (Doc B.9/B.13).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | Chave primária |
| `project_id` | uuid | FK para items (projeto) |
| `user_id` | uuid | FK para auth.users |
| `title` | text | Título da milestone |
| `completed` | boolean | Estado de conclusão |
| `weight` | integer | Peso no progresso (default: 3) |
| `due_date` | date | Data de entrega |

### Enums

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

### 6. Project Engine (B.9/B.13)

**Arquivos:** `src/hooks/useProjectProgress.ts`, `src/pages/ProjectDetail.tsx`

Gestão de projetos com milestones e Journal integrado.

#### Abas da Project Sheet

1. **Trabalho** - Tasks e Hábitos
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
| `/journal` | Journal.tsx | Página de reflexões |

---
---
---

# API REFERENCE

## Tipos

### AtomItem

```typescript
interface AtomItem {
  id: string;                          // UUID
  user_id: string;                     // UUID do usuário
  title: string;                       // Título do item
  type: ItemType;                      // Tipo do item
  
  // Contexto
  module: string | null;               // work, body, mind, home, social, finance
  tags: string[];                      // ["tag1", "who:andre", "checkin"]
  
  // Hierarquia
  parent_id: string | null;            // UUID do item pai
  project_id: string | null;           // UUID do projeto container
  
  // Tempo
  due_date: string | null;             // "YYYY-MM-DD"
  recurrence_rule: string | null;      // RRULE string
  ritual_slot: RitualSlot;             // manha, meio_dia, noite, null
  
  // Estado
  completed: boolean;
  completed_at: string | null;         // ISO timestamp
  
  // Conteúdo
  notes: string | null;
  checklist: ChecklistItem[];
  
  // Project Meta (type = 'project' only)
  project_status: ProjectStatus | null;
  progress_mode: ProgressMode | null;
  progress: number | null;             // 0-100
  deadline: string | null;
  milestones: Milestone[];             // [DEPRECATED]
  
  // Timestamps
  created_at: string;
  updated_at: string;
}
```

### ItemType

```typescript
type ItemType = 
  | "project" 
  | "task" 
  | "habit" 
  | "note" 
  | "reflection"  // Usado pelo Reflection Engine
  | "resource" 
  | "list";
```

### RitualSlot / RitualPeriod

```typescript
type RitualSlot = "manha" | "meio_dia" | "noite" | null;

type RitualPeriod = "aurora" | "zenite" | "crepusculo";

// Mapeamento RitualSlot -> RitualPeriod
// manha -> aurora
// meio_dia -> zenite
// noite -> crepusculo
```

### ParsedInput

```typescript
interface ParsedInput {
  title: string;              // Título limpo
  type: ItemType;             // Tipo inferido
  tags: string[];             // Tags extraídas
  due_date: string | null;    // Data parseada
  ritual_slot: RitualSlot;    // Slot de ritual
  module: string | null;      // Módulo inferido
  raw_input: string;          // Input original
  detected_tokens: { token: string; type: string; value: string; }[];
}
```

### ReflectionPrompt

```typescript
interface ReflectionPrompt {
  text: string;
  category: "gratitude" | "growth" | "feelings" | "goals" | "learning" | "general";
}
```

### TimePeriod (Filtros do Journal)

```typescript
type TimePeriod = "all" | "today" | "week" | "month" | "year";
```

---

## Funções

### parseInput

```typescript
import { parseInput } from "@/lib/parsing-engine";

const result = parseInput("Comprar leite @amanha #mod_casa");
// { title: "Comprar leite", due_date: "2025-12-16", module: "casa", ... }
```

### Prompts de Reflexão

```typescript
import { 
  getRandomPrompt, 
  getRandomProjectPrompt, 
  getPromptsByCategory 
} from "@/lib/reflection-prompts";

// Prompt aleatório de qualquer categoria
const prompt = getRandomPrompt();

// Prompt específico para projetos
const projectPrompt = getRandomProjectPrompt();

// Prompts filtrados por categoria
const gratitudePrompts = getPromptsByCategory("gratitude");
```

---

## Hooks

### useAtomItems

CRUD de itens via Supabase.

```typescript
const { items, isLoading, createItem, updateItem, deleteItem } = useAtomItems();

// Criar reflexão
await createItem({
  title: "Minha reflexão",
  type: "reflection",
  notes: "Conteúdo da reflexão...",
  tags: ["checkin", "mood:calmo"],
  project_id: null,  // ou UUID do projeto
  // ... outros campos
});
```

### useMilestones

CRUD de milestones de projeto.

```typescript
const { milestones, createMilestone, toggleComplete, deleteMilestone } = useMilestones(projectId);
```

### useProjectProgress

Cálculo de progresso híbrido (tasks + milestones).

```typescript
const { progress, taskCount, milestoneCount } = useProjectProgress(projectItems, milestones);
```

### useDashboardData

Filtros e organização para dashboard.

```typescript
const { focusItems, todayItems, ritualItems, projects, toggleComplete } = useDashboardData();
```

### useRitual

Lógica para Ritual View com check-in.

```typescript
const {
  activePeriod,    // aurora | zenite | crepusculo
  config,          // { slot, label, phrase, icon }
  habits,          // AtomItem[]
  progress,        // 0-100
  toggleHabit,     // (id) => void
  forcedPeriod,    // Para debug
  setForcedPeriod, // Para debug
} = useRitual();
```

### useEngineLogger

Sistema de logs global.

```typescript
const { logs, addLog, clearLogs } = useEngineLogger();
addLog("ReflectionEngine", "Reflexão salva", { id: "..." });
```

### useDebugConsole

Controle do Debug Console.

```typescript
const { isOpen, toggle, open, close } = useDebugConsole();
```

---

## Componentes

### Journal

```tsx
import { JournalComposer, JournalFeed, JournalFilters } from "@/components/journal";

// Composer com prompts guiados
<JournalComposer />

// Feed com filtros
<JournalFeed
  selectedTags={["checkin"]}
  timePeriod="week"
  searchQuery="intenção"
  onReflectionsChange={(items) => setReflections(items)}
/>

// Filtros de tag e período
<JournalFilters
  reflections={reflections}
  selectedTags={selectedTags}
  onTagsChange={setSelectedTags}
  timePeriod={timePeriod}
  onTimePeriodChange={setTimePeriod}
/>
```

### JournalPane (Project Sheet)

```tsx
import { JournalPane } from "@/components/project-sheet/JournalPane";

<JournalPane
  projectId={project.id}
  projectTitle={project.title}
  projectModule={project.module}
/>
```

### Project Sheet

```tsx
import { MilestonesPane } from "@/components/project-sheet/MilestonesPane";
import { WorkAreaPane } from "@/components/project-sheet/WorkAreaPane";
import { NotesPane } from "@/components/project-sheet/NotesPane";
import { JournalPane } from "@/components/project-sheet/JournalPane";
import { ProjectFab } from "@/components/project-sheet/ProjectFab";
```

### Dashboard

```tsx
import { FocusBlock } from "@/components/dashboard/FocusBlock";
import { RitualBanner } from "@/components/dashboard/RitualBanner";
import { TodayList } from "@/components/dashboard/TodayList";
```

---

## Rotas

| Rota | Componente | Auth | Nav | Descrição |
|------|------------|------|-----|-----------|
| `/` | Index.tsx | ✅ | ✅ | Dashboard |
| `/inbox` | Inbox.tsx | ✅ | ✅ | Captura |
| `/projects` | Projects.tsx | ✅ | ✅ | Lista de projetos |
| `/projects/:id` | ProjectDetail.tsx | ✅ | ✅ | Project Sheet |
| `/ritual` | RitualView.tsx | ✅ | ❌ | Ritual imersivo |
| `/journal` | Journal.tsx | ✅ | ✅ | Reflexões |

---
---
---

# CHANGELOG

Todas as mudanças notáveis do projeto MindMate - Atom Engine 4.0 serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [4.0.0-alpha.8] - 2025-12-15

### Adicionado

#### Reflection Engine - Fase 3 (B.11)

##### Página Journal (/journal)
- **Design Zen:** Layout focado em tipografia, espaço em branco, sem distrações
- **JournalComposer:** Textarea auto-expansível para captura de reflexões
  - Placeholder acolhedor: "O que está na sua mente agora?"
  - Atalho ⌘Enter / Ctrl+Enter para salvar
  - Extração automática de tags do conteúdo (#checkin, #mood:*)
  - Toast de sucesso ao salvar
- **JournalFeed:** Timeline visual de reflexões
  - Linha vertical conectando entradas
  - Datas formatadas (Hoje, Ontem, formato completo)
  - Tags exibidas como pílulas discretas
  - Ordenação por data (mais recente primeiro)
- **JournalFilters:** Sistema duplo de filtros
  - Filtro por tags: extração dinâmica das reflexões existentes
  - Filtro por período: all, today, week, month, year
  - Filtros combinam entre si
  - Estado vazio quando nenhuma reflexão corresponde

##### Busca Full-Text no Journal
- **Busca Global (/journal):**
  - Input de busca com ícone e botão limpar
  - Atalho "/" para focar na busca
  - Hint visual do atalho no campo
  - Destaque (highlight) dos termos encontrados
  - Busca em conteúdo e tags
- **Busca no Projeto (Project Sheet):**
  - Mesmo comportamento na aba Journal do projeto
  - Atalho "/" funciona também no contexto do projeto

##### Prompts de Reflexão Guiada
- **Biblioteca de Prompts:** `src/lib/reflection-prompts.ts`
  - 20+ prompts organizados por categoria
  - Categorias: gratitude, growth, feelings, goals, learning, general
  - Prompts específicos para projetos
- **UI de Prompts no JournalComposer:**
  - Seletor de categorias como pills clicáveis
  - Ícones visuais por categoria (Heart, TrendingUp, Smile, Target, Lightbulb)
  - Botão "Usar este prompt" insere no textarea
  - Botão "Outro" randomiza novo prompt
  - Prompt muda automaticamente após salvar reflexão
- **Prompts no JournalPane (Projetos):**
  - Prompts contextuais para decisões, bloqueios, ideias
  - Mesmo padrão visual do JournalComposer

##### Integração Ritual + Reflexão
- **Check-in no Ritual View:**
  - Novo passo no fluxo: Hábitos → Check-in → Encerramento
  - Pergunta contextual por período:
    - Aurora: "Qual é sua intenção para hoje?"
    - Zênite: "Como está sendo seu dia até agora?"
    - Crepúsculo: "Como você encerra este ciclo?"
  - Textarea para resposta livre
  - Botões "Pular" e "Registrar"
- **Salvamento Contextual:**
  - Cria item type='reflection' automaticamente
  - Tags automáticas: `#ritual:{período}`, `#checkin`
  - Reflexão aparece no Journal global

##### Aba Journal na Project Sheet
- **Nova Aba:** "Journal" ao lado de Trabalho/Jornada/Notas
- **JournalPane:** Feed de reflexões filtrado por project_id
- **Criação Contextual:**
  - Botão "Adicionar nota ou reflexão"
  - project_id definido automaticamente
  - Tag de contexto: `#project:{nome-do-projeto}`
- **Timeline Visual:** Mesmo estilo do JournalFeed global

##### Navegação e Atalhos
- **Rota /journal** adicionada ao sistema
- **Atalho ⌘J / Ctrl+J** para acesso rápido ao Journal
- **Command Palette** atualizado com opção Journal
- **Sidebar/Bottom Nav** com link "Diário"
- **KeyboardShortcutsHelp** atualizado

### Modificado
- **ProjectDetail.tsx:** Refatorado para usar Tabs com 4 abas (Trabalho, Jornada, Notas, Journal)
- **RitualView.tsx:** Adicionado gerenciamento de steps e componente de Check-in

---

## [4.0.0-alpha.7] - 2025-12-15

### Adicionado

#### Command Palette (Power User)
- **Atalho Global:** `Cmd+K` (Mac) / `Ctrl+K` (Windows)
- **Navegação Rápida:**
  - Ir para Home, Inbox, Projetos, Ritual
  - Atalhos visuais (⌘H, ⌘I, ⌘P, ⌘N)
- **Busca de Projetos:**
  - Lista todos os projetos ativos
  - Exibe ModuleBadge de cada projeto
  - Navegação direta para Project Sheet
- **Ações do Sistema:**
  - Novo Item (navega para Inbox com foco no input)
  - Debug Console (⌃⇧E)
  - Logout

#### Mobile Navigation (Drawer)
- **Sidebar Mobile:**
  - Transformada em Sheet/Drawer que desliza da esquerda
  - Hamburger menu no header fixo
  - Logo e branding no header
  - Botão de Command Palette no header
- **Header Fixo:**
  - Barra fixa no topo em mobile
  - Acesso rápido ao menu e busca
- **Responsividade:**
  - Layout adaptativo desktop/mobile
  - Padding ajustado para header fixo

#### Ritual View (Mobile Improvements)
- **Footer Fixo:**
  - Botão "Encerrar Ritual" fixo na parte inferior
  - Acessível com polegar em qualquer posição de scroll
  - Backdrop blur para legibilidade
  - Botão maior (h-14) para toque fácil

---

## [4.0.0-alpha.6] - 2025-12-15

### Adicionado

#### Empty States (UX)
- **EmptyInbox** - Ilustração zen para "Inbox Zero"
- **EmptyDashboard** - Estado de "dia livre" com mensagem encorajadora
- **EmptyProjectStart** - CTA claro para criar primeira milestone/task
- **EmptyFocus** - Estado para lista de foco vazia com sugestão de adicionar itens
- Integração em todas as telas: Inbox, Dashboard, ProjectDetail, FocusBlock

#### Ilustrações SVG Customizadas
- **ZenCircleIllustration** - Círculo zen animado (enso) para Inbox Zero
- **FreeDayIllustration** - Cena aconchegante de café para Dashboard vazio
- **RocketLaunchIllustration** - Foguete dinâmico para Projeto novo
- **TargetFocusIllustration** - Alvo minimalista para Focus vazio

#### Confetti Celebration
- **Componente Confetti** - Explosão de confetes para celebração
- **Detecção automática** - Dispara ao completar todas as tasks do dia
- **Toast de celebração** - Mensagem "Parabéns!" ao zerar pendências

#### Drag & Drop Animations (FocusBlock)
- **DragOverlay** - Preview flutuante do item sendo arrastado
- **Transições suaves** - Cubic-bezier easing para movimentação natural
- **Feedback visual** - Escala, opacidade, bordas e rotação sutil durante arraste

#### Haptic Feedback (Mobile)
- **Vibração no pickup** - Feedback médio (25ms) ao iniciar arraste
- **Vibração no hover** - Feedback leve (10ms) ao passar sobre nova posição
- **Vibração de sucesso** - Padrão [10, 50, 20]ms ao soltar com sucesso

#### Module System (UX)
- **ModuleBadge** - Componente de badge colorido para módulos
- **MacroPicker atualizado** com seletor de Módulo obrigatório
- **Regra de Negócio:** Itens sem módulo recebem "geral" automaticamente

#### Projects Page - Filtros e Ordenação
- **Filtros por Módulo:** Pills compactas para Work, Body, Mind, Family
- **Ordenação de Projetos:** Nome, Progresso, Data de Criação

---

## [4.0.0-alpha.5] - 2025-12-15

### Adicionado

#### Project Sheet (A.13/B.13)
- **Tabela `project_milestones`** - Milestones como entidades independentes
- **Hook `useMilestones`** - CRUD completo para milestones
- **Hook `useProjectProgress`** - Cálculo de progresso híbrido
- **Componentes Project Sheet:** MilestonesPane, WorkAreaPane, NotesPane, ProjectFab

### Modificado
- **ProjectDetail** refatorado para Project Sheet completo

---

## [4.0.0-alpha.4] - 2025-12-15

### Adicionado

#### Ritual View (A.19/B.19)
- **Rota `/ritual`** - Experiência imersiva full-screen
- **Detecção de Período** baseada na hora do sistema
- **Cores por Período:** Aurora, Zênite, Crepúsculo
- **Componentes:** Header, Habit Cards, Footer, Debug Selector

#### Ritual Slot Assignment
- **MacroPickerModal** atualizado para hábitos com seletor de ritual slot

#### Hook useRitual
- Filtragem por período, contagem de pendentes, funções de override

---

## [4.0.0-alpha.3] - 2025-12-15

### Adicionado

#### Dashboard Engine (B.10)
- **Hook `useDashboardData`** - Filtros e organização para dashboard
- **RitualBanner**, **FocusBlock**, **TodayList**

#### Project Engine (B.9)
- Rotas `/projects` e `/projects/:id`
- **ProjectCard** com barra de progresso

#### Sistema de Navegação
- **AppNavigation** - Bottom nav (mobile) + Sidebar (desktop)
- **AppLayout** - Wrapper com auth handling

---

## [4.0.0-alpha.2] - 2025-12-15

### Adicionado

#### Inbox Engine (B.6)
- **Rota `/inbox`** - Captura e processamento
- **InboxItemCard** - Card com título, chips de tags, botão "Processar"

#### MacroPicker Engine (B.8)
- **Modal MacroPicker** - Interface de promoção de itens
- **Seleção de Tipo**, **Projeto**, **Sugestões Inteligentes**

---

## [4.0.0-alpha.1] - 2025-12-15

### Adicionado

#### Banco de Dados (Lovable Cloud)
- Tabela `items` com schema completo
- Enums, índices, RLS Policies, Realtime

#### Core Engine
- **Tipos TypeScript** (`src/types/atom-engine.ts`)
- **Parsing Engine** (`src/lib/parsing-engine.ts`)

#### Hooks
- **useAtomItems**, **useEngineLogger**, **useDebugConsole**

#### UI/Debug
- **EngineDebugConsole**, **AuthForm**, **Index Page**

#### Design System
- Tema terminal/hacker, cores customizadas, fonte monospace

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas em breve
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades

---
---
---

# CONTRIBUTING

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Começando](#começando)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Padrões de Código](#padrões-de-código)
- [Fluxo de Trabalho](#fluxo-de-trabalho)
- [Convenções de Commit](#convenções-de-commit)
- [Criando Issues](#criando-issues)
- [Pull Requests](#pull-requests)

---

## 📜 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para o projeto
- Mantenha discussões técnicas e produtivas

---

## 🚀 Começando

### Pré-requisitos

- Conta no [Lovable](https://lovable.dev)
- Conhecimento básico de React, TypeScript e Tailwind CSS
- Familiaridade com o modelo de dados

### Ambiente de Desenvolvimento

O projeto roda no Lovable Cloud, então não é necessário configurar ambiente local. Porém, você pode:

1. **Conectar ao GitHub** via Lovable para ter o código no seu repositório
2. **Clonar localmente** para análise e edição no seu IDE favorito
3. **Sincronizar** mudanças via GitHub (sync bidirecional)

---

## 🏗️ Arquitetura do Projeto

### Engines (Domínio)

Os engines são a lógica central do sistema:

| Engine | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Parsing | `lib/parsing-engine.ts` | Parser de linguagem natural |
| Inbox | `pages/Inbox.tsx` | Captura de itens |
| MacroPicker | `components/inbox/MacroPickerModal.tsx` | Promoção de itens |
| Dashboard | `hooks/useDashboardData.ts` | Filtros e agregação |
| Ritual | `hooks/useRitual.ts` | Lógica de rituais |
| Project | `hooks/useProjectProgress.ts` | Cálculo de progresso |

### Modelo de Dados

**IMPORTANTE**: O modelo de dados está definido em `src/types/atom-engine.ts`. Este é o **SOURCE OF TRUTH**.

```typescript
// Tipos principais
type ItemType = 'project' | 'task' | 'habit' | 'note' | 'reflection' | 'resource' | 'list';
type RitualSlot = 'manha' | 'meio_dia' | 'noite' | null;
type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
```

### Banco de Dados

- Tabela `items`: Todos os tipos de itens
- Tabela `project_milestones`: Milestones de projetos
- RLS habilitado em todas as tabelas

---

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ BOM - Tipagem explícita
const createItem = async (item: Omit<AtomItem, 'id' | 'created_at'>): Promise<AtomItem> => {
  // ...
};

// ❌ RUIM - any ou tipagem implícita
const createItem = async (item: any) => {
  // ...
};
```

### React Components

```tsx
// ✅ BOM - Componente funcional com props tipadas
interface TaskCardProps {
  task: AtomItem;
  onComplete: (id: string) => void;
}

export const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  return (
    <div className="p-4 rounded-lg bg-card">
      {/* ... */}
    </div>
  );
};

// ❌ RUIM - Props inline sem interface
export const TaskCard = ({ task, onComplete }: { task: any; onComplete: any }) => {
  // ...
};
```

### Tailwind CSS

```tsx
// ✅ BOM - Usa tokens semânticos do design system
<div className="bg-background text-foreground border-border">

// ❌ RUIM - Cores diretas
<div className="bg-slate-900 text-white border-gray-700">
```

### Hooks Customizados

```typescript
// ✅ BOM - Hook focado com responsabilidade única
export const useProjectProgress = (projectId: string) => {
  // Apenas calcula progresso
};

// ❌ RUIM - Hook fazendo muitas coisas
export const useProjectEverything = (projectId: string) => {
  // Progress, milestones, tasks, notes, etc.
};
```

---

## 🔄 Fluxo de Trabalho

### 1. Entenda o Contexto

Antes de implementar, leia:
- [ ] Issue relacionada (se existir)
- [ ] Arquitetura para entender a estrutura
- [ ] API para hooks e tipos disponíveis
- [ ] Código existente relacionado

### 2. Planeje a Implementação

Para features novas:
```
1. Qual engine será afetado?
2. Precisa de nova tabela/coluna no banco?
3. Precisa de novo hook?
4. Quais componentes serão criados/modificados?
```

### 3. Implemente Incrementalmente

```
1. Comece pelo modelo de dados (se necessário)
2. Crie/atualize hooks
3. Crie/atualize componentes
4. Teste manualmente
5. Atualize documentação
```

### 4. Documente

- Atualize CHANGELOG.md com suas mudanças
- Atualize API.md se criou novos hooks/tipos
- Atualize ARCHITECTURE.md se mudou estrutura

---

## 💬 Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

| Tipo | Uso |
|------|-----|
| `feat` | Nova feature |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `style` | Formatação (não afeta lógica) |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Adição/modificação de testes |
| `chore` | Manutenção, configs |

### Escopos Comuns

- `parsing-engine`
- `inbox`
- `dashboard`
- `ritual`
- `project-sheet`
- `ui`
- `db`

### Exemplos

```bash
feat(ritual): add period detection based on system time
fix(parsing-engine): handle empty input gracefully
docs(api): add useRitual hook documentation
refactor(dashboard): extract filter logic to separate hooks
```

---

## 🐛 Criando Issues

### Bug Report

```markdown
## Descrição
[Descreva o bug de forma clara]

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Observe o erro

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que está acontecendo]

## Screenshots
[Se aplicável]

## Contexto Adicional
- Navegador:
- Rota:
- Console errors:
```

### Feature Request

```markdown
## Descrição
[Descreva a feature desejada]

## Motivação
[Por que isso seria útil?]

## Solução Proposta
[Como você imagina a implementação?]

## Alternativas Consideradas
[Outras abordagens pensadas]

## Engine Relacionado
[Qual engine seria afetado: Parsing, Inbox, Dashboard, etc.]
```

---

## 🔀 Pull Requests

### Checklist

- [ ] Código segue os padrões estabelecidos
- [ ] Tipos TypeScript estão corretos
- [ ] Usa tokens do design system (não cores diretas)
- [ ] Componentes são pequenos e focados
- [ ] Hooks seguem responsabilidade única
- [ ] CHANGELOG.md atualizado
- [ ] Documentação atualizada (se necessário)
- [ ] Testado manualmente no Lovable

### Template de PR

```markdown
## Descrição
[Resumo das mudanças]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Engine Afetado
- [ ] Parsing Engine
- [ ] Inbox Engine
- [ ] MacroPicker Engine
- [ ] Dashboard Engine
- [ ] Ritual Engine
- [ ] Project Engine
- [ ] Nenhum (UI/docs only)

## Como Testar
1. ...
2. ...

## Screenshots
[Se aplicável]
```

---

## 🔧 Debug Console (God Mode)

Use o Debug Console (`Ctrl+Shift+E`) para:

1. **Tab State**: Ver JSON dos items carregados
2. **Tab Logs**: Ver logs dos engines
3. **Tab Input Test**: Testar o Parsing Engine em tempo real
4. **Tab Tokens**: Referência de todos os tokens # e @

### Adicionando Logs

```typescript
import { useEngineLogger } from '@/hooks/useEngineLogger';

const MyComponent = () => {
  const { log } = useEngineLogger();
  
  const handleAction = () => {
    log('MyEngine', 'Ação executada', { data: 'contexto' });
  };
};
```

---

## 📚 Recursos Úteis

- [Lovable Docs](https://docs.lovable.dev/) - Documentação do Lovable
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/docs) - Documentação Tailwind

---

## ❓ Dúvidas?

- Abra uma issue com a tag `question`
- Consulte a documentação existente
- Verifique issues fechadas para problemas similares

---

**Obrigado por contribuir! 💚**

---
---
---

# FIM DA DOCUMENTAÇÃO

**MindMate - Atom Engine 4.0**  
Versão: 4.0.0-alpha.8  
Última atualização: 2025-12-16
