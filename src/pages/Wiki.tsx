import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, Atom, Rocket, Inbox, LayoutDashboard, FolderKanban, 
  Calendar, Sun, Sunset, Moon, BookMarked, ListChecks, Repeat, 
  BarChart3, Keyboard, Users, Wifi, HelpCircle, ChevronRight,
  Menu, X, Hash, AtSign, ArrowRight, Search
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  label: string;
  icon: React.ElementType;
  keywords: string[];
}

const tocItems: TocItem[] = [
  { id: "manifesto", label: "Manifesto", icon: BookOpen, keywords: ["filosofia", "capturar", "organizar", "refletir", "agnóstico", "metodologia", "open source", "gratuito", "pilares"] },
  { id: "arquitetura", label: "Arquitetura Atom", icon: Atom, keywords: ["single table", "items", "type", "project_id", "parent_id", "milestone", "weight", "progresso", "state machine", "draft", "active", "hierarquia"] },
  { id: "funcionalidades", label: "Funcionalidades", icon: Rocket, keywords: ["parsing", "token", "inbox", "dashboard", "projeto", "calendário", "ritual", "journal", "lista", "recorrência", "analytics", "hábito", "tag", "módulo", "@hoje", "@amanha", "rrule", "heatmap", "streak"] },
  { id: "como-usar", label: "Como Usar", icon: ArrowRight, keywords: ["conta", "captura", "fluxo", "passo", "novos usuários", "guia"] },
  { id: "atalhos", label: "Atalhos de Teclado", icon: Keyboard, keywords: ["shortcut", "⌘", "ctrl", "command palette", "teclado", "navegação"] },
  { id: "colaboracao", label: "Colaboração", icon: Users, keywords: ["owner", "editor", "viewer", "convite", "role", "compartilhar", "activity", "membro"] },
  { id: "pwa", label: "PWA & Offline", icon: Wifi, keywords: ["instalação", "offline", "push", "notificação", "sync", "ios", "android", "desktop"] },
  { id: "faq", label: "FAQ", icon: HelpCircle, keywords: ["gratuito", "seguro", "exportar", "dados", "tags", "dispositivos", "conexão"] },
];

