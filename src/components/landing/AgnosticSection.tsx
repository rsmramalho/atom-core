import { motion } from "framer-motion";
import { Cpu, Brain, Database, Shuffle, Cog, Shield } from "lucide-react";

export function AgnosticSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
            <p className="text-xs text-primary mb-2">"A Lógica Central"</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Estável, Lógico, Regrado. Parsing via Tokens, Rituais, Contexto Hierárquico.
            </p>
          </motion.div>

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
          {[
            { icon: Shuffle, title: "Tech-Agnostic", desc: "Hoje você usa GPT-4 e Notion. Amanhã, Claude 5 e uma ferramenta nova. O Atom se adapta." },
            { icon: Cog, title: "Lógica Determinística", desc: "Nosso motor segue regras claras (seus Rituais, seus Projetos), não \"alucinações\" de IA." },
            { icon: Shield, title: "Soberania dos Dados", desc: "Você decide quem processa e onde guarda. O Atom é apenas a estrutura." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-4 rounded-lg bg-background/50">
              <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
