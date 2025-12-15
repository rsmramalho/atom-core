import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAtomItems } from "@/hooks/useAtomItems";
import { useEngineLogger } from "@/hooks/useEngineLogger";
import { parseInput } from "@/lib/parsing-engine";
import { EngineDebugConsole } from "@/components/EngineDebugConsole";
import { useDebugConsole } from "@/hooks/useDebugConsole";
import { InboxItemCard } from "@/components/inbox/InboxItemCard";
import { MacroPickerModal } from "@/components/inbox/MacroPickerModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Inbox as InboxIcon, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AtomItem } from "@/types/atom-engine";

export default function Inbox() {
  const navigate = useNavigate();
  const { isOpen } = useDebugConsole();
  const { toast } = useToast();
  const { items, isLoading, createItem, updateItem } = useAtomItems();
  const { addLog } = useEngineLogger();
  
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AtomItem | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get inbox items (items with #inbox tag)
  const inboxItems = items.filter(item => 
    item.tags.some(tag => tag.toLowerCase() === "#inbox")
  );

  // Get projects for the MacroPicker
  const projects = items.filter(item => item.type === "project");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleCapture = async () => {
    if (!inputValue.trim() || !user) return;
    
    setIsCreating(true);
    addLog("InboxEngine", "capture_start", { raw_input: inputValue });
    
    try {
      const parsed = parseInput(inputValue);
      addLog("ParsingEngine", "parsed_input", { parsed });
      
      // Ensure #inbox tag is present
      const tags = parsed.tags.includes("#inbox") 
        ? parsed.tags 
        : [...parsed.tags, "#inbox"];
      
      await createItem({
        title: parsed.title,
        type: parsed.type,
        tags,
        due_date: parsed.due_date,
        ritual_slot: parsed.ritual_slot,
        module: parsed.module,
        parent_id: null,
        project_id: null,
        recurrence_rule: null,
        completed: false,
        completed_at: null,
        notes: null,
        checklist: [],
        project_status: null,
        progress_mode: null,
        progress: null,
        deadline: null,
        milestones: [],
      });
      
      addLog("InboxEngine", "item_captured", { title: parsed.title, tags });
      setInputValue("");
      toast({
        title: "Capturado!",
        description: `"${parsed.title}" adicionado ao Inbox.`,
      });
    } catch (error) {
      addLog("InboxEngine", "capture_error", { error });
      toast({
        title: "Erro",
        description: "Falha ao capturar item.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCapture();
    }
  };

  const handleProcess = (item: AtomItem) => {
    setSelectedItem(item);
    setIsPickerOpen(true);
    addLog("MacroPicker", "opened", { item_id: item.id, title: item.title });
  };

  const handlePromote = async (
    itemId: string, 
    projectId: string, 
    projectName: string, 
    newType: AtomItem["type"]
  ) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    addLog("MacroPicker", "promoting_item", { 
      item_id: itemId, 
      project_id: projectId,
      new_type: newType 
    });

    try {
      // Remove #inbox, add #macro:ProjectName
      const updatedTags = item.tags
        .filter(t => t.toLowerCase() !== "#inbox")
        .concat([`#macro:${projectName.replace(/\s+/g, "_")}`]);

      await updateItem({
        id: itemId,
        type: newType,
        project_id: projectId,
        tags: updatedTags,
      });

      addLog("MacroPicker", "item_promoted", { 
        item_id: itemId, 
        project_id: projectId,
        project_name: projectName,
        new_type: newType 
      });

      toast({
        title: "Promovido!",
        description: `Item movido para "${projectName}".`,
      });

      setIsPickerOpen(false);
      setSelectedItem(null);
    } catch (error) {
      addLog("MacroPicker", "promote_error", { error });
      toast({
        title: "Erro",
        description: "Falha ao promover item.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Você precisa estar logado para acessar o Inbox.</p>
          <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <InboxIcon className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Inbox</h1>
              <span className="text-sm text-muted-foreground">
                ({inboxItems.length} itens)
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 font-mono text-xs"
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'E',
                ctrlKey: true,
                shiftKey: true,
              });
              window.dispatchEvent(event);
            }}
          >
            <Terminal className="h-3 w-3" />
            Debug
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Capture Input */}
        <div className="mb-8">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="O que está na sua mente? (Enter para capturar)"
              className="h-14 text-lg px-5 pr-24 bg-card border-2 border-border focus:border-primary transition-colors"
              disabled={isCreating}
            />
            <Button
              onClick={handleCapture}
              disabled={!inputValue.trim() || isCreating}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              size="sm"
            >
              {isCreating ? "..." : "Capturar"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-1">
            Dica: Use <code className="text-primary">@hoje</code>, <code className="text-primary">@amanha</code>, <code className="text-primary">#tags</code> para organização automática
          </p>
        </div>

        {/* Inbox List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando...
          </div>
        ) : inboxItems.length === 0 ? (
          <div className="text-center py-12">
            <InboxIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Inbox vazio</p>
            <p className="text-sm text-muted-foreground/70">
              Capture pensamentos acima para começar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {inboxItems.map((item) => (
              <InboxItemCard 
                key={item.id} 
                item={item} 
                onProcess={handleProcess}
              />
            ))}
          </div>
        )}
      </main>

      {/* Macro Picker Modal */}
      <MacroPickerModal
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        item={selectedItem}
        projects={projects}
        onPromote={handlePromote}
        onCreateProject={async (name, module) => {
          const newProject = await createItem({
            title: name,
            type: "project",
            tags: module ? [`#mod_${module}`] : [],
            due_date: null,
            ritual_slot: null,
            module: module || null,
            parent_id: null,
            project_id: null,
            recurrence_rule: null,
            completed: false,
            completed_at: null,
            notes: null,
            checklist: [],
            project_status: "active",
            progress_mode: "auto",
            progress: 0,
            deadline: null,
            milestones: [],
          });
          addLog("MacroPicker", "project_created", { name, module });
          return newProject;
        }}
      />

      {/* Debug Console */}
      {isOpen && <EngineDebugConsole isOpen={isOpen} onClose={() => {}} />}
    </div>
  );
}
