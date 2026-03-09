// Super Manual Wiki — Detailed sections for each screen, function, and module
import {
  LayoutDashboard, Inbox, FolderKanban, ListChecks, Calendar,
  BookMarked, Sun, Sunset, Moon, BarChart3, Briefcase, Dumbbell,
  Brain, Users, Inbox as InboxIcon, Keyboard, Bell, Database,
  Zap, Target, CheckCircle2, Circle, Sparkles, Eye, ArrowRight,
  Hash, Repeat, Diamond, ListTodo, StickyNote, Activity, Settings,
  Share2, GripVertical, Palette, FileText, Search, Download,
  Upload, Trash2, Clock, TrendingUp, Flame, Shield, UserPlus,
  MessageSquare, Map, Trophy, Bookmark
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ── Shared helpers (same style as Wiki.tsx) ──

function CodeToken({ children }: { children: React.ReactNode }) {
  return <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">{children}</code>;
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground flex gap-2">
      <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function ActionList({ actions }: { actions: { icon: React.ElementType; label: string; desc: string }[] }) {
  return (
    <div className="space-y-2 my-3">
      {actions.map((a, i) => (
        <div key={i} className="flex items-start gap-2.5 text-sm">
          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <a.icon className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <span className="font-medium text-foreground">{a.label}</span>
            <span className="text-muted-foreground"> — {a.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 1. DASHBOARD ──

export function DashboardSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        O <strong className="text-foreground">Dashboard</strong> é a tela inicial após o login. Mostra uma visão consolidada do seu dia com 4 componentes principais:
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Focus Block
          </h4>
          <p>Exibe itens marcados com a tag <CodeToken>#focus</CodeToken>. Permite completar itens diretamente. Quando todos são completados, um efeito de <strong className="text-foreground">confetti</strong> é disparado.</p>
          <Tip>Adicione <CodeToken>#focus</CodeToken> a qualquer item para ele aparecer no Focus Block. Use para priorizar as 3-5 tarefas mais importantes do dia.</Tip>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-primary" /> Today List
          </h4>
          <p>Lista automática com itens que possuem <CodeToken>due_date</CodeToken> igual a hoje ou em atraso (overdue). Ordenados por prioridade.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Sun className="h-4 w-4 text-primary" /> Ritual Banner
          </h4>
          <p>Detecta o período atual (Aurora 05h-12h, Zênite 12h-18h, Crepúsculo 18h-05h) e mostra os hábitos do slot ativo. Completar todos exibe confetti e registra no <CodeToken>completion_log</CodeToken>.</p>
          <p>O banner inclui:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong className="text-foreground">Streak Badge</strong> — dias consecutivos de completude</li>
            <li><strong className="text-foreground">Heatmap</strong> — mapa de calor dos últimos 90 dias (clique no badge)</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Smart Suggestions
          </h4>
          <p>Sugestões inteligentes geradas por heurísticas locais:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Itens no Inbox há mais de 24h sem processamento</li>
            <li>Projetos sem atividade recente</li>
            <li>Hábitos com streaks prestes a quebrar</li>
            <li>Tarefas com deadline próximo</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Circle className="h-4 w-4 text-muted-foreground" /> Empty State
        </h4>
        <p>Quando não há itens para o dia, o Dashboard exibe uma ilustração motivacional com sugestões de próximos passos (capturar no Inbox, criar projeto, etc.).</p>
      </div>
    </div>
  );
}

// ── 2. INBOX ──

export function InboxSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        O <strong className="text-foreground">Inbox</strong> é o ponto de entrada para tudo. Capture pensamentos, tarefas, ideias — qualquer coisa — e processe depois.
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Captura Rápida
          </h4>
          <p>Campo de texto com <strong className="text-foreground">Parsing Engine</strong> integrado. Todos os tokens são extraídos automaticamente:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><CodeToken>@hoje</CodeToken> / <CodeToken>@amanha</CodeToken> → define due_date</li>
            <li><CodeToken>#tag</CodeToken> → adiciona tags livres</li>
            <li><CodeToken>~manha</CodeToken> / <CodeToken>~noite</CodeToken> → define ritual slot</li>
            <li><CodeToken>#mod_work</CodeToken> → define módulo</li>
            <li><CodeToken>tipo:habit</CodeToken> → define o tipo do item</li>
          </ul>
          <p>Todo item capturado recebe automaticamente a tag <CodeToken>#inbox</CodeToken>.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" /> MacroPicker — Processamento
          </h4>
          <p>Ao clicar "Processar" em um item do Inbox, o <strong className="text-foreground">MacroPicker</strong> abre com opções:</p>
          <ActionList actions={[
            { icon: FolderKanban, label: "Mover para Projeto", desc: "Selecione um projeto existente e defina tipo (task/habit/note), módulo e ritual slot." },
            { icon: Zap, label: "Converter em Projeto", desc: "Transforma o item inbox em um novo projeto com status 'active'." },
            { icon: FolderKanban, label: "Criar Novo Projeto", desc: "Cria projeto on-the-fly e vincula o item automaticamente." },
          ]} />
          <p>Ao promover, a tag <CodeToken>#inbox</CodeToken> é removida e uma tag <CodeToken>#macro:NomeProjeto</CodeToken> é adicionada.</p>
        </div>

        <Tip>O Inbox é ideal para a metodologia GTD: capture tudo sem julgamento, depois processe em blocos.</Tip>
      </div>
    </div>
  );
}

// ── 3. PROJETOS ──

export function ProjectsSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        <strong className="text-foreground">Projetos</strong> são o coração organizacional do MindMate. Cada projeto agrupa tarefas, milestones, notas e listas sob uma mesma umbrella.
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Ciclo de Vida (Status)
          </h4>
          <p>Todo projeto segue uma máquina de estados:</p>
          <div className="flex items-center gap-1.5 flex-wrap my-2">
            {["draft", "active", "paused", "completed", "archived"].map((s, i) => (
              <span key={s} className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-muted text-foreground font-mono text-xs">{s}</span>
                {i < 4 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              </span>
            ))}
          </div>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong className="text-foreground">draft</strong> — planejamento, sem impacto no dashboard</li>
            <li><strong className="text-foreground">active</strong> — em andamento, itens aparecem no calendário e dashboard</li>
            <li><strong className="text-foreground">paused</strong> — temporariamente suspenso</li>
            <li><strong className="text-foreground">completed</strong> — todos os entregáveis concluídos</li>
            <li><strong className="text-foreground">archived</strong> — movido para histórico</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-primary" /> 4 Abas do Projeto
          </h4>
          <Accordion type="multiple" className="space-y-1">
            <AccordionItem value="workarea" className="border border-border/30 rounded-lg px-3 bg-card/20">
              <AccordionTrigger className="hover:no-underline text-xs py-2">
                <span className="flex items-center gap-2"><ListTodo className="h-3.5 w-3.5 text-primary" /> Área de Trabalho</span>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-1">
                <p>Lista principal de tasks e sub-tasks. Suporta <strong className="text-foreground">drag-and-drop</strong> para reordenação (via dnd-kit). Cada item pode ser editado, completado ou excluído inline.</p>
                <p>O <strong className="text-foreground">ProjectFab</strong> (botão flutuante) permite criar rapidamente Tasks, Milestones ou Listas.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="milestones" className="border border-border/30 rounded-lg px-3 bg-card/20">
              <AccordionTrigger className="hover:no-underline text-xs py-2">
                <span className="flex items-center gap-2"><Diamond className="h-3.5 w-3.5 text-primary" /> Milestones</span>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-1">
                <p>Marcos do projeto com peso 3x no cálculo de progresso. Cada milestone pode ter tarefas filhas vinculadas. Progresso visual com barra e percentual.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="notes" className="border border-border/30 rounded-lg px-3 bg-card/20">
              <AccordionTrigger className="hover:no-underline text-xs py-2">
                <span className="flex items-center gap-2"><StickyNote className="h-3.5 w-3.5 text-primary" /> Notas</span>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-1">
                <p>Notas livres vinculadas ao projeto. Ideal para documentação, links de referência e ideias.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="activity" className="border border-border/30 rounded-lg px-3 bg-card/20">
              <AccordionTrigger className="hover:no-underline text-xs py-2">
                <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-primary" /> Atividade</span>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-1">
                <p>Feed cronológico de todas as ações no projeto: criação de tasks, completude, edições, adição de membros. Especialmente útil em projetos compartilhados.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Modos de Progresso
          </h4>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><CodeToken>auto</CodeToken> — calcula automaticamente baseado na completude de tasks/milestones, ponderado por <CodeToken>weight</CodeToken> (tasks=1, milestones=3)</li>
            <li><CodeToken>milestone</CodeToken> — considera apenas itens com tag <CodeToken>#milestone</CodeToken></li>
            <li><CodeToken>manual</CodeToken> — slider para o usuário definir o % diretamente</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" /> Compartilhamento
          </h4>
          <p>Projetos podem ser compartilhados via link de convite com 3 níveis de permissão:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong className="text-foreground">Owner</strong> — controle total: editar projeto, gerenciar membros, alterar roles, deletar</li>
            <li><strong className="text-foreground">Editor</strong> — criar, editar e completar tasks/milestones/notas</li>
            <li><strong className="text-foreground">Viewer</strong> — acesso somente leitura a todas as abas</li>
          </ul>
          <p>Links de convite têm expiração configurável e número máximo de usos.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" /> Configurações do Projeto
          </h4>
          <ActionList actions={[
            { icon: Settings, label: "Status", desc: "Alterar o status do ciclo de vida." },
            { icon: TrendingUp, label: "Modo de Progresso", desc: "Trocar entre auto, milestone ou manual." },
            { icon: Clock, label: "Deadline", desc: "Definir prazo final do projeto." },
            { icon: Trash2, label: "Deletar", desc: "Excluir projeto e todos os itens associados (confirmação necessária)." },
          ]} />
        </div>
      </div>
    </div>
  );
}

// ── 4. LISTAS ──

export function ListsSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        <strong className="text-foreground">Listas</strong> funcionam como cards no estilo Google Keep — coloridas, compactas e com checklist integrado.
      </p>

      <ActionList actions={[
        { icon: Palette, label: "Cores Personalizáveis", desc: "10+ opções de cores para organização visual." },
        { icon: CheckCircle2, label: "Checklist Integrado", desc: "Cada lista possui itens de checklist com toggle de completude." },
        { icon: TrendingUp, label: "Progresso Visual", desc: "Barra de progresso baseada nos itens completados do checklist." },
        { icon: ListChecks, label: "Duplicação", desc: "Clone uma lista inteira com um clique." },
        { icon: Zap, label: "Quick Add Modal", desc: "Modal rápido para criar nova lista com nome, cor e itens iniciais." },
      ]} />

      <Tip>Listas são itens do tipo <CodeToken>list</CodeToken> no Atom Engine. Podem ser vinculadas a projetos via <CodeToken>project_id</CodeToken>.</Tip>
    </div>
  );
}

// ── 5. CALENDÁRIO ──

export function CalendarSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        O <strong className="text-foreground">Calendário</strong> mostra todos os itens com <CodeToken>due_date</CodeToken> em views mensal ou semanal.
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Views
          </h4>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong className="text-foreground">Mês</strong> — grid tradicional com mini-cards em cada dia. Navegação por mês.</li>
            <li><strong className="text-foreground">Semana</strong> — visão detalhada com mais espaço por dia. Ideal para planejamento semanal.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-primary" /> Drag-and-Drop
          </h4>
          <p>Arraste itens entre dias para reagendar rapidamente. Usa <CodeToken>DroppableDayCell</CodeToken> com dnd-kit para drop zones precisas.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" /> Filtros
          </h4>
          <p>Filtre por tipo (task, habit, note) e módulo (work, body, mind, family). Os filtros são mantidos entre navegações.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-destructive" /> Seção Overdue
          </h4>
          <p>Itens com due_date no passado e não completados aparecem numa seção especial acima do grid. Permite reagendar ou completar rapidamente.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" /> Day Detail Sheet
          </h4>
          <p>Clique em um dia para abrir um painel lateral com todos os itens daquele dia. Permite editar, completar e criar novos itens inline.</p>
        </div>
      </div>
    </div>
  );
}

