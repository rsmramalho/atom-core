# Changelog

Todas as mudanças notáveis do projeto MindMate - Atom Engine 4.0 serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
  - Anel rotativo com gradiente
  - Partículas flutuantes com pulse
  - Checkmark central e folha decorativa
- **FreeDayIllustration** - Cena aconchegante de café para Dashboard vazio
  - Xícara com vapor animado
  - Sol com raios pulsantes
  - Nuvem e partículas decorativas
- **RocketLaunchIllustration** - Foguete dinâmico para Projeto novo
  - Chama animada no propulsor
  - Trilha de trajetória
  - Estrelas e bandeira de destino
- **TargetFocusIllustration** - Alvo minimalista para Focus vazio
  - Anéis concêntricos com pulse
  - Crosshairs e ponto central
  - Sparkle decorativo

#### Confetti Celebration
- **Componente Confetti** - Explosão de confetes para celebração
  - 60 peças com cores variadas (primary, gold, green, blue, pink, purple)
  - Animação de queda com rotação e drift horizontal
  - Duração e delay randomizados para efeito natural
- **Detecção automática** - Dispara ao completar todas as tasks do dia
- **Toast de celebração** - Mensagem "Parabéns!" ao zerar pendências

#### Drag & Drop Animations (FocusBlock)
- **DragOverlay** - Preview flutuante do item sendo arrastado
- **Transições suaves** - Cubic-bezier easing para movimentação natural
- **Feedback visual** - Escala, opacidade, bordas e rotação sutil durante arraste
- **Estados visuais** - Distinção clara entre item original e overlay

#### Haptic Feedback (Mobile)
- **Vibração no pickup** - Feedback médio (25ms) ao iniciar arraste
- **Vibração no hover** - Feedback leve (10ms) ao passar sobre nova posição
- **Vibração de sucesso** - Padrão [10, 50, 20]ms ao soltar com sucesso
- **Vibração de erro** - Feedback pesado (50ms) em caso de falha

#### Module System (UX)
- **ModuleBadge** - Componente de badge colorido para módulos
  - Cores distintas: Work (azul), Body (laranja), Mind (roxo), Family (rosa)
  - Ícones visuais: Briefcase, Dumbbell, Brain, Users
  - Suporte a tamanhos sm/md e ícone opcional
- **MacroPicker atualizado:**
  - Seletor de Módulo obrigatório ao criar projeto
  - Herança automática do módulo ao selecionar projeto
  - Override manual do módulo disponível
- **EditItemModal atualizado:**
  - Campo Módulo obrigatório para projetos
  - Seletor visual com 4 opções coloridas
- **Visualização em Cards:**
  - ProjectCard exibe ModuleBadge colorido
  - InboxItemCard exibe ModuleBadge do item
- **Regra de Negócio:**
  - Itens sem módulo recebem "geral" automaticamente
  - Projetos nunca podem ter módulo null

#### Projects Page - Filtros e Ordenação
- **Filtros por Módulo:**
  - Pills compactas para Work, Body, Mind, Family e Todos
  - Cores distintas por módulo
  - Contador de projetos por categoria
  - Estado vazio quando nenhum projeto no filtro
- **Ordenação de Projetos:**
  - Dropdown com opções: Nome, Progresso, Data de Criação
  - Toggle de direção (asc/desc) ao clicar no mesmo campo
  - Indicador visual de direção atual
  - Ordenação alfabética PT-BR para nomes

---

## [4.0.0-alpha.5] - 2025-12-15

### Adicionado

#### Project Sheet (A.13/B.13)
- **Tabela `project_milestones`** - Milestones como entidades independentes
  - `id`, `project_id`, `user_id`, `title`, `completed`, `weight`, `due_date`
  - RLS policies para isolamento por usuário
  - Peso padrão: 3x (tasks = 1x)
- **Hook `useMilestones`** - CRUD completo para milestones
  - `createMilestone()`, `updateMilestone()`, `deleteMilestone()`
  - `toggleComplete()` - Toggle de conclusão
- **Hook `useProjectProgress`** - Cálculo de progresso híbrido
  - Fórmula: `(Peso Concluído / Peso Total) * 100`
  - Considera tasks (peso 1) + milestones (peso 3)
- **Componentes Project Sheet:**
  - `MilestonesPane` - Timeline visual da "Jornada"
  - `WorkAreaPane` - Tasks e Hábitos separados
  - `NotesPane` - Notas e Recursos vinculados
  - `ProjectFab` - Botão flutuante com opções Task/Milestone
  - `QuickAddTaskModal` - Criação rápida de task
  - `QuickAddMilestoneModal` - Criação rápida de milestone

