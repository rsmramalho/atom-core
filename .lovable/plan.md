

## Melhorar Wiki + Torná-la Pública

### Problema atual
A Wiki está dentro do `AppLayout` (rota `/wiki`), exigindo login. Precisa ser acessível publicamente e ter melhorias de conteúdo/UX.

### Plano

#### 1. Rota pública `/wiki` (sem auth)

Mover a rota `/wiki` de `LayoutRoute` para `ImmersiveRoute` no `App.tsx`, seguindo o mesmo padrão da Landing page e `/install`. Isso remove a exigência de login.

Adicionar um header leve na Wiki com link "Voltar" (para `/`) e botão "Entrar" (para `/app`), similar ao `LandingNav`.

#### 2. Melhorias de conteúdo

Adicionar novas seções e expandir existentes:

- **Versão e Changelog** — resumo das últimas versões no rodapé da Wiki
- **Glossário de termos** — tabela com termos-chave (Atom, Token, Ritual Slot, Milestone, Weight, RRULE, etc.)
- **Diagramas visuais** — diagrama ASCII da arquitetura Atom (tabela → tipos → hierarquia) e fluxo de dados
- **Seção "API de Tokens" expandida** — mais exemplos combinados (ex: `Reunião @segunda #trabalho ~manha tipo:task`)

#### 3. Melhorias de UX

- **Active TOC indicator** — destacar no sidebar qual seção está visível (usando IntersectionObserver)
- **Botão "Voltar ao topo"** — aparece ao rolar para baixo
- **Breadcrumb da seção atual** — visível no mobile
- **Link na Landing page** — adicionar link "Wiki / Documentação" no footer e nav da Landing

#### 4. Manter acesso interno

A Wiki continuará no `NavItemList` do sidebar para usuários logados, mas a rota em si não exigirá auth.

### Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/App.tsx` | Mover `/wiki` de `LayoutRoute` para `ImmersiveRoute` |
| `src/pages/Wiki.tsx` | Adicionar header público, glossário, diagrama, active TOC, scroll-to-top |
| `src/components/landing/LandingNav.tsx` | Adicionar link "Wiki" |
| `src/components/landing/LandingFooter.tsx` | Adicionar link "Wiki" |

### Estimativa: 4 arquivos editados