// ── 6. JOURNAL ──

export function JournalSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        O <strong className="text-foreground">Diário (Journal)</strong> é o espaço para reflexão. Aqui você escreve reflexões, gratidão, aprendizados e pensamentos.
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Composer
          </h4>
          <p>Editor com <strong className="text-foreground">prompts reflexivos</strong> rotativos que mudam a cada sessão:</p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-xs">
            <li>"O que estou sentindo agora?"</li>
            <li>"Qual foi meu maior aprendizado hoje?"</li>
            <li>"Por que sou grato hoje?"</li>
            <li>"O que posso melhorar amanhã?"</li>
          </ul>
          <p>Entradas são salvas como itens do tipo <CodeToken>reflection</CodeToken>.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Feed Cronológico
          </h4>
          <p>Todas as reflexões em ordem cronológica reversa. Filtrável por período e tags.</p>
        </div>

        <ActionList actions={[
          { icon: Search, label: "Filtros", desc: "Por período (semana, mês, todos) e por tags." },
          { icon: Download, label: "Exportação Markdown", desc: "Exporte todas as reflexões em formato .md para backup ou leitura offline." },
          { icon: Sun, label: "Integração com Rituais", desc: "Entradas do Crepúsculo sugerem reflexão como parte do ritual noturno." },
        ]} />
      </div>
    </div>
  );
}

