// Project Sheet - FAB (Floating Action Button) for quick item creation
import { useState } from "react";
import { Plus, ListTodo, Diamond, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectFabProps {
  onCreateTask: () => void;
  onCreateMilestone: () => void;
}

export function ProjectFab({ onCreateTask, onCreateMilestone }: ProjectFabProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Options (visible when open) */}
      <div className={cn(
        "flex flex-col-reverse gap-2 transition-all duration-200",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <Button
          onClick={() => {
            onCreateTask();
            setIsOpen(false);
          }}
          className="gap-2 shadow-lg"
          variant="secondary"
        >
          <ListTodo className="h-4 w-4" />
          Nova Task
        </Button>
        <Button
          onClick={() => {
            onCreateMilestone();
            setIsOpen(false);
          }}
          className="gap-2 shadow-lg bg-primary/90 hover:bg-primary"
        >
          <Diamond className="h-4 w-4" />
          Nova Milestone
        </Button>
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-all duration-200",
          isOpen 
            ? "bg-muted text-muted-foreground hover:bg-muted rotate-45" 
            : "bg-primary hover:bg-primary/90"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
