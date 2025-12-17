import { AtomItem } from "@/types/atom-engine";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Converts an array of reflections to Markdown format
 */
export function reflectionsToMarkdown(reflections: AtomItem[]): string {
  const sorted = [...reflections].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const lines: string[] = [
    "# Diário - MindMate",
    "",
    `> Exportado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`,
    "",
    `Total de reflexões: ${reflections.length}`,
    "",
    "---",
    "",
  ];

  // Group by date
  const groupedByDate = new Map<string, AtomItem[]>();
  
  for (const reflection of sorted) {
    const dateKey = format(new Date(reflection.created_at), "yyyy-MM-dd");
    if (!groupedByDate.has(dateKey)) {
      groupedByDate.set(dateKey, []);
    }
    groupedByDate.get(dateKey)!.push(reflection);
  }

  // Generate markdown for each date group
  for (const [dateKey, items] of groupedByDate) {
    const date = new Date(dateKey);
    const formattedDate = format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    lines.push(`## ${formattedDate}`);
    lines.push("");

    for (const item of items) {
      const time = format(new Date(item.created_at), "HH:mm");
      
      lines.push(`### ${time}`);
      lines.push("");
      
      // Title if exists
      if (item.title && item.title.trim()) {
        lines.push(`**${item.title}**`);
        lines.push("");
      }
      
      // Content/notes
      if (item.notes && item.notes.trim()) {
        lines.push(item.notes);
        lines.push("");
      }
      
      // Tags
      if (item.tags && item.tags.length > 0) {
        const tagStr = item.tags.map(t => `\`${t}\``).join(" ");
        lines.push(`Tags: ${tagStr}`);
        lines.push("");
      }
      
      lines.push("---");
      lines.push("");
    }
  }

  return lines.join("\n");
}

/**
 * Downloads content as a file
 */
export function downloadAsFile(content: string, filename: string, mimeType: string = "text/markdown") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Exports reflections as a Markdown file
 */
export function exportJournalAsMarkdown(reflections: AtomItem[]) {
  const markdown = reflectionsToMarkdown(reflections);
  const date = format(new Date(), "yyyy-MM-dd");
  const filename = `diario-mindmate-${date}.md`;
  
  downloadAsFile(markdown, filename);
}