// ── 7. RITUAIS ──

export function RitualsSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        <strong className="text-foreground">Rituais</strong> são conjuntos de hábitos organizados em 3 slots do dia. O objetivo é criar consistência através de rotinas.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { name: "Aurora", slot: "manha", icon: Sun, time: "05h – 12h", gradient: "from-amber-500/20 to-yellow-500/10", border: "border-amber-500/30", examples: ["Meditação", "Exercício", "Planejamento"] },
          { name: "Zênite", slot: "meio_dia", icon: Sunset, time: "12h – 18h", gradient: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/30", examples: ["Review Inbox", "Deep Work", "Hidratação"] },
          { name: "Crepúsculo", slot: "noite", icon: Moon, time: "18h – 05h", gradient: "from-indigo-500/20 to-violet-500/10", border: "border-indigo-500/30", examples: ["Journaling", "Leitura", "Gratidão"] },
        ].map((s) => (
          <div key={s.slot} className={`rounded-xl border ${s.border} bg-gradient-to-br ${s.gradient} p-4 space-y-2`}>
            <div className="flex items-center gap-2">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">{s.name}</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">{s.time}</p>
            <ul className="text-xs space-y-0.5">
              {s.examples.map((e) => (
                <li key={e} className="flex items-center gap-1.5">
                  <Circle className="h-3 w-3 text-muted-foreground/50" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Check-in Visual
          </h4>
          <p>Na tela de Rituais (/ritual), cada slot mostra seus hábitos com toggle de completude. Ao completar todos os hábitos de um slot, um efeito de <strong className="text-foreground">confetti</strong> celebra a conquista.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" /> Streak Tracking
          </h4>
          <p>Cada hábito recorrente mantém um <CodeToken>completion_log</CodeToken> — array de datas ISO registrando cada completude.</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong className="text-foreground">Streak Badge</strong> — mostra dias consecutivos (ex: "🔥 12 dias")</li>
            <li><strong className="text-foreground">Habit Heatmap</strong> — mapa de calor dos últimos 90 dias, estilo GitHub contributions</li>
          </ul>
        </div>
      </div>

      <Tip>Para criar um hábito com ritual slot, use o token <CodeToken>~manha</CodeToken>, <CodeToken>~meio_dia</CodeToken> ou <CodeToken>~noite</CodeToken> no Inbox ou defina manualmente ao editar.</Tip>
    </div>
  );
}

// ── 8. ANALYTICS ──

export function AnalyticsSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        <strong className="text-foreground">Estatísticas (Analytics)</strong> dá uma visão macro da sua produtividade e consistência ao longo do tempo.
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Weekly Summary (AI)
          </h4>
          <p>Resumo semanal gerado por IA analisando seus dados da semana: tarefas completadas, hábitos mantidos, projetos avançados e sugestões personalizadas.</p>
        </div>

        <ActionList actions={[
          { icon: BarChart3, label: "Gráficos por Tipo", desc: "Distribuição de itens por tipo (task, habit, note, etc.) em gráfico de barras." },
          { icon: Briefcase, label: "Gráficos por Módulo", desc: "Proporção de atividade entre Work, Body, Mind e Family." },
          { icon: Flame, label: "Streak Badges", desc: "Visão consolidada de todos os streaks ativos de hábitos." },
          { icon: TrendingUp, label: "Tendências", desc: "Comparação semana-a-semana de itens completados e criados." },
        ]} />
      </div>
    </div>
  );
}

// ── 9. MÓDULOS EM DETALHE ──

export function ModulesSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        O sistema de <strong className="text-foreground">Módulos</strong> organiza todos os itens por área da vida. É o filtro mais amplo do MindMate.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { name: "Work", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", desc: "Carreira, estudos, freelance" },
          { name: "Body", icon: Dumbbell, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", desc: "Exercício, saúde, nutrição" },
          { name: "Mind", icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", desc: "Meditação, leitura, aprendizado" },
          { name: "Family", icon: Users, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", desc: "Família, relacionamentos, casa" },
        ].map((m) => (
          <div key={m.name} className={`rounded-xl border ${m.border} ${m.bg} p-3 space-y-1.5`}>
            <div className="flex items-center gap-2">
              <m.icon className={`h-4 w-4 ${m.color}`} />
              <span className="font-semibold text-foreground text-sm">{m.name}</span>
            </div>
            <p className="text-xs">{m.desc}</p>
            <code className="text-[10px] text-primary font-mono">#mod_{m.name.toLowerCase()}</code>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p><strong className="text-foreground">Geral</strong> é o módulo padrão quando nenhum é definido. Garante que nenhum item fique sem classificação.</p>
        <p><strong className="text-foreground">Herança via MacroPicker:</strong> ao mover um item do Inbox para um projeto, o módulo do projeto é herdado automaticamente. Você pode sobrescrever manualmente.</p>
        <p>O <strong className="text-foreground">ModuleBadge</strong> é exibido visualmente em cards de projeto, itens do calendário e na lista de tarefas, com ícone e cor correspondentes.</p>
      </div>

      <Tip>Use <CodeToken>#mod_work</CodeToken> ao capturar no Inbox para definir o módulo automaticamente. Os módulos fixos são: work, body, mind, family.</Tip>
    </div>
  );
}

// ── 10. COMMAND PALETTE ──

export function CommandPaletteSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        A <strong className="text-foreground">Command Palette</strong> é ativada com <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs font-mono border border-border/50">⌘K</kbd> (ou Ctrl+K) e oferece busca global instantânea.
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" /> Busca Global
          </h4>
          <p>Busca por título em todos os items (tasks, projetos, notas, hábitos, listas). Resultados agrupados por tipo com ícones visuais.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-primary" /> Navegação por Atalhos
          </h4>
          <p>Use setas ↑↓ para navegar entre resultados, Enter para abrir, Esc para fechar. A palette também lista comandos de navegação rápida (Home, Inbox, Projetos, etc.).</p>
        </div>
      </div>
    </div>
  );
}

// ── 11. NOTIFICAÇÕES ──

export function NotificationsSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        O sistema de <strong className="text-foreground">Notificações</strong> mantém você informado sobre prazos e atividades.
      </p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Push Notifications
          </h4>
          <p>Requer permissão do navegador. Quando ativadas:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong className="text-foreground">Due-date reminders</strong> — lembrete no dia de vencimento de tasks</li>
            <li><strong className="text-foreground">Atividade em projetos</strong> — quando um membro edita ou completa algo em um projeto compartilhado</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" /> Configuração
          </h4>
          <p>Acesse configurações de notificação na sidebar para ativar/desativar push e escolher quais tipos de alerta receber.</p>
        </div>
      </div>
    </div>
  );
}

