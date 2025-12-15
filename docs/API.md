# API Reference - Atom Engine 4.0

Documentação das interfaces e funções públicas do sistema.

---

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
  tags: string[];                      // ["#tag1", "#who:andre", "#where:casa"]
  
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
  deadline: string | null;             // "YYYY-MM-DD"
  milestones: Milestone[];             // [DEPRECATED] Usar tabela project_milestones
  
  // Timestamps
  created_at: string;                  // ISO timestamp
  updated_at: string;                  // ISO timestamp
}
```

### Milestone (Tabela Separada)

```typescript
interface Milestone {
  id: string;                          // UUID
  project_id: string;                  // UUID do projeto
  user_id: string;                     // UUID do usuário
  title: string;                       // Título da milestone
  completed: boolean;
  completed_at: string | null;         // ISO timestamp
  weight: number;                      // Peso no progresso (padrão: 3)
  due_date: string | null;             // "YYYY-MM-DD"
  created_at: string;                  // ISO timestamp
  updated_at: string;                  // ISO timestamp
}
```

### ItemType

```typescript
type ItemType = 
  | "project" 
  | "task" 
  | "habit" 
  | "note" 
  | "reflection" 
  | "resource" 
  | "list";
```

### RitualSlot

```typescript
type RitualSlot = "manha" | "meio_dia" | "noite" | null;
```

### ProjectStatus

```typescript
type ProjectStatus = "draft" | "active" | "paused" | "completed" | "archived";
```

### ProgressMode

```typescript
type ProgressMode = "auto" | "manual";
```

### RitualPeriod

```typescript
type RitualPeriod = "aurora" | "zenite" | "crepusculo";

// Mapeamento RitualSlot -> RitualPeriod
// manha -> aurora
// meio_dia -> zenite
// noite -> crepusculo
```

### ChecklistItem

```typescript
interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}
```

### ParsedInput

```typescript
interface ParsedInput {
  title: string;              // Título limpo (sem tokens)
  type: ItemType;             // Tipo inferido
  tags: string[];             // Tags extraídas
  due_date: string | null;    // Data parseada
  ritual_slot: RitualSlot;    // Slot de ritual
  module: string | null;      // Módulo inferido
  raw_input: string;          // Input original
  detected_tokens: {
    token: string;            // Token original
    type: string;             // Tipo do token
    value: string;            // Valor extraído
  }[];
}
```

### EngineLogEntry

```typescript
interface EngineLogEntry {
  timestamp: string;                    // ISO timestamp
  engine: string;                       // Nome da engine
  action: string;                       // Descrição da ação
  details?: Record<string, unknown>;    // Detalhes extras
}
```

---

## Funções

### parseInput

Transforma texto cru em estrutura `ParsedInput`.

```typescript
import { parseInput } from "@/lib/parsing-engine";

const result = parseInput("Comprar leite @amanha #mod_casa @where:mercado");

// Resultado:
{
  title: "Comprar leite",
  type: "task",
  tags: ["#where:mercado", "#mod_casa"],
  due_date: "2025-12-16",
  ritual_slot: null,
  module: "casa",
  raw_input: "Comprar leite @amanha #mod_casa @where:mercado",
  detected_tokens: [
    { token: "@amanha", type: "temporal", value: "2025-12-16" },
    { token: "@where:mercado", type: "context_where", value: "mercado" },
    { token: "#mod_casa", type: "tag", value: "mod_casa" }
  ]
}
```

---

## Hooks

### useAtomItems

CRUD de itens via Supabase.

```typescript
import { useAtomItems } from "@/hooks/useAtomItems";

const {
  items,        // AtomItem[]
  isLoading,    // boolean
  error,        // Error | null
  refetch,      // () => void
  createItem,   // (payload: CreateItemPayload) => Promise<AtomItem>
  updateItem,   // (payload: UpdateItemPayload & { id: string }) => Promise<AtomItem>
  deleteItem,   // (id: string) => Promise<void>
  isCreating,   // boolean
  isUpdating,   // boolean
  isDeleting,   // boolean
} = useAtomItems();
```

#### Criar Item

```typescript
const newItem = await createItem({
  title: "Minha tarefa",
  type: "task",
  tags: ["#urgente"],
  due_date: "2025-12-20",
  module: "work",
});
```

#### Atualizar Item

```typescript
const updated = await updateItem({
  id: "uuid-do-item",
  completed: true,
  completed_at: new Date().toISOString(),
});
```

---

### useMilestones

CRUD de milestones de projeto.

```typescript
import { useMilestones } from "@/hooks/useMilestones";

const {
  milestones,       // Milestone[]
  isLoading,        // boolean
  createMilestone,  // (payload: CreateMilestonePayload) => Promise<Milestone>
  updateMilestone,  // (payload: UpdateMilestonePayload) => Promise<Milestone>
  deleteMilestone,  // (id: string) => Promise<void>
  toggleComplete,   // (milestone: Milestone) => Promise<void>
  isCreating,       // boolean
} = useMilestones(projectId);
```

#### Criar Milestone

```typescript
await createMilestone({
  project_id: "uuid-do-projeto",
  title: "Lançamento Beta",
  weight: 5, // Opcional, default = 3
});
```

---

### useProjectProgress

Cálculo de progresso híbrido (tasks + milestones).

```typescript
import { useProjectProgress } from "@/hooks/useProjectProgress";

