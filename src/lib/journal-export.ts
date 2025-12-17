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
 * Converts reflections to JSON format
 */
export function reflectionsToJson(reflections: AtomItem[]): string {
  const sorted = [...reflections].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const exportData = {
    exportedAt: new Date().toISOString(),
    source: "MindMate - Atom Engine 4.0",
    count: reflections.length,
    reflections: sorted.map(r => ({
      id: r.id,
      title: r.title,
      content: r.notes,
      tags: r.tags,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Generates HTML for PDF printing
 */
export function reflectionsToHtml(reflections: AtomItem[]): string {
  const sorted = [...reflections].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const exportDate = format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });

  // Group by date
  const groupedByDate = new Map<string, AtomItem[]>();
  for (const reflection of sorted) {
    const dateKey = format(new Date(reflection.created_at), "yyyy-MM-dd");
    if (!groupedByDate.has(dateKey)) {
      groupedByDate.set(dateKey, []);
    }
    groupedByDate.get(dateKey)!.push(reflection);
  }

  let entriesHtml = "";
  for (const [dateKey, items] of groupedByDate) {
    const date = new Date(dateKey);
    const formattedDate = format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    entriesHtml += `<h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">${formattedDate}</h2>`;
    
    for (const item of items) {
      const time = format(new Date(item.created_at), "HH:mm");
      const content = item.notes || item.title || "";
      const tags = item.tags?.filter(t => !t.startsWith("inbox") && !t.startsWith("macro:")) || [];
      
      entriesHtml += `
        <div style="margin: 16px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">${time}</div>
          <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.6;">${content}</div>
          ${tags.length > 0 ? `
            <div style="margin-top: 12px;">
              ${tags.map(t => `<span style="display: inline-block; background: #e5e7eb; color: #4b5563; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 4px;">#${t}</span>`).join("")}
            </div>
          ` : ""}
        </div>
      `;
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Diário - MindMate</title>
      <style>
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #1f2937; }
        h1 { color: #059669; margin-bottom: 8px; }
        .meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
      </style>
    </head>
    <body>
      <h1>📔 Diário - MindMate</h1>
      <div class="meta">
        Exportado em ${exportDate}<br>
        Total de reflexões: ${reflections.length}
      </div>
      <hr style="border: none; border-top: 2px solid #059669; margin: 24px 0;">
      ${entriesHtml}
    </body>
    </html>
  `;
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
 * Opens print dialog for PDF export
 */
export function printAsPdf(reflections: AtomItem[]) {
  const html = reflectionsToHtml(reflections);
  const printWindow = window.open("", "_blank");
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Exports reflections as a Markdown file
 */
export function exportJournalAsMarkdown(reflections: AtomItem[]) {
  const markdown = reflectionsToMarkdown(reflections);
  const date = format(new Date(), "yyyy-MM-dd");
  const filename = `diario-mindmate-${date}.md`;
  
  downloadAsFile(markdown, filename, "text/markdown");
}

/**
 * Exports reflections as a JSON file
 */
export function exportJournalAsJson(reflections: AtomItem[]) {
  const json = reflectionsToJson(reflections);
  const date = format(new Date(), "yyyy-MM-dd");
  const filename = `diario-mindmate-${date}.json`;
  
  downloadAsFile(json, filename, "application/json");
}

/**
 * Exports reflections as PDF (via print dialog)
 */
export function exportJournalAsPdf(reflections: AtomItem[]) {
  printAsPdf(reflections);
}
