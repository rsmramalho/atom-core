// Atom Engine 4.0 - Parsing Engine Tests
// Tests for B.7 specification

import { describe, it, expect, beforeEach, vi } from "vitest";
import { parseInput, createLogEntry } from "./parsing-engine";
import { format, addDays } from "date-fns";

describe("Parsing Engine (B.7)", () => {
  describe("parseInput", () => {
    describe("Basic Input", () => {
      it("should return clean title for plain text", () => {
        const result = parseInput("Comprar leite");
        expect(result.title).toBe("Comprar leite");
        expect(result.type).toBe("task");
        expect(result.tags).toEqual([]);
        expect(result.due_date).toBeNull();
        expect(result.ritual_slot).toBeNull();
      });

      it("should trim whitespace from title", () => {
        const result = parseInput("  Tarefa com espaços  ");
        expect(result.title).toBe("Tarefa com espaços");
      });

      it("should preserve raw_input", () => {
        const input = "Reunião @hoje #work";
        const result = parseInput(input);
        expect(result.raw_input).toBe(input);
      });
    });

    describe("Temporal Tokens", () => {
      it("should detect @hoje and set due_date to today", () => {
        const result = parseInput("Tarefa @hoje");
        const today = format(new Date(), "yyyy-MM-dd");
        
        expect(result.due_date).toBe(today);
        expect(result.title).toBe("Tarefa");
        expect(result.detected_tokens).toContainEqual(
          expect.objectContaining({
            type: "temporal",
            value: today,
          })
        );
      });

      it("should detect @amanha and set due_date to tomorrow", () => {
        const result = parseInput("Reunião @amanha");
        const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
        
        expect(result.due_date).toBe(tomorrow);
        expect(result.title).toBe("Reunião");
      });

      it("should handle @hoje case-insensitively", () => {
        const result1 = parseInput("Task @HOJE");
        const result2 = parseInput("Task @Hoje");
        const today = format(new Date(), "yyyy-MM-dd");
        
        expect(result1.due_date).toBe(today);
        expect(result2.due_date).toBe(today);
      });

      it("should prioritize @amanha over @hoje if both present", () => {
        const result = parseInput("Task @hoje @amanha");
        const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
        
        expect(result.due_date).toBe(tomorrow);
      });
    });

    describe("Ritual Slots", () => {
      it("should detect @ritual_manha and set ritual_slot", () => {
        const result = parseInput("Meditar @ritual_manha");
        
        expect(result.ritual_slot).toBe("manha");
        expect(result.type).toBe("habit");
        expect(result.title).toBe("Meditar");
      });

      it("should detect @ritual_meio_dia", () => {
        const result = parseInput("Almoço saudável @ritual_meio_dia");
        
        expect(result.ritual_slot).toBe("meio_dia");
        expect(result.type).toBe("habit");
      });

      it("should detect @ritual_noite", () => {
        const result = parseInput("Leitura @ritual_noite");
        
        expect(result.ritual_slot).toBe("noite");
        expect(result.type).toBe("habit");
      });

      it("should change type to habit when ritual_slot is set", () => {
        const result = parseInput("Qualquer coisa @ritual_manha");
        
        expect(result.type).toBe("habit");
      });
    });

    describe("Context Tokens (@who, @where)", () => {
      it("should convert @who:name to tag #who:name", () => {
        const result = parseInput("Reunião @who:joao");
        
        expect(result.tags).toContain("#who:joao");
        expect(result.title).toBe("Reunião");
      });

      it("should convert @where:place to tag #where:place", () => {
        const result = parseInput("Almoço @where:cafe");
        
        expect(result.tags).toContain("#where:cafe");
        expect(result.title).toBe("Almoço");
      });

      it("should handle multiple @who tokens", () => {
        const result = parseInput("Reunião @who:joao @who:maria");
        
        expect(result.tags).toContain("#who:joao");
        expect(result.tags).toContain("#who:maria");
      });

      it("should lowercase context values", () => {
        const result = parseInput("Meeting @who:ANDRE @where:OFFICE");
        
        expect(result.tags).toContain("#who:andre");
        expect(result.tags).toContain("#where:office");
      });
    });

    describe("Hashtags", () => {
      it("should extract single hashtag", () => {
        const result = parseInput("Urgente #prioridade");
        
        expect(result.tags).toContain("#prioridade");
        expect(result.title).toBe("Urgente");
      });

      it("should extract multiple hashtags", () => {
        const result = parseInput("Task #work #urgent #important");
        
        expect(result.tags).toContain("#work");
        expect(result.tags).toContain("#urgent");
        expect(result.tags).toContain("#important");
      });

      it("should lowercase hashtags", () => {
        const result = parseInput("Task #UPPERCASE #MixedCase");
        
        expect(result.tags).toContain("#uppercase");
        expect(result.tags).toContain("#mixedcase");
      });

      it("should not duplicate hashtags", () => {
        const result = parseInput("Task #work #WORK #Work");
        
        const workTags = result.tags.filter((t) => t === "#work");
        expect(workTags.length).toBe(1);
      });
    });

    describe("Module Inference", () => {
      it("should infer 'work' module from keywords", () => {
        const result = parseInput("Reunião com cliente");
        expect(result.module).toBe("work");
      });

      it("should infer 'body' module from keywords", () => {
        const result = parseInput("Ir para academia");
        expect(result.module).toBe("body");
      });

      it("should infer 'mind' module from keywords", () => {
        const result = parseInput("Ler livro novo");
        expect(result.module).toBe("mind");
      });

      it("should infer 'home' module from keywords", () => {
        const result = parseInput("Limpar a casa");
        expect(result.module).toBe("home");
      });

      it("should infer 'social' module from keywords", () => {
        const result = parseInput("Jantar com amigo");
        expect(result.module).toBe("social");
      });

      it("should infer 'finance' module from keywords", () => {
        const result = parseInput("Pagar conta de luz");
        expect(result.module).toBe("finance");
      });

      it("should return null module for unknown keywords", () => {
        const result = parseInput("Fazer algo aleatório xyz");
        expect(result.module).toBeNull();
      });
    });

    describe("Explicit Module Tag (#mod_*)", () => {
      it("should set module from #mod_* tag", () => {
        const result = parseInput("Task #mod_body");
        
        expect(result.module).toBe("body");
        expect(result.tags).toContain("#mod_body");
      });

      it("should override inferred module with explicit #mod_* tag", () => {
        const result = parseInput("Reunião com cliente #mod_personal");
        
        // Even though "reunião" and "cliente" would infer "work"
        expect(result.module).toBe("personal");
      });
    });

    describe("Type Inference", () => {
      it("should infer 'note' type from keywords", () => {
        const result = parseInput("Uma ideia para o projeto");
        expect(result.type).toBe("note");
      });

      it("should infer 'habit' type from keywords", () => {
        const result = parseInput("Rotina de exercícios");
        expect(result.type).toBe("habit");
      });

      it("should infer 'project' type from keyword", () => {
        const result = parseInput("Novo projeto de app");
        expect(result.type).toBe("project");
      });

      it("should infer 'reflection' type from keywords", () => {
        const result = parseInput("Reflexão sobre a semana");
        expect(result.type).toBe("reflection");
      });

      it("should default to 'task' type", () => {
        const result = parseInput("Comprar algo");
        expect(result.type).toBe("task");
      });

      it("should prioritize ritual_slot over type inference", () => {
        const result = parseInput("Algo @ritual_manha");
        // ritual_slot forces type to 'habit'
        expect(result.type).toBe("habit");
      });
    });

    describe("Complex Input Combinations", () => {
      it("should handle full complex input", () => {
        const input = "Reunião com cliente @amanha @who:joao @where:office #urgent #mod_work";
        const result = parseInput(input);
        const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

        expect(result.title).toBe("Reunião com cliente");
        expect(result.due_date).toBe(tomorrow);
        expect(result.tags).toContain("#who:joao");
        expect(result.tags).toContain("#where:office");
        expect(result.tags).toContain("#urgent");
        expect(result.tags).toContain("#mod_work");
        expect(result.module).toBe("work");
        expect(result.raw_input).toBe(input);
      });

      it("should handle ritual with tags", () => {
        const result = parseInput("Meditar @ritual_manha #mindfulness #focus");

        expect(result.title).toBe("Meditar");
        expect(result.ritual_slot).toBe("manha");
        expect(result.type).toBe("habit");
        expect(result.tags).toContain("#mindfulness");
        expect(result.tags).toContain("#focus");
      });

      it("should detect all tokens", () => {
        const input = "Task @hoje #tag1 #tag2 @who:person";
        const result = parseInput(input);

        expect(result.detected_tokens.length).toBeGreaterThanOrEqual(4);
        expect(result.detected_tokens.some((t) => t.type === "temporal")).toBe(true);
        expect(result.detected_tokens.some((t) => t.type === "tag")).toBe(true);
        expect(result.detected_tokens.some((t) => t.type === "context_who")).toBe(true);
      });
    });

    describe("Edge Cases", () => {
      it("should handle empty string", () => {
        const result = parseInput("");
        expect(result.title).toBe("");
        expect(result.tags).toEqual([]);
      });

      it("should handle only tokens (no content)", () => {
        const result = parseInput("@hoje #work");
        expect(result.title).toBe("");
        expect(result.due_date).not.toBeNull();
        expect(result.tags).toContain("#work");
      });

      it("should handle multiple spaces", () => {
        const result = parseInput("Task    with    spaces");
        expect(result.title).toBe("Task with spaces");
      });

      it("should handle special characters in title", () => {
        const result = parseInput("Task: important! (urgent)");
        expect(result.title).toBe("Task: important! (urgent)");
      });
    });
  });

  describe("createLogEntry", () => {
    it("should create log entry with timestamp", () => {
      const entry = createLogEntry("ParsingEngine", "parsed input");
      
      expect(entry.engine).toBe("ParsingEngine");
      expect(entry.action).toBe("parsed input");
      expect(entry.timestamp).toBeDefined();
      expect(new Date(entry.timestamp).getTime()).not.toBeNaN();
    });

    it("should include details when provided", () => {
      const details = { inputLength: 50, tokensFound: 3 };
      const entry = createLogEntry("ParsingEngine", "parsed", details);
      
      expect(entry.details).toEqual(details);
    });

    it("should handle undefined details", () => {
      const entry = createLogEntry("Test", "action");
      
      expect(entry.details).toBeUndefined();
    });
  });
});
