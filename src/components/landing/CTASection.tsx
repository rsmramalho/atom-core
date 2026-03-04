import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
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
        
        <Link to="/app">
          <Button size="lg" className="gap-2 w-full sm:w-auto">
            Criar Conta Grátis
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
