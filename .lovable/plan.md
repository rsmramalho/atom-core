

## Próximo Passo: Smart Suggestions — Sugerir próxima ação no Dashboard

As Fases 7 e 8 do roadmap já estão completas. O AI Summary (Fase 9, item 10) também está implementado. O próximo item pendente é o **item 11: Smart Suggestions**.

### O que será construído

Um componente **SmartSuggestions** no Dashboard que analisa os dados do usuário e sugere 2-3 ações concretas baseadas em padrões de uso. Exemplos:
- "Você tem 4 tarefas atrasadas — que tal resolver a mais antiga?"
- "Seu hábito 'Meditação' tem streak de 5 dias — não quebre hoje!"
- "O projeto 'App v2' está em 80% — faltam só 2 tasks"
- "Nenhuma reflexão esta semana — escreva uma no Journal"

### Abordagem

**Heurísticas locais (sem AI)** — rápido, sem custo, sem latência:

1. **Criar `src/lib/smart-suggestions.ts`** — Motor de sugestões com regras heurísticas:
   - Tarefas atrasadas mais antigas → sugerir resolver
   - Hábitos com streak alto → sugerir não quebrar
   - Projetos próximos de 100% → sugerir finalizar
   - Sem reflexões na semana → sugerir Journal
   - Itens com tag `#focus` parados há dias → sugerir ação
   - Inbox com muitos itens → sugerir triagem

2. **Criar `src/components/dashboard/SmartSuggestions.tsx`** — Card com ícone de lâmpada, lista de 2-3 sugestões com botões de ação (navegar para a view relevante ou executar ação direta)

3. **Integrar no `src/pages/Index.tsx`** — Adicionar o componente entre o FocusBlock e TodayList

### Estrutura das sugestões

```text
interface Suggestion {
  id: string;
  icon: LucideIcon;
  message: string;
  action: { label: string; path?: string; itemId?: string };
  priority: number;  // higher = more relevant
}

generateSuggestions(items: AtomItem[]) → Suggestion[] (top 3 by priority)
```

### Arquivos alterados
- **Novo:** `src/lib/smart-suggestions.ts` — lógica de geração de sugestões
- **Novo:** `src/components/dashboard/SmartSuggestions.tsx` — componente visual
- **Editado:** `src/pages/Index.tsx` — montar o componente no dashboard

