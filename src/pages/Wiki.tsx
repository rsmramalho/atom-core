import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Atom, Rocket, Inbox, LayoutDashboard, FolderKanban, 
  Calendar, Sun, Sunset, Moon, BookMarked, ListChecks, Repeat, 
  BarChart3, Keyboard, Users, Wifi, HelpCircle, ChevronRight,
  Menu, X, Hash, AtSign, ArrowRight, Search, ArrowUp, Sparkles,
  ChevronUp, BookText, Layers, Play, Lightbulb, History,
  GraduationCap, Briefcase, UsersRound, Heart, Zap, Target,
   Bell, Database, Dumbbell, UserPlus
} from "lucide-react";
import {
  DashboardSection, InboxSection, ProjectsSection, ListsSection,
  CalendarSection, JournalSection, RitualsSection, AnalyticsSection,
  ModulesSection, CommandPaletteSection, NotificationsSection, BackupCacheSection,
  OnboardingSection,
} from "@/data/wiki-sections";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { parseInput } from "@/lib/parsing-engine";

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
  // ── Super Manual: Telas Detalhadas ──
  { id: "tela-dashboard", label: "📊 Dashboard", icon: LayoutDashboard, keywords: ["home", "focus", "today", "ritual banner", "sugestões", "confetti", "empty state"] },
  { id: "tela-inbox", label: "📥 Inbox", icon: Inbox, keywords: ["captura", "parsing", "macropicker", "processar", "promover", "gtd"] },
  { id: "tela-projetos", label: "📁 Projetos", icon: FolderKanban, keywords: ["workarea", "milestones", "notas", "atividade", "status", "compartilhar", "fab", "drag"] },
  { id: "tela-listas", label: "📋 Listas", icon: ListChecks, keywords: ["keep", "checklist", "cores", "duplicar", "quick add"] },
  { id: "tela-calendario", label: "📅 Calendário", icon: Calendar, keywords: ["mês", "semana", "drag", "overdue", "day detail", "filtro"] },
  { id: "tela-journal", label: "📔 Diário", icon: BookMarked, keywords: ["reflexão", "composer", "prompts", "exportar", "markdown", "feed"] },
  { id: "tela-rituais", label: "🌅 Rituais", icon: Sun, keywords: ["aurora", "zênite", "crepúsculo", "streak", "heatmap", "confetti", "check-in"] },
  { id: "tela-analytics", label: "📈 Analytics", icon: BarChart3, keywords: ["resumo", "gráfico", "tendência", "weekly summary", "ai"] },
  // ── Super Manual: Seções Complementares ──
  { id: "modulos-detalhe", label: "🧩 Módulos", icon: Dumbbell, keywords: ["work", "body", "mind", "family", "geral", "#mod_", "herança", "badge"] },
  { id: "command-palette", label: "⌨️ Command Palette", icon: Keyboard, keywords: ["⌘k", "busca global", "navegação", "atalho"] },
  { id: "notificacoes", label: "🔔 Notificações", icon: Bell, keywords: ["push", "reminder", "due date", "atividade"] },
  { id: "backup-cache", label: "💾 Backup & Cache", icon: Database, keywords: ["offline", "sync", "indexeddb", "export", "rls", "segurança"] },
  // ── Seções originais ──
  { id: "playground", label: "Token Playground", icon: Play, keywords: ["parsing", "testar", "demo", "interativo", "token", "ao vivo"] },
  { id: "rituais-demo", label: "Rituais Demo", icon: Sun, keywords: ["aurora", "zênite", "crepúsculo", "slot", "manhã", "noite"] },
  { id: "casos-de-uso", label: "Casos de Uso", icon: Target, keywords: ["estudante", "freelancer", "equipe", "bem-estar", "cenário"] },
  { id: "dicas", label: "Dicas & Truques", icon: Lightbulb, keywords: ["avançado", "macro", "workflow", "combinação", "produtividade"] },
  { id: "como-usar", label: "Como Usar", icon: ArrowRight, keywords: ["conta", "captura", "fluxo", "passo", "novos usuários", "guia"] },
  { id: "atalhos", label: "Atalhos de Teclado", icon: Keyboard, keywords: ["shortcut", "⌘", "ctrl", "command palette", "teclado", "navegação"] },
  { id: "colaboracao", label: "Colaboração", icon: Users, keywords: ["owner", "editor", "viewer", "convite", "role", "compartilhar", "activity", "membro"] },
  { id: "pwa", label: "PWA & Offline", icon: Wifi, keywords: ["instalação", "offline", "push", "notificação", "sync", "ios", "android", "desktop"] },
  { id: "glossario", label: "Glossário", icon: BookText, keywords: ["atom", "token", "ritual slot", "milestone", "weight", "rrule", "módulo", "parsing", "termos"] },
  { id: "diagrama", label: "Arquitetura Visual", icon: Layers, keywords: ["diagrama", "ascii", "single table", "hierarquia", "fluxo"] },
  { id: "changelog", label: "Changelog", icon: History, keywords: ["versão", "atualização", "mudança", "release", "alpha"] },
  { id: "faq", label: "FAQ", icon: HelpCircle, keywords: ["gratuito", "seguro", "exportar", "dados", "tags", "dispositivos", "conexão"] },
];

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={sectionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ id, icon: Icon, children, gradient }: { id: string; icon: React.ElementType; children: React.ReactNode; gradient?: string }) {
  return (
    <AnimatedSection>
      <h2 id={id} className={cn(
        "text-2xl font-bold text-foreground flex items-center gap-3 pt-8 pb-4 scroll-mt-20 border-b mb-4",
        gradient || "border-border/50"
      )}>
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          gradient ? "bg-gradient-to-br " + gradient : "bg-primary/10"
        )}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        {children}
      </h2>
    </AnimatedSection>
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

