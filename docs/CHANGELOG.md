# Changelog

Todas as mudanças notáveis do projeto MindMate - Atom Engine 4.0 serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [4.0.0-alpha.22] - 2026-03-04 🏗️ ARCHITECTURE REFACTOR

> **Refatoração arquitetural completa** - Auth centralizado, Landing componentizada, AppNavigation DRY, QueryClient otimizado

### Alterado

#### Auth Centralizado
- Removida duplicação de auth entre `Index.tsx` e `AppLayout.tsx`
- `AppLayout` agora é o único ponto de verificação de autenticação
- `Index.tsx` assume que o usuário já está autenticado (renderiza apenas dashboard)
- `onAuthStateChange` configurado antes de `getSession` (best practice)

#### Landing Page Componentizada (1054 → 32 linhas)
- Extraídas 9 seções em componentes independentes:
  - `HeroSection`, `PillarSection`, `AgnosticSection`, `FeaturesSection`
  - `BenefitsSection`, `DeveloperSection`, `FAQSection`, `CTASection`
  - `LandingNav`, `LandingFooter`
- Componentes compartilhados: `FeatureCard`, `BenefitItem` em `shared.tsx`
- `Landing.tsx` agora é apenas um compositor

#### AppNavigation Refatorada (483 → 240 linhas)
- Extraídos 3 componentes reutilizáveis:
  - `NavItemList` - lista de links de navegação
  - `SyncStatus` - indicador de sincronização
  - `SidebarActions` - botões de ação (debug, cache, backup, logout)
- Eliminada duplicação mobile/desktop via componente wrapper pattern
- Versão centralizada em constante `VERSION`

#### Performance
- `QueryClient` configurado com defaults: `staleTime: 5min`, `retry: 2`, `refetchOnWindowFocus: false`
- Onboarding (`WelcomeModal`, `TourOverlay`, `FirstStepsChecklist`) movido para dentro de `AppLayout`
  - Antes: renderizava em rotas públicas (Landing, Install, Privacy)
  - Depois: renderiza apenas para usuários autenticados

### Corrigido
- Warning de forwardRef no `FirstStepsChecklist` (hooks após early return)
- `console.log` em produção no `useNotifications.ts` removido

### Removido
- 6 dependências Radix órfãs: `hover-card`, `menubar`, `navigation-menu`, `toggle-group`, `aspect-ratio`, `avatar`
- Lógica duplicada de auth no `Index.tsx` (import supabase, AuthForm, loading state)

---

## [4.0.0-alpha.21] - 2026-03-04 🧹 CODE AUDIT & CLEANUP

> **Auditoria completa do codebase** - Remoção de código morto, componentes e dependências não utilizados

### Removido

