

## Plano: Super Manual Wiki — Documentação Completa de Cada Tela, Função e Módulo

### Situação Atual
A Wiki já tem ~1037 linhas cobrindo: Manifesto, Arquitetura Atom, grid de funcionalidades (resumido), Token Playground, Rituais Demo, Casos de Uso, Dicas, Como Usar, Atalhos, Colaboração, PWA, Glossário, Diagrama, Changelog e FAQ.

**O que falta** — cobertura detalhada tela-a-tela e funcionalidade-a-funcionalidade. As features atuais são descritas superficialmente em cards de 1 linha. O usuário quer um manual completo.

### O que será adicionado

**8 novas seções detalhadas** (uma por tela do app), substituindo/expandindo o grid resumido atual:

1. **Dashboard (Home)** — Focus Block (o que é, como itens chegam via `#focus`), Today List (overdue + due today), Ritual Banner (link com slot ativo), Smart Suggestions (heurísticas), empty state, confetti ao completar tudo

2. **Inbox** — Captura rápida com Parsing Engine, auto-tag `#inbox`, swipe para MacroPicker, fluxo Inbox→Projeto, filtros, skeleton loading, validação Zod

3. **Projetos** — Criação, status lifecycle (draft→archived), 4 abas (WorkArea com drag-and-drop, Milestones com peso 3x, Notes, Activity Feed), progress modes (auto/milestone/manual), compartilhamento (roles, convites, membros), ProjectFab, settings

4. **Listas** — Cards estilo Keep, cores personalizáveis, checklist integrado, duplicação, quick-add modal, progresso visual

5. **Calendário** — Views mês/semana, drag-and-drop entre dias (DroppableDayCell), filtros por tipo/módulo, seção Overdue, DayDetailSheet

6. **Diário (Journal)** — Composer com prompts reflexivos, feed cronológico, filtros, exportação Markdown, integration com ritual slots

7. **Rituais** — Aurora/Zênite/Crepúsculo detalhado, check-in visual, confetti, streak tracking, completion_log, heatmap

8. **Estatísticas (Analytics)** — Weekly Summary (AI), gráficos por tipo/módulo, streak badges, heatmap de atividade, tendências semana-a-semana

**Seções complementares expandidas:**

9. **Módulos em Detalhe** — Work, Body, Mind, Family + Geral. Como usar `#mod_xxx`, herança via MacroPicker, ModuleBadge visual

10. **Command Palette & Navegação** — `⌘K`, busca global, filtros, navegação por atalhos

11. **Notificações & Push** — Configuração, due-date reminders, atividade em projetos compartilhados

12. **Backup & Cache** — Export/import JSON, limpar cache, sync status, pending operations

### Abordagem Técnica

O arquivo Wiki.tsx já está com ~1037 linhas. Para manter organizado:

- **Extrair conteúdo para `src/data/wiki-sections.tsx`** — Novo arquivo com os dados/JSX das seções, exportando componentes por seção. Mantém Wiki.tsx como shell de layout (~300 linhas)
- **Expandir `tocItems`** com as 8 novas seções de telas + 4 complementares
- **Cada seção de tela** terá: descrição, screenshot-style mockup (ASCII ou visual cards), lista de ações disponíveis, tokens relevantes, dicas específicas
- **Manter interatividade** — Accordion para detalhes densos, mesmos patterns visuais (FeatureCard, SubSection, CodeToken, TokenTable)

### Estrutura de Arquivos

- **Novo:** `src/data/wiki-sections.tsx` — Componentes de conteúdo para cada seção (Dashboard, Inbox, Projetos, etc.)
- **Editado:** `src/pages/Wiki.tsx` — Importa seções do novo arquivo, expande tocItems, adiciona novas seções ao render

### Escopo estimado

~12 novas seções detalhadas com ~400-600 linhas de conteúdo no arquivo de dados, reorganização do Wiki.tsx para importar modularmente.

