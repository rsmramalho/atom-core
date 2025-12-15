// Atom Engine 4.0 - Parsing Engine (B.7)
// Transforms raw text into structured AtomItem data

import { format, addDays } from "date-fns";
import type { ParsedInput, ItemType, RitualSlot } from "@/types/atom-engine";

interface DetectedToken {
  token: string;
  type: string;
  value: string;
}

// Module inference keywords
const MODULE_KEYWORDS: Record<string, string[]> = {
  work: ["trabalho", "reunião", "meeting", "cliente", "projeto", "email", "call", "deadline"],
  body: ["treino", "academia", "correr", "exercício", "dieta", "saúde", "gym", "workout"],
  mind: ["meditar", "ler", "estudar", "curso", "aprender", "livro", "meditação"],
  home: ["casa", "limpar", "organizar", "compras", "mercado", "cozinha"],
  social: ["amigo", "família", "encontro", "festa", "jantar", "almoço"],
  finance: ["pagar", "conta", "dinheiro", "investir", "banco", "boleto"],
};

// Type inference keywords
const TYPE_KEYWORDS: Record<ItemType, string[]> = {
  note: ["nota", "ideia", "lembrete", "anotação"],
  habit: ["hábito", "rotina", "diário", "sempre"],
  task: [],
  project: ["projeto"],
  reflection: ["reflexão", "pensamento"],
  resource: ["recurso", "link", "artigo"],
  list: ["lista"],
};

export function parseInput(text: string): ParsedInput {
  const detectedTokens: DetectedToken[] = [];
  let workingText = text;
  const tags: string[] = [];
  let dueDate: string | null = null;
  let ritualSlot: RitualSlot = null;
  let inferredModule: string | null = null;
  let inferredType: ItemType = "task";

  // 1. Extract @hoje and @amanha (temporal tokens)
  const todayMatch = workingText.match(/@hoje\b/gi);
  if (todayMatch) {
    dueDate = format(new Date(), "yyyy-MM-dd");
    detectedTokens.push({
      token: todayMatch[0],
      type: "temporal",
      value: dueDate,
    });
    workingText = workingText.replace(/@hoje\b/gi, "");
  }

  const tomorrowMatch = workingText.match(/@amanha\b/gi);
  if (tomorrowMatch) {
    dueDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
    detectedTokens.push({
      token: tomorrowMatch[0],
      type: "temporal",
      value: dueDate,
    });
    workingText = workingText.replace(/@amanha\b/gi, "");
  }

  // 2. Extract ritual slots @ritual_*
  const ritualMatch = workingText.match(/@ritual_(manha|meio_dia|noite)\b/gi);
  if (ritualMatch) {
    const slotValue = ritualMatch[0].replace(/@ritual_/i, "").toLowerCase() as RitualSlot;
    ritualSlot = slotValue;
    inferredType = "habit";
    detectedTokens.push({
      token: ritualMatch[0],
      type: "ritual",
      value: slotValue || "",
    });
    workingText = workingText.replace(/@ritual_(manha|meio_dia|noite)\b/gi, "");
  }

  // 3. Extract @who:name and @where:place -> convert to tags
  const whoMatches = workingText.matchAll(/@who:(\w+)/gi);
  for (const match of whoMatches) {
    const tag = `#who:${match[1].toLowerCase()}`;
    tags.push(tag);
    detectedTokens.push({
      token: match[0],
      type: "context_who",
      value: match[1],
    });
    workingText = workingText.replace(match[0], "");
  }

  const whereMatches = workingText.matchAll(/@where:(\w+)/gi);
  for (const match of whereMatches) {
    const tag = `#where:${match[1].toLowerCase()}`;
    tags.push(tag);
    detectedTokens.push({
      token: match[0],
      type: "context_where",
      value: match[1],
    });
    workingText = workingText.replace(match[0], "");
  }

  // 4. Extract hashtags #something
  const hashtagMatches = workingText.matchAll(/#(\w+)/gi);
  for (const match of hashtagMatches) {
    const tag = `#${match[1].toLowerCase()}`;
    if (!tags.includes(tag)) {
      tags.push(tag);
      detectedTokens.push({
        token: match[0],
        type: "tag",
        value: match[1],
      });
    }
    workingText = workingText.replace(match[0], "");
  }

  // 5. Infer module from keywords
  const lowerText = text.toLowerCase();
  for (const [module, keywords] of Object.entries(MODULE_KEYWORDS)) {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      inferredModule = module;
      detectedTokens.push({
        token: keywords.find((kw) => lowerText.includes(kw)) || "",
        type: "module_inference",
        value: module,
      });
      break;
    }
  }

  // 6. Infer type from keywords
  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    if (keywords.length > 0 && keywords.some((kw) => lowerText.includes(kw))) {
      inferredType = type as ItemType;
      detectedTokens.push({
        token: keywords.find((kw) => lowerText.includes(kw)) || "",
        type: "type_inference",
        value: type,
      });
      break;
    }
  }

  // 7. Check for #mod_* tags to set module explicitly
  const modTag = tags.find((t) => t.startsWith("#mod_"));
  if (modTag) {
    inferredModule = modTag.replace("#mod_", "");
  }

  // Clean up the title
  const cleanTitle = workingText
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: cleanTitle,
    type: inferredType,
    tags,
    due_date: dueDate,
    ritual_slot: ritualSlot,
    module: inferredModule,
    raw_input: text,
    detected_tokens: detectedTokens,
  };
}

// Utility to create a log entry
export function createLogEntry(engine: string, action: string, details?: Record<string, unknown>) {
  return {
    timestamp: new Date().toISOString(),
    engine,
    action,
    details,
  };
}
