

# Roadmap Alpha.28 → Beta: O que falta

Baseado na análise do codebase atual, aqui esta o gap entre o estado alpha e um release beta estavel.

---

## Estado Atual (alpha.28)

**Implementado:**
- 9 engines funcionais (Parsing, Inbox, Dashboard, Calendar, Ritual, Journal, Lists, Recurrence, MacroPicker)
- Colaboracao (Owner/Editor/Viewer + convites + Activity Feed)
- PWA completo (offline sync, push notifications, install prompts)
- Auth centralizado, Command Palette, Dark/Light mode
- AI Weekly Summary (Gemini Flash)
- E2E tests (sharing, role-change, role-downgrade, member-removal)
- Zero console.log, zero TODO/FIXME

---

## Gap para Beta - 5 Blocos

### 1. Estabilidade e Error Handling
- **Password reset flow** -- nao existe pagina/fluxo de "Esqueci minha senha"
- **Error boundaries por rota** -- existe global mas erros em uma pagina derrubam tudo
- **Tratamento de sessao expirada** -- redirect gracioso quando token expira mid-session
- **Rate limiting no client** -- proteção contra submissões duplicadas (double-click)

### 2. Dados e Integridade
- **Profiles sync** -- tabela `profiles` existe mas nao ha trigger `on_auth_user_created` para popular automaticamente
- **Cascade deletes** -- ao deletar projeto, garantir que `project_members`, `project_invites`, `project_activities` sao limpos
- **Validação de dados no client** -- formularios sem validação Zod (Quick Add Task, Quick Add Milestone, etc.)

### 3. Segurança
- **Auditoria RLS completa** -- verificar todas as policies das 7 tabelas contra cenarios de escalação
- **assetlinks.json placeholder** -- `COLE_AQUI_O_SHA256_DO_SEU_KEYSTORE` em produção
- **CORS/CSP headers** -- nao ha Content Security Policy configurado
- **Email de contato** -- `privacy@mindmate.app` na pagina Privacy e um placeholder

### 4. UX e Polish
- **Loading states consistentes** -- algumas paginas usam skeleton, outras nao (Inbox, Journal, Lists)
- **Empty states completos** -- verificar cobertura em todas as paginas
- **Mobile responsiveness audit** -- testes visuais existem mas nao cobrem todos os breakpoints
- **Acessibilidade (a11y)** -- aria-labels, focus management, screen reader compat
- **Feedback de ações** -- confirmação visual apos delete, complete, etc.

### 5. Documentação e Deploy
- **DEPLOYMENT_CHECKLIST.md desatualizado** -- referencia alpha.22
- **EXECUTIVE_SUMMARY.md desatualizado** -- referencia alpha.22, falta colaboração, push, AI
- **ARCHITECTURE.md + FULL_DOCUMENTATION.md** -- precisam sync (memoria do projeto confirma)
- **Testes unitarios** -- cobertura dos hooks principais (useAtomItems, useProjectMembers)

---

## Priorização Sugerida para Beta

| Prioridade | Item | Esforço |
|------------|------|---------|
| P0 | Password reset flow | Pequeno |
| P0 | Profiles auto-create trigger | Pequeno |
| P0 | Auditoria RLS | Medio |
| P1 | Sessao expirada handling | Pequeno |
| P1 | Validação Zod nos formularios | Medio |
| P1 | Skeletons/loading states uniformes | Medio |
| P1 | Docs sync (Architecture, Executive Summary, Checklist) | Medio |
| P2 | Error boundaries por rota | Pequeno |
| P2 | a11y audit e fixes | Grande |
| P2 | CSP headers | Pequeno |
| P2 | Remover placeholder assetlinks.json | Pequeno |

---

## Resumo

Para beta, o foco e **estabilidade > segurança > polish**. As features core ja existem. O que falta e garantir que nao quebram em edge cases (sessao expirada, double submit, dados orfaos), que a segurança esta auditada (RLS, CSP), e que a experiencia e consistente (loading states, error handling, password reset). Documentação precisa ser sincronizada com o estado real do codigo.

Posso começar implementando qualquer bloco -- recomendo atacar P0 primeiro (password reset + profiles trigger + auditoria RLS).

