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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-foreground mb-6 leading-[0.9] tracking-tight"
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
      <span className="inline-block mx-3" />
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
      p-6 rounded-xl border transition-all duration-500 ease-out group relative overflow-hidden
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
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground">MindMate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/">
              <Button size="sm" className="gap-2">
                Começar Grátis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Terminal Style */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Atom Engine v4.0
            </span>
          </motion.div>
          
          <AnimatedTagline />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            MindMate combina produtividade e introspecção em um único app. 
            Capture tarefas, cultive hábitos, e reflita sobre sua jornada.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Começar Agora
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/install">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Smartphone className="w-4 h-4" />
                Instalar App
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Terminal Style */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Engines Poderosos
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Cada funcionalidade foi projetada para reduzir fricção e maximizar foco.
            </p>
          </motion.div>

          {/* Operational Features */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Produtividade</h3>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Introspecção</h3>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
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
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Projetado para{" "}
                <span className="text-primary">power users</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Navegação por teclado, feedback háptico, e zero fricção. 
                Cada interação foi otimizada para velocidade.
              </p>
              
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-4"
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
              className="bg-card/50 rounded-2xl border border-border/50 p-6"
            >
              <div className="font-mono text-sm space-y-2">
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

          {/* Experiência Section */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Experiência</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
        </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-t from-primary/5 to-transparent">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para organizar sua mente?
          </h2>
          <p className="text-muted-foreground mb-8">
            Comece gratuitamente. Sem cartão de crédito.
          </p>
          
          <Link to="/">
            <Button size="lg" className="gap-2">
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span className="font-semibold text-foreground/80">MindMate</span>
            <span className="text-muted-foreground text-sm">v4.0.0</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
