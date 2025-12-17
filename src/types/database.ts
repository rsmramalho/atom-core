// Database row types for type-safe mapping
// Based on Supabase schema

import type { Tables } from '@/integrations/supabase/types';
import type { Json } from '@/integrations/supabase/types';
import type { ChecklistItem, ItemType, RitualSlot, ProjectStatus, ProgressMode } from './atom-engine';

// Raw database row type from items table
export type ItemsRow = Tables<'items'>;

// Typed version of ItemsRow for mapping to AtomItem
// This interface provides a properly typed view of the database row
export interface TypedItemsRow {
  id: string;
  user_id: string;
  title: string;
  type: ItemType;
  module: string | null;
  tags: string[] | null;
  parent_id: string | null;
  project_id: string | null;
  due_date: string | null;
  recurrence_rule: string | null;
  ritual_slot: RitualSlot | null;
  completed: boolean;
  completed_at: string | null;
  completion_log: string[] | null;
  notes: string | null;
  checklist: ChecklistItem[] | null;
  project_status: ProjectStatus | null;
  progress_mode: ProgressMode | null;
  progress: number | null;
  deadline: string | null;
  weight: number | null;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

// Helper to cast ItemsRow to TypedItemsRow
export function asTypedRow(row: ItemsRow): TypedItemsRow {
  return row as unknown as TypedItemsRow;
}

// Onboarding progress row type
export type OnboardingProgressRow = Tables<'onboarding_progress'>;

// Onboarding analytics row type  
export type OnboardingAnalyticsRow = Tables<'onboarding_analytics'>;

// Helper type for update payloads
export type UpdatePayload = Record<string, string | number | boolean | null | Json | string[]>;

// Engine log entry type
export interface EngineLogEntry {
  timestamp: string;
  engine: string;
  action: string;
  details?: Record<string, unknown>;
}

// Parsed input result type (re-export for convenience)
export type { ParsedInput } from './atom-engine';