function SectionTitle({ id, icon: Icon, children }: { id: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-bold text-foreground flex items-center gap-3 pt-8 pb-4 scroll-mt-20 border-b border-border/50 mb-4">
      <Icon className="h-6 w-6 text-primary shrink-0" />
      {children}
    </h2>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <div className="text-muted-foreground text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function CodeToken({ children }: { children: React.ReactNode }) {
  return <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">{children}</code>;
}

function TokenTable({ tokens }: { tokens: { token: string; desc: string }[] }) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden mb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30">
            <th className="text-left px-3 py-2 font-medium text-foreground">Token</th>
            <th className="text-left px-3 py-2 font-medium text-foreground">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={i} className="border-t border-border/30">
              <td className="px-3 py-2"><CodeToken>{t.token}</CodeToken></td>
              <td className="px-3 py-2 text-muted-foreground">{t.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShortcutTable({ shortcuts }: { shortcuts: { keys: string; action: string }[] }) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30">
            <th className="text-left px-3 py-2 font-medium text-foreground">Atalho</th>
            <th className="text-left px-3 py-2 font-medium text-foreground">Ação</th>
          </tr>
        </thead>
        <tbody>
          {shortcuts.map((s, i) => (
            <tr key={i} className="border-t border-border/30">
              <td className="px-3 py-2"><kbd className="px-2 py-0.5 rounded bg-muted text-foreground text-xs font-mono border border-border/50">{s.keys}</kbd></td>
              <td className="px-3 py-2 text-muted-foreground">{s.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Wiki() {
  const [tocOpen, setTocOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredToc = useMemo(() => {
    if (!search.trim()) return tocItems;
    const q = search.toLowerCase();
    return tocItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [search]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setTocOpen(false);
  };

  const sidebarContent = (
    <nav className="space-y-1">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3 px-2">Índice</p>
      <div className="relative px-1 mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Buscar na wiki..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-8 text-xs bg-muted/30 border-border/50"
        />
      </div>
      {filteredToc.length === 0 && (
        <p className="text-xs text-muted-foreground px-2 py-2">Nenhuma seção encontrada.</p>
      )}
      {filteredToc.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-left"
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-full"
    >
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0 border-r border-border/50 p-4 sticky top-0 h-screen">
        <ScrollArea className="h-full">
          {sidebar}
        </ScrollArea>
      </aside>

      {/* Mobile TOC toggle */}
      <button
        onClick={() => setTocOpen(!tocOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
        aria-label="Índice"
      >
        {tocOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile TOC overlay */}
      {tocOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm p-6 pt-12">
          <ScrollArea className="h-full">{sidebar}</ScrollArea>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Wiki MindMate
          </h1>
          <p className="text-muted-foreground mt-2">Manual completo — arquitetura, funcionalidades e guia de uso.</p>
        </div>

        {/* ====== MANIFESTO ====== */}
        <SectionTitle id="manifesto" icon={BookOpen}>Manifesto</SectionTitle>
        <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
          <p>
            O MindMate nasceu de uma premissa simples: <strong className="text-foreground">sua mente merece um parceiro, não uma prisão metodológica.</strong>
          </p>
          <p>Três pilares guiam tudo o que construímos:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-foreground">Capturar sem fricção</strong> — do pensamento ao registro em segundos, com linguagem natural e tokens inteligentes.</li>
            <li><strong className="text-foreground">Organizar sem rigidez</strong> — projetos, tarefas, hábitos e notas convivem no mesmo espaço sem hierarquias artificiais.</li>
            <li><strong className="text-foreground">Refletir com propósito</strong> — rituais diários e journaling transformam dados em autoconhecimento.</li>
          </ul>
          <p>
            Somos <strong className="text-foreground">agnósticos de metodologia</strong>. GTD, Pomodoro, Bullet Journal, Zettelkasten — use o que funcionar para você.
            O MindMate se adapta ao seu estilo, não o contrário.
          </p>
          <p>
            <strong className="text-foreground">100% gratuito e open source.</strong> Acreditamos que ferramentas de produtividade e bem-estar devem ser acessíveis a todos.
          </p>
        </div>

        {/* ====== ARQUITETURA ATOM ====== */}
        <SectionTitle id="arquitetura" icon={Atom}>Arquitetura Atom</SectionTitle>
        
        <SubSection title="Single Table Design">
          <p>
            O coração do MindMate é o <strong className="text-foreground">Atom Engine</strong> — um design onde todos os tipos de item vivem numa única tabela <CodeToken>items</CodeToken>.
          </p>
          <p>Cada item tem um campo <CodeToken>type</CodeToken> que define sua natureza:</p>
          <div className="flex flex-wrap gap-2 my-3">
            {["project", "task", "habit", "note", "reflection", "resource", "list"].map((t) => (
              <span key={t} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono">{t}</span>
            ))}
          </div>
          <p>Essa abordagem permite queries unificadas, filtros transversais e máxima flexibilidade sem migrações ao adicionar novos tipos.</p>
        </SubSection>

        <SubSection title="Hierarquia">
          <p>A relação entre items é feita por dois campos:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><CodeToken>project_id</CodeToken> — vincula qualquer item a um projeto.</li>
            <li><CodeToken>parent_id</CodeToken> — cria sub-tarefas ou aninhamento genérico.</li>
          </ul>
          <p>
            <strong className="text-foreground">Milestones</strong> são simplesmente tasks com a tag <CodeToken>#milestone</CodeToken> e peso (<CodeToken>weight</CodeToken>) = 3.
            Isso permite cálculo automático de progresso ponderado nos projetos.
          </p>
        </SubSection>

        <SubSection title="Progresso de Projetos">
          <p>Três modos de progresso (<CodeToken>progress_mode</CodeToken>):</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-foreground">auto</strong> — calcula baseado na completude de tasks/milestones filhas (ponderado por <CodeToken>weight</CodeToken>).</li>
            <li><strong className="text-foreground">milestone</strong> — considera apenas items com tag <CodeToken>#milestone</CodeToken>.</li>
            <li><strong className="text-foreground">manual</strong> — o usuário define o percentual diretamente.</li>
          </ul>
        </SubSection>

        <SubSection title="State Machine de Projetos">
          <p>Projetos seguem um ciclo de vida:</p>
          <div className="flex items-center gap-2 flex-wrap text-xs my-2">
            {["draft", "active", "paused", "completed", "archived"].map((s, i) => (
              <span key={s} className="flex items-center gap-1">
                <span className="px-2 py-1 rounded bg-muted text-foreground font-mono">{s}</span>
                {i < 4 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </span>
            ))}
          </div>
        </SubSection>

        {/* ====== FUNCIONALIDADES ====== */}
        <SectionTitle id="funcionalidades" icon={Rocket}>Guia de Funcionalidades</SectionTitle>

        <Accordion type="multiple" className="space-y-2">
          <AccordionItem value="parsing" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><Hash className="h-4 w-4 text-primary" /> Parsing Engine</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-3">
              <p>Digite em linguagem natural e o MindMate extrai tokens automaticamente:</p>
              <TokenTable tokens={[
                { token: "@hoje", desc: "Define due_date para hoje" },
                { token: "@amanha", desc: "Define due_date para amanhã" },
                { token: "@segunda", desc: "Próxima segunda-feira" },
                { token: "#trabalho", desc: "Adiciona a tag 'trabalho'" },
                { token: "#mod_work", desc: "Define o módulo como 'work'" },
                { token: "~manha", desc: "Ritual slot: manhã (Aurora)" },
                { token: "~noite", desc: "Ritual slot: noite (Crepúsculo)" },
                { token: "tipo:habit", desc: "Cria como hábito" },
                { token: "tipo:note", desc: "Cria como nota" },
              ]} />
              <p>Exemplo: <CodeToken>Estudar React @amanha #estudo ~manha tipo:task</CodeToken></p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="inbox" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><Inbox className="h-4 w-4 text-primary" /> Inbox</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>Ponto central de captura rápida. Tudo começa aqui.</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Campo de input com parsing engine integrado.</li>
                <li>Swipe para completar ou deletar (mobile).</li>
                <li>Macros para aplicar conjuntos de tags/módulos de uma vez.</li>
                <li>Filtro por tipo e tags.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dashboard" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>Visão geral do seu dia:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-foreground">Focus Block</strong> — exibe a tarefa com due_date mais próxima.</li>
                <li><strong className="text-foreground">Today List</strong> — todas as tarefas e hábitos de hoje.</li>
                <li><strong className="text-foreground">Ritual Banner</strong> — acesso rápido ao ritual do período atual.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="projetos" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><FolderKanban className="h-4 w-4 text-primary" /> Projetos</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>Cada projeto tem 4 abas:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-foreground">Área de Trabalho</strong> — tarefas do projeto com drag-and-drop.</li>
                <li><strong className="text-foreground">Milestones</strong> — marcos com peso 3x para cálculo de progresso.</li>
                <li><strong className="text-foreground">Notas</strong> — anotações vinculadas ao projeto.</li>
                <li><strong className="text-foreground">Atividade</strong> — feed de ações (criou, completou, editou).</li>
              </ul>
              <p>Progresso visual com barra de % calculada pelo modo selecionado (auto/milestone/manual).</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="calendario" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Calendário</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Visualização mensal e semanal.</li>
                <li>Drag-and-drop para reagendar tasks entre dias.</li>
                <li>Filtros por tipo e tags.</li>
                <li>Seção de tarefas atrasadas (overdue) em destaque.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ritual" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><Sun className="h-4 w-4 text-primary" /> Rituais</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>Três períodos do dia com experiência visual imersiva:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-foreground">Aurora (manhã)</strong> — tons dourados, início do dia.</li>
                <li><strong className="text-foreground">Zênite (meio-dia)</strong> — tons âmbar, pico de energia.</li>
                <li><strong className="text-foreground">Crepúsculo (noite)</strong> — tons índigo, reflexão e encerramento.</li>
              </ul>
              <p>Cada ritual exibe os hábitos do slot correspondente para check-in rápido, com animações de progresso e confetti ao completar todos.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="journal" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><BookMarked className="h-4 w-4 text-primary" /> Journal</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Composer com prompts reflexivos rotativos para inspiração.</li>
                <li>Feed cronológico de reflexões com busca e filtros por tags.</li>
                <li>Exportação em Markdown.</li>
                <li>Suporta tipos: <CodeToken>reflection</CodeToken> e <CodeToken>note</CodeToken>.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="listas" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary" /> Listas</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Cards estilo Google Keep com cores personalizáveis.</li>
                <li>Checklist integrado em cada lista.</li>
                <li>Criação rápida via modal.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="recorrencia" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><Repeat className="h-4 w-4 text-primary" /> Recorrência</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>Hábitos e tarefas recorrentes usam <CodeToken>RRULE</CodeToken> (padrão iCalendar) armazenado em <CodeToken>recurrence_rule</CodeToken>.</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Frequências: diária, semanal, mensal, dias específicos.</li>
                <li>Completude registrada em <CodeToken>completion_log</CodeToken> (array de datas ISO).</li>
                <li>Heatmap visual de streaks na view de analytics.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="analytics" className="border border-border/50 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline text-sm">
              <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Analytics</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Resumo semanal com tarefas completadas, hábitos mantidos e reflexões escritas.</li>
                <li>Heatmap de atividade diária.</li>
                <li>Streak badges para hábitos consecutivos.</li>
                <li>Gráficos de distribuição por tipo e por módulo.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ====== COMO USAR ====== */}
        <SectionTitle id="como-usar" icon={ArrowRight}>Como Usar</SectionTitle>
        <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
          <p className="font-medium text-foreground">Fluxo recomendado para novos usuários:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong className="text-foreground">Crie sua conta</strong> — email e senha, confirme via e-mail.</li>
            <li><strong className="text-foreground">Capture no Inbox</strong> — digite tudo que vier à mente. Use tokens como <CodeToken>@amanha #trabalho</CodeToken> para classificar automaticamente.</li>
            <li><strong className="text-foreground">Organize em Projetos</strong> — agrupe tarefas relacionadas. Defina milestones para marcos importantes.</li>
            <li><strong className="text-foreground">Configure Hábitos</strong> — crie hábitos recorrentes e atribua slots de ritual (<CodeToken>~manha</CodeToken>, <CodeToken>~noite</CodeToken>).</li>
            <li><strong className="text-foreground">Rituais diários</strong> — use Aurora, Zênite e Crepúsculo para check-in dos hábitos em cada período do dia.</li>
            <li><strong className="text-foreground">Reflita no Journal</strong> — escreva reflexões usando os prompts guiados. Exporte quando quiser.</li>
            <li><strong className="text-foreground">Acompanhe em Analytics</strong> — veja sua evolução semanal, streaks e heatmaps de atividade.</li>
          </ol>
        </div>

        {/* ====== ATALHOS ====== */}
        <SectionTitle id="atalhos" icon={Keyboard}>Atalhos de Teclado</SectionTitle>
        <ShortcutTable shortcuts={[
          { keys: "⌘ + K", action: "Abrir Command Palette / Busca global" },
          { keys: "⌘ + H", action: "Ir para Home (Dashboard)" },
          { keys: "⌘ + I", action: "Ir para Inbox" },
          { keys: "⌘ + P", action: "Ir para Projetos" },
          { keys: "⌘ + L", action: "Ir para Listas" },
          { keys: "⌘ + J", action: "Ir para Journal" },
          { keys: "⌘ + B", action: "Ir para Calendário" },
          { keys: "⌘ + ?", action: "Mostrar atalhos de teclado" },
          { keys: "⌘ + D", action: "Abrir Debug Console" },
          { keys: "Esc", action: "Fechar modal / painel aberto" },
        ]} />

        {/* ====== COLABORAÇÃO ====== */}
        <SectionTitle id="colaboracao" icon={Users}>Colaboração</SectionTitle>
        <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
          <SubSection title="Roles (Papéis)">
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-foreground">Owner</strong> — controle total: editar, deletar, convidar membros, alterar roles, configurar projeto.</li>
              <li><strong className="text-foreground">Editor</strong> — pode criar, editar e completar tarefas/milestones do projeto.</li>
              <li><strong className="text-foreground">Viewer</strong> — acesso somente leitura ao projeto e seu conteúdo.</li>
            </ul>
          </SubSection>
          <SubSection title="Convites">
            <p>Owners podem gerar links de convite com role pré-definido e expiração. O link pode ser de uso único ou múltiplo.</p>
          </SubSection>
          <SubSection title="Activity Feed">
            <p>Toda ação em projetos compartilhados é registrada: criação, edição, completude, mudanças de role. Visível na aba "Atividade" do projeto.</p>
          </SubSection>
        </div>

        {/* ====== PWA ====== */}
        <SectionTitle id="pwa" icon={Wifi}>PWA & Offline</SectionTitle>
        <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
          <SubSection title="Instalação">
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-foreground">iOS</strong> — Safari → Compartilhar → Adicionar à Tela de Início.</li>
              <li><strong className="text-foreground">Android</strong> — Chrome → Menu ⋮ → Instalar app.</li>
              <li><strong className="text-foreground">Desktop</strong> — Chrome/Edge → ícone de instalação na barra de endereço.</li>
            </ul>
          </SubSection>
          <SubSection title="Modo Offline">
            <p>Quando sem internet, o MindMate continua funcionando. Alterações são salvas localmente e sincronizadas automaticamente quando a conexão retorna.</p>
            <p>Um indicador visual no topo mostra o status da conexão e operações pendentes.</p>
          </SubSection>
          <SubSection title="Notificações Push">
            <p>Receba lembretes de tarefas com due_date próximo e notificações de atividade em projetos compartilhados (requer permissão do navegador).</p>
          </SubSection>
        </div>

        {/* ====== FAQ ====== */}
        <SectionTitle id="faq" icon={HelpCircle}>FAQ</SectionTitle>
        <Accordion type="single" collapsible className="space-y-2">
          {[
            { q: "O MindMate é gratuito?", a: "Sim, 100% gratuito e open source. Sem limitações de funcionalidades." },
            { q: "Meus dados ficam seguros?", a: "Sim. Dados são armazenados com criptografia, protegidos por Row-Level Security (cada usuário vê apenas seus próprios dados). Projetos compartilhados usam políticas de acesso por role." },
            { q: "Posso exportar meus dados?", a: "O Journal suporta exportação em Markdown. Para dados completos, o código é open source — você pode fazer fork e hospedar sua própria instância." },
            { q: "O que acontece se eu perder conexão?", a: "O app continua funcionando offline. Alterações são enfileiradas e sincronizadas automaticamente quando a conexão retorna." },
            { q: "Como funcionam as tags?", a: "Tags começam com # e são livres. Use #mod_xxx para definir módulos (ex: #mod_work). Tags são pesquisáveis no Command Palette e filtráveis em todas as views." },
            { q: "Posso usar em múltiplos dispositivos?", a: "Sim! Como é um PWA, funciona em qualquer navegador moderno. Instale em celular, tablet e desktop — seus dados sincronizam entre todos." },
          ].map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-lg px-4 bg-card/30">
              <AccordionTrigger className="hover:no-underline text-sm text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          MindMate — Atom Engine 4.0 · Open Source · Feito com 💚
        </div>
      </main>
    </motion.div>
  );
}
