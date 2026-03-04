import { motion } from "framer-motion";
import { Code, Table2, GitFork, Layers, Heart } from "lucide-react";

const cards = [
  { icon: Table2, title: "Single Table", desc: 'Uma tabela <code class="text-xs bg-muted px-1 py-0.5 rounded">items</code> governa tudo. Schema minimalista, queries simples, manutenção zero.', delay: 0.1 },
  { icon: GitFork, title: "Fork-Friendly", desc: "Documentação completa, arquitetura modular. Faça fork e construa sua própria versão em minutos.", delay: 0.2 },
  { icon: Layers, title: "Stack Moderna", desc: "React + Vite + TypeScript + Supabase + Tailwind. Zero configuração, DX primeiro.", delay: 0.3 },
  { icon: Heart, title: "Open Source", desc: "MIT License. Contribua, aprenda, adapte. Comunidade aberta e PRs bem-vindos.", delay: 0.4 },
];

export function DeveloperSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-2 justify-center mb-4">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Para Desenvolvedores</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Arquitetura que faz sentido
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">
            Construído com as melhores práticas em mente. <span className="text-foreground font-medium">Fork, customize, contribua.</span> O MindMate foi feito para ser entendido e estendido.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.5 }}
              className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all group shadow-lg shadow-black/20 hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: card.desc }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
