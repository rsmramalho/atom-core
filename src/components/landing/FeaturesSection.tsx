import { motion } from "framer-motion";
import { Inbox, Target, Calendar, Sunrise, Repeat, BookOpen, Sparkles } from "lucide-react";
import { FeatureCard } from "./shared";

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 bg-primary/5 scroll-mt-16">
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
            <FeatureCard icon={Inbox} title="Inbox Zero" description="Capture pensamentos rapidamente e processe depois. Parsing inteligente extrai datas, tags e contexto automaticamente." />
            <FeatureCard icon={Target} title="Projetos & Milestones" description="Organize trabalho em projetos com progresso visual. Milestones marcam conquistas importantes na jornada." />
            <FeatureCard icon={Calendar} title="Calendário Inteligente" description="Visualize timeline de tarefas e hábitos. Drag-and-drop para reagendar. Overdue nunca esquecido." />
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
            <FeatureCard icon={Sunrise} title="Rituais Diários" description="Manhã, tarde e noite: organize hábitos em rituais. Experiência imersiva para foco total." isZen />
            <FeatureCard icon={Repeat} title="Hábitos & Streaks" description="Padrões complexos de repetição. Streaks e heatmaps mostram consistência ao longo do tempo." isZen />
            <FeatureCard icon={BookOpen} title="Journal & Reflexões" description="Capture pensamentos, sentimentos e insights. Prompts guiados ajudam quando a página em branco paralisa." isZen />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
