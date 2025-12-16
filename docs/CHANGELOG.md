# Changelog

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
