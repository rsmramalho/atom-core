import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Inbox, 
  Target, 
  Calendar, 
  Sunrise, 
  Repeat, 
  BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DemoSlide {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
}

const slides: DemoSlide[] = [
  {
    id: 1,
    title: "Inbox Zero",
    description: "Capture pensamentos rapidamente e processe depois",
    icon: Inbox,
    color: "from-primary/20 to-primary/5",
    features: [
      "Parsing inteligente extrai datas e tags",
      "Tokens como @hoje, @amanha detectados",
      "Organize quando tiver tempo"
    ]
  },
  {
    id: 2,
    title: "Projetos & Milestones",
    description: "Organize trabalho em projetos com progresso visual",
    icon: Target,
    color: "from-blue-500/20 to-blue-500/5",
    features: [
      "Progresso calculado automaticamente",
      "Milestones marcam conquistas",
      "Três modos de progresso"
    ]
  },
  {
    id: 3,
    title: "Calendário Inteligente",
    description: "Visualize timeline de tarefas e hábitos",
    icon: Calendar,
    color: "from-violet-500/20 to-violet-500/5",
    features: [
      "Drag-and-drop para reagendar",
      "Seção de overdue sempre visível",
      "Visualização mensal e semanal"
    ]
  },
  {
    id: 4,
    title: "Rituais Diários",
    description: "Manhã, tarde e noite: organize hábitos em rituais",
    icon: Sunrise,
    color: "from-amber-500/20 to-amber-500/5",
    features: [
      "Experiência imersiva fullscreen",
      "Check-in com reflexão guiada",
      "Períodos Aurora, Zênite, Crepúsculo"
    ]
  },
  {
    id: 5,
    title: "Hábitos & Streaks",
    description: "Construa consistência com tracking visual",
    icon: Repeat,
    color: "from-green-500/20 to-green-500/5",
    features: [
      "Streaks calculados automaticamente",
      "Heatmap de 90+ dias de histórico",
      "Padrões complexos de repetição"
    ]
  },
  {
    id: 6,
    title: "Journal & Reflexões",
    description: "Capture pensamentos, sentimentos e insights",
    icon: BookOpen,
    color: "from-rose-500/20 to-rose-500/5",
    features: [
      "Prompts guiados por categoria",
      "Exportação em Markdown/JSON/PDF",
      "Busca full-text com filtros"
    ]
  }
];

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-card border-border/50">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Descubra o MindMate
            </DialogTitle>
            <span className="text-xs text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </DialogHeader>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-6"
            >
              {/* Icon & Title */}
              <div className={`rounded-xl bg-gradient-to-br ${slide.color} p-6 sm:p-8 mb-4 sm:mb-6`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {slide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {slide.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5 pb-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? "bg-primary w-6" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 sm:p-6 pt-0 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          {currentSlide === slides.length - 1 ? (
            <Button size="sm" onClick={() => onOpenChange(false)}>
              Começar Agora
            </Button>
          ) : (
            <Button size="sm" onClick={nextSlide} className="gap-1">
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}