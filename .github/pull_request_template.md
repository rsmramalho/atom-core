## Descrição

<!-- Resumo claro das mudanças realizadas -->

## Tipo de Mudança

- [ ] 🐛 Bug fix (correção que não quebra funcionalidade existente)
- [ ] ✨ Nova feature (funcionalidade que não quebra código existente)
- [ ] 💥 Breaking change (correção ou feature que altera comportamento existente)
- [ ] 📚 Documentação (alterações apenas em docs)
- [ ] 🔧 Refactor (mudança de código sem alterar funcionalidade)
- [ ] 🧪 Testes (adição ou modificação de testes)

## Engine Afetado

- [ ] Parsing Engine (`lib/parsing-engine.ts`)
- [ ] Inbox Engine (`pages/Inbox.tsx`)
- [ ] MacroPicker Engine (`components/inbox/MacroPickerModal.tsx`)
- [ ] Dashboard Engine (`hooks/useDashboardData.ts`)
- [ ] Calendar Engine (`pages/Calendar.tsx`)
- [ ] Ritual Engine (`hooks/useRitual.ts`)
- [ ] Project Engine (`hooks/useProjectProgress.ts`)
- [ ] Reflection Engine (`pages/Journal.tsx`)
- [ ] Nenhum (UI/docs/config only)

## Issue Relacionada

<!-- Link para a issue: Fixes #123 ou Closes #456 -->

## Como Testar

1. 
2. 
3. 

## Screenshots

<!-- Se aplicável, adicione screenshots das mudanças visuais -->

| Antes | Depois |
|-------|--------|
|       |        |

## Checklist

### Código
- [ ] Código segue os padrões do projeto
- [ ] Tipos TypeScript estão corretos (sem `any`)
- [ ] Usa tokens do design system (não cores diretas)
- [ ] Componentes são pequenos e focados
- [ ] Sem `console.log` em código de produção

### Testes
- [ ] Testes existentes passam (`npm run test`)
- [ ] Novos testes adicionados (se aplicável)
- [ ] Build passa sem erros (`npm run build`)

### Documentação
- [ ] CHANGELOG.md atualizado
- [ ] Documentação atualizada (se necessário)
- [ ] Comentários em código complexo

### Database (se aplicável)
- [ ] Migrations criadas
- [ ] RLS policies configuradas
- [ ] Rollback testado

## Contexto Adicional

<!-- Informações adicionais relevantes para o reviewer -->