const {
  progress,               // number (0-100)
  totalWeight,            // number
  completedWeight,        // number
  taskCount,              // number
  taskCompletedCount,     // number
  milestoneCount,         // number
  milestoneCompletedCount,// number
} = useProjectProgress(projectItems, milestones);
```

**Fórmula:**
```
progress = (completedWeight / totalWeight) * 100

Onde:
- Tasks: peso 1 cada
- Milestones: peso variável (default 3)
```

---

### useDashboardData

Filtros e organização para dashboard.

```typescript
import { useDashboardData } from "@/hooks/useDashboardData";

const {
  items,          // AtomItem[] - Todos os itens
  activeItems,    // AtomItem[] - Não completados
  focusItems,     // AtomItem[] - Com tag #focus
  todayItems,     // AtomItem[] - Due <= hoje
  overdueItems,   // AtomItem[] - Due < hoje
  dueTodayItems,  // AtomItem[] - Due = hoje
  ritualItems,    // AtomItem[] - Hábitos do período atual
  projects,       // Project[] - Projetos ativos com progresso
  currentSlot,    // RitualSlot - Slot atual baseado na hora
  
  getProjectItems,// (projectId) => AtomItem[]
  toggleComplete, // (itemId) => Promise<void>
  isLoading,      // boolean
  refetch,        // () => void
} = useDashboardData();
```

---

### useRitual

Lógica para Ritual View.

```typescript
import { useRitual } from "@/hooks/useRitual";

const {
  currentPeriod,    // RitualPeriod - aurora, zenite, crepusculo
  ritualHabits,     // AtomItem[] - Hábitos do período
  pendingCount,     // number - Hábitos pendentes
  completedCount,   // number - Hábitos completos
  
  toggleHabit,      // (id: string) => Promise<void>
  overridePeriod,   // (period: RitualPeriod | null) => void
} = useRitual();
```

#### Períodos

| Período | Horário | RitualSlot |
|---------|---------|------------|
| aurora | < 11:00 | manha |
| zenite | 11:00 - 17:00 | meio_dia |
| crepusculo | > 17:00 | noite |

---

### useEngineLogger

Sistema de logs global.

```typescript
import { useEngineLogger } from "@/hooks/useEngineLogger";

const { logs, addLog, clearLogs } = useEngineLogger();

// Adicionar log
addLog("ParsingEngine", "Token @hoje detectado", { value: "2025-12-15" });

// Limpar logs
clearLogs();
```

---

### useDebugConsole

Controle do Debug Console.

```typescript
import { useDebugConsole } from "@/hooks/useDebugConsole";

const { isOpen, toggle, open, close } = useDebugConsole();

// Toggle via código
toggle();

// Ou use o atalho: Ctrl+Shift+E
```

---

## Componentes

### Project Sheet

Componentes da tela de detalhes do projeto.

```tsx
import { MilestonesPane } from "@/components/project-sheet/MilestonesPane";
import { WorkAreaPane } from "@/components/project-sheet/WorkAreaPane";
import { NotesPane } from "@/components/project-sheet/NotesPane";
import { ProjectFab } from "@/components/project-sheet/ProjectFab";
import { QuickAddTaskModal } from "@/components/project-sheet/QuickAddTaskModal";
import { QuickAddMilestoneModal } from "@/components/project-sheet/QuickAddMilestoneModal";
```

### MilestonesPane

Timeline visual de milestones.

```tsx
<MilestonesPane
  milestones={milestones}
  onToggle={(milestone) => toggleMilestone(milestone)}
  onCreate={(title) => createMilestone({ project_id, title })}
  onDelete={(id) => deleteMilestone(id)}
  isCreating={isCreating}
/>
```

### WorkAreaPane

Tasks e Hábitos separados.

```tsx
<WorkAreaPane
  items={projectItems}
  onToggle={(id) => toggleComplete(id)}
/>
```

### ProjectFab

FAB flutuante com opções.

```tsx
<ProjectFab
  onCreateTask={() => setTaskModalOpen(true)}
  onCreateMilestone={() => setMilestoneModalOpen(true)}
/>
```

---

### Dashboard

Componentes do dashboard principal.

```tsx
import { FocusBlock } from "@/components/dashboard/FocusBlock";
import { RitualBanner } from "@/components/dashboard/RitualBanner";
import { TodayList } from "@/components/dashboard/TodayList";
```

---

### EngineDebugConsole

Console de debug flutuante.

```tsx
import { EngineDebugConsole } from "@/components/EngineDebugConsole";

<EngineDebugConsole 
  isOpen={isOpen} 
  onClose={close} 
/>
```

### AuthForm

Formulário de autenticação.

```tsx
import { AuthForm } from "@/components/AuthForm";

<AuthForm onSuccess={() => console.log("Logged in!")} />
```

---

## Rotas

| Rota | Componente | Auth | Nav |
|------|------------|------|-----|
| `/` | Index.tsx | ✅ | ✅ |
| `/inbox` | Inbox.tsx | ✅ | ✅ |
| `/projects` | Projects.tsx | ✅ | ✅ |
| `/projects/:id` | ProjectDetail.tsx | ✅ | ✅ |
| `/ritual` | RitualView.tsx | ✅ | ❌ |
