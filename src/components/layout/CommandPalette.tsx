// Global Command Palette (CMD+K)
// Power user navigation, actions, and global search across all items

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
  Sunrise,
  Terminal,
  LogOut,
  BookOpen,
  Calendar,
  ListChecks,
  CheckSquare,
  Repeat,
  StickyNote,
  Lightbulb,
  Link,
  Hash,
  Tag,
} from "lucide-react";
import { useAtomItems } from "@/hooks/useAtomItems";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModuleBadge } from "@/components/shared/ModuleBadge";
import type { AtomItem, ItemType } from "@/types/atom-engine";
import { Badge } from "@/components/ui/badge";

interface CommandPaletteProps {
  onNewItem?: () => void;
}

const TYPE_ICON: Record<ItemType, typeof CheckSquare> = {
  task: CheckSquare,
  habit: Repeat,
  note: StickyNote,
  reflection: Lightbulb,
  resource: Link,
  project: FolderKanban,
  list: ListChecks,
};

const TYPE_LABEL: Record<ItemType, string> = {
  task: "Tarefa",
  habit: "Hábito",
  note: "Nota",
  reflection: "Reflexão",
  resource: "Recurso",
  project: "Projeto",
  list: "Lista",
};

function getItemRoute(item: AtomItem): string {
  switch (item.type) {
    case "project":
      return `/projects/${item.id}`;
    case "list":
      return "/lists";
    case "reflection":
      return "/journal";
    case "habit":
      return item.ritual_slot ? "/ritual" : item.project_id ? `/projects/${item.project_id}` : "/inbox";
    default:
      return item.project_id ? `/projects/${item.project_id}` : "/inbox";
  }
}

const MAX_SEARCH_RESULTS = 15;

export function CommandPalette({ onNewItem }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { items } = useAtomItems();

  // Separate items by type for grouped display
  const projects = useMemo(() => {
    return items.filter(item => item.type === "project" && item.project_status !== "archived");
  }, [items]);

  const lists = useMemo(() => {
    return items.filter(item => item.type === "list");
  }, [items]);

  // Searchable items: everything except projects and lists (shown in their own groups)
  const searchableItems = useMemo(() => {
    return items.filter(item => item.type !== "project" && item.type !== "list");
  }, [items]);

  // All unique tags for tag search
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach(item => {
      (item.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [items]);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        return;
      }

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
      <CommandInput placeholder="Buscar itens, projetos, tags, ações..." />
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
                value={`projeto ${project.title} ${(project.tags || []).join(" ")}`}
                onSelect={() => runCommand(() => navigate(`/projects/${project.id}`))}
                className="flex items-center gap-2"
              >
                <FolderKanban className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{project.title}</span>
                {project.module && (
                  <ModuleBadge module={project.module} size="sm" showIcon={false} />
                )}
                {(project.tags || []).length > 0 && (
                  <div className="flex gap-1">
                    {project.tags!.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-4">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
                  value={`lista ${list.title} ${(list.tags || []).join(" ")}`}
                  onSelect={() => runCommand(() => navigate("/lists"))}
                  className="flex items-center gap-2"
                >
                  <ListChecks className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 truncate">{list.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* All Items Search */}
        {searchableItems.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Itens">
              {searchableItems.slice(0, MAX_SEARCH_RESULTS).map((item) => {
                const Icon = TYPE_ICON[item.type];
                return (
                  <CommandItem
                    key={item.id}
                    value={`${TYPE_LABEL[item.type]} ${item.title} ${(item.tags || []).join(" ")} ${item.module || ""}`}
                    onSelect={() => runCommand(() => navigate(getItemRoute(item)))}
                    className="flex items-center gap-2"
                  >
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 truncate">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {TYPE_LABEL[item.type]}
                    </span>
                    {item.completed && (
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 shrink-0">
                        ✓
                      </Badge>
                    )}
                    {(item.tags || []).length > 0 && (
                      <div className="flex gap-1 shrink-0">
                        {item.tags!.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-4">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}

        {/* Tags Search */}
        {allTags.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Tags">
              {allTags.slice(0, 10).map(tag => {
                const count = items.filter(i => (i.tags || []).includes(tag)).length;
                return (
                  <CommandItem
                    key={tag}
                    value={`tag ${tag}`}
                    onSelect={() => runCommand(() => {
                      navigate("/inbox");
                      toast.info(`Filtrando por tag: ${tag}`);
                    })}
                    className="flex items-center gap-2"
                  >
                    <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{tag}</span>
                    <span className="text-xs text-muted-foreground">{count} {count === 1 ? "item" : "itens"}</span>
                  </CommandItem>
                );
              })}
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
