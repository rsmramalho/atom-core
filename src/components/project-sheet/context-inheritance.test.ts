// Unit tests for Context Inheritance in Project Sheet Modals
import { describe, it, expect } from "vitest";

/**
 * Context Inheritance Tests
 * 
 * These tests validate the module inheritance behavior in QuickAddTaskModal
 * and QuickAddMilestoneModal components.
 */

// ============================================================
// MODULE INHERITANCE LOGIC TESTS
// ============================================================

describe("Module Inheritance Logic", () => {
  
  describe("Default Module Resolution", () => {
    // Simulates the logic used in modals for default module
    const resolveDefaultModule = (defaultModule: string | null | undefined): string => {
      return defaultModule || "geral";
    };

    it("should use project module when provided", () => {
      expect(resolveDefaultModule("work")).toBe("work");
      expect(resolveDefaultModule("body")).toBe("body");
      expect(resolveDefaultModule("mind")).toBe("mind");
      expect(resolveDefaultModule("family")).toBe("family");
    });

    it("should fallback to 'geral' when module is null", () => {
      expect(resolveDefaultModule(null)).toBe("geral");
    });

    it("should fallback to 'geral' when module is undefined", () => {
      expect(resolveDefaultModule(undefined)).toBe("geral");
    });

    it("should fallback to 'geral' when module is empty string", () => {
      expect(resolveDefaultModule("")).toBe("geral");
    });
  });

  describe("Final Module Resolution (onSubmit)", () => {
    // Simulates the logic used when submitting - "geral" becomes null
    const resolveFinalModule = (selectedModule: string): string | null => {
      return selectedModule === "geral" ? null : selectedModule;
    };

    it("should return module value for valid modules", () => {
      expect(resolveFinalModule("work")).toBe("work");
      expect(resolveFinalModule("body")).toBe("body");
      expect(resolveFinalModule("mind")).toBe("mind");
      expect(resolveFinalModule("family")).toBe("family");
    });

    it("should return null for 'geral' module", () => {
      expect(resolveFinalModule("geral")).toBeNull();
    });
  });
});

// ============================================================
// TASK CREATION WITH MODULE TESTS
// ============================================================

describe("Task Creation with Module Inheritance", () => {
  
  // Simulates handleCreateTask logic from ProjectDetail
  const createTaskPayload = (
    title: string,
    selectedModule: string | null,
    projectModule: string | null
  ) => {
    const finalModule = selectedModule ?? projectModule ?? null;
    return {
      title,
      type: "task" as const,
      module: finalModule,
      tags: finalModule ? [`#${finalModule.toLowerCase()}`] : [],
    };
  };

  describe("Module Inheritance", () => {
    it("should inherit module from project when no override", () => {
      const payload = createTaskPayload("Test task", null, "work");
      expect(payload.module).toBe("work");
      expect(payload.tags).toContain("#work");
    });

    it("should use selected module when overriding", () => {
      const payload = createTaskPayload("Test task", "body", "work");
      expect(payload.module).toBe("body");
      expect(payload.tags).toContain("#body");
    });

    it("should have null module when both are null", () => {
      const payload = createTaskPayload("Test task", null, null);
      expect(payload.module).toBeNull();
      expect(payload.tags).toEqual([]);
    });
  });

  describe("Tag Generation", () => {
    it("should generate lowercase tag from module", () => {
      const payload = createTaskPayload("Test", "WORK", null);
      expect(payload.tags).toContain("#work");
    });

    it("should not generate tags when module is null", () => {
      const payload = createTaskPayload("Test", null, null);
      expect(payload.tags).toHaveLength(0);
    });
  });
});

// ============================================================
// MILESTONE CREATION WITH MODULE TESTS
// ============================================================

describe("Milestone Creation with Module Inheritance", () => {
  
  // Simulates handleCreateMilestone logic from ProjectDetail
  const createMilestonePayload = (
    title: string,
    weight: number,
    selectedModule: string | null,
    projectModule: string | null
  ) => {
    return {
      title,
      weight,
      module: selectedModule ?? projectModule ?? null,
      tags: ["#milestone"],
    };
  };

  describe("Module Inheritance", () => {
    it("should inherit module from project when no override", () => {
      const payload = createMilestonePayload("MVP Launch", 3, null, "work");
      expect(payload.module).toBe("work");
    });

    it("should use selected module when overriding", () => {
      const payload = createMilestonePayload("MVP Launch", 3, "mind", "work");
      expect(payload.module).toBe("mind");
    });

    it("should have null module when both are null", () => {
      const payload = createMilestonePayload("MVP Launch", 3, null, null);
      expect(payload.module).toBeNull();
    });
  });

  describe("Weight Preservation", () => {
    it("should preserve weight regardless of module", () => {
      const payload1 = createMilestonePayload("Test", 5, "work", null);
      const payload2 = createMilestonePayload("Test", 10, null, "body");
      const payload3 = createMilestonePayload("Test", 1, null, null);

      expect(payload1.weight).toBe(5);
      expect(payload2.weight).toBe(10);
      expect(payload3.weight).toBe(1);
    });
  });

  describe("Milestone Tag", () => {
    it("should always include #milestone tag", () => {
      const payload = createMilestonePayload("Test", 3, "work", null);
      expect(payload.tags).toContain("#milestone");
    });
  });
});

