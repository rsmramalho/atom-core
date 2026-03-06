

## Wiki / Manual Completo do MindMate

Criar uma página `/wiki` acessível dentro do app (autenticado) que serve como manual completo e contextual do MindMate, organizada em seções navegáveis.

---

### Estrutura da Wiki

A página será um documento rico com navegação por âncoras, dividido em:

1. **Manifesto** — Filosofia do MindMate: capturar sem fricção, organizar sem rigidez, refletir com propósito. Agnóstico de metodologia (GTD, Pomodoro, Bullet Journal — use o que funcionar).

2. **Arquitetura Atom** — Explicação do Single Table Design: todos os tipos (task, habit, note, reflection, project, resource, list) numa tabela `items`. Milestones = tasks com tag `#milestone`. Hierarquia via `parent_id` e `project_id`.

3. **Guia de Funcionalidades** — Cada engine explicada com exemplos práticos:
   - Parsing Engine (tokens `@hoje`, `@amanha`, `#tags`, `#mod_work`)
   - Inbox (captura rápida)
   - Dashboard (Focus, Today, Ritual Banner)
   - Projetos (state machine, progresso híbrido, 4 abas)
   - Calendário (mensal/semanal, drag-and-drop)
   - Ritual (3 períodos, check-in, reflexão)
   - Journal (prompts guiados, busca, exportação)
   - Listas (estilo Keep, cores, checklist)
   - Recorrência (RRULE)
   - Analytics (métricas de produtividade)

4. **Como Usar** — Guia prático passo-a-passo para novos usuários: criar conta → capturar no inbox → organizar em projetos → rituais diários → journaling → analytics.

5. **Atalhos de Teclado** — Tabela completa de shortcuts.

6. **Colaboração** — Roles (Owner/Editor/Viewer), convites, activity feed.

7. **PWA & Offline** — Instalação, sync offline, notificações push.

8. **FAQ** — Perguntas frequentes sobre uso.

---

### Implementação Técnica

**Arquivo novo:** `src/pages/Wiki.tsx`
- Componente com scroll suave e sidebar de navegação (table of contents)
- Usa `Accordion` para seções colapsáveis em mobile
- Conteúdo estático (sem fetch ao banco)
- Responsivo: sidebar fixa no desktop, collapsed no mobile
- Estilo consistente com o app (Tailwind + design system existente)

**Rota:** Adicionar `/wiki` no `App.tsx` como `LayoutRoute` (dentro do AppLayout, requer auth)

**Navegação:** Adicionar link "Wiki" no `NavItemList.tsx` com ícone `BookOpen`

**Estimativa:** 2 arquivos editados + 1 novo (`Wiki.tsx`)

