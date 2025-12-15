// Project Sheet - Notes & Resources Pane
import { 
  FileText, 
  Link as LinkIcon,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AtomItem } from "@/types/atom-engine";

interface NotesPaneProps {
  items: AtomItem[];
}

export function NotesPane({ items }: NotesPaneProps) {
  const notes = items.filter(i => i.type === "note");
  const resources = items.filter(i => i.type === "resource");

  if (notes.length === 0 && resources.length === 0) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="py-8 text-center text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma nota ou recurso vinculado</p>
          <p className="text-xs">Adicione notas e links úteis ao projeto</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Notes */}
      {notes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-amber-500" />
              Notas
              <Badge variant="secondary" className="ml-auto">
                {notes.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <p className="font-medium text-sm">{note.title}</p>
                {note.notes && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {note.notes}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <LinkIcon className="h-5 w-5 text-purple-500" />
              Recursos
              <Badge variant="secondary" className="ml-auto">
                {resources.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{resource.title}</p>
                  {resource.notes && (
                    <p className="text-xs text-muted-foreground truncate">
                      {resource.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
