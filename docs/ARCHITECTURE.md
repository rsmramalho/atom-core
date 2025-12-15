# MindMate - Atom Engine 4.0

## Arquitetura do Sistema

**Versão:** 4.0.0-alpha.2  
**Data:** 2025-12-15  
**Status:** Core Engine + Debug Console + Inbox + MacroPicker implementados

---

## 📁 Estrutura de Diretórios

```
src/
├── components/
│   ├── ui/                    # Componentes Shadcn (base)
│   ├── inbox/
│   │   ├── InboxItemCard.tsx  # Card de item no inbox
│   │   └── MacroPickerModal.tsx # Modal de promoção (B.8)
│   ├── AuthForm.tsx           # Formulário de login/signup
│   └── EngineDebugConsole.tsx # Console de debug (God Mode)
│
├── hooks/
│   ├── useAtomItems.ts        # CRUD de itens via Supabase
│   ├── useDebugConsole.ts     # Controle do console (atalho Ctrl+Shift+E)
│   ├── useEngineLogger.ts     # Sistema de logs global (Zustand)
│   └── use-toast.ts           # Toasts do sistema
│
├── lib/
│   ├── parsing-engine.ts      # Motor de parsing (B.7)
│   └── utils.ts               # Utilitários (cn, etc)
│
├── types/
│   └── atom-engine.ts         # Tipos TypeScript do domínio
│
├── pages/
│   ├── Index.tsx              # Página principal (debug mode)
│   ├── Inbox.tsx              # Inbox Engine UI (B.6)
│   └── NotFound.tsx           # 404
│
└── integrations/
    └── supabase/              # Cliente Supabase (auto-gerado)
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
| `milestones` | jsonb | Yes | '[]' | Milestones do projeto |
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

Todas as operações (SELECT, INSERT, UPDATE, DELETE) verificam:
```sql
auth.uid() = user_id
```

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

#### Inferência de Módulo

Palavras-chave que inferem módulos automaticamente:

| Módulo | Palavras-chave |
|--------|---------------|
| `work` | trabalho, reunião, meeting, cliente, projeto, email, call, deadline |
| `body` | treino, academia, correr, exercício, dieta, saúde, gym, workout |
| `mind` | meditar, ler, estudar, curso, aprender, livro, meditação |
| `home` | casa, limpar, organizar, compras, mercado, cozinha |
| `social` | amigo, família, encontro, festa, jantar, almoço |
| `finance` | pagar, conta, dinheiro, investir, banco, boleto |

#### Inferência de Tipo

| Tipo | Palavras-chave |
|------|---------------|
| `note` | nota, ideia, lembrete, anotação |
| `habit` | hábito, rotina, diário, sempre |
| `project` | projeto |
| `reflection` | reflexão, pensamento |
| `resource` | recurso, link, artigo |
| `list` | lista |

### 2. Inbox Engine (B.6)

**Arquivo:** `src/pages/Inbox.tsx`

Tela de captura e processamento de itens brutos.

#### Funcionalidades

| Feature | Descrição |
|---------|-----------|
| Quick Capture | Input no topo com parsing automático |
| Inbox Filter | Exibe apenas itens com `#inbox` tag |
| Auto-refresh | Lista atualiza ao criar/processar |
| Process Button | Abre MacroPicker para promoção |

#### Fluxo de Captura

1. Usuário digita no input
2. `parseInput()` extrai tokens
3. Tag `#inbox` é adicionada automaticamente
4. Item salvo no Supabase
5. Lista atualiza via React Query

---

### 3. MacroPicker Engine (B.8)

**Arquivo:** `src/components/inbox/MacroPickerModal.tsx`

Modal de promoção de itens do inbox para projetos.

#### Interface

| Elemento | Função |
|----------|--------|
| Type Buttons | Escolher: Task, Habit, Note, Project |
| Project Combobox | Selecionar projeto existente |
| Create Project | Criar novo projeto inline |
| Suggestions | Badges de projetos do mesmo módulo |
| Confirm Button | Só habilita com projeto selecionado |

#### Ação de Promoção

1. Remove tag `#inbox`
2. Adiciona `project_id`
3. Adiciona tag `#macro:NomeProjeto`
4. Atualiza `type` se alterado
5. Item desaparece do Inbox

---

## 🔧 Hooks

### useAtomItems

```typescript
const {
  items,           // AtomItem[] - Lista de itens
  isLoading,       // boolean - Estado de carregamento
  error,           // Error | null
  refetch,         // () => void - Recarregar
  createItem,      // (payload) => Promise<AtomItem>
  updateItem,      // ({ id, ...payload }) => Promise<AtomItem>
  deleteItem,      // (id) => Promise<void>
  isCreating,      // boolean
  isUpdating,      // boolean
  isDeleting,      // boolean
} = useAtomItems();
```

### useEngineLogger

```typescript
const {
  logs,      // EngineLogEntry[] - Lista de logs
  addLog,    // (engine, action, details?) => void
  clearLogs, // () => void
} = useEngineLogger();
```

### useDebugConsole

```typescript
const {
  isOpen,  // boolean
  toggle,  // () => void
  open,    // () => void
  close,   // () => void
} = useDebugConsole();
```

---

## 🖥️ Debug Console (God Mode)

**Atalho:** `Ctrl+Shift+E` ou `Cmd+Shift+E`

### Abas

1. **State** - JSON cru de todos os itens do banco
2. **Logs** - Logs de ações das engines
3. **Input Test** - Tester do ParsingEngine em tempo real

---

## 🎨 Design System

**Tema:** Terminal/Hacker (dark only)

### Cores Principais

| Token | HSL | Uso |
|-------|-----|-----|
| `--background` | 220 20% 8% | Fundo principal |
| `--console` | 220 20% 10% | Fundo do console |
| `--console-accent` | 142 70% 50% | Verde destaque |
| `--console-text` | 0 0% 92% | Texto principal |
| `--console-muted` | 220 10% 50% | Texto secundário |
| `--console-border` | 220 15% 18% | Bordas |

### Fonte

```css
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
```

---

## 📋 Roadmap

### ✅ Implementado (v4.0.0-alpha.2)

- [x] Modelo de dados (items table)
- [x] Tipos TypeScript
- [x] Parsing Engine (B.7)
- [x] Hook useAtomItems (CRUD)
- [x] Sistema de logs
- [x] Debug Console (God Mode)
- [x] Autenticação básica
- [x] RLS Policies
- [x] Inbox Engine (B.6) - Tela de captura
- [x] MacroPicker Engine (B.8) - Promoção para projetos

### 🔲 Próximas Etapas

- [ ] Dashboard Engine (B.10/B.14) - Lógica de exibição
- [ ] Ritual Engine (B.11/B.19) - Camada simbólica
- [ ] Realtime sync - Atualizações em tempo real
- [ ] Project View - Visualização de projeto com tarefas

---

## 🔗 Referências

- **Doc B.3** - Modelo de Dados Core
- **Doc B.6** - Inbox Engine
- **Doc B.7** - Parsing Engine
- **Doc B.8** - MacroPicker Engine
- **Doc B.9** - ProjectMeta
- **Doc B.10/B.14** - Dashboard Engine
- **Doc B.11/B.19** - Reflection & Ritual Engine
