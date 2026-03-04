

# Activity Feed para Projetos Compartilhados

## Objetivo
Adicionar um feed de atividades no projeto compartilhado mostrando ações dos membros (criação de tasks, conclusão de itens, entrada de membros, etc).

## Arquitetura

```text
┌──────────────────────┐       ┌─────────────────────┐
│  project_activities  │◄──────│  Triggers / App Code│
│  (nova tabela)       │       │  (inserts on action) │
└──────────┬───────────┘       └─────────────────────┘
           │
           ▼
┌──────────────────────┐
│  ActivityPane (UI)   │
│  Nova aba no projeto │
└──────────────────────┘
```

## Passos de Implementação

### 1. Criar tabela `project_activities`

Nova tabela para armazenar eventos do projeto:

```sql
CREATE TABLE public.project_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  action text NOT NULL,        -- 'task_created', 'task_completed', 'member_joined', etc.
  target_title text,           -- título do item afetado
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;
```

**RLS**: Membros do projeto podem ler; inserção via `SECURITY DEFINER` function ou direto pelo app (com policy usando `is_project_member`).

### 2. Criar function para registrar atividades

Uma function `log_project_activity` (SECURITY DEFINER) que insere no feed, validando que o user é membro do projeto.

### 3. Registrar atividades no código existente

Adicionar chamadas ao `log_project_activity` nos pontos-chave:
- **`ProjectDetail.tsx`**: Ao criar task, milestone, ou lista → log `task_created`, `milestone_created`, `list_created`
- **`WorkAreaPane.tsx`**: Ao completar item → log `item_completed`
- **`InviteAccept.tsx`**: Ao aceitar convite → log `member_joined`
- **Status change**: Ao mudar status do projeto → log `status_changed`

### 4. Criar hook `useProjectActivities`

Hook com `useQuery` para buscar atividades do projeto, ordenadas por `created_at DESC`, com paginação simples (últimas 50).

### 5. Criar componente `ActivityPane`

Nova aba "Atividade" no `ProjectDetail.tsx` (5ª tab) com:
- Timeline vertical com ícones por tipo de ação
- Nome/email do membro que fez a ação
- Timestamp relativo (ex: "há 2 horas")
- Scroll infinito ou "carregar mais"

### 6. Atualizar `ProjectDetail.tsx`

- Adicionar 5ª aba "Atividade" com ícone `Activity` do lucide
- Grid do TabsList passa de 4 para 5 colunas

## Detalhes Técnicos

- **Tipos de ação**: `task_created`, `task_completed`, `milestone_created`, `milestone_completed`, `list_created`, `member_joined`, `member_removed`, `status_changed`, `note_created`
- **RLS policies**: SELECT para `is_project_member`, INSERT para `is_project_member` (membros logam suas próprias ações)
- **Sem realtime** inicialmente — refresh ao abrir a aba
- A tabela não tem foreign keys para `items` (usa `target_title` como snapshot para simplicidade)

