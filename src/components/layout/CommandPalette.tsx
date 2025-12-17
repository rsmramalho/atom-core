// Global Command Palette (CMD+K)
// Power user navigation and actions

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Home,
  FolderKanban,
  Inbox,
  Plus,
  Search,
  Sunrise,
  Terminal,
  LogOut,
  BookOpen,
  Calendar,
  ListChecks,
} from "lucide-react";
import { useAtomItems } from "@/hooks/useAtomItems";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModuleBadge } from "@/components/shared/ModuleBadge";

interface CommandPaletteProps {
  onNewItem?: () => void;
}

export function CommandPalette({ onNewItem }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { items } = useAtomItems();

  // Get projects for search
  const projects = useMemo(() => {
    return items.filter(item => item.type === "project" && item.project_status !== "archived");
  }, [items]);

  // Get lists for search
  const lists = useMemo(() => {
    return items.filter(item => item.type === "list");
  }, [items]);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // CMD+K - Toggle Command Palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        return;
      }

      // Only process shortcuts if command palette is closed
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "h":
            e.preventDefault();
            navigate("/app");
            break;
          case "i":
            e.preventDefault();
            navigate("/inbox");
            break;
          case "p":
            e.preventDefault();
            navigate("/projects");
            break;
          case "n":
            e.preventDefault();
            navigate("/inbox");
            setTimeout(() => {
              const input = document.querySelector('input[placeholder*="mente"]') as HTMLInputElement;
              input?.focus();
            }, 100);
            break;
          case "r":
            e.preventDefault();
            navigate("/ritual");
            break;
          case "j":
            e.preventDefault();
            navigate("/journal");
            break;
          case "l":
            if (e.shiftKey) {
              e.preventDefault();
              navigate("/lists");
            } else {
              e.preventDefault();
              navigate("/calendar");
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [navigate]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    navigate("/");
  };

  const openDebug = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'E',
      ctrlKey: true,
      shiftKey: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar ações, projetos, listas..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => runCommand(() => navigate("/app"))}>
            <Home className="mr-2 h-4 w-4" />
            Ir para Home
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/inbox"))}>
            <Inbox className="mr-2 h-4 w-4" />
            Ir para Inbox
            <CommandShortcut>⌘I</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
            <FolderKanban className="mr-2 h-4 w-4" />
            Ir para Projetos
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/lists"))}>
            <ListChecks className="mr-2 h-4 w-4" />
            Ir para Listas
            <CommandShortcut>⌘⇧L</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/ritual"))}>
            <Sunrise className="mr-2 h-4 w-4" />
            Entrar no Ritual
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/journal"))}>
            <BookOpen className="mr-2 h-4 w-4" />
            Abrir Diário
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/calendar"))}>
            <Calendar className="mr-2 h-4 w-4" />
            Abrir Calendário
            <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Actions */}
        <CommandGroup heading="Ações">
          <CommandItem onSelect={() => runCommand(() => {
            navigate("/inbox");
            // Small delay to ensure navigation completes before focusing input
            setTimeout(() => {
              const input = document.querySelector('input[placeholder*="mente"]') as HTMLInputElement;
              input?.focus();
            }, 100);
          })}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Item
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Projects Search */}
        {projects.length > 0 && (
          <CommandGroup heading="Projetos">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => runCommand(() => navigate(`/projects/${project.id}`))}
                className="flex items-center gap-2"
              >
                <FolderKanban className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{project.title}</span>
                {project.module && (
                  <ModuleBadge module={project.module} size="sm" showIcon={false} />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Lists Search */}
        {lists.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Listas">
              {lists.map((list) => (
                <CommandItem
                  key={list.id}
                  onSelect={() => runCommand(() => navigate("/lists"))}
                  className="flex items-center gap-2"
                >
                  <ListChecks className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{list.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        {/* System */}
        <CommandGroup heading="Sistema">
          <CommandItem onSelect={() => runCommand(openDebug)}>
            <Terminal className="mr-2 h-4 w-4" />
            Debug Console
            <CommandShortcut>⌃⇧E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(handleLogout)}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
