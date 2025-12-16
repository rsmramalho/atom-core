// Keyboard Shortcuts Help Modal
// Shows all available keyboard shortcuts

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useOnboarding } from "@/components/onboarding";

const shortcuts = [
  { keys: ["⌘", "K"], description: "Abrir Command Palette" },
  { keys: ["⌘", "H"], description: "Ir para Home" },
  { keys: ["⌘", "I"], description: "Ir para Inbox" },
  { keys: ["⌘", "P"], description: "Ir para Projetos" },
  { keys: ["⌘", "L"], description: "Abrir Calendário" },
  { keys: ["⌘", "J"], description: "Abrir Diário" },
  { keys: ["⌘", "N"], description: "Novo Item" },
  { keys: ["⌘", "R"], description: "Entrar no Ritual" },
  { keys: ["Ctrl", "⇧", "E"], description: "Debug Console" },
];

const calendarShortcuts = [
  { keys: ["M"], description: "Visualização Mensal" },
  { keys: ["W"], description: "Visualização Semanal" },
  { keys: ["←"], description: "Período Anterior" },
  { keys: ["→"], description: "Próximo Período" },
  { keys: ["T"], description: "Ir para Hoje" },
  { keys: ["👆"], description: "Swipe ← → (mobile)" },
];

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const { resetOnboarding } = useOnboarding();

  const handleRestartTour = () => {
    setOpen(false);
    resetOnboarding();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed bottom-4 right-4 z-40 h-10 w-10 rounded-full bg-muted/80 backdrop-blur-sm shadow-lg hover:bg-muted md:bottom-6 md:right-6"
            >
              <Keyboard className="h-5 w-5" />
              <span className="sr-only">Atalhos de teclado</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Atalhos de teclado</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Atalhos de Teclado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Navegação</p>
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-border bg-background px-1.5 text-xs font-medium text-foreground shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
          
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-2">Calendário</p>
          {calendarShortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-border bg-background px-1.5 text-xs font-medium text-foreground shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRestartTour}
            className="w-full gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar Tour Guiado
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            No Windows/Linux, use <kbd className="rounded border px-1">Ctrl</kbd> ao invés de <kbd className="rounded border px-1">⌘</kbd>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