function GlossaryTable({ terms }: { terms: { term: string; desc: string }[] }) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30">
            <th className="text-left px-3 py-2 font-medium text-foreground">Termo</th>
            <th className="text-left px-3 py-2 font-medium text-foreground">Definição</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((t, i) => (
            <tr key={i} className="border-t border-border/30">
              <td className="px-3 py-2 font-mono text-xs text-primary whitespace-nowrap">{t.term}</td>
              <td className="px-3 py-2 text-muted-foreground">{t.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== TOKEN PLAYGROUND =====
function TokenPlayground() {
  const [input, setInput] = useState("Estudar React @amanha #estudo ~manha tipo:task");
  const parsed = useMemo(() => parseInput(input), [input]);

  return (
    <AnimatedSection>
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Play className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Playground ao Vivo</span>
          <Badge variant="secondary" className="text-[10px]">Interativo</Badge>
        </div>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite algo como: Comprar pão @hoje #casa ~manha"
          className="bg-background/80 border-border/50 font-mono text-sm"
        />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Título Limpo</p>
            <p className="text-foreground font-medium">{parsed.title || <span className="text-muted-foreground italic">vazio</span>}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</p>
            <Badge variant="outline" className="text-xs">{parsed.type}</Badge>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</p>
            <p className="text-foreground text-xs font-mono">{parsed.due_date || "—"}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ritual Slot</p>
            <p className="text-foreground text-xs font-mono">{parsed.ritual_slot || "—"}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Módulo</p>
            <p className="text-foreground text-xs font-mono">{parsed.module || "—"}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</p>
            <div className="flex flex-wrap gap-1">
              {parsed.tags.length > 0
                ? parsed.tags.map((t) => (
                    <Badge key={t} className="text-[10px] bg-primary/10 text-primary border-0">{t}</Badge>
                  ))
                : <span className="text-xs text-muted-foreground">—</span>}
            </div>
          </div>
        </div>
        {parsed.detected_tokens.length > 0 && (
          <div className="pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tokens Detectados</p>
            <div className="flex flex-wrap gap-1.5">
              {parsed.detected_tokens.map((dt, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-[10px] font-mono">
                  <span className="text-primary">{dt.token}</span>
                  <span className="text-muted-foreground">→ {dt.type}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

// ===== RITUAL SLOTS DEMO =====
const ritualSlots = [
  { name: "Aurora", slot: "manha", icon: Sun, time: "05h–12h", color: "from-amber-500/20 to-yellow-500/10", borderColor: "border-amber-500/30", iconColor: "text-amber-500", desc: "Início do dia. Energize-se com hábitos matinais: meditação, exercício, planejamento." },
  { name: "Zênite", slot: "meio_dia", icon: Sunset, time: "12h–18h", color: "from-orange-500/20 to-amber-500/10", borderColor: "border-orange-500/30", iconColor: "text-orange-500", desc: "Pico de energia. Foque nas tarefas mais importantes e check-ins de hábitos do meio-dia." },
  { name: "Crepúsculo", slot: "noite", icon: Moon, time: "18h–05h", color: "from-indigo-500/20 to-violet-500/10", borderColor: "border-indigo-500/30", iconColor: "text-indigo-500", desc: "Reflexão e encerramento. Journaling, leitura, revisão do dia e gratidão." },
] as const;

function RitualSlotsDemo() {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  return (
    <AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ritualSlots.map((slot, i) => {
          const Icon = slot.icon;
          const isActive = activeSlot === i;
          return (
            <motion.button
              key={slot.slot}
              onClick={() => setActiveSlot(isActive ? null : i)}
              className={cn(
                "relative rounded-xl border p-4 text-left transition-all",
                "bg-gradient-to-br", slot.color, slot.borderColor,
                isActive && "ring-2 ring-primary/30 shadow-lg"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("h-5 w-5", slot.iconColor)} />
                <span className="font-semibold text-foreground text-sm">{slot.name}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mb-2">{slot.time}</p>
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground leading-relaxed"
                  >
                    {slot.desc}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className={cn(
                "absolute top-2 right-2 w-2 h-2 rounded-full",
                isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
              )} />
            </motion.button>
          );
        })}
      </div>
    </AnimatedSection>
  );
}

// ===== FEATURE CARD (for Funcionalidades grid) =====
function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 25px -8px hsl(var(--primary) / 0.15)" }}
      className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2 transition-colors hover:border-primary/20"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ===== USE CASE CARD =====
function UseCaseCard({ icon: Icon, persona, desc, tokens }: { icon: React.ElementType; persona: string; desc: string; tokens: string[] }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border/50 bg-card/30 p-5 space-y-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">{persona}</h4>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((t) => (
          <code key={t} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono">{t}</code>
        ))}
      </div>
    </motion.div>
  );
}

export default function Wiki() {
  const [tocOpen, setTocOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const ids = tocItems.map((t) => t.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
          className={cn(
            "w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors text-left",
            activeSection === item.id
              ? "text-primary bg-primary/10 font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );

  const activeTocItem = tocItems.find((t) => t.id === activeSection);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen"
    >
      {/* Public header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-bold text-foreground">MindMate</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              Wiki
            </span>
            <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">v4.0.0-alpha.28</Badge>
          </div>
          
          {/* Mobile breadcrumb */}
          {activeTocItem && (
            <span className="lg:hidden text-xs text-muted-foreground truncate max-w-[120px]">
              {activeTocItem.label}
            </span>
          )}
          
          <div className="flex items-center gap-2">
            <Link to="/app">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Entrar</Button>
            </Link>
            <Link to="/app" className="hidden sm:block">
              <Button size="sm" className="gap-2">
                Começar Grátis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-border/50 p-4 sticky top-14 h-[calc(100vh-3.5rem)]">
          <ScrollArea className="h-full">
            {sidebarContent}
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
          <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm p-6 pt-20">
            <ScrollArea className="h-full">{sidebarContent}</ScrollArea>
          </div>
        )}

        {/* Main content */}
        <main ref={mainRef} className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-20">
          <AnimatedSection>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                Wiki MindMate
              </h1>
              <p className="text-muted-foreground mt-2">Manual completo — arquitetura, funcionalidades, demos interativas e guia de uso.</p>
            </div>
          </AnimatedSection>

          {/* ====== MANIFESTO ====== */}
          <SectionTitle id="manifesto" icon={BookOpen} gradient="from-emerald-500 to-green-600 border-emerald-500/30">Manifesto</SectionTitle>
          <AnimatedSection>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
              <p>
                O MindMate nasceu de uma premissa simples: <strong className="text-foreground">sua mente merece um parceiro, não uma prisão metodológica.</strong>
              </p>
              <p>Três pilares guiam tudo o que construímos:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                {[
                  { icon: Zap, title: "Capturar sem fricção", desc: "Do pensamento ao registro em segundos, com linguagem natural e tokens inteligentes." },
                  { icon: Layers, title: "Organizar sem rigidez", desc: "Projetos, tarefas, hábitos e notas convivem sem hierarquias artificiais." },
                  { icon: Heart, title: "Refletir com propósito", desc: "Rituais diários e journaling transformam dados em autoconhecimento." },
                ].map((p) => (
                  <motion.div
                    key={p.title}
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2"
                  >
                    <p.icon className="h-5 w-5 text-primary" />
                    <p className="font-semibold text-foreground text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
              <p>
                Somos <strong className="text-foreground">agnósticos de metodologia</strong>. GTD, Pomodoro, Bullet Journal, Zettelkasten — use o que funcionar para você.
              </p>
              <p>
                <strong className="text-foreground">100% gratuito e open source.</strong> Acreditamos que ferramentas de produtividade e bem-estar devem ser acessíveis a todos.
              </p>
            </div>
          </AnimatedSection>

          {/* ====== ARQUITETURA ATOM ====== */}
          <SectionTitle id="arquitetura" icon={Atom} gradient="from-violet-500 to-purple-600 border-violet-500/30">Arquitetura Atom</SectionTitle>
          
          <AnimatedSection>
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
          </AnimatedSection>

          <AnimatedSection>
            <SubSection title="Hierarquia">
              <p>A relação entre items é feita por dois campos:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><CodeToken>project_id</CodeToken> — vincula qualquer item a um projeto.</li>
                <li><CodeToken>parent_id</CodeToken> — cria sub-tarefas ou aninhamento genérico.</li>
              </ul>
              <p>
                <strong className="text-foreground">Milestones</strong> são simplesmente tasks com a tag <CodeToken>#milestone</CodeToken> e peso (<CodeToken>weight</CodeToken>) = 3.
              </p>
            </SubSection>
          </AnimatedSection>

          <AnimatedSection>
            <SubSection title="Progresso de Projetos">
              <p>Três modos de progresso (<CodeToken>progress_mode</CodeToken>):</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-foreground">auto</strong> — calcula baseado na completude de tasks/milestones filhas (ponderado por <CodeToken>weight</CodeToken>).</li>
                <li><strong className="text-foreground">milestone</strong> — considera apenas items com tag <CodeToken>#milestone</CodeToken>.</li>
                <li><strong className="text-foreground">manual</strong> — o usuário define o percentual diretamente.</li>
              </ul>
            </SubSection>
          </AnimatedSection>

          <AnimatedSection>
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
          </AnimatedSection>

          {/* ====== FUNCIONALIDADES (now as visual cards grid) ====== */}
          <SectionTitle id="funcionalidades" icon={Rocket} gradient="from-blue-500 to-cyan-600 border-blue-500/30">Guia de Funcionalidades</SectionTitle>

          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <FeatureCard icon={Hash} title="Parsing Engine" desc="Linguagem natural → dados estruturados. Tokens @hoje, #tags, ~slots extraídos automaticamente." />
              <FeatureCard icon={Inbox} title="Inbox" desc="Captura rápida com parsing integrado. Swipe gestures, macros e filtros por tipo/tags." />
              <FeatureCard icon={LayoutDashboard} title="Dashboard" desc="Visão do dia: Focus Block, Today List e Ritual Banner em uma única tela." />
              <FeatureCard icon={FolderKanban} title="Projetos" desc="4 abas: Área de Trabalho, Milestones, Notas e Atividade. Drag-and-drop e progresso visual." />
              <FeatureCard icon={Calendar} title="Calendário" desc="Views mensal e semanal. Drag-and-drop entre dias, filtros e seção de overdue." />
              <FeatureCard icon={Sun} title="Rituais" desc="Aurora, Zênite e Crepúsculo — check-in visual com confetti ao completar todos os hábitos." />
              <FeatureCard icon={BookMarked} title="Journal" desc="Reflexões com prompts guiados, feed cronológico com filtros e exportação em Markdown." />
              <FeatureCard icon={ListChecks} title="Listas" desc="Cards estilo Google Keep com cores personalizáveis e checklist integrado." />
              <FeatureCard icon={Repeat} title="Recorrência" desc="RRULE (iCalendar) para hábitos: diário, semanal, mensal. Heatmap de streaks." />
              <FeatureCard icon={BarChart3} title="Analytics" desc="Resumo semanal, heatmap de atividade, streak badges e gráficos por tipo/módulo." />
            </div>
          </AnimatedSection>

          {/* ====== DETAILS ACCORDION ====== */}
          <AnimatedSection>
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="parsing" className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="hover:no-underline text-sm">
                  <span className="flex items-center gap-2"><Hash className="h-4 w-4 text-primary" /> Detalhes: Parsing Engine</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-3">
                  <p>Digite em linguagem natural e o MindMate extrai tokens automaticamente:</p>
                  <TokenTable tokens={[
                    { token: "@hoje", desc: "Define due_date para hoje" },
                    { token: "@amanha", desc: "Define due_date para amanhã" },
                    { token: "#trabalho", desc: "Adiciona a tag 'trabalho'" },
                    { token: "#mod_work", desc: "Define o módulo como 'work'" },
                    { token: "#milestone", desc: "Marca como marco (peso 3x)" },
                    { token: "#focus", desc: "Adiciona ao bloco Focus" },
                    { token: "@ritual_manha", desc: "Ritual slot: manhã (Aurora)" },
                    { token: "@ritual_meio_dia", desc: "Ritual slot: meio-dia (Zênite)" },
                    { token: "@ritual_noite", desc: "Ritual slot: noite (Crepúsculo)" },
                    { token: "@who:nome", desc: "Tag de pessoa" },
                    { token: "@where:local", desc: "Tag de local" },
                  ]} />
                  <p className="font-medium text-foreground">Exemplos combinados:</p>
                  <div className="space-y-2">
                    <p><CodeToken>Estudar React @amanha #estudo</CodeToken></p>
                    <p className="text-xs">→ Task "Estudar React", due amanhã, tag #estudo</p>
                    <p><CodeToken>Reunião @who:carlos @where:escritorio #mod_work</CodeToken></p>
                    <p className="text-xs">→ Task com tags #who:carlos, #where:escritorio, módulo work</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="collaboration" className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="hover:no-underline text-sm">
                  <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Detalhes: Roles & Convites</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2">
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong className="text-foreground">Owner</strong> — controle total do projeto.</li>
                    <li><strong className="text-foreground">Editor</strong> — criar, editar e completar tarefas.</li>
                    <li><strong className="text-foreground">Viewer</strong> — acesso somente leitura.</li>
                  </ul>
                  <p>Links de convite com role e expiração configuráveis. Activity Feed registra toda ação em projetos compartilhados.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedSection>

          {/* ====== SUPER MANUAL: TELAS DETALHADAS ====== */}
          <SectionTitle id="tela-dashboard" icon={LayoutDashboard} gradient="from-emerald-500 to-teal-600 border-emerald-500/30">Dashboard (Home)</SectionTitle>
          <AnimatedSection><DashboardSection /></AnimatedSection>

          <SectionTitle id="tela-inbox" icon={Inbox} gradient="from-blue-500 to-indigo-600 border-blue-500/30">Inbox — Captura & Processamento</SectionTitle>
          <AnimatedSection><InboxSection /></AnimatedSection>

          <SectionTitle id="tela-projetos" icon={FolderKanban} gradient="from-violet-500 to-purple-600 border-violet-500/30">Projetos — Organização Completa</SectionTitle>
          <AnimatedSection><ProjectsSection /></AnimatedSection>

          <SectionTitle id="tela-listas" icon={ListChecks} gradient="from-pink-500 to-rose-600 border-pink-500/30">Listas — Cards Visuais</SectionTitle>
          <AnimatedSection><ListsSection /></AnimatedSection>

          <SectionTitle id="tela-calendario" icon={Calendar} gradient="from-cyan-500 to-blue-600 border-cyan-500/30">Calendário — Visão Temporal</SectionTitle>
          <AnimatedSection><CalendarSection /></AnimatedSection>

          <SectionTitle id="tela-journal" icon={BookMarked} gradient="from-amber-500 to-yellow-600 border-amber-500/30">Diário (Journal) — Reflexão</SectionTitle>
          <AnimatedSection><JournalSection /></AnimatedSection>

          <SectionTitle id="tela-rituais" icon={Sun} gradient="from-orange-500 to-amber-600 border-orange-500/30">Rituais — Consistência Diária</SectionTitle>
          <AnimatedSection><RitualsSection /></AnimatedSection>

          <SectionTitle id="tela-analytics" icon={BarChart3} gradient="from-green-500 to-lime-600 border-green-500/30">Analytics — Estatísticas</SectionTitle>
          <AnimatedSection><AnalyticsSection /></AnimatedSection>

          {/* ====== SUPER MANUAL: SEÇÕES COMPLEMENTARES ====== */}
          <SectionTitle id="modulos-detalhe" icon={Dumbbell} gradient="from-blue-500 to-purple-600 border-blue-500/30">Módulos em Detalhe</SectionTitle>
          <AnimatedSection><ModulesSection /></AnimatedSection>

          <SectionTitle id="command-palette" icon={Keyboard} gradient="from-slate-500 to-zinc-600 border-slate-500/30">Command Palette & Navegação</SectionTitle>
          <AnimatedSection><CommandPaletteSection /></AnimatedSection>

          <SectionTitle id="notificacoes" icon={Bell} gradient="from-red-500 to-orange-600 border-red-500/30">Notificações & Push</SectionTitle>
          <AnimatedSection><NotificationsSection /></AnimatedSection>

          <SectionTitle id="backup-cache" icon={Database} gradient="from-gray-500 to-slate-600 border-gray-500/30">Backup & Cache</SectionTitle>
          <AnimatedSection><BackupCacheSection /></AnimatedSection>

          {/* ====== TOKEN PLAYGROUND ====== */}
          <SectionTitle id="playground" icon={Play} gradient="from-green-500 to-emerald-600 border-green-500/30">Token Playground</SectionTitle>
          <AnimatedSection>
            <p className="text-sm text-muted-foreground mb-4">
              Teste o <strong className="text-foreground">Parsing Engine</strong> ao vivo. Digite qualquer texto e veja os tokens sendo extraídos em tempo real.
            </p>
          </AnimatedSection>
          <TokenPlayground />

          {/* ====== RITUAL SLOTS DEMO ====== */}
          <SectionTitle id="rituais-demo" icon={Sun} gradient="from-amber-500 to-orange-600 border-amber-500/30">Rituais — Demo Interativa</SectionTitle>
          <AnimatedSection>
            <p className="text-sm text-muted-foreground mb-4">
              Clique em cada período para explorar como os <strong className="text-foreground">Ritual Slots</strong> organizam seus hábitos ao longo do dia.
            </p>
          </AnimatedSection>
          <RitualSlotsDemo />

          {/* ====== CASOS DE USO ====== */}
          <SectionTitle id="casos-de-uso" icon={Target} gradient="from-pink-500 to-rose-600 border-pink-500/30">Casos de Uso</SectionTitle>
          <AnimatedSection>
            <p className="text-sm text-muted-foreground mb-4">
              Veja como diferentes perfis usam o MindMate no dia a dia.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UseCaseCard
                icon={GraduationCap}
                persona="Estudante"
                desc="Organiza disciplinas como projetos, tarefas por deadline e rituais de estudo."
                tokens={["#mod_study", "@amanha", "#milestone", "~manha"]}
              />
              <UseCaseCard
                icon={Briefcase}
                persona="Freelancer"
                desc="Projetos por cliente, milestones para entregas, time-tracking com tags."
                tokens={["#mod_work", "@who:cliente", "#milestone", "#focus"]}
              />
              <UseCaseCard
                icon={UsersRound}
                persona="Equipe Pequena"
                desc="Projetos compartilhados com roles, activity feed e convites por link."
                tokens={["role:editor", "convite", "atividade", "#mod_work"]}
              />
              <UseCaseCard
                icon={Heart}
                persona="Bem-estar Pessoal"
                desc="Hábitos em ritual slots, journaling reflexivo e heatmap de consistência."
                tokens={["~manha", "~noite", "tipo:habit", "tipo:reflection"]}
              />
            </div>
          </AnimatedSection>

          {/* ====== DICAS & TRUQUES ====== */}
          <SectionTitle id="dicas" icon={Lightbulb} gradient="from-yellow-500 to-amber-600 border-yellow-500/30">Dicas & Truques</SectionTitle>
          <AnimatedSection>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Combinações Avançadas de Tokens
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Combine múltiplos tokens numa única entrada para máxima eficiência:</p>
                  <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs space-y-1">
                    <p><CodeToken>Entregar relatório @amanha #mod_work #milestone #focus @who:maria</CodeToken></p>
                    <p className="text-muted-foreground/70">→ Milestone focada, módulo work, vinculada a Maria, due amanhã</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-amber-500" /> Workflows de Ritual
                </h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Configure hábitos em slots específicos para criar uma rotina consistente:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                    <li><strong className="text-foreground">Aurora</strong>: Meditação → Exercício → Planejamento do dia</li>
                    <li><strong className="text-foreground">Zênite</strong>: Review de inbox → Deep work → Hidratação</li>
                    <li><strong className="text-foreground">Crepúsculo</strong>: Journaling → Leitura → Gratidão</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-2">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Hash className="h-4 w-4 text-amber-500" /> Sistema de Módulos
                </h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Use <CodeToken>#mod_xxx</CodeToken> para categorizar por área da vida:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { mod: "#mod_work", label: "Trabalho" },
                      { mod: "#mod_body", label: "Corpo" },
                      { mod: "#mod_mind", label: "Mente" },
                      { mod: "#mod_home", label: "Casa" },
                      { mod: "#mod_social", label: "Social" },
                      { mod: "#mod_finance", label: "Finanças" },
                    ].map((m) => (
                      <span key={m.mod} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 text-xs">
                        <code className="text-primary font-mono">{m.mod}</code>
                        <span className="text-muted-foreground">= {m.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ====== COMO USAR ====== */}
          <SectionTitle id="como-usar" icon={ArrowRight} gradient="from-teal-500 to-cyan-600 border-teal-500/30">Como Usar</SectionTitle>
          <AnimatedSection>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
              <p className="font-medium text-foreground">Fluxo recomendado para novos usuários:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li><strong className="text-foreground">Crie sua conta</strong> — email e senha, confirme via e-mail.</li>
                <li><strong className="text-foreground">Capture no Inbox</strong> — digite tudo que vier à mente. Use tokens como <CodeToken>@amanha #trabalho</CodeToken>.</li>
                <li><strong className="text-foreground">Organize em Projetos</strong> — agrupe tarefas relacionadas. Defina milestones para marcos.</li>
                <li><strong className="text-foreground">Configure Hábitos</strong> — crie hábitos recorrentes e atribua slots de ritual.</li>
                <li><strong className="text-foreground">Rituais diários</strong> — use Aurora, Zênite e Crepúsculo para check-in dos hábitos.</li>
                <li><strong className="text-foreground">Reflita no Journal</strong> — escreva reflexões usando os prompts guiados.</li>
                <li><strong className="text-foreground">Acompanhe em Analytics</strong> — veja sua evolução semanal, streaks e heatmaps.</li>
              </ol>
            </div>
          </AnimatedSection>

          {/* ====== ATALHOS ====== */}
          <SectionTitle id="atalhos" icon={Keyboard} gradient="from-slate-500 to-gray-600 border-slate-500/30">Atalhos de Teclado</SectionTitle>
          <AnimatedSection>
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
          </AnimatedSection>

          {/* ====== COLABORAÇÃO ====== */}
          <SectionTitle id="colaboracao" icon={Users} gradient="from-sky-500 to-blue-600 border-sky-500/30">Colaboração</SectionTitle>
          <AnimatedSection>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
              <SubSection title="Roles (Papéis)">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-foreground">Owner</strong> — controle total: editar, deletar, convidar membros, alterar roles.</li>
                  <li><strong className="text-foreground">Editor</strong> — pode criar, editar e completar tarefas/milestones.</li>
                  <li><strong className="text-foreground">Viewer</strong> — acesso somente leitura.</li>
                </ul>
              </SubSection>
              <SubSection title="Convites">
                <p>Owners podem gerar links de convite com role pré-definido e expiração.</p>
              </SubSection>
              <SubSection title="Activity Feed">
                <p>Toda ação em projetos compartilhados é registrada na aba "Atividade".</p>
              </SubSection>
            </div>
          </AnimatedSection>

          {/* ====== PWA ====== */}
          <SectionTitle id="pwa" icon={Wifi} gradient="from-cyan-500 to-teal-600 border-cyan-500/30">PWA & Offline</SectionTitle>
          <AnimatedSection>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
              <SubSection title="Instalação">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-foreground">iOS</strong> — Safari → Compartilhar → Adicionar à Tela de Início.</li>
                  <li><strong className="text-foreground">Android</strong> — Chrome → Menu ⋮ → Instalar app.</li>
                  <li><strong className="text-foreground">Desktop</strong> — Chrome/Edge → ícone de instalação na barra de endereço.</li>
                </ul>
              </SubSection>
              <SubSection title="Modo Offline">
                <p>Alterações são salvas localmente e sincronizadas quando a conexão retorna.</p>
              </SubSection>
              <SubSection title="Notificações Push">
                <p>Lembretes de due_date e atividade em projetos compartilhados (requer permissão do navegador).</p>
              </SubSection>
            </div>
          </AnimatedSection>

          {/* ====== GLOSSÁRIO ====== */}
          <SectionTitle id="glossario" icon={BookText} gradient="from-fuchsia-500 to-pink-600 border-fuchsia-500/30">Glossário de Termos</SectionTitle>
          <AnimatedSection>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-3 mb-4">
              <p>Referência rápida dos termos e conceitos usados no MindMate.</p>
            </div>
            <GlossaryTable terms={[
              { term: "Atom", desc: "Unidade fundamental do sistema — qualquer item na tabela única (task, habit, note, etc.)." },
              { term: "Atom Engine", desc: "Motor central que processa, armazena e relaciona todos os Atoms via Single Table Design." },
              { term: "Token", desc: "Marcador no texto que o Parsing Engine interpreta (ex: @hoje, #tag, @ritual_manha)." },
              { term: "Parsing Engine", desc: "Processador que extrai tokens da entrada em linguagem natural e converte em campos estruturados." },
              { term: "Ritual Slot", desc: "Período do dia associado a um hábito: manha (Aurora), meio_dia (Zênite), noite (Crepúsculo)." },
              { term: "Milestone", desc: "Task marcada com #milestone. Peso 3x no cálculo de progresso do projeto." },
              { term: "Weight", desc: "Peso numérico do item para cálculo de progresso ponderado (tasks = 1, milestones = 3)." },
              { term: "RRULE", desc: "Padrão iCalendar (RFC 5545) usado para definir regras de recorrência de hábitos e tasks." },
              { term: "completion_log", desc: "Array de datas ISO que registra cada ocorrência completada de um item recorrente." },
              { term: "progress_mode", desc: "Modo de cálculo de progresso do projeto: auto (ponderado), milestone (só marcos), manual." },
              { term: "project_status", desc: "Estado no ciclo de vida do projeto: draft → active → paused → completed → archived." },
              { term: "Module", desc: "Classificação temática definida por #mod_xxx (ex: #mod_work → módulo 'work')." },
              { term: "Macro", desc: "Conjunto pré-definido de tags/módulos aplicáveis de uma vez no Inbox." },
              { term: "Single Table Design", desc: "Arquitetura onde todos os tipos de item (7) vivem na mesma tabela 'items'." },
              { term: "RLS", desc: "Row-Level Security — política que garante que cada usuário só vê seus próprios dados." },
            ]} />
          </AnimatedSection>

          {/* ====== DIAGRAMA ====== */}
          <SectionTitle id="diagrama" icon={Layers} gradient="from-indigo-500 to-violet-600 border-indigo-500/30">Arquitetura Visual</SectionTitle>
          <AnimatedSection>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-4">
              <SubSection title="Single Table Design">
                <pre className="text-xs font-mono bg-muted/30 border border-border/50 rounded-lg p-4 overflow-x-auto whitespace-pre leading-relaxed">
{`┌─────────────────────────────────────────────────┐
│                  items (tabela)                  │
├─────────────────────────────────────────────────┤
│ id          │ uuid PK                           │
│ user_id     │ uuid FK → auth.users              │
│ title       │ text                              │
│ type        │ enum: project│task│habit│note│...  │
│ tags[]      │ text[] (#milestone, #focus, ...)   │
│ module      │ text (work, body, mind, family)    │
│ project_id  │ uuid FK → items (self-ref)        │
│ parent_id   │ uuid FK → items (self-ref)        │
│ due_date    │ date                              │
│ ritual_slot │ enum: manha│meio_dia│noite        │
│ completed   │ boolean                           │
│ weight      │ int (task=1, milestone=3)          │
│ progress    │ int 0-100 (projects only)         │
│ ...         │                                   │
└─────────────────────────────────────────────────┘`}
                </pre>
              </SubSection>

              <SubSection title="Hierarquia de Items">
                <pre className="text-xs font-mono bg-muted/30 border border-border/50 rounded-lg p-4 overflow-x-auto whitespace-pre leading-relaxed">
{`Project (type: "project")
├── Task (project_id → project.id)
│   ├── Sub-task (parent_id → task.id)
│   └── Sub-task
├── Milestone (tags: ["#milestone"], weight: 3)
├── Note (type: "note", project_id → project.id)
└── Habit (type: "habit", ritual_slot: "manha")`}
                </pre>
              </SubSection>

              <SubSection title="Fluxo de Dados">
                <pre className="text-xs font-mono bg-muted/30 border border-border/50 rounded-lg p-4 overflow-x-auto whitespace-pre leading-relaxed">
{`Input (linguagem natural)
  │
  ▼
┌──────────────┐     ┌──────────────┐
│ Parsing      │────▶│ Atom Engine  │
│ Engine       │     │ (CRUD)       │
│              │     │              │
│ @hoje → date │     │ items table  │
│ #tag → tags  │     │ + RLS        │
│ ~slot → slot │     │ + realtime   │
└──────────────┘     └──────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         Dashboard     Calendar      Ritual
         (today)       (month/week)  (slot check-in)`}
                </pre>
              </SubSection>
            </div>
          </AnimatedSection>

          {/* ====== CHANGELOG ====== */}
          <SectionTitle id="changelog" icon={History} gradient="from-gray-500 to-zinc-600 border-gray-500/30">Changelog</SectionTitle>
          <AnimatedSection>
            <div className="space-y-4">
              {[
                {
                  version: "v4.0.0-alpha.28",
                  date: "Março 2026",
                  changes: [
                    "Wiki melhorada: Token Playground interativo, Demo de Rituais, Casos de Uso, Dicas & Truques",
                    "Scroll animations com framer-motion em todas as seções",
                    "Cards visuais em grid para funcionalidades",
                    "Gradientes temáticos nos headers de seção",
                  ],
                },
                {
                  version: "v4.0.0-alpha.27",
                  date: "Março 2026",
                  changes: [
                    "ErrorBoundary global com Suspense em rotas",
                    "Skeleton loading contextual (Inbox, ProjectDetail, Calendar)",
                    "Micro-animações em elementos interativos (scale, shadow, ring)",
                  ],
                },
                {
                  version: "v4.0.0-alpha.17",
                  date: "Dezembro 2025",
                  changes: [
                    "Fix crítico: tela preta mobile (AnimatePresence em InstallPrompt)",
                    "Novos ícones PWA (72x72 a 512x512) com design atom verde (#26D96E)",
                    "7 splash screens iOS (iPhone SE até iPad Pro 12.9\")",
                  ],
                },
              ].map((release) => (
                <div key={release.version} className="rounded-xl border border-border/50 bg-card/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs font-mono">{release.version}</Badge>
                    <span className="text-xs text-muted-foreground">{release.date}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-muted-foreground">
                    {release.changes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* ====== FAQ ====== */}
          <SectionTitle id="faq" icon={HelpCircle} gradient="from-orange-500 to-red-600 border-orange-500/30">FAQ</SectionTitle>
          <AnimatedSection>
            <Accordion type="single" collapsible className="space-y-2">
              {[
                { q: "O MindMate é gratuito?", a: "Sim, 100% gratuito e open source. Sem limitações de funcionalidades." },
                { q: "Meus dados ficam seguros?", a: "Sim. Dados protegidos por Row-Level Security — cada usuário só vê seus próprios dados." },
                { q: "Posso exportar meus dados?", a: "O Journal suporta exportação em Markdown. O código é open source — faça fork e hospede sua instância." },
                { q: "O que acontece se eu perder conexão?", a: "O app continua offline. Alterações são sincronizadas automaticamente ao reconectar." },
                { q: "Como funcionam as tags?", a: "Tags começam com # e são livres. Use #mod_xxx para módulos. Pesquisáveis no Command Palette." },
                { q: "Posso usar em múltiplos dispositivos?", a: "Sim! PWA que funciona em qualquer navegador moderno. Dados sincronizam entre todos os dispositivos." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-lg px-4 bg-card/30">
                  <AccordionTrigger className="hover:no-underline text-sm text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>

          {/* Footer with version */}
          <AnimatedSection>
            <div className="mt-12 pt-6 border-t border-border/50 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                MindMate — Atom Engine 4.0 · Open Source · Feito com 💚
              </p>
              <p className="text-[10px] text-muted-foreground/60">
                v4.0.0-alpha.28 · Última atualização: Março 2026
              </p>
            </div>
          </AnimatedSection>
        </main>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-4 left-4 z-50 bg-muted/80 backdrop-blur-sm text-foreground rounded-full p-2.5 shadow-lg border border-border/50 hover:bg-muted transition-colors"
            aria-label="Voltar ao topo"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
