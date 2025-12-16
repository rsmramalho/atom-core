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
  | "reflection"  // ⭐ Usado pelo Reflection Engine
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

### ReflectionPrompt ⭐ NOVO

```typescript
interface ReflectionPrompt {
  text: string;
  category: "gratitude" | "growth" | "feelings" | "goals" | "learning" | "general";
}
```

### TimePeriod (Filtros do Journal) ⭐ NOVO

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

### Prompts de Reflexão ⭐ NOVO

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

### Journal ⭐ NOVO

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

### JournalPane (Project Sheet) ⭐ NOVO

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
| `/journal` | Journal.tsx | ✅ | ✅ | Reflexões ⭐ NOVO |

---

## Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` / `Ctrl+K` | Command Palette |
| `⌘H` / `Ctrl+H` | Home |
| `⌘I` / `Ctrl+I` | Inbox |
| `⌘P` / `Ctrl+P` | Projetos |
| `⌘R` / `Ctrl+R` | Ritual |
| `⌘J` / `Ctrl+J` | Journal ⭐ NOVO |
| `⌘N` / `Ctrl+N` | Novo Item |
| `Ctrl+Shift+E` | Debug Console |
| `/` | Focar busca (Journal) ⭐ NOVO |
| `⌘Enter` / `Ctrl+Enter` | Salvar reflexão (no composer) ⭐ NOVO |
