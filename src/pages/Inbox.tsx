import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAtomItems } from "@/hooks/useAtomItems";
import { useEngineLogger } from "@/hooks/useEngineLogger";
import { parseInput } from "@/lib/parsing-engine";
import { InboxItemCard } from "@/components/inbox/InboxItemCard";
import { EmptyInbox } from "@/components/empty-states";
import { MacroPickerModal } from "@/components/inbox/MacroPickerModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Inbox as InboxIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AtomItem, RitualSlot } from "@/types/atom-engine";

export default function Inbox() {
  const { toast } = useToast();
  const { items, isLoading, createItem, updateItem } = useAtomItems();
  const { addLog } = useEngineLogger();
  
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AtomItem | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get inbox items (items with #inbox tag)
  // INTEGRITY: Exclude milestones from inbox - they only appear in project context
  const inboxItems = items.filter(item => 
    item.tags.some(tag => tag.toLowerCase() === "#inbox") &&
    !item.tags.some(tag => tag.toLowerCase() === "#milestone")
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
        weight: 1,
        order_index: 0,
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
    newType: AtomItem["type"],
    ritualSlot?: RitualSlot,
    module?: string
  ) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    addLog("MacroPicker", "promoting_item", { 
      item_id: itemId, 
      project_id: projectId,
      new_type: newType 
    });

    try {
      // Remove #inbox tag
      let updatedTags = item.tags.filter(t => t.toLowerCase() !== "#inbox");
      
      // If converting to project, set project-specific fields
      if (newType === "project") {
        await updateItem({
          id: itemId,
          type: "project",
          project_id: null,
          tags: updatedTags,
          module: module || "geral", // Ensure module is never null
          project_status: "active",
          progress_mode: "auto",
          progress: 0,
        });

        addLog("MacroPicker", "item_converted_to_project", { 
          item_id: itemId, 
          title: item.title 
        });

        toast({
          title: "Convertido!",
          description: `"${item.title}" agora é um Projeto.`,
        });
      } else {
        // Add #macro:ProjectName tag
        updatedTags = [...updatedTags, `#macro:${projectName.replace(/\s+/g, "_")}`];

        // Determine final module: use provided module, or fallback to geral
        const finalModule = module || "geral";

        await updateItem({
          id: itemId,
          type: newType,
          project_id: projectId,
          tags: updatedTags,
          ritual_slot: ritualSlot || null,
          module: finalModule,
        });

        addLog("MacroPicker", "item_promoted", { 
          item_id: itemId, 
          project_id: projectId,
          project_name: projectName,
          new_type: newType,
          ritual_slot: ritualSlot || null
        });

        const ritualMessage = ritualSlot 
          ? ` (Ritual: ${ritualSlot === "manha" ? "Manhã" : ritualSlot === "meio_dia" ? "Meio-dia" : "Noite"})`
          : "";
        
        toast({
          title: "Promovido!",
          description: `Item movido para "${projectName}"${ritualMessage}.`,
        });
      }

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <InboxIcon className="h-6 w-6 text-primary" />
          Inbox
        </h1>
        <p className="text-muted-foreground">
          {inboxItems.length} item{inboxItems.length !== 1 ? "s" : ""} para processar
        </p>
      </header>

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
      {inboxItems.length === 0 ? (
        <EmptyInbox />
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
            weight: 1,
            order_index: 0,
          });
          addLog("MacroPicker", "project_created", { name, module });
          return newProject;
        }}
      />
    </div>
  );
}