// ── 12. BACKUP & CACHE ──

export function BackupCacheSection() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        O MindMate opera com uma camada de <strong className="text-foreground">cache local</strong> que garante funcionamento offline e sincronização automática.
      </p>

      <div className="space-y-4">
        <ActionList actions={[
          { icon: Database, label: "Cache Local (IndexedDB)", desc: "Dados são armazenados localmente para acesso offline imediato." },
          { icon: Upload, label: "Sync Automático", desc: "Ao reconectar, operações pendentes são enviadas ao backend em ordem (FIFO)." },
          { icon: Eye, label: "Sync Status", desc: "Indicador visual na sidebar mostra o estado: sincronizado, pendente ou offline." },
          { icon: Clock, label: "Pending Operations", desc: "Modal com lista de operações ainda não sincronizadas. Permite retry manual." },
        ]} />

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" /> Exportação
          </h4>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong className="text-foreground">Journal → Markdown</strong> — exporta reflexões em .md</li>
            <li><strong className="text-foreground">Error Logs → CSV</strong> — exporta logs de erro (admin) com colunas selecionáveis</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Segurança
          </h4>
          <p>Todos os dados são protegidos por <strong className="text-foreground">Row-Level Security (RLS)</strong> — cada usuário só acessa seus próprios dados. Projetos compartilhados usam policies baseadas em membership.</p>
        </div>
      </div>

      <Tip>O código é 100% open source. Faça fork e hospede sua própria instância para controle total dos dados.</Tip>
    </div>
  );
}
