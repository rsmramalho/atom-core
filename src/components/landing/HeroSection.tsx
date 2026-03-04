import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface HeroSectionProps {
  onDemoOpen: () => void;
}

export function HeroSection({ onDemoOpen }: HeroSectionProps) {
  return (
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
          <Link to="/app">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 w-full sm:w-auto"
            onClick={onDemoOpen}
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
  );
}
