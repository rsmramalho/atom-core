# Guia de Contribuição - MindMate Atom Engine 4.0

Obrigado pelo interesse em contribuir! Este guia ajudará você a entender como participar do desenvolvimento.

---

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Começando](#começando)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Padrões de Código](#padrões-de-código)
- [Convenções de Branch](#convenções-de-branch)
- [Fluxo de Trabalho](#fluxo-de-trabalho)
- [Convenções de Commit](#convenções-de-commit)
- [Criando Issues](#criando-issues)
- [Pull Requests](#pull-requests)
- [Code Review](#code-review)

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
- Familiaridade com o modelo de dados (ver [ARCHITECTURE.md](./ARCHITECTURE.md))

### Ambiente de Desenvolvimento

O projeto roda no Lovable Cloud, então não é necessário configurar ambiente local. Porém, você pode:

1. **Conectar ao GitHub** via Lovable para ter o código no seu repositório
2. **Clonar localmente** para análise e edição no seu IDE favorito
3. **Sincronizar** mudanças via GitHub (sync bidirecional)

### Estrutura de Diretórios

```
src/
├── components/          # Componentes React
│   ├── ui/             # shadcn/ui components
│   ├── dashboard/      # Dashboard components
│   ├── inbox/          # Inbox components
│   ├── project-sheet/  # Project detail components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utilitários e engines
├── pages/              # Páginas/rotas
├── types/              # TypeScript types
└── integrations/       # Integrações (Supabase)

docs/
├── ARCHITECTURE.md     # Documentação de arquitetura
├── CHANGELOG.md        # Histórico de mudanças
├── API.md              # Referência de API
└── CONTRIBUTING.md     # Este arquivo
```

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

## 🌿 Convenções de Branch

### Estrutura do Nome

```
<tipo>/<issue-number>-<descricao-curta>
```

### Tipos de Branch

| Prefixo | Uso | Exemplo |
|---------|-----|---------|
| `feature/` | Nova funcionalidade | `feature/42-calendar-drag-drop` |
| `fix/` | Correção de bug | `fix/58-ritual-period-detection` |
| `hotfix/` | Correção urgente em produção | `hotfix/critical-auth-bypass` |
| `refactor/` | Refatoração de código | `refactor/extract-filter-hooks` |
| `docs/` | Alterações de documentação | `docs/api-reference-update` |
| `test/` | Adição/modificação de testes | `test/parsing-engine-coverage` |
| `chore/` | Tarefas de manutenção | `chore/update-dependencies` |

### Regras

1. **Sempre em inglês** - Descrições de branch em inglês
2. **Kebab-case** - Palavras separadas por hífen
3. **Curto e descritivo** - Máximo 50 caracteres na descrição
4. **Inclua número da issue** - Quando relacionado a uma issue

### Branches Protegidas

| Branch | Propósito | Merge Policy |
|--------|-----------|--------------|
| `main` | Código de produção estável | Somente via PR aprovado |
| `develop` | Integração de features | PR com 1+ aprovação |
| `release/*` | Preparação de releases | Freeze de features |

### Exemplos Completos

```bash
# Feature nova com issue
git checkout -b feature/123-add-journal-search

# Bug fix
git checkout -b fix/456-overdue-items-not-showing

# Hotfix sem issue
git checkout -b hotfix/login-redirect-loop

# Refatoração
git checkout -b refactor/dashboard-hooks-cleanup

# Documentação
git checkout -b docs/fork-guide-improvements
```

---

### 1. Entenda o Contexto

Antes de implementar, leia:
- [ ] Issue relacionada (se existir)
- [ ] [ARCHITECTURE.md](./ARCHITECTURE.md) para entender a estrutura
- [ ] [API.md](./API.md) para hooks e tipos disponíveis
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

- Atualize `CHANGELOG.md` com suas mudanças
- Atualize `API.md` se criou novos hooks/tipos
- Atualize `ARCHITECTURE.md` se mudou estrutura

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

## 👀 Code Review

### Para Autores

1. **Self-review primeiro** - Revise seu próprio código antes de abrir PR
2. **PR pequenos** - Máximo 400 linhas de mudança quando possível
3. **Descrição clara** - Explique o "porquê" além do "o quê"
4. **Responda rapidamente** - Engaje com feedback em até 24h

### Para Reviewers

#### O Que Verificar

| Aspecto | Perguntas |
|---------|-----------|
| **Funcionalidade** | O código faz o que deveria? Edge cases cobertos? |
| **Design** | Segue a arquitetura? Está no lugar certo? |
| **Legibilidade** | Código é claro? Nomes fazem sentido? |
| **Performance** | Há loops desnecessários? Queries otimizadas? |
| **Segurança** | RLS respeitado? Dados sensíveis protegidos? |
| **Design System** | Usa tokens semânticos? Responsivo? |

#### Linguagem de Review

```markdown
# Níveis de Feedback

🔴 **Blocker**: "Isso precisa mudar antes do merge"
🟡 **Suggestion**: "Considere fazer X" ou "nit: pequeno ajuste"
🟢 **Praise**: "Ótima solução para esse problema!"
❓ **Question**: "Não entendi essa parte, pode explicar?"
```

#### Template de Comentário

```markdown
**[Blocker/Suggestion/Question]**

Contexto: [Onde está o problema]
Problema: [O que está errado ou pode melhorar]
Sugestão: [Como resolver]
```

### Critérios de Aprovação

- [ ] Código compila sem erros
- [ ] Tipos TypeScript corretos
- [ ] Não quebra funcionalidade existente
- [ ] Segue padrões do projeto
- [ ] Documentação atualizada (se necessário)
- [ ] CHANGELOG atualizado

### Tempo de Resposta

| Prioridade | Tempo Máximo |
|------------|--------------|
| Hotfix | 2 horas |
| Bug fix | 24 horas |
| Feature | 48 horas |
| Refactor/Docs | 72 horas |

---

## 📚 Recursos Úteis

- [FORK_GUIDE.md](./FORK_GUIDE.md) - Setup do ambiente de desenvolvimento
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Checklist de deploy
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Visão geral da arquitetura
- [API.md](./API.md) - Referência de tipos e hooks
- [CHANGELOG.md](./CHANGELOG.md) - Histórico de versões
- [Lovable Docs](https://docs.lovable.dev/) - Documentação do Lovable
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/docs) - Documentação Tailwind

---

## ❓ Dúvidas?

- Abra uma issue com a tag `question`
- Consulte a documentação existente
- Verifique issues fechadas para problemas similares

---

<div align="center">

**Obrigado por contribuir! 💚**

</div>
