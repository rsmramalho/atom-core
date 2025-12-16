# MindMate - Atom Engine 4.0

<div align="center">

![Version](https://img.shields.io/badge/version-4.0.0--alpha.8-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-alpha-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

**Sistema de produtividade pessoal com arquitetura modular de engines**

[Documentação](#-documentação) • [Quick Start](#-quick-start) • [Features](#-features) • [Roadmap](#-roadmap)

</div>

---

## ✨ O que há de novo na v4.0.0-alpha.8

### 📝 Reflection Engine (Fase 3)

- **Página Journal** (`/journal`) - Espaço zen para reflexões
- **Prompts Guiados** - Perguntas por categoria para inspirar
- **Busca Full-Text** - Encontre reflexões rapidamente com highlight
- **Check-in no Ritual** - Reflexão integrada ao fluxo de hábitos
- **Journal no Projeto** - Aba dedicada para decisões e ideias
- **Atalho ⌘J** - Acesso rápido ao diário

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

📝 Journal (/journal) ⭐ NOVO
├── Prompts por categoria
├── Busca full-text com highlight
├── Filtros por tag e período
└── Timeline visual de reflexões
```

### 3. Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` | Command Palette |
| `⌘H` | Home |
| `⌘I` | Inbox |
| `⌘P` | Projetos |
| `⌘R` | Ritual |
| `⌘J` | Journal ⭐ |
| `⌘N` | Novo Item |
| `/` | Buscar no Journal ⭐ |
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

---

## ✅ Status de Implementação

### Engines
- [x] Parsing Engine (B.7)
- [x] Inbox Engine (B.6)
- [x] MacroPicker Engine (B.8)
- [x] Dashboard Engine (B.10)
- [x] Ritual Engine (B.19)
- [x] Project Engine (B.9/B.13)
- [x] **Reflection Engine (B.11)** ⭐

### UI
- [x] Dashboard com Focus/Today/Ritual
- [x] Inbox com captura rápida
- [x] Project Sheet com 4 abas
- [x] Ritual View com Check-in
- [x] **Journal com prompts e busca** ⭐
- [x] Command Palette (⌘K)
- [x] Empty States ilustrados
- [x] Confetti de celebração

---

## 🔲 Roadmap

### Próximas Etapas
- [ ] CRUD completo para reflexões
- [ ] Exportação do Journal em Markdown
- [ ] Recorrência de hábitos (RRULE)
- [ ] Notificações e lembretes
- [ ] Estatísticas e analytics
- [ ] PWA + Offline mode

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

**v4.0.0-alpha.8** - 2025-12-15

Veja [CHANGELOG.md](docs/CHANGELOG.md) para detalhes.

---

## 🔗 Links

- 🔧 [Lovable Docs](https://docs.lovable.dev/)
- 💬 [Lovable Discord](https://discord.gg/lovable-dev)

---

<div align="center">

**Feito com 💚 usando [Lovable](https://lovable.dev)**

</div>