### Modificado
- **ProjectDetail** refatorado para Project Sheet completo
  - Header com título, módulo e status
  - Barra de progresso híbrido (tasks + milestones)
  - Layout em blocos verticais (não abas)
  - FAB para criação rápida dentro do projeto

---

## [4.0.0-alpha.4] - 2025-12-15

### Adicionado

#### Ritual View (A.19/B.19)
- **Rota `/ritual`** - Experiência imersiva full-screen
- **Detecção de Período** baseada na hora do sistema:
  - Aurora (manhã): < 11:00
  - Zênite (meio-dia): 11:00 - 17:00
  - Crepúsculo (noite): > 17:00
- **Cores por Período:**
  - Aurora: tons quentes (laranja/amarelo)
  - Zênite: tons claros (amarelo brilhante)
  - Crepúsculo: tons frios (roxo/azul)
- **Componentes:**
  - Header com ícone de sol e frase motivacional
  - Lista de hábitos com cards grandes e clicáveis
  - Feedback visual de conclusão (checkmark verde)
  - Botão "Encerrar Ritual" para voltar ao dashboard
- **Debug Selector** - Seletor para forçar período (dev only)

#### Ritual Slot Assignment
- **MacroPickerModal** atualizado para hábitos:
  - Seletor de ritual slot (Manhã, Meio-dia, Noite)
  - Só aparece quando `type === "habit"`
  - Ícones visuais: Sunrise, Sun, Sunset

#### Hook useRitual
- **Filtragem por período** - Hábitos do slot atual
- **Contagem de pendentes** - Para badge no dashboard
- **Funções de override** - Para debug/testes

### Modificado
- **Dashboard** agora mostra RitualBanner com botão "Entrar no Ritual"
- **Inbox** passa `ritualSlot` no `handlePromote`
- **AppLayout** não renderiza nav no `/ritual` (experiência imersiva)

---

## [4.0.0-alpha.3] - 2025-12-15

### Adicionado

#### Dashboard Engine (B.10)
- **Hook `useDashboardData`** - Filtros e organização para dashboard
  - `filterFocus()`: Itens com tag `#focus`
  - `filterToday()`: Itens com due_date <= hoje (exclui rituais)
  - `filterRitual()`: Hábitos com ritual_slot do período atual
  - `filterProjects()`: Projetos ativos com cálculo de progresso
  - `toggleComplete()`: Ação para completar itens do dashboard
- **RitualBanner** - Card de ritual ativo baseado na hora do sistema
- **FocusBlock** - Bloco de destaque para itens #focus
- **TodayList** - Lista do dia com separação Atrasados/Hoje

#### Project Engine (B.9)
- **Rota `/projects`** - Visão macro de todos os projetos
- **ProjectCard** - Card com título, módulo e barra de progresso
- **Cálculo de Progresso** - (itens completos / total) * 100
- **Rota `/projects/:id`** - Detalhes do projeto com lista de itens

#### Sistema de Navegação
- **AppNavigation** - Bottom nav (mobile) + Sidebar (desktop)
- **AppLayout** - Wrapper com auth handling e navegação
- **Rotas**: Home (/), Projects (/projects), Inbox (/inbox), Debug (Ctrl+Shift+E)

### Modificado
- Index.tsx agora é o Dashboard principal (não mais debug-only)
- Inbox.tsx simplificado (navegação movida para AppLayout)
- AuthForm.onSuccess agora é opcional

### Corrigido
- Modal MacroPicker agora fecha após confirmação
- Conversão para projeto agora define campos project_status, progress_mode, progress

---

## [4.0.0-alpha.2] - 2025-12-15

### Adicionado

#### Inbox Engine (B.6)
- **Rota `/inbox`** - Tela operacional de captura e processamento
- **Input de Captura** - Campo "O que está na sua mente?" com parsing automático
- **Filtro por tag** - Exibe apenas itens com `#inbox`
- **InboxItemCard** - Card com título, chips de tags, e botão "Processar"
- **Remoção automática** - Item some do inbox ao ser processado (remove `#inbox`)

#### MacroPicker Engine (B.8)
- **Modal MacroPicker** - Interface de promoção de itens
- **Seleção de Tipo** - Botões para Task, Habit, Note, Project
- **Seleção de Projeto** - Combobox com projetos existentes
- **Criação de Projeto** - Opção de criar "Projeto Geral" inline
- **Sugestões Inteligentes** - Destaca projetos do mesmo módulo (`#mod_*`)
- **Regra de Ouro** - Botão "Confirmar" só habilita com projeto selecionado
- **Tags de Promoção** - Adiciona `#macro:NomeProjeto` ao promover

#### UI/Navegação
- Botão "Abrir Inbox" na página principal
- Header do Inbox com contagem de itens
- Botão de acesso rápido ao Debug Console no Inbox

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
