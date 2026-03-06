

# Auditoria Completa & Roadmap — MindMate v4.0.0-alpha.26

## Estado Atual

**Versão:** v4.0.0-alpha.26 (2026-03-04)
**Stack:** React 18 + Vite + Tailwind + Lovable Cloud + PWA
**Arquitetura:** Single Table Design (tabela `items`) com 7 tipos de item

### Funcionalidades Implementadas
- Parsing Engine com tokens inteligentes
- Dashboard operacional (Focus, Today, Overdue, Ritual)
- Projetos com state machine + progresso híbrido (auto/milestone/manual)
- Colaboração multi-usuário (Owner/Editor/Viewer) com links de convite
- Activity Feed em tempo real por projeto
- Sistema de Rituais (manhã/meio-dia/noite) com habits
- Calendário mensal/semanal com drag-and-drop
- Journal/Reflexões com prompts guiados
- Listas rápidas estilo Google Keep
- Recurrence Engine (RRULE)
- Analytics com gráficos (recharts)
- PWA completo com offline sync + push notifications
- Onboarding (welcome, tour, checklist)
- Command Palette + keyboard shortcuts
- Landing page de marketing

---

## Problemas Encontrados

### 1. Violação da Zero Any Policy (CRÍTICO)
O projeto mantém uma política de zero `any`, mas há **5 ocorrências** em código de produção:

| Arquivo | Linha | Ocorrência |
|---------|-------|------------|
| `useProjectMembers.ts` | 41 | `(row: any)` no map de membros |
| `useProjectMembers.ts` | 88 | `as any` no insert de invite role |
| `useProjectMembers.ts` | 134 | `as any` no update de member role |
| `usePushNotifications.ts` | 49, 80, 123 | `as any` no pushManager |

### 2. Console Logs em Produção
125 ocorrências de `console.log/warn/error` em 11 arquivos. A maioria são `warn/error` em catch blocks (aceitável), mas devem ser auditados para remover os desnecessários.

### 3. RLS: Sem DELETE para items de projetos compartilhados
A tabela `items` tem policies para SELECT, INSERT e UPDATE em projetos compartilhados, mas **não tem DELETE policy** para membros. Editores não conseguem excluir itens de projetos compartilhados.

### 4. Viewer Role incompleto no DB
O enum `member_role` no banco tem `owner | editor`, mas o código TypeScript referencia `viewer`. A policy de UPDATE permite apenas `editor` e `viewer` no check, mas o enum pode não incluir `viewer`.

### 5. `useProjectMembers` — `invitesQuery` usa `as unknown as`
Linha 59: cast forçado que pode mascarar incompatibilidades de tipo.

### 6. Query sem limit
`useAtomItems` faz `select("*")` sem `.limit()`. Com muitos itens, vai bater no limite de 1000 rows do Supabase silenciosamente.

---

## Roadmap Proposto

### Fase 7: Hardening & Type Safety (Próxima)
1. **Eliminar `any` em `useProjectMembers.ts`** — Tipar o resultado do join com profiles e usar tipos corretos para enums do DB
2. **Eliminar `as any` em `usePushNotifications.ts`** — Usar interface `PushManager` com type assertion segura
3. **Adicionar DELETE policy para items em projetos compartilhados** — Permitir que editors deletem itens
4. **Verificar enum `member_role`** — Confirmar que `viewer` existe no DB, adicionar migration se necessário
5. **Adicionar `.limit()` ou paginação** em `useAtomItems` para projetos com muitos itens

### Fase 8: UX & Polish
6. **Busca global** — Filtrar itens por título/tag em todas as views
7. **Drag-and-drop na WorkArea** — Reordenar tasks dentro de projetos
8. **Dark/Light mode toggle** acessível na sidebar (já tem next-themes instalado)
9. **Skeleton loading** para ProjectDetail (já existe para outros)

### Fase 9: Inteligência
10. **AI Summary** — Resumo semanal automático usando Lovable AI (Gemini Flash)
11. **Smart suggestions** — Sugerir próxima ação baseado em padrões de uso
12. **Natural language input** melhorado com AI para parsing de datas complexas

### Fase 10: Escala
13. **Paginação real** para items (cursor-based)
14. **Realtime subscriptions** para projetos compartilhados (ver edições de outros membros ao vivo)
15. **Export PDF** de projetos com progresso e milestones

