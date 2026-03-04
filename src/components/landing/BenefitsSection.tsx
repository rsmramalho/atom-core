import { motion } from "framer-motion";
import { WifiOff, Keyboard, Sparkles } from "lucide-react";
import { FeatureCard, BenefitItem } from "./shared";

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export function BenefitsSection() {
  return (
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

          {/* Terminal animation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card/50 rounded-2xl border border-border/50 p-4 sm:p-6"
          >
            <div className="font-mono text-xs sm:text-sm space-y-2">
              <TerminalLine delay={0.3} text="$ mindmate --status" isCommand />
              <TerminalLine delay={0.6} text="✓ Inbox: 0 items pendentes" icon="green" />
              <TerminalLine delay={0.8} text="✓ Ritual: Aurora completo" icon="green" />
              <TerminalLine delay={1.0} text="✓ Streak: 12 dias consecutivos" icon="green" />
              <TerminalLine delay={1.2} text="✓ Foco: 3 tasks prioritárias" icon="green" />

              <TerminalLine delay={1.8} text='$ mindmate add "Revisar projeto @amanha #focus"' isCommand className="mt-4" />
              <TerminalLine delay={2.2} text="→ Parsing: detectado @amanha, #focus" icon="blue" />
              <TerminalLine delay={2.5} text="✓ Task criada com sucesso" icon="green" />

              <TerminalLine delay={3.0} text="$ mindmate ritual --start" isCommand className="mt-4" />
              <TerminalLine delay={3.4} text="☀ Iniciando ritual Aurora..." icon="amber" />
              <TerminalLine delay={3.7} text="✓ 4 hábitos carregados" icon="green" />

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 4.2 }}
                className="mt-4 text-primary"
              >
                <span className="text-muted-foreground">$</span> _
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>▌</motion.span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Experience cards */}
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center gap-2 mb-4 sm:mb-6 justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Experiência</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <FeatureCard icon={WifiOff} title="Offline First" description="Funciona sem internet. Sincroniza automaticamente quando você voltar online." isExperience />
            <FeatureCard icon={Keyboard} title="Keyboard Shortcuts" description="Navegue sem mouse. Atalhos globais para máxima produtividade." isExperience />
          </div>
        </div>
      </div>
    </section>
  );
}

function TerminalLine({ delay, text, isCommand, icon, className }: { 
  delay: number; text: string; isCommand?: boolean; icon?: "green" | "blue" | "amber"; className?: string;
}) {
  const iconColors = { green: "text-green-500", blue: "text-blue-400", amber: "text-amber-400" };
  const iconSymbols = { green: "✓", blue: "→", amber: "☀" };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: isCommand ? 0 : -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`${isCommand ? 'text-muted-foreground' : 'text-muted-foreground/70 pl-4'} ${className || ''}`}
    >
      {isCommand ? (
        <><span className="text-primary">$</span> {text.replace('$ ', '')}</>
      ) : icon ? (
        <><span className={iconColors[icon]}>{iconSymbols[icon]}</span> {text.replace(/^[✓→☀]\s/, '')}</>
      ) : text}
    </motion.div>
  );
}
