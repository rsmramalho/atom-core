# MindMate - Atom Engine 4.0
## Resumo Executivo

**Versão:** 4.0.0-alpha.19 | **Status:** Production Ready | **Data:** 2025-12-17

---

### O Que É

Sistema de produtividade pessoal com arquitetura modular de engines. Combina gestão de tarefas, hábitos, projetos e journaling em uma experiência unificada.

### Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Lovable Cloud (Supabase) |
| State | TanStack Query + Zustand |
| PWA | vite-plugin-pwa + Service Worker |

### Engines Implementados

| Engine | Função |
|--------|--------|
| **Parsing** | Linguagem natural: `@hoje`, `@amanha`, `#tags`, `#mod_work` |
| **Inbox** | Captura rápida de ideias e tarefas |
| **MacroPicker** | Promoção de itens para projetos com sugestões |
| **Dashboard** | Seções Focus, Today, Ritual |
| **Calendar** | Visualização mensal/semanal com drag-and-drop |
| **Ritual** | Hábitos por período (Aurora/Zênite/Crepúsculo) + Check-in |
| **Reflection** | Journaling com prompts guiados e busca full-text |
| **List** | Listas rápidas estilo Google Keep |
| **Recurrence** | Tarefas recorrentes via RRULE |

### Modelo de Dados (Single Table Design)

```typescript
type ItemType = 'project' | 'task' | 'habit' | 'note' | 'reflection' | 'resource' | 'list';
type RitualSlot = 'manha' | 'meio_dia' | 'noite' | null;
type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
```

**Tabela única `items`** com campos opcionais por tipo. Milestones são tasks com tag `#milestone`.

### Features Principais

- **PWA Completo:** Instalável, offline-first, splash screens
- **Offline Sync:** IndexedDB queue + auto-sync ao reconectar
- **Notificações:** Web Notifications API para lembretes
- **Analytics:** Dashboard de métricas de produtividade
- **Keyboard-First:** Atalhos globais (⌘K, ⌘H, ⌘I, ⌘P, ⌘J, etc.)
- **Haptic Feedback:** Vibração em interações mobile
- **Onboarding:** Welcome modal + tour guiado + checklist gamificado

### Qualidade de Código

- **Zero Any Policy:** Type safety completa (50/50 audit score)
- **150+ Testes:** Vitest (unit) + Playwright (E2E + visual)
- **CI/CD:** GitHub Actions com 3 jobs automatizados
- **Performance:** React.memo, React.lazy, Suspense, Skeletons

### Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard (Focus/Today/Ritual) |
| `/inbox` | Captura de itens |
| `/projects` | Lista de projetos |
| `/projects/:id` | Project Sheet (4 abas) |
| `/calendar` | Calendário mensal/semanal |
| `/ritual` | Experiência imersiva de hábitos |
| `/journal` | Reflexões com prompts |
| `/lists` | Listas rápidas |
| `/analytics` | Métricas de produtividade |

### Arquivos Essenciais

| Arquivo | Propósito |
|---------|-----------|
| `src/types/atom-engine.ts` | Source of Truth - Tipos do domínio |
| `src/lib/parsing-engine.ts` | Motor de parsing de linguagem natural |
| `src/hooks/useAtomItems.ts` | CRUD de itens via Supabase |
| `docs/FULL_DOCUMENTATION.md` | Documentação técnica completa |

### Próximos Passos

- [ ] Publicação Google Play Store (TWA)
- [ ] Push Notifications (VAPID)
- [ ] Metas diárias de produtividade
- [ ] Gamificação avançada

---

**Repositório:** Lovable Cloud | **Licença:** MIT | **Testes:** 150+ | **Build:** Zero erros TS
