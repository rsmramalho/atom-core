import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const FeatureCard = ({ 
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
      p-4 sm:p-6 rounded-xl border transition-all duration-500 ease-out group relative overflow-hidden shadow-lg shadow-black/20
      ${isZen 
        ? 'bg-card border-border/50 hover:bg-slate-50 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/20' 
        : isExperience
          ? 'bg-card border-border/50 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10'
          : 'bg-card border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'
      }
    `}
  >
    {isZen && (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-rose-50/0 to-violet-50/0 group-hover:from-amber-50/80 group-hover:via-rose-50/60 group-hover:to-violet-50/80 transition-all duration-500 -z-10" />
    )}
    {isExperience && (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500 -z-10" />
    )}
    
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 relative ${
      isZen ? 'bg-primary/10 group-hover:bg-gradient-to-br group-hover:from-amber-100 group-hover:to-rose-100' : 'bg-primary/10'
    }`}>
      {isExperience && <div className="absolute inset-0 rounded-lg bg-primary/20 animate-pulse" />}
      <Icon className={`w-6 h-6 transition-all duration-500 relative z-10 ${
        isZen ? 'text-primary group-hover:text-amber-600' : isExperience ? 'text-primary group-hover:scale-110' : 'text-primary'
      }`} />
    </div>
    
    <h3 className={`text-lg font-semibold mb-2 transition-colors duration-500 ${
      isZen ? 'text-foreground group-hover:text-slate-800' : 'text-foreground'
    }`}>{title}</h3>
    
    <p className={`text-sm leading-relaxed transition-colors duration-500 ${
      isZen ? 'text-muted-foreground group-hover:text-slate-600' : 'text-muted-foreground'
    }`}>{description}</p>
    
    {isZen && (
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-amber-400 text-lg">✧</span>
      </div>
    )}
    {isExperience && (
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-primary text-sm font-mono">⚡</span>
      </div>
    )}
  </motion.div>
);

export const BenefitItem = ({ text }: { text: string }) => (
  <motion.div variants={fadeInUp} className="flex items-center gap-3">
    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
    <span className="text-muted-foreground">{text}</span>
  </motion.div>
);
