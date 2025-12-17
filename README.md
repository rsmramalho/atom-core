# MindMate - Atom Engine 4.0

<div align="center">

[![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
[![Issues](https://img.shields.io/github/issues/YOUR_USERNAME/YOUR_REPO?style=flat-square)](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/YOUR_USERNAME/YOUR_REPO?style=flat-square)](https://github.com/YOUR_USERNAME/YOUR_REPO/pulls)
[![Contributors](https://img.shields.io/github/contributors/YOUR_USERNAME/YOUR_REPO?style=flat-square)](https://github.com/YOUR_USERNAME/YOUR_REPO/graphs/contributors)

![Version](https://img.shields.io/badge/version-4.0.0--alpha.19-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-production-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

**Sistema de produtividade pessoal com arquitetura modular de engines**

[Documentação](#-documentação) • [Quick Start](#-quick-start) • [Features](#-features) • [Contributing](#-contributing) • [Roadmap](#-roadmap)

</div>

---

## 🚀 v4.0.0-alpha.19 - Fase 6: Performance & UX

> **✅ PRODUCTION READY:** Sistema completo com PWA, offline sync, notificações,  
> analytics dashboard, e polimento de UX. Zero Any Policy enforced.

### ✅ Funcionalidades Core Completas

| Engine | Status | Descrição |
|--------|--------|-----------|
| Parsing Engine | ✅ | Tokens @hoje, @amanha, #tags, módulos |
| Inbox Engine | ✅ | Captura e processamento |
| MacroPicker | ✅ | Promoção com sugestões inteligentes |
| Dashboard | ✅ | Focus, Today, Ritual sections |
| Project Engine | ✅ | State machine, progress híbrido |
| Ritual Engine | ✅ | Períodos, check-in, reflexões |
| Calendar Engine | ✅ | Month/week views, drag-and-drop |
| Reflection Engine | ✅ | Journal, prompts, busca full-text |
| Onboarding | ✅ | Welcome, tour, checklist, analytics |
| List Engine | ✅ | Listas com cores personalizadas |
| Habit Streaks | ✅ | Badge + Heatmap de conclusões |
| Recurrence Engine | ✅ | RRULE para tarefas recorrentes |
| **PWA + Offline** | ✅ | **Service Worker, sync queue** ⭐ NOVO |
| **Notifications** | ✅ | **Web Notifications API** ⭐ NOVO |
| **Analytics** | ✅ | **Dashboard de produtividade** ⭐ NOVO |

---

## 🚀 Quick Start

### 1. Crie uma Conta

Na tela de login, clique em **"Não tem conta? Cadastre-se"**

### 2. Explore as Features

```
🏠 Dashboard (/)
├── Focus Block - Itens com #focus
├── Today List - Vencimentos do dia
└── Ritual Banner - Hábitos do período

📥 Inbox (/inbox)
├── Captura rápida com parsing
├── Tokens: @hoje, @amanha, #tags
└── Promoção para projetos

📁 Projects (/projects)
├── Lista de projetos ativos
├── Filtros por módulo
└── Ordenação por nome/progresso/data

📋 Project Sheet (/projects/:id)
├── Trabalho - Tasks & Hábitos
├── Jornada - Timeline de Milestones
├── Notas - Recursos e anotações
└── Journal - Reflexões do projeto ⭐

🌅 Ritual View (/ritual)
├── Hábitos do período atual
├── Check-in com pergunta guiada ⭐
└── Salvamento automático de reflexão

📝 Journal (/journal)
├── Prompts por categoria
├── Busca full-text com highlight
├── Filtros por tag e período
└── Timeline visual de reflexões

📋 Listas (/lists) ⭐ NOVO
├── Grid de cards estilo Keep
├── Cores personalizadas (18 opções)
├── Drag & Drop para reordenar
└── Ações: duplicar, limpar, excluir
```

### 3. Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` | Command Palette |
| `⌘H` | Home |
| `⌘I` | Inbox |
| `⌘P` | Projetos |
| `⌘L` | Calendário |
| `⌘R` | Ritual |
| `⌘J` | Journal |
| `⌘⇧L` | **Listas** ⭐ NOVO |
| `⌘N` | Novo Item |
| `/` | Buscar no Journal |
| `Ctrl+Shift+E` | Debug Console |

---

## ✨ Features

### 🧠 Parsing Engine

```
"Reunião com cliente @amanha #mod_work"
     ↓ parseInput()
{
  title: "Reunião com cliente",
  due_date: "2025-12-16",
  module: "work"
}
```

### 🌅 Ritual View com Check-in

Experiência imersiva para hábitos diários, agora com reflexão integrada:

1. **Hábitos** - Complete seus hábitos do período
2. **Check-in** - Responda uma pergunta contextual
3. **Encerramento** - Reflexão salva automaticamente no Journal

| Período | Horário | Pergunta |
|---------|---------|----------|
| 🌅 Aurora | < 11:00 | "Qual é sua intenção para hoje?" |
| ☀️ Zênite | 11:00-17:00 | "Como está sendo seu dia até agora?" |
| 🌆 Crepúsculo | > 17:00 | "Como você encerra este ciclo?" |

### 📝 Journal (Reflection Engine)

Sistema de journaling com design zen:

- **Prompts Guiados** por categoria (Gratidão, Crescimento, Sentimentos, Metas, Aprendizado)
- **Busca Full-Text** com destaque dos termos
- **Filtros** por tags e período de tempo
- **Timeline Visual** conectando reflexões
- **Atalho /** para focar na busca

### 📋 Project Sheet

Gestão completa de projetos em 4 abas:

1. **Trabalho** - Tasks e Hábitos separados
2. **Jornada** - Timeline de Milestones (peso 3x)
3. **Notas** - Resources e Notes
4. **Journal** - Reflexões e decisões do projeto

### 📋 List Engine ⭐ NOVO

Listas rápidas para organizar itens simples:

- **Cores Personalizadas** - 18 opções de cores
- **Grid Layout** - Estilo Google Keep
- **Drag & Drop** - Reordenação de itens
- **Ações Rápidas** - Duplicar, limpar concluídos, excluir

### 🔥 Habit Streaks ⭐ NOVO

Gamificação para hábitos:

- **StreakBadge** - Badge visual de dias consecutivos
- **HabitHeatmap** - Calendário de histórico de conclusões

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18.3 + Vite |
| **Linguagem** | TypeScript 5.0+ |
| **Styling** | Tailwind CSS 3.4 |
| **Backend** | Lovable Cloud (Supabase) |
| **State (Server)** | TanStack Query 5.x |
| **State (Client)** | Zustand 5.x |
| **Icons** | Lucide React |
| **Dates** | date-fns 3.x |
| **UI Components** | shadcn/ui |

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| 📐 [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Estrutura, modelo de dados, engines |
| 📜 [CHANGELOG.md](docs/CHANGELOG.md) | Histórico de versões |
| 📖 [API.md](docs/API.md) | Referência de tipos, hooks e componentes |
| 🚀 [FORK_GUIDE.md](docs/FORK_GUIDE.md) | Setup do ambiente de desenvolvimento |
| ✅ [DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) | Checklist para deploy em produção |
| 📝 [FULL_DOCUMENTATION.md](docs/FULL_DOCUMENTATION.md) | Documentação completa consolidada |

---

## 🤝 Contributing

Contribuições são bem-vindas! Por favor, leia nosso [Guia de Contribuição](docs/CONTRIBUTING.md) antes de enviar PRs.

### Quick Links

- 📋 [Abrir uma Issue](https://github.com/YOUR_USERNAME/YOUR_REPO/issues/new/choose)
- 🔀 [Ver Pull Requests](https://github.com/YOUR_USERNAME/YOUR_REPO/pulls)
- 💡 [Discussões](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions)

---

## ✅ Status de Implementação

### Engines
- [x] Parsing Engine (B.7)
- [x] Inbox Engine (B.6)
- [x] MacroPicker Engine (B.8)
- [x] Dashboard Engine (B.10)
- [x] Calendar Engine (B.4)
- [x] Ritual Engine (B.19)
- [x] Project Engine (B.9/B.13)
- [x] Reflection Engine (B.11)
- [x] **List Engine** ⭐ NOVO
- [x] **Recurrence Engine (B.5)** ⭐ NOVO

### UI
- [x] Dashboard com Focus/Today/Ritual
- [x] Inbox com captura rápida
- [x] Project Sheet com 4 abas
- [x] Calendar com drag & drop
- [x] Ritual View com Check-in
- [x] Journal com prompts e busca
- [x] **Listas com cores personalizadas** ⭐ NOVO
- [x] **Habit Streaks + Heatmap** ⭐ NOVO
- [x] Command Palette (⌘K)
- [x] Empty States ilustrados
- [x] Confetti de celebração

---

## 🔲 Roadmap

### ✅ Concluído na Fase 6
- [x] Exportação do Journal (Markdown, JSON, PDF)
- [x] Notificações e lembretes (Web Notifications API)
- [x] Estatísticas e analytics (/analytics)
- [x] PWA + Offline mode (Service Worker + IndexedDB)

### Próximas Etapas
- [ ] Publicação Google Play Store (TWA)
- [ ] Push Notifications (VAPID)
- [ ] Widgets nativos

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│                      PRESENTATION                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │Dashboard│ │  Inbox  │ │Projects │ │ Ritual  │ │ Journal │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │
├───────┼───────────┼───────────┼───────────┼───────────┼──────┤
│       │     APPLICATION LAYER │           │           │      │
│  ┌────▼───────────▼───────────▼───────────▼───────────▼────┐ │
│  │                    Custom Hooks                          │ │
│  │  useDashboardData │ useMilestones │ useRitual │ useAtom  │ │
│  └──────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │  Parsing  │ │ MacroPick │ │  Project  │ │Reflection │     │
│  │  Engine   │ │  Engine   │ │  Engine   │ │  Engine   │     │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
├───────────────────────────────────────────────────────────────┤
│                       DATA LAYER                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │              Lovable Cloud (Supabase)                  │   │
│  │  ┌──────────┐  ┌──────────────────────┐               │   │
│  │  │  items   │  │  project_milestones  │               │   │
│  │  └──────────┘  └──────────────────────┘               │   │
│  └───────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

---

## 📝 Versão Atual

**v4.0.0-alpha.19** - 2025-12-17 🎨 **Fase 6: Performance & UX**

> ErrorBoundary, Suspense, Skeletons, React.memo, AnimatePresence, micro-animations. Veja [CHANGELOG.md](docs/CHANGELOG.md) para detalhes.

---

## 🔗 Links

- 🔧 [Lovable Docs](https://docs.lovable.dev/)
- 💬 [Lovable Discord](https://discord.gg/lovable-dev)

---

<div align="center">

**Feito com 💚 usando [Lovable](https://lovable.dev)**

</div>
