# MindMate - Atom Engine 4.0
## Resumo Executivo

**Versão:** 4.0.0-beta.1 | **Status:** Beta | **Data:** 2026-03-06

---

### O Que É

Sistema de produtividade pessoal com arquitetura modular de engines. Combina gestão de tarefas, hábitos, projetos e journaling em uma experiência unificada com colaboração em tempo real.

### Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Lovable Cloud (Supabase) |
| State | TanStack Query + Zustand |
| PWA | vite-plugin-pwa + Service Worker |
| Validação | Zod |

### Engines Implementados (9)

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

### Colaboração Multi-Usuário

| Feature | Descrição |
|---------|-----------|
| **Roles** | Owner / Editor / Viewer com permissões distintas |
| **Convites** | Link com código único, expiração e limite de uso |
| **Activity Feed** | Timeline de ações no projeto |
| **RLS** | Políticas por role com funções `is_project_member`, `is_project_editor`, etc. |

### Modelo de Dados (Single Table Design)

```typescript
type ItemType = 'project' | 'task' | 'habit' | 'note' | 'reflection' | 'resource' | 'list';
type RitualSlot = 'manha' | 'meio_dia' | 'noite' | null;
type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
```

**Tabela principal `items`** com campos opcionais por tipo. Milestones são tasks com tag `#milestone`.

**Tabelas auxiliares:** `profiles`, `project_members`, `project_invites`, `project_activities`, `push_subscriptions`, `onboarding_progress`, `onboarding_analytics`, `error_logs`.

### Arquitetura (beta.0)

```
App.tsx (QueryClient: staleTime 5min, retry 2)
├── Landing (pública) → 9 componentes modulares
└── AppLayout (auth centralizada + session expiry handling)
    ├── AppNavigation → NavItemList + SyncStatus + SidebarActions
    ├── Onboarding (só autenticado)
    └── {pages} (assumem autenticado)
```

### Features Principais

- **Landing Componentizada:** 9 seções modulares (Hero, Pillars, Features, FAQ, etc.)
- **Auth Centralizada:** Único ponto de verificação no AppLayout com session expiry
- **Password Reset:** Fluxo completo de "Esqueci minha senha"
- **PWA Completo:** Instalável, offline-first, splash screens
- **Offline Sync:** IndexedDB queue + auto-sync ao reconectar
- **Push Notifications:** VAPID + Edge Functions para lembretes
- **AI Weekly Summary:** Gemini Flash via Edge Function
- **Colaboração:** Projetos compartilhados com roles e convites
- **Analytics:** Dashboard de métricas de produtividade
- **Keyboard-First:** Atalhos globais (⌘K, ⌘H, ⌘I, ⌘P, ⌘J, etc.)
- **Onboarding:** Welcome modal + tour guiado + checklist gamificado
- **Zod Validation:** Formulários validados com schemas centralizados
- **Error Tracking:** Captura de crashes em produção via Edge Function + error_logs

### Qualidade de Código

- **Zero Any Policy:** Type safety completa (50/50 audit score)
- **150+ Testes:** Vitest (unit) + Playwright (E2E + visual)
- **CI/CD:** GitHub Actions com 3 jobs automatizados
- **Performance:** React.memo, React.lazy, Suspense, Skeletons
- **Segurança:** RLS auditado, cascade deletes, profiles auto-create trigger

### Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing Page (marketing) |
| `/app` | Dashboard operacional (Focus/Today/Ritual) |
| `/inbox` | Captura de itens |
| `/projects` | Lista de projetos |
| `/projects/:id` | Project Sheet (4 abas) |
| `/calendar` | Calendário mensal/semanal |
| `/ritual` | Experiência imersiva de hábitos |
| `/journal` | Reflexões com prompts |
| `/lists` | Listas rápidas |
| `/analytics` | Métricas de produtividade |
| `/install` | Guia de instalação PWA |
| `/privacy` | Política de privacidade |
| `/invite/:code` | Aceitar convite de projeto |
| `/reset-password` | Redefinir senha |

### Arquivos Essenciais

| Arquivo | Propósito |
|---------|-----------|
| `src/types/atom-engine.ts` | Source of Truth - Tipos do domínio |
| `src/lib/parsing-engine.ts` | Motor de parsing de linguagem natural |
| `src/lib/validation.ts` | Schemas Zod para formulários |
| `src/hooks/useAtomItems.ts` | CRUD de itens via Supabase |
| `docs/FULL_DOCUMENTATION.md` | Documentação técnica completa |

### Edge Functions

| Função | Descrição |
|--------|-----------|
| `send-push-notification` | Push via VAPID/WebCrypto |
| `check-due-tasks` | Cron: verifica tarefas vencidas |
| `weekly-summary` | AI weekly summary via Gemini Flash |
| `report-error` | Error tracking em produção (JWT-free) |

### Segurança (Beta)

- [x] RLS auditado em todas as tabelas
- [x] Cascade deletes (project → members, invites, activities)
- [x] Profiles auto-create via trigger `on_auth_user_created`
- [x] Session expiry handling com redirect gracioso
- [x] Push subscriptions com políticas per-user

---

**Repositório:** Lovable Cloud | **Licença:** MIT | **Testes:** 150+ | **Build:** Zero erros TS
