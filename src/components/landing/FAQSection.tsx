import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "O MindMate é gratuito?",
    answer: '<strong class="text-foreground">Sim, 100% gratuito e open source!</strong> Todas as funcionalidades estão disponíveis para todos, sem limitações. Se você vê valor e pode contribuir, aceitamos doações — mas se não puder, sem problema nenhum. <span class="text-foreground font-medium"> MindMate é para todos.</span> Acreditamos que ferramentas de bem-estar e produtividade devem ser acessíveis, independentemente da sua situação financeira.',
  },
  {
    question: "Posso usar offline?",
    answer: "Sim! O MindMate funciona como um PWA (Progressive Web App) com suporte completo a offline. Suas alterações são sincronizadas automaticamente quando você volta a ficar online.",
  },
  {
    question: "Meus dados ficam seguros?",
    answer: "Absolutamente. Seus dados são armazenados de forma segura com criptografia e políticas de acesso rigorosas. Apenas você pode acessar suas informações pessoais.",
  },
  {
    question: "Como funcionam os Rituais?",
    answer: "Rituais são momentos dedicados aos seus hábitos diários, divididos em três períodos: Aurora (manhã), Zênite (meio-dia) e Crepúsculo (noite). Cada período tem uma experiência visual única para ajudar você a focar.",
  },
  {
    question: "Posso instalar no celular?",
    answer: 'Sim! O MindMate pode ser instalado como app nativo em iOS, Android e Desktop. Basta acessar o menu do navegador e selecionar "Adicionar à tela inicial" ou usar nosso guia de instalação.',
  },
  {
    question: "O que são os atalhos de teclado?",
    answer: "O MindMate foi projetado para usuários avançados. Pressione ⌘? (ou Ctrl+?) para ver todos os atalhos disponíveis, como ⌘H para Home, ⌘N para nova tarefa, e muito mais.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-12 sm:py-20 px-4 sm:px-6 bg-primary/5 scroll-mt-16 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i + 1}`} className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  <span dangerouslySetInnerHTML={{ __html: item.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
