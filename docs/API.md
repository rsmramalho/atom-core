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
  milestones: Milestone[];
  
  // Timestamps
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

### ChecklistItem

```typescript
interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}
```

### Milestone

```typescript
interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  weight: number;
  due_date?: string;
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
  // ... outros campos opcionais
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

#### Deletar Item

```typescript
await deleteItem("uuid-do-item");
```

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