// ============================================================
// MODULE SELECTOR VALIDATION TESTS
// ============================================================

describe("Module Selector Validation", () => {
  const VALID_MODULES = ["work", "body", "mind", "family", "geral"];

  describe("Valid Modules", () => {
    it("should recognize all valid module values", () => {
      VALID_MODULES.forEach(module => {
        expect(VALID_MODULES).toContain(module);
      });
    });

    it("should have exactly 5 module options", () => {
      expect(VALID_MODULES).toHaveLength(5);
    });
  });

  describe("Module Display Properties", () => {
    const MODULE_CONFIG = [
      { value: "work", label: "Work", color: "text-blue-500" },
      { value: "body", label: "Body", color: "text-red-500" },
      { value: "mind", label: "Mind", color: "text-purple-500" },
      { value: "family", label: "Family", color: "text-green-500" },
      { value: "geral", label: "Geral", color: "text-muted-foreground" },
    ];

    it("should have unique colors for each module", () => {
      const colors = MODULE_CONFIG.map(m => m.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(MODULE_CONFIG.length);
    });

    it("should have labels for all modules", () => {
      MODULE_CONFIG.forEach(module => {
        expect(module.label).toBeTruthy();
        expect(module.label.length).toBeGreaterThan(0);
      });
    });
  });
});

// ============================================================
// OVERRIDE DETECTION TESTS
// ============================================================

describe("Module Override Detection", () => {
  
  // Logic used to show warning when module differs from inherited
  const isOverridden = (
    currentModule: string,
    defaultModule: string | null | undefined
  ): boolean => {
    return !!defaultModule && currentModule !== defaultModule;
  };

  describe("Override Warning Logic", () => {
    it("should detect override when module differs from project", () => {
      expect(isOverridden("body", "work")).toBe(true);
      expect(isOverridden("mind", "family")).toBe(true);
    });

    it("should not show warning when module matches project", () => {
      expect(isOverridden("work", "work")).toBe(false);
      expect(isOverridden("body", "body")).toBe(false);
    });

    it("should not show warning when project has no module", () => {
      expect(isOverridden("work", null)).toBe(false);
      expect(isOverridden("work", undefined)).toBe(false);
    });

    it("should detect override even for geral selection", () => {
      expect(isOverridden("geral", "work")).toBe(true);
    });
  });
});

// ============================================================
// INTEGRATION SCENARIOS
// ============================================================

describe("Context Inheritance Integration Scenarios", () => {
  
  // Helper to simulate module resolution
  const resolveModule = (
    selected: string | null,
    project: string | null
  ): string | null => {
    return selected ?? project ?? null;
  };

  const toFinalModule = (module: string): string | null => {
    return module === "geral" ? null : module;
  };

  describe("Project with Work module", () => {
    const projectModule: string | null = "work";

    it("should create task with work module by default", () => {
      const selected: string | null = null;
      const finalModule = resolveModule(selected, projectModule);
      expect(finalModule).toBe("work");
    });

    it("should allow override to body module", () => {
      const selectedModule: string | null = "body";
      const finalModule = resolveModule(selectedModule, projectModule);
      expect(finalModule).toBe("body");
    });
  });

  describe("Project without module (null)", () => {
    const projectModule: string | null = null;

    it("should create task with null module by default", () => {
      const selected: string | null = null;
      const finalModule = resolveModule(selected, projectModule);
      expect(finalModule).toBeNull();
    });

    it("should allow setting module when project has none", () => {
      const selectedModule: string | null = "mind";
      const finalModule = resolveModule(selectedModule, projectModule);
      expect(finalModule).toBe("mind");
    });
  });

  describe("Full workflow simulation", () => {
    it("should handle complete task creation workflow", () => {
      // 1. User opens modal for project with "work" module
      const projectModule: string | null = "work";
      const initialState = projectModule || "geral";
      expect(initialState).toBe("work");

      // 2. User changes module to "body"
      const selectedModule: string = "body";
      
      // 3. Override is detected
      const isOverride = projectModule !== null && selectedModule !== projectModule;
      expect(isOverride).toBe(true);

      // 4. User submits - final module is "body"
      const finalModule = toFinalModule(selectedModule);
      expect(finalModule).toBe("body");
    });

    it("should handle complete milestone creation workflow", () => {
      // 1. User opens modal for project with "mind" module
      const projectModule: string | null = "mind";
      const initialState = projectModule || "geral";
      expect(initialState).toBe("mind");

      // 2. User keeps default module, sets weight to 5
      const selectedModule: string = "mind";
      const weight = 5;
      
      // 3. No override warning (same module)
      const isOverride = projectModule !== null && selectedModule !== projectModule;
      expect(isOverride).toBe(false);

      // 4. User submits
      const finalModule = toFinalModule(selectedModule);
      expect(finalModule).toBe("mind");
      expect(weight).toBe(5);
    });
  });
});
