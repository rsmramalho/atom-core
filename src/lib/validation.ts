// Shared Zod validation schemas for forms
import { z } from "zod";

// Reusable field schemas
export const titleSchema = z
  .string()
  .trim()
  .min(1, "Título é obrigatório")
  .max(200, "Título deve ter no máximo 200 caracteres");

export const moduleSchema = z
  .enum(["work", "body", "mind", "family", "geral"])
  .nullable()
  .optional();

export const weightSchema = z
  .number()
  .int("Peso deve ser um número inteiro")
  .min(1, "Peso mínimo é 1")
  .max(10, "Peso máximo é 10");

// Form schemas
export const quickAddTaskSchema = z.object({
  title: titleSchema,
  module: moduleSchema,
  dueDate: z.string().nullable().optional(),
  recurrenceRule: z.string().nullable().optional(),
});

export const quickAddMilestoneSchema = z.object({
  title: titleSchema,
  weight: weightSchema,
  module: moduleSchema,
});

export const quickAddListSchema = z.object({
  title: titleSchema,
});

export const journalContentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escreva algo antes de salvar"),
});

// Helper to extract first error message from ZodError
export function getFirstError(error: z.ZodError): string {
  return error.errors[0]?.message ?? "Dados inválidos";
}
