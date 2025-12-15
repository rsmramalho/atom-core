# MindMate - Atom Engine 4.0

<div align="center">

![Version](https://img.shields.io/badge/version-4.0.0--alpha.5-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-alpha-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

**Sistema de produtividade pessoal com arquitetura modular de engines**

[Documentação](#-documentação) • [Quick Start](#-quick-start) • [Features](#-features) • [Roadmap](#-roadmap)

</div>

---

## 📸 Telas do Sistema

### 🔐 Login
```
┌─────────────────────────────────────┐
│                                     │
│          MindMate                   │
│       Atom Engine 4.0               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         Login               │   │
│  │                             │   │
│  │  Email: [user@example.com] │   │
│  │                             │   │
│  │  Password: [••••••••]      │   │
│  │                             │   │
│  │  [      Login →     ]      │   │
│  │                             │   │
│  │  Need an account? Sign up   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 📥 Inbox
```
┌─────────────────────────────────────────┐
│ 📥 Inbox                                │
│ 0 items para processar                  │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ O que está na sua mente?  [Capturar]│ │
│ └─────────────────────────────────────┘ │
│ Dica: Use @hoje, @amanha, #tags         │
│                                         │
│            📭 Inbox vazio               │
│  Capture pensamentos acima para começar │
└─────────────────────────────────────────┘
```

### 📁 Projects
```
┌─────────────────────────────────────────┐
│ 📁 Projetos              [+ Novo Item]  │
│ 0 projetos ativos                       │
│                                         │
│              📁                         │
│      Nenhum projeto ainda               │
│  Crie projetos processando itens        │
│           no Inbox                      │
│        [Ir para Inbox]                  │
└─────────────────────────────────────────┘
```

### 🌆 Ritual View (Crepúsculo)
```
┌─────────────────────────────────────────┐
│ [X]                    DEV: [aurora][...│
│                                         │
│               ☀️                        │
│                                         │
│       Ritual Crepúsculo                 │
│    Hora de refletir e descansar.        │
│                                         │
│  Progresso                         0%   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       │
│                                         │
│     Nenhum hábito para este ritual.     │
│  Adicione hábitos com ritual_slot =     │
│          "noite" no Inbox.              │
│                                         │
│         [Encerrar Ritual]               │
└─────────────────────────────────────────┘

Cores por período:
🌅 Aurora (< 11:00)     → #FFD9A0 (Laranja)
☀️ Zênite (11:00-17:00) → #FFF7C2 (Amarelo)
🌆 Crepúsculo (> 17:00) → #D4C0E8 (Roxo)
```

### 🖥️ Debug Console (Ctrl+Shift+E)
```
┌─────────────────────────────────────────┐
│ 🔧 Engine Debug Console          [X]   │
├─────────────────────────────────────────┤
│ [State] [Logs] [Input Test]             │
├─────────────────────────────────────────┤
│ {                                       │
│   "items": [...],                       │
│   "milestones": [...],                  │
│   "user": {...}                         │
│ }                                       │
│                                         │
│ > ParsingEngine: Parsed "@hoje" → today │
│ > MacroPicker: Item promoted to project │
│ > RitualEngine: Period = crepusculo     │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Pré-requisitos

- Conta no [Lovable](https://lovable.dev)
- Navegador moderno (Chrome, Firefox, Edge)

### 1. Acesse o Projeto

```bash
# O projeto já está hospedado no Lovable Cloud
# Acesse diretamente pelo navegador
```

### 2. Crie uma Conta

1. Na tela de login, clique em **"Não tem conta? Cadastre-se"**
2. Preencha email e senha
3. Confirme o cadastro (auto-confirm habilitado)

### 3. Explore as Features

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
└── Progresso calculado

📋 Project Sheet (/projects/:id)
├── Milestones (peso 3x)
├── Tasks (peso 1x)
└── FAB para criação rápida

🌅 Ritual View (/ritual)
├── Aurora: < 11:00
├── Zênite: 11:00 - 17:00
└── Crepúsculo: > 17:00
```

### 4. Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+Shift+E` | Abrir Debug Console |
| `Cmd+Shift+E` | (Mac) Debug Console |

---

## ✨ Features

### 🧠 Parsing Engine (B.7)

Capture ideias com linguagem natural:

```
"Reunião com cliente @amanha #mod_work @who:joao"
     ↓ parseInput()
{
  title: "Reunião com cliente",
  due_date: "2025-12-16",
  module: "work",
  tags: ["#who:joao", "#mod_work"]
}
```

**Tokens Suportados:**

| Token | Exemplo | Resultado |
|-------|---------|-----------|
| `@hoje` | "Tarefa @hoje" | due_date = hoje |
| `@amanha` | "Call @amanha" | due_date = amanhã |
| `@ritual_manha` | "Meditar @ritual_manha" | ritual_slot + type=habit |
| `#tag` | "Urgente #prioridade" | tags array |
| `#mod_*` | "#mod_body" | module = body |
| `@who:*` | "@who:andre" | tag de contexto |
| `@where:*` | "@where:cafe" | tag de contexto |

---

### 📥 Inbox Engine (B.6)

Captura de baixa fricção:

1. Digite no campo "O que está na sua mente?"
2. Parsing automático extrai tokens
3. Tag `#inbox` adicionada
4. Clique "Processar" para promover

---

### 🎯 MacroPicker Engine (B.8)

Promoção inteligente:

- Selecione **Tipo**: Task, Habit, Note, Project
- Para **Habits**: escolha o ritual slot
- Selecione o **Projeto** destino
- Sugestões baseadas no módulo do item

---

### 🌅 Ritual View (B.19)

Experiência imersiva para hábitos:

| Período | Horário | Cor |
|---------|---------|-----|
| 🌅 Aurora | < 11:00 | Laranja/Amarelo |
| ☀️ Zênite | 11:00-17:00 | Amarelo brilhante |
| 🌆 Crepúsculo | > 17:00 | Roxo/Azul |

---

### 📋 Project Sheet (A.13/B.13)

Gestão visual de projetos:

```
┌─────────────────────────────────┐
│  📁 Nome do Projeto             │
│  [Módulo] [Status: Ativo]       │
│  ████████░░░░░░░░ 45%           │
├─────────────────────────────────┤
│  💎 JORNADA (Milestones)        │
│  ○───●───○───○                  │
│    MVP  Beta  v1.0  Launch      │
├─────────────────────────────────┤
│  📝 MESA DE TRABALHO            │
│  ┌─────────┐ ┌─────────┐        │
│  │  Tasks  │ │ Hábitos │        │
│  └─────────┘ └─────────┘        │
├─────────────────────────────────┤
│  📎 NOTAS & RECURSOS            │
└─────────────────────────────────┘
              [+] FAB
```

**Progresso Híbrido:**
```
Progresso = (Peso Concluído / Peso Total) × 100

Task = peso 1
Milestone = peso 3 (padrão)
```

---

## 🛠️ Stack Tecnológica

<div align="center">

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | React + Vite | 18.3 |
| **Linguagem** | TypeScript | 5.0+ |
| **Styling** | Tailwind CSS | 3.4 |
| **Backend** | Lovable Cloud | - |
| **State (Server)** | TanStack Query | 5.x |
| **State (Client)** | Zustand | 5.x |
| **Icons** | Lucide React | 0.46x |
| **Dates** | date-fns | 3.x |
| **UI Components** | shadcn/ui | - |

</div>

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| 📐 [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Estrutura, modelo de dados, engines |
| 📜 [CHANGELOG.md](docs/CHANGELOG.md) | Histórico de versões |
| 📖 [API.md](docs/API.md) | Referência de tipos, hooks e componentes |

---

## ✅ Status de Implementação

### Core Engine
- [x] Modelo de dados (`items` + `project_milestones`)
- [x] Tipos TypeScript completos
- [x] Parsing Engine (B.7)
- [x] CRUD via hooks
- [x] Sistema de logs (Zustand)

### Engines
- [x] Inbox Engine (B.6)
- [x] MacroPicker Engine (B.8)
- [x] Dashboard Engine (B.10)
- [x] Ritual Engine (B.19)
- [x] Project Engine (B.9/B.13)

### UI
- [x] Dashboard principal
- [x] Inbox com captura rápida
- [x] Project Sheet com milestones
- [x] Ritual View imersiva
- [x] Debug Console (God Mode)
- [x] Navegação responsiva

### Segurança
- [x] Autenticação (Login/Signup)
- [x] RLS (Row Level Security)
- [x] Isolamento por usuário

---

## 🔲 Roadmap

### v4.0.0-beta.1 (Próximo)
- [ ] Recorrência de hábitos (RRULE)
- [ ] Edição inline de items
- [ ] Drag & drop para reordenação
- [ ] Filtros avançados no dashboard

### v4.0.0-beta.2
- [ ] Reflection Engine (B.11)
- [ ] Estatísticas e analytics
- [ ] Gráficos de progresso

### v4.0.0-rc.1
- [ ] Notificações e lembretes
- [ ] PWA support
- [ ] Offline mode
- [ ] Sync otimizado

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────┐
│                    PRESENTATION                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │Dashboard│ │  Inbox  │ │Projects │ │ Ritual  │    │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘    │
├───────┼───────────┼───────────┼───────────┼──────────┤
│       │    APPLICATION LAYER  │           │          │
│  ┌────▼────────────▼──────────▼───────────▼────┐    │
│  │              Custom Hooks                    │    │
│  │  useDashboardData │ useMilestones │ useRitual│    │
│  └─────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Parsing   │ │ MacroPicker │ │   Project   │   │
│  │   Engine    │ │   Engine    │ │   Engine    │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
├─────────────────────────────────────────────────────┤
│                    DATA LAYER                        │
│  ┌─────────────────────────────────────────────┐   │
│  │           Lovable Cloud (Supabase)           │   │
│  │  ┌──────────┐  ┌──────────────────────┐     │   │
│  │  │  items   │  │  project_milestones  │     │   │
│  │  └──────────┘  └──────────────────────┘     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Versão Atual

**v4.0.0-alpha.5** - 2025-12-15

Veja [CHANGELOG.md](docs/CHANGELOG.md) para detalhes.

---

## 🔗 Links

- 🔧 [Lovable Docs](https://docs.lovable.dev/)
- 💬 [Lovable Discord](https://discord.gg/lovable-dev)

---

<div align="center">

**Feito com 💚 usando [Lovable](https://lovable.dev)**

</div>