#### 17 Componentes UI Não Utilizados
- `resizable.tsx`, `input-otp.tsx`, `carousel.tsx`, `drawer.tsx`
- `hover-card.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `toggle-group.tsx`
- `sidebar.tsx`, `pagination.tsx`, `breadcrumb.tsx`, `table.tsx`
- `aspect-ratio.tsx`, `avatar.tsx`, `alert.tsx`, `form.tsx`, `chart.tsx` (restaurado — usado por Analytics)

#### 6 Dependências npm Removidas
- `react-resizable-panels` — não utilizado
- `input-otp` — não utilizado
- `embla-carousel-react` — não utilizado
- `vaul` — não utilizado
- `@hookform/resolvers` — não utilizado
- `react-hook-form` — não utilizado

#### Outros Arquivos Removidos
- `public/placeholder.svg` — nunca referenciado
- `src/hooks/use-mobile.tsx` — apenas usado pelo sidebar deletado
- `src/components/ui/use-toast.ts` — wrapper duplicado desnecessário

### Verificado
- Zero erros de build após limpeza
- Todas as páginas testadas: Landing, Dashboard, Analytics, Calendar, Inbox, Projects
- Nenhuma regressão funcional

---

## [4.0.0-alpha.20] - 2025-12-17 🚀 LANDING PAGE & MARKETING

> **Landing Page de Marketing** - Nova página de entrada com posicionamento estratégico

### Adicionado

#### Landing Page (`/`)
- **Hero Section:** Tagline "Mindful control" com animação letra-por-letra
- **3 Pilares da Soberania Atom:** Internet Passiva, Estrutura Universal, Transparência Radical
- **Sistema Operacional Agnóstico:** Conceito "Plug & Play" com slots de Inteligência e Memória
- **Features Grid:** Seções de Produtividade e Introspecção com visual duality
- **Para Desenvolvedores:** Single Table Design, Fork-Friendly, Stack Moderna, Open Source
- **FAQ Section:** Perguntas frequentes com accordion
- **CTA Section:** "Gratuito para todos. Open source. Doe se puder, use mesmo se não puder."
- **Demo Modal:** Vídeo de demonstração

#### Roteamento Atualizado
- `/` → Landing Page (marketing)
- `/app` → Dashboard operacional (autenticado)
- Todos os links internos atualizados para `/app`

#### Design System
- Cards com sombras (`shadow-lg shadow-black/20`) para profundidade
- Seções alternadas com `bg-primary/5` para contraste visual
- Hover effects em cards com `hover:shadow-xl hover:border-primary/20`
- Divisores sutis entre seções (gradient line)

### Modificado
- **App.tsx:** Roteamento atualizado (landing em `/`, app em `/app`)
- **AppNavigation.tsx:** Links atualizados para `/app`
- **CommandPalette.tsx:** Navegação para `/app`
- **RitualView.tsx:** Retorno para `/app`
- **ErrorBoundary.tsx:** Redirecionamento para `/app`
- **NotFound.tsx:** Link para `/app`
- **Install.tsx:** Link para `/app`
- **Privacy.tsx:** Link para `/app`

---

## [4.0.0-alpha.19] - 2025-12-17 🎨 PERFORMANCE & UX POLISH

> **Fase 6: Performance & UX** - Refinamento final de experiência do usuário

### Adicionado

#### Error Handling & Loading States
- **ErrorBoundary Global:** Componente de fallback elegante com opções de retry/home/reload
- **Suspense Boundaries:** Em todas as rotas com PageLoader contextual
- **Skeleton Components:** ProjectCardSkeleton, InboxItemCardSkeleton, CalendarGridSkeleton

#### Performance Optimizations
- **React.memo:** Aplicado em ProjectCard, InboxItemCard, CalendarItem
- **React.lazy:** Carregamento lazy para páginas secundárias (Analytics, Install, Privacy, Lists)
- **Lazy SVG Illustrations:** Ilustrações de empty states carregadas sob demanda

#### Page Transitions & Micro-Animations
- **PageTransition Component:** AnimatePresence com fade + slide (200ms)
- **Button Animations:** active:scale-[0.98], hover:shadow-md
- **Card Interactions:** .card-interactive com hover-lift + shadow
- **Checkbox Animations:** hover-glow + zoom no ícone de check
- **Switch Animations:** hover-glow + thumb shadow
- **Badge Variants:** Interactive variant com scale
- **Progress Bars:** 500ms transition + gradient

#### Novas Rotas
- **/analytics:** Dashboard de métricas de produtividade
- **/install:** Guia de instalação PWA por plataforma
- **/privacy:** Página de política de privacidade

#### Ritual View UX Polish
- **Empty State:** Ícone Feather, mensagem contextual, CTA para criar hábito
- **Step Transitions:** AnimatePresence com fade/slide, staggered cards
- **Completion Feedback:** Checkmark pulse animation

### Modificado
- **AppNavigation:** Tooltip de versão com melhorias recentes
- **index.css:** Novas animações (hover-lift, hover-glow, card-interactive)

---

## [4.0.0-alpha.18] - 2025-12-17 🎯 ZERO ANY POLICY

> **Fase 5: Refinamento Final & Type Safety** - Score de Auditoria: 50/50

### Adicionado

#### Type Safety Infrastructure
- **`src/types/auth.ts`:** Tipos centralizados para autenticação
  - `UserProfile` - Interface completa baseada no schema Supabase Auth
  - `User` - Re-export do tipo Supabase para consistência
  - `AuthError` - Tipagem de erros de autenticação

- **`src/types/database.ts`:** Tipos para mapeamento de banco de dados
  - `ItemsRow` - Tipo bruto da tabela items
  - `TypedItemsRow` - Versão tipada com conversões seguras
  - `asTypedRow()` - Helper para casting seguro de rows
  - `OnboardingProgressRow`, `OnboardingAnalyticsRow` - Tipos de onboarding
  - `UpdatePayload` - Tipo para payloads de update
  - `EngineLogEntry` - Tipo para logs do debug console

### Modificado

#### Eliminação de `any` Types (15 → 0)

**Hooks Refatorados:**
- `useAtomItems.ts` - Mapeamento tipado com `ItemsRow`
- `useMilestones.ts` - Mapeamento tipado para milestones
- `useCalendarItems.ts` - Mapeamento tipado para items de calendário

**Componentes de Auth:**
- `Index.tsx` - useState tipado com `User | null`
- `Inbox.tsx` - useState tipado com `User | null`
- `AppLayout.tsx` - useState tipado com `User | null`
- `AuthForm.tsx` - useState tipado com `User | null`

**Componentes UI:**
- `FocusBlock.tsx` - Casting explícito para `order_index`
- `OnboardingContext.tsx` - Tipagem de `checklistProgress` object
- `EngineDebugConsole.tsx` - Tipagem de `EngineLogEntry[]`
- `RecurrencePickerModal.tsx` - Tipagem de completion_log

**Engine:**
- `recurrence-engine.ts` - Tipagem de completion_log entries

### Validação

- ✅ Build TypeScript: Zero erros
- ✅ Busca por `: any`: 0 ocorrências
- ✅ Busca por `as any`: 1 ocorrência (intencional em teste)
- ✅ Console logs: Sem erros de runtime

---

## [4.0.0-alpha.17] - 2025-12-17

### Corrigido
- **Mobile Black Screen Bug:** Corrigido erro React #310 causado por uso incorreto de AnimatePresence em `InstallPrompt.tsx`
  - Condição movida para dentro do AnimatePresence com key estável no motion.div
  - Padrão correto: renderizar condicionalmente o motion.div, não o AnimatePresence

### Modificado
- **PWA Icons:** Regenerados todos os 8 ícones (72x72 até 512x512) com design de átomo em verde (#26D96E) em fundo escuro (#111318)
- **Favicon:** Atualizado com design de átomo com glow
- **iOS Splash Screens:** Adicionadas 7 splash screens cobrindo iPhone SE até iPad Pro 12.9"

---

## [4.0.0-rc.1] - 2025-12-16 🚀 MILESTONE RELEASE

> **🎯 FORK POINT:** Esta versão marca um marco importante no desenvolvimento do Atom Engine 4.0.
> O branch principal continua com inovações experimentais, enquanto a equipe faz fork desta versão
> para desenvolvimento do aplicativo de produção. Todas as funcionalidades core estão estáveis e testadas.

### Highlights desta Release

- ✅ **Core Engine Completo:** Parsing Engine, Inbox, MacroPicker, Dashboard, Projects
- ✅ **Ritual System:** Períodos do dia com check-in e reflexões integradas
- ✅ **Calendar Engine:** Visualização mensal/semanal com drag-and-drop
- ✅ **Journal/Reflection:** Sistema completo de introspecção com prompts guiados
- ✅ **Project Intelligence:** State machine, progress híbrido, milestones ponderados
- ✅ **Onboarding System:** Welcome modal, tour guiado, checklist gamificado, analytics
- ✅ **Power User Features:** Command palette, keyboard shortcuts, haptic feedback
- ✅ **Mobile Ready:** Responsivo, swipe navigation, touch-optimized
- ✅ **100+ Testes:** Cobertura de Parsing Engine, Dashboard filters, Milestones

### Para a Equipe de Fork

Arquivos essenciais para entender o sistema:
- `docs/FULL_DOCUMENTATION.md` - Documentação técnica completa
- `docs/ARCHITECTURE.md` - Visão geral da arquitetura
- `docs/API.md` - Referência de APIs e hooks
- `src/types/atom-engine.ts` - Source of truth para tipos

---

## [4.0.0-alpha.14] - 2025-12-16

### Adicionado

#### List Engine (Fase 4) - Listas Rápidas
- **Nova Rota `/lists`:** Página dedicada para listas com grid layout estilo Google Keep
- **ListDetailModal:** Modal de edição com input rápido (Enter para adicionar), checkboxes e drag & drop
- **Cores Personalizadas:** 18 opções de cores via picker (armazenadas como tag `color:*`)
- **Ações Rápidas:**
  - Duplicar lista (copia título e todos os itens)
  - Limpar concluídos (remove itens completados)
  - Excluir lista (com confirmação)
- **Hierarquia:** Listas são items `type='list'`, itens internos são tasks com `parent_id`
- **Atalho ⌘⇧L:** Acesso rápido via Command Palette
- **Isolamento:** Itens de listas NÃO aparecem no Dashboard Today (a menos que tenham due_date)

#### Habit Streaks & Heatmap
- **StreakBadge:** Badge visual mostrando dias consecutivos de conclusão
- **HabitHeatmap:** Visualização de histórico de conclusões em formato calendário
  - Exibe últimos 90+ dias
  - Cores indicam dias completados
  - Mostra streak atual, maior streak e % de conclusão mensal
- **Integração:** Badge clicável no Dashboard, WorkAreaPane e RitualBanner

#### Recurrence Engine (B.5)
- **RRULE Support:** Integração com biblioteca rrule para padrões complexos
- **RecurrencePickerModal:** Modal para configurar recorrência em tasks com due_date
- **Presets:** Diário, semanal (dias específicos), mensal
- **Completion Log:** Campo JSONB para rastrear conclusões de instâncias recorrentes
- **Virtual Projection:** Instâncias projetadas visualmente no calendário sem persistir no DB

### Modificado
- **AppNavigation:** Adicionado link "Listas" na sidebar
- **CommandPalette:** Adicionada opção "Ir para Listas" com atalho ⌘⇧L
- **ProjectFab:** Adicionada opção "Nova Lista" no menu flutuante

---

## [4.0.0-alpha.13] - 2025-12-16

### Adicionado

#### WorkArea Drag & Drop Avançado
- **Conversão de Tipo via Drag:** Arrastar task para seção Hábitos converte para habit (e vice-versa)
- **Modal de Confirmação:** Dialog antes de converter com opção de cancelar
- **Seletor de Ritual Slot:** Ao converter para hábito, permite selecionar período (Manhã, Meio-dia, Noite)
- **Animação de Sucesso:** Pulse animation + ring colorido no item recém-convertido (1.5s)
- **Feedback Háptico:** Vibração em mobile ao arrastar e soltar

#### Context Menu Avançado para Hábitos
- **Submenu "Período do Ritual":** Opções Manhã, Meio-dia, Noite
- **Highlight do Período Ativo:** Visual colorido no item selecionado
- **Opção "Remover Período":** Permite desvincular hábito do ritual

#### Visual Badges de Ritual Slot
- **Badge Colorido por Período:**
  - Manhã: Amber/laranja com ícone Sunrise
  - Meio-dia: Amarelo com ícone Sun
  - Noite: Roxo com ícone Sunset
- **Responsivo:** Nome do período visível em telas maiores (sm:inline)

#### Project Status Visual Treatment
- **Cards de Projeto (ProjectCard.tsx):**
  - Pausado: opacity-60, borda amber, badge "Pausado"
  - Concluído: borda azul, badge "Concluído", ícone azul
  - Arquivado: opacity-50, borda slate, badge "Arquivado"
- **Project Detail:** Container com opacity reduzida para pausados
- **Toast de Conclusão Aprimorado:**
  - Sugestão de criar reflexão de encerramento
  - Botão de ação direta "Criar Reflexão"
  - Navega para aba Journal do projeto

### Modificado
- **`ItemContextMenu.tsx`:** Suporte a isHabit, onRitualSlotChange, currentRitualSlot
- **`WorkAreaPane.tsx`:** DndContext unificado para tasks e hábitos
- **`ProjectCard.tsx`:** STATUS_BADGE_CONFIG com visual por status
- **`ProjectDetail.tsx`:** isProjectPaused + toast com ação

---

## [4.0.0-alpha.12] - 2025-12-16

### Adicionado

#### Project Intelligence (A.9/A.18)
- **State Machine (Ciclo de Vida de Projetos):**
  - Status: `draft`, `active`, `paused`, `completed`, `archived`
  - `ProjectStatusDropdown` com ícones e confirmação para transições sensíveis
  - Projetos `paused` excluídos de estatísticas globais de produtividade
  - Transição para `completed` dispara animação de confetti
  - Projetos `completed` ou `archived` bloqueiam criação de novas tasks/milestones

- **Progress Engine Híbrido:**
  - Modo `auto`: (Tasks + Milestones concluídos) / Total * 100
  - Modo `milestone`: Apenas milestones contam (ignora tasks)
  - Modo `manual`: Valor arbitrário definido pelo usuário (0-100)
  - `ProjectSettingsModal` para configurar modo de progresso
  - Enum `progress_mode` atualizado no banco de dados

#### Componentes UI
- `ProjectStatusDropdown.tsx` - Dropdown de status com transições válidas
- `ProjectSettingsModal.tsx` - Modal de configurações de progresso

### Modificado
- **`useProjectProgress.ts`:** Refatorado para suportar 3 modos de cálculo
- **`ProjectDetail.tsx`:** Integrado State Machine e Progress Engine
- **`MilestonesPane.tsx`:** `onCreate` agora é opcional (bloqueado em projetos finalizados)
- **`useAtomItems.ts`:** Type assertion para compatibilidade com `progress_mode`

### Migração de Banco de Dados
- Adicionado `'milestone'` ao enum `progress_mode`

---

## [4.0.0-alpha.10] - 2025-12-16

### Adicionado

#### Calendar Engine - Navegação Avançada
- **Atalhos de Teclado para Visualização:**
  - `M` - Alterna para visualização mensal
  - `W` - Alterna para visualização semanal
  - Hints visuais nos botões de toggle
- **Navegação por Setas:**
  - `←` - Mês/Semana anterior
  - `→` - Próximo mês/semana
  - `T` - Ir para hoje
- **Suporte a Touch/Swipe (Mobile):**
  - Swipe esquerda → Próximo mês/semana
  - Swipe direita → Mês/semana anterior
  - **Feedback Visual:** Indicadores de seta com gradiente durante swipe
  - Hook `useSwipe` retorna `swipeState` com direção e offset

### Modificado
- **`useSwipe.ts`:** Refatorado para retornar `handlers` e `swipeState` separados
- **`Calendar.tsx`:** Integrado feedback visual de swipe
- **`KeyboardShortcutsHelp.tsx`:** Adicionada seção "Calendário" com todos os novos atalhos

---

## [4.0.0-alpha.9] - 2025-12-16

### Adicionado

#### Single Table Design - Milestones Unificados
- **Migração de Dados:** Milestones movidos da tabela `project_milestones` para `items`
- **Tag `#milestone`:** Milestones são agora items com type='task' e tag '#milestone'
- **Coluna `weight`:** Adicionada à tabela `items` (integer, default: 1)
- **Peso Customizável:** Slider 1-10x na criação de milestones (padrão: 3)
- **Tooltips Explicativos:** Informações sobre impacto do peso no progresso

#### Validação de Peso
- **Validação >= 1:** Peso mínimo garantido na criação
- **Feedback Visual:** Slider com indicador de peso em tempo real
- **Tooltips:** Explicação da fórmula de cálculo de progresso

### Modificado
- **`useMilestones.ts`:** Refatorado para consultar tabela `items` com filtro de tag
- **`useProjectProgress.ts`:** Aceita apenas `projectItems` (Single Table Design)
- **`MilestonesPane.tsx`:** Suporte a peso customizado com slider
- **`QuickAddMilestoneModal.tsx`:** Adicionado slider de peso
- **`WorkAreaPane.tsx`:** Filtra milestones (#milestone) da lista de tasks
- **Documentação:** Atualizada para refletir Single Table Design

### Removido
- **Tabela `project_milestones`:** Consolidada na tabela `items`
- **Interface `Milestone` separada:** Milestones são agora `AtomItem` com tag

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
