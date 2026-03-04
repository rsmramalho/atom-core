import { motion } from "framer-motion";
import { Moon, Layers, Code } from "lucide-react";

export function PillarSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-primary/5 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
          {[
            {
              icon: Moon,
              title: "Internet Passiva",
              description: (
                <>
                  Nós não lutamos pela sua atenção. O Atom é uma ferramenta silenciosa que espera pelo seu comando. 
                  <span className="text-foreground/80"> Sem feeds infinitos, sem sugestões algorítmicas opacas.</span> Apenas a estrutura que você criou.
                </>
              ),
              delay: 0.1,
            },
            {
              icon: Layers,
              title: "Estrutura Universal",
              description: (
                <>
                  Capture tudo, em qualquer lugar. O Atom padroniza o caos da vida em um formato que você controla. 
                  <span className="text-foreground/80"> Se amanhã você quiser mover tudo para outro lugar, seus dados estão estruturados e prontos.</span> A lógica é sua.
                </>
              ),
              delay: 0.2,
            },
            {
              icon: Code,
              title: "Transparência Radical",
              description: (
                <>
                  Não confie em "mágica". <span className="text-foreground/80">Confie em lógica.</span> Nosso código é aberto para que você saiba 
                  exatamente como suas informações são processadas. Sem custos ocultos, sem venda de dados.
                </>
              ),
              delay: 0.3,
            },
          ].map((pillar) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: pillar.delay, duration: 0.5 }}
              className="p-6 rounded-xl bg-card border border-border/50 text-left shadow-lg shadow-black/20 hover:shadow-xl hover:border-primary/20 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <pillar.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
