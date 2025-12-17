import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Inbox, 
  Target, 
  Calendar, 
  BookOpen, 
  Sunrise, 
  Repeat, 
  Wifi, 
  WifiOff,
  Keyboard,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
  HelpCircle,
  Moon,
  Layers,
  Code,
  Cpu,
  Brain,
  Database,
  Shuffle,
  Cog,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DemoModal } from "@/components/landing/DemoModal";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Letter animation for tagline
const letterAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 }
};

const AnimatedTagline = () => {
  const word1 = "Mindful";
  const word2 = "control";
  
  return (
    <motion.h1 
      className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-foreground mb-4 sm:mb-6 leading-[0.9] tracking-tight"
      initial="initial"
      animate="animate"
    >
      <span className="inline-block overflow-hidden">
        {word1.split("").map((letter, index) => (
          <motion.span
            key={index}
            variants={letterAnimation}
            transition={{ 
              duration: 0.4,
              delay: 0.1 + index * 0.05,
              ease: [0.215, 0.61, 0.355, 1]
            }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
      </span>
      <span className="inline-block mx-2 sm:mx-3" />
      <span className="inline-block overflow-hidden">
        {word2.split("").map((letter, index) => (
          <motion.span
            key={index}
            variants={letterAnimation}
            transition={{ 
              duration: 0.4,
              delay: 0.1 + (word1.length + 1) * 0.05 + index * 0.05,
              ease: [0.215, 0.61, 0.355, 1]
            }}
            className="inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            {letter}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  isZen = false,
  isExperience = false
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  isZen?: boolean;
  isExperience?: boolean;
}) => (
  <motion.div 
    variants={fadeInUp}
    className={`
      p-4 sm:p-6 rounded-xl border transition-all duration-500 ease-out group relative overflow-hidden
      ${isZen 
        ? 'bg-card/50 border-border/50 hover:bg-slate-50 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/20' 
        : isExperience
          ? 'bg-card/50 border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10'
          : 'bg-card/50 border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
      }
    `}
  >
    {/* Zen glow effect on hover */}
    {isZen && (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-rose-50/0 to-violet-50/0 group-hover:from-amber-50/80 group-hover:via-rose-50/60 group-hover:to-violet-50/80 transition-all duration-500 -z-10" />
    )}
    
    {/* Experience glow effect */}
    {isExperience && (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500 -z-10" />
    )}
    
    <div className={`
      w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 relative
      ${isZen 
        ? 'bg-primary/10 group-hover:bg-gradient-to-br group-hover:from-amber-100 group-hover:to-rose-100' 
        : isExperience
          ? 'bg-primary/10'
          : 'bg-primary/10'
      }
    `}>
      {/* Pulsing glow ring for experience cards */}
      {isExperience && (
        <div className="absolute inset-0 rounded-lg bg-primary/20 animate-pulse" />
      )}
      <Icon className={`
        w-6 h-6 transition-all duration-500 relative z-10
        ${isZen 
          ? 'text-primary group-hover:text-amber-600' 
          : isExperience
            ? 'text-primary group-hover:scale-110'
            : 'text-primary'
        }
      `} />
    </div>
    
    <h3 className={`
      text-lg font-semibold mb-2 transition-colors duration-500
      ${isZen 
        ? 'text-foreground group-hover:text-slate-800' 
        : 'text-foreground'
      }
    `}>
      {title}
    </h3>
    
    <p className={`
      text-sm leading-relaxed transition-colors duration-500
      ${isZen 
        ? 'text-muted-foreground group-hover:text-slate-600' 
        : 'text-muted-foreground'
      }
    `}>
      {description}
    </p>
    
    {/* Zen symbol hint */}
    {isZen && (
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-amber-400 text-lg">✧</span>
      </div>
    )}
    
    {/* Experience tech symbol */}
    {isExperience && (
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-primary text-sm font-mono">⚡</span>
      </div>
    )}
  </motion.div>
);

const BenefitItem = ({ text }: { text: string }) => (
  <motion.div variants={fadeInUp} className="flex items-center gap-3">
    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
    <span className="text-muted-foreground">{text}</span>
  </motion.div>
);

export default function Landing() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden scroll-smooth">
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#hero" className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <span className="font-bold text-base sm:text-lg text-foreground">MindMate</span>
            </a>
          </div>
          
          {/* Anchor Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Benefits
            </a>
            <a href="#cta" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Começar
            </a>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">Entrar</Button>
            </Link>
            <Link to="/" className="hidden sm:block">
              <Button size="sm" className="gap-2">
                Começar Grátis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/" className="sm:hidden">
              <Button size="sm" className="px-3">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Terminal Style */}
      <section id="hero" className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              100% Gratuito & Open Source
            </span>
          </motion.div>
          
          <AnimatedTagline />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-2"
          >
            MindMate combina produtividade e introspecção em um único app. 
            Capture tarefas, cultive hábitos, e reflita sobre sua jornada.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Começar Agora
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 w-full sm:w-auto"
              onClick={() => setDemoOpen(true)}
            >
              <Play className="w-4 h-4" />
              Ver Demo
            </Button>
            <Link to="/install">
              <Button size="lg" variant="ghost" className="gap-2 w-full sm:w-auto">
                <Smartphone className="w-4 h-4" />
                Instalar App
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Atom Sovereignty Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
              Os 3 Pilares da Soberania Atom
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-14 px-2 leading-relaxed">
              Em uma era de algoritmos que tentam nos confundir, o Atom Engine é sua âncora de clareza. 
              <span className="text-foreground font-medium"> Gratuito, transparente e desenhado para devolver o controle a você.</span>
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Pilar 1 - Internet Passiva */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="p-6 rounded-xl bg-card/50 border border-border/50 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Internet Passiva
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nós não lutamos pela sua atenção. O Atom é uma ferramenta silenciosa que espera pelo seu comando. 
                <span className="text-foreground/80"> Sem feeds infinitos, sem sugestões algorítmicas opacas.</span> Apenas a estrutura que você criou.
              </p>
            </motion.div>

            {/* Pilar 2 - Estrutura Universal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 rounded-xl bg-card/50 border border-border/50 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Estrutura Universal
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Capture tudo, em qualquer lugar. O Atom padroniza o caos da vida em um formato que você controla. 
                <span className="text-foreground/80"> Se amanhã você quiser mover tudo para outro lugar, seus dados estão estruturados e prontos.</span> A lógica é sua.
              </p>
            </motion.div>

            {/* Pilar 3 - Transparência Radical */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="p-6 rounded-xl bg-card/50 border border-border/50 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Transparência Radical
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Não confie em "mágica". <span className="text-foreground/80">Confie em lógica.</span> Nosso código é aberto para que você saiba 
                exatamente como suas informações são processadas. Sem custos ocultos, sem venda de dados.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agnostic System Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
              Seu Sistema Operacional. <span className="text-primary">Agnóstico. Timeless.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-4 px-2 leading-relaxed">
              A tecnologia muda. A necessidade de clareza não. O Atom Engine é a camada de organização 
              fundamental que sobrevive às tendências. <span className="text-foreground font-medium">Conecte a IA que você quiser, 
              armazene onde preferir.</span> Nós garantimos a estrutura.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-xl mx-auto px-2 italic">
              Não somos "mais uma IA". Somos a lógica que governa o caos. O Atom Engine funciona hoje 
              e funcionará daqui a 10 anos.
            </p>
          </motion.div>

          {/* Plug & Play Visual */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-14">
            {/* Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="p-6 rounded-xl bg-primary/5 border-2 border-primary/30 text-center relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                NÚCLEO
              </div>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2">
                <Cpu className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Atom Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Estável, Lógico, Regrado. Parsing via Tokens, Rituais, Contexto Hierárquico.
              </p>
            </motion.div>

            {/* Intelligence Slot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 rounded-xl bg-card border border-dashed border-border text-center relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                OPCIONAL
              </div>
              <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 mt-2">
                <Brain className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Slot de Inteligência</h3>
              <p className="text-xs text-primary mb-2">"Conecte sua Mente"</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Insira sua API Key (OpenAI, Claude, Gemini) para turbinar o parsing.
              </p>
            </motion.div>

            {/* Memory Slot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="p-6 rounded-xl bg-card border border-dashed border-border text-center relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                OPCIONAL
              </div>
              <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 mt-2">
                <Database className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Slot de Memória</h3>
              <p className="text-xs text-primary mb-2">"Conecte seu Arquivo"</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sincronize com Notion, Obsidian, Todoist ou onde preferir.
              </p>
            </motion.div>
          </div>

          {/* Bullet Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid sm:grid-cols-3 gap-4 sm:gap-6"
          >
            <div className="flex gap-3 p-4 rounded-lg bg-background/50">
              <Shuffle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Tech-Agnostic</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hoje você usa GPT-4 e Notion. Amanhã, Claude 5 e uma ferramenta nova. O Atom se adapta.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg bg-background/50">
              <Cog className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Lógica Determinística</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nosso motor segue regras claras (seus Rituais, seus Projetos), não "alucinações" de IA.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg bg-background/50">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Soberania dos Dados</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Você decide quem processa e onde guarda. O Atom é apenas a estrutura.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Terminal Style */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 bg-card/30 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Engines Poderosos
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-2">
              Cada funcionalidade foi projetada para reduzir fricção e maximizar foco.
            </p>
          </motion.div>

          {/* Operational Features */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Produtividade</h3>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              <FeatureCard 
                icon={Inbox}
                title="Inbox Zero"
                description="Capture pensamentos rapidamente e processe depois. Parsing inteligente extrai datas, tags e contexto automaticamente."
              />
              <FeatureCard 
                icon={Target}
                title="Projetos & Milestones"
                description="Organize trabalho em projetos com progresso visual. Milestones marcam conquistas importantes na jornada."
              />
              <FeatureCard 
                icon={Calendar}
                title="Calendário Inteligente"
                description="Visualize timeline de tarefas e hábitos. Drag-and-drop para reagendar. Overdue nunca esquecido."
              />
            </motion.div>
          </div>

          {/* Zen Features */}
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Introspecção</h3>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              <FeatureCard 
                icon={Sunrise}
                title="Rituais Diários"
                description="Manhã, tarde e noite: organize hábitos em rituais. Experiência imersiva para foco total."
                isZen
              />
              <FeatureCard 
                icon={Repeat}
                title="Hábitos & Streaks"
                description="Padrões complexos de repetição. Streaks e heatmaps mostram consistência ao longo do tempo."
                isZen
              />
              <FeatureCard 
                icon={BookOpen}
                title="Journal & Reflexões"
                description="Capture pensamentos, sentimentos e insights. Prompts guiados ajudam quando a página em branco paralisa."
                isZen
              />
            </motion.div>
          </div>
        </div>
      </section>



      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
                Projetado para{" "}
                <span className="text-primary">power users</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                Navegação por teclado, feedback háptico, e zero fricção. 
                Cada interação foi otimizada para velocidade.
              </p>
              
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-3 sm:space-y-4"
              >
                <BenefitItem text="Atalhos globais (⌘H, ⌘I, ⌘P, ⌘J...)" />
                <BenefitItem text="Command Palette para acesso rápido" />
                <BenefitItem text="Drag-and-drop com feedback visual" />
                <BenefitItem text="Funciona 100% offline" />
                <BenefitItem text="PWA instalável em qualquer dispositivo" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card/50 rounded-2xl border border-border/50 p-4 sm:p-6"
            >
              <div className="font-mono text-xs sm:text-sm space-y-2">
                <div className="text-muted-foreground">
                  <span className="text-primary">$</span> mindmate --status
                </div>
                <div className="text-muted-foreground/70 pl-4">
                  ✓ Inbox: 0 items pendentes
                </div>
                <div className="text-muted-foreground/70 pl-4">
                  ✓ Ritual: Aurora completo
                </div>
                <div className="text-muted-foreground/70 pl-4">
                  ✓ Streak: 12 dias consecutivos
                </div>
                <div className="text-muted-foreground/70 pl-4">
                  ✓ Foco: 3 tasks prioritárias
                </div>
                <div className="mt-4 text-primary">
                  <span className="text-muted-foreground">$</span> _
                  <span className="animate-pulse">▌</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Experiência Section */}
          <div className="mt-12 sm:mt-16">
            <div className="flex items-center gap-2 mb-4 sm:mb-6 justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Experiência</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <FeatureCard
                icon={WifiOff}
                title="Offline First"
                description="Funciona sem internet. Sincroniza automaticamente quando você voltar online."
                isExperience
              />
              <FeatureCard
                icon={Keyboard}
                title="Keyboard Shortcuts"
                description="Navegue sem mouse. Atalhos globais para máxima produtividade."
                isExperience
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center gap-2 justify-center mb-4">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Perguntas Frequentes
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="item-1" className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                  O MindMate é gratuito?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Sim, 100% gratuito e open source!</strong> Todas as 
                  funcionalidades estão disponíveis para todos, sem limitações. Se você vê valor e pode 
                  contribuir, aceitamos doações — mas se não puder, sem problema nenhum. 
                  <span className="text-foreground font-medium"> MindMate é para todos.</span> Acreditamos 
                  que ferramentas de bem-estar e produtividade devem ser acessíveis, independentemente da 
                  sua situação financeira.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                  Posso usar offline?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Sim! O MindMate funciona como um PWA (Progressive Web App) com suporte completo a offline. 
                  Suas alterações são sincronizadas automaticamente quando você volta a ficar online.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                  Meus dados ficam seguros?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Absolutamente. Seus dados são armazenados de forma segura com criptografia e políticas 
                  de acesso rigorosas. Apenas você pode acessar suas informações pessoais.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                  Como funcionam os Rituais?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Rituais são momentos dedicados aos seus hábitos diários, divididos em três períodos: 
                  Aurora (manhã), Zênite (meio-dia) e Crepúsculo (noite). Cada período tem uma experiência 
                  visual única para ajudar você a focar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                  Posso instalar no celular?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Sim! O MindMate pode ser instalado como app nativo em iOS, Android e Desktop. 
                  Basta acessar o menu do navegador e selecionar "Adicionar à tela inicial" ou usar 
                  nosso guia de instalação.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                  O que são os atalhos de teclado?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  O MindMate foi projetado para usuários avançados. Pressione ⌘? (ou Ctrl+?) para ver 
                  todos os atalhos disponíveis, como ⌘H para Home, ⌘N para nova tarefa, e muito mais.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-t from-primary/5 to-transparent scroll-mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Pronto para organizar sua mente?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
            Gratuito para todos. Open source. Doe se puder, use mesmo se não puder.
          </p>
          
          <Link to="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span className="font-semibold text-foreground/80">MindMate</span>
            <span className="text-muted-foreground text-sm">v4.0.0</span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link to="/install" className="hover:text-foreground transition-colors">
              Instalar App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
