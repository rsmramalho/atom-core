import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Monitor, 
  Apple, 
  Share, 
  PlusSquare, 
  MoreVertical,
  Download,
  Check,
  ArrowRight,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

type Platform = "ios" | "android" | "desktop";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const iosSteps: Step[] = [
  {
    icon: <Share className="h-6 w-6" />,
    title: "Toque em Compartilhar",
    description: "No Safari, toque no ícone de compartilhar (quadrado com seta para cima) na barra inferior."
  },
  {
    icon: <PlusSquare className="h-6 w-6" />,
    title: "Adicionar à Tela de Início",
    description: "Role o menu e toque em \"Adicionar à Tela de Início\"."
  },
  {
    icon: <Check className="h-6 w-6" />,
    title: "Confirme a Instalação",
    description: "Confirme o nome do app e toque em \"Adicionar\" no canto superior direito."
  }
];

const androidSteps: Step[] = [
  {
    icon: <MoreVertical className="h-6 w-6" />,
    title: "Abra o Menu",
    description: "No Chrome, toque no ícone de três pontos (⋮) no canto superior direito."
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Instalar Aplicativo",
    description: "Toque em \"Instalar aplicativo\" ou \"Adicionar à tela inicial\"."
  },
  {
    icon: <Check className="h-6 w-6" />,
    title: "Confirme",
    description: "Toque em \"Instalar\" no popup de confirmação."
  }
];

const desktopSteps: Step[] = [
  {
    icon: <Monitor className="h-6 w-6" />,
    title: "Acesse pelo Chrome ou Edge",
    description: "Abra o MindMate no navegador Chrome ou Microsoft Edge."
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Clique no Ícone de Instalação",
    description: "Na barra de endereço, clique no ícone de instalação (⊕) ou no menu → \"Instalar MindMate\"."
  },
  {
    icon: <Check className="h-6 w-6" />,
    title: "Confirme",
    description: "Clique em \"Instalar\" na janela de confirmação."
  }
];

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {step.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Passo {index + 1}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PlatformIcon({ platform }: { platform: Platform }) {
  switch (platform) {
    case "ios":
      return <Apple className="h-5 w-5" />;
    case "android":
      return <Smartphone className="h-5 w-5" />;
    case "desktop":
      return <Monitor className="h-5 w-5" />;
  }
}

export default function Install() {
  const [platform, setPlatform] = useState<Platform>("ios");

  const steps = {
    ios: iosSteps,
    android: androidSteps,
    desktop: desktopSteps
  };

  const platformNames = {
    ios: "iPhone/iPad",
    android: "Android",
    desktop: "Computador"
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Instalar MindMate
          </h1>
          <p className="text-muted-foreground">
            Instale o app no seu dispositivo para acesso rápido, funcionar offline e receber notificações.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: "⚡", label: "Acesso Rápido" },
            { icon: "📴", label: "Funciona Offline" },
            { icon: "🔔", label: "Notificações" }
          ].map((benefit, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50"
            >
              <span className="text-2xl">{benefit.icon}</span>
              <span className="text-xs text-muted-foreground text-center">
                {benefit.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Platform Tabs */}
        <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="ios" className="gap-2">
              <PlatformIcon platform="ios" />
              <span className="hidden sm:inline">iPhone</span>
            </TabsTrigger>
            <TabsTrigger value="android" className="gap-2">
              <PlatformIcon platform="android" />
              <span className="hidden sm:inline">Android</span>
            </TabsTrigger>
            <TabsTrigger value="desktop" className="gap-2">
              <PlatformIcon platform="desktop" />
              <span className="hidden sm:inline">Desktop</span>
            </TabsTrigger>
          </TabsList>

          {(["ios", "android", "desktop"] as Platform[]).map((p) => (
            <TabsContent key={p} value={p} className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <PlatformIcon platform={p} />
                <h2 className="font-semibold text-foreground">
                  {platformNames[p]}
                </h2>
              </div>
              {steps[p].map((step, index) => (
                <StepCard key={index} step={step} index={index} />
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* iOS Safari Note */}
        {platform === "ios" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-sm text-amber-200">
              <strong>Importante:</strong> No iPhone/iPad, use o Safari para instalar. 
              Outros navegadores como Chrome não suportam instalação de PWA no iOS.
            </p>
          </motion.div>
        )}

        {/* After Installation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Após a Instalação
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
              O app abrirá em tela cheia, sem barra do navegador
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
              Seus dados serão sincronizados automaticamente
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
              Funciona offline - alterações são sincronizadas quando voltar online
            </li>
          </ul>
        </motion.div>

        {/* Back to App */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Voltar ao App
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
