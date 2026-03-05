import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { stats } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é um coach de produtividade pessoal integrado ao MindMate, um app de gestão pessoal.
Analise os dados de produtividade do usuário da última semana e gere um resumo motivacional em português do Brasil.

Estruture sua resposta EXATAMENTE neste formato markdown:

## 📊 Resumo da Semana

Um parágrafo curto (2-3 frases) com o overview geral da semana.

## 🔥 Destaques

- Liste 2-3 conquistas ou pontos positivos
- Use dados concretos dos stats

## ⚡ Oportunidades

- Liste 2-3 áreas de melhoria
- Seja construtivo e específico

## 💡 Sugestões

- 2-3 ações concretas para a próxima semana
- Baseie nas tendências dos dados

Regras:
- Seja conciso (máximo 250 palavras total)
- Use tom motivacional mas realista
- Reference números específicos dos dados
- Se não houver dados suficientes, incentive o usuário a usar mais o app
- Nunca invente dados que não estão no contexto`;

    const userPrompt = `Dados de produtividade desta semana:

Tarefas concluídas: ${stats.tasksCompleted} (de ${stats.tasksTotal} total)
Taxa de conclusão: ${stats.completionRate}%
Tarefas ativas pendentes: ${stats.tasksActive}

Comparativo semanal:
- Tarefas: ${stats.weeklyTasks} esta semana vs ${stats.weeklyTasksLastWeek} semana passada
- Hábitos completados: ${stats.weeklyHabits} esta semana vs ${stats.weeklyHabitsLastWeek} semana passada  
- Reflexões: ${stats.weeklyReflections} esta semana vs ${stats.weeklyReflectionsLastWeek} semana passada

Hábitos (top 5 por streak):
${stats.habitStreaks || "Nenhum hábito registrado"}

Projetos ativos: ${stats.activeProjects}
Projetos concluídos: ${stats.completedProjects}
Total de reflexões: ${stats.totalReflections}

Atividade dos últimos 7 dias (tarefas/dia): ${stats.dailyActivity || "Sem dados"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao gerar resumo" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("weekly-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
