

## Melhorias na Wiki: Conteúdo Interativo, Mais Seções e Visual

### 1. Conteúdo Interativo

**Token Playground** — campo de input ao vivo na seção "Parsing Engine" onde o usuário digita texto e vê em tempo real os tokens extraídos (tags, datas, slots, tipo). Usa o `parseInput()` já existente em `src/lib/parsing-engine.ts`.

**Demo de Ritual Slots** — mini visualização interativa dos 3 slots (Aurora/Zênite/Crepúsculo) com as cores temáticas, que responde a hover/tap mostrando detalhes.

### 2. Mais Conteúdo/Seções

| Nova Seção | Descrição |
|------------|-----------|
| **Changelog** | Resumo das últimas versões (v4.0.0-alpha.17+), extraído do `CHANGELOG.md` existente |
| **Casos de Uso** | 3-4 cenários práticos: estudante, freelancer, equipe pequena, bem-estar pessoal |
| **Dicas e Truques** | Combinações avançadas de tokens, macros, workflows recomendados |

### 3. Visual/Design

- **Scroll animations** — `framer-motion` `whileInView` fade-in nas seções ao rolar
- **Cards visuais** para funcionalidades em vez de apenas accordions (grid 2 colunas no desktop)
- **Gradientes temáticos** nos headers de seção (matching ritual colors)
- **Ilustrações SVG inline** reutilizando as existentes em `src/components/empty-states/illustrations/`
- **Versão badge** no header da Wiki mostrando a versão atual

### Arquivos Alterados

| Arquivo | Mudança |
|---------|---------|
| `src/pages/Wiki.tsx` | Token Playground, demo de slots, novas seções (changelog, casos de uso, dicas), scroll animations, cards visuais, gradientes, versão badge |
| `src/lib/parsing-engine.ts` | Nenhuma mudança — apenas importar `parseInput` na Wiki |

Estimativa: 1 arquivo editado (Wiki.tsx), ~200 linhas adicionadas.

