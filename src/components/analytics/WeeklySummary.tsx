// AI Weekly Summary Component
// Streams productivity insights from Lovable AI (Gemini Flash)

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface WeeklySummaryStats {
  tasksCompleted: number;
  tasksTotal: number;
  tasksActive: number;
  completionRate: number;
  weeklyTasks: number;
  weeklyTasksLastWeek: number;
  weeklyHabits: number;
  weeklyHabitsLastWeek: number;
  weeklyReflections: number;
  weeklyReflectionsLastWeek: number;
  habitStreaks: string;
  activeProjects: number;
  completedProjects: number;
  totalReflections: number;
  dailyActivity: string;
}

interface WeeklySummaryProps {
  stats: WeeklySummaryStats;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weekly-summary`;

export function WeeklySummary({ stats }: WeeklySummaryProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateSummary = useCallback(async () => {
    setIsLoading(true);
    setSummary("");

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ stats }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: "Erro ao gerar resumo" }));
        if (resp.status === 429) {
          toast.error("Limite de requisições excedido. Tente novamente em alguns minutos.");
        } else if (resp.status === 402) {
          toast.error("Créditos insuficientes. Adicione créditos ao workspace.");
        } else {
          toast.error(errorData.error || "Erro ao gerar resumo");
        }
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullText += content;
              setSummary(fullText);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullText += content;
              setSummary(fullText);
            }
          } catch { /* ignore */ }
        }
      }

      setHasGenerated(true);
    } catch (err) {
      console.error("Weekly summary error:", err);
      toast.error("Erro ao gerar resumo semanal");
    } finally {
      setIsLoading(false);
    }
  }, [stats]);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Resumo Semanal com IA
          </div>
          {hasGenerated && !isLoading && (
            <Button variant="ghost" size="sm" onClick={generateSummary} className="h-7 px-2">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasGenerated && !isLoading && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Gere um resumo inteligente da sua semana com insights e sugestões personalizadas.
            </p>
            <Button onClick={generateSummary} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Gerar Resumo
            </Button>
          </div>
        )}

        {isLoading && !summary && (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Analisando seus dados...</span>
          </div>
        )}

        {summary && (
          <div className="prose prose-sm max-w-none [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mt-4 [&>h2]:mb-2 [&>h2:first-child]:mt-0 [&>ul]:my-1 [&>ul>li]:my-0.5 [&>p]:my-2 [&>p]:text-sm [&>ul>li]:text-sm text-foreground">
            {summary.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i}>{line.slice(3)}</h2>;
              }
              if (line.startsWith('- ')) {
                return (
                  <div key={i} className="flex gap-2 text-sm my-0.5">
                    <span className="text-primary shrink-0">•</span>
                    <span>{line.slice(2)}</span>
                  </div>
                );
              }
              if (line.trim() === '') return null;
              return <p key={i} className="text-sm my-1">{line}</p>;
            })}
            {isLoading && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
