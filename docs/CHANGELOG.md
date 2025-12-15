# Changelog

Todas as mudanças notáveis do projeto MindMate - Atom Engine 4.0 serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [4.0.0-alpha.1] - 2025-12-15

### Adicionado

#### Banco de Dados (Lovable Cloud)
- Tabela `items` com schema completo baseado no Doc B.3/B.9
- Enums: `item_type`, `ritual_slot`, `project_status`, `progress_mode`
- Índices para performance: user_id, type, project_id, parent_id, due_date, tags (GIN)
- RLS Policies para isolamento de dados por usuário
- Trigger para atualização automática de `updated_at`
- Realtime habilitado na tabela items

#### Core Engine
- **Tipos TypeScript** (`src/types/atom-engine.ts`)
  - `AtomItem` - Interface principal
  - `ParsedInput` - Resultado do parsing
  - `EngineLogEntry` - Entrada de log
  - Tipos auxiliares: `ItemType`, `RitualSlot`, `ProjectStatus`, etc.

- **Parsing Engine** (`src/lib/parsing-engine.ts`) - Doc B.7
  - Detecção de `@hoje` e `@amanha` → `due_date`
  - Detecção de `@ritual_*` → `ritual_slot` + tipo `habit`
  - Extração de `@who:*` e `@where:*` → tags de contexto
  - Extração de `#tags` genéricas
  - Inferência de módulo por palavras-chave
  - Inferência de tipo por palavras-chave
  - Suporte a `#mod_*` para módulo explícito

#### Hooks
- **useAtomItems** - CRUD completo via React Query + Supabase
- **useEngineLogger** - Sistema de logs global com Zustand (mantém últimos 500)
- **useDebugConsole** - Controle de visibilidade + atalho de teclado

#### UI/Debug
- **EngineDebugConsole** - Overlay flutuante estilo terminal
  - Aba State: JSON cru dos itens
  - Aba Logs: Histórico de ações das engines
  - Aba Input Test: Tester do ParsingEngine em tempo real
  - Atalho: `Ctrl+Shift+E` / `Cmd+Shift+E`

- **AuthForm** - Login/signup simples para testes

- **Index Page** - Interface de debug com botão de acesso ao console

#### Design System
- Tema terminal/hacker (dark mode only)
- Cores customizadas: console-*, accent verde
- Fonte monospace: JetBrains Mono
- Scrollbar customizada
- Tokens semânticos em index.css + tailwind.config.ts

### Configurado
- Lovable Cloud habilitado
- Auto-confirm email ativado
- Dependência `zustand` instalada

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas em breve
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades
