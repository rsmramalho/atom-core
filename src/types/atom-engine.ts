// Atom Engine 4.0 - Core Types
// Based on Doc B.3, B.7, B.9
// Single Table Design - All items in one table

export type ItemType = 
  | "project" 
  | "task" 
  | "habit" 
  | "note" 
  | "reflection" 
  | "resource" 
  | "list";

export type RitualSlot = "manha" | "meio_dia" | "noite" | null;

export type ProjectStatus = "draft" | "active" | "paused" | "completed" | "archived";
export type ProgressMode = "auto" | "manual";

// Checklist item structure
export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

// Main AtomItem interface - Single Table Design
export interface AtomItem {
  id: string;
  user_id: string;
  title: string;
  type: ItemType;
  
  // Context and Classification
  module: string | null;
  tags: string[];
  
  // Hierarchy
  parent_id: string | null;
  project_id: string | null;
  
  // Time and Rhythm
  due_date: string | null;
  recurrence_rule: string | null;
  ritual_slot: RitualSlot;
  
  // State
  completed: boolean;
  completed_at: string | null;
  
  // Content
  notes: string | null;
  checklist: ChecklistItem[];
  
  // Project Meta (only for type = 'project')
  project_status: ProjectStatus | null;
  progress_mode: ProgressMode | null;
  progress: number | null;
  deadline: string | null;
  
  // Weight for progress calculation (milestones = 3, tasks = 1)
  weight: number;
  
  // Ordering
  order_index: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Milestone is just an AtomItem with #milestone tag
export type Milestone = AtomItem & {
  tags: string[]; // Must include '#milestone'
};

// Helper to check if item is a milestone
export function isMilestone(item: AtomItem): boolean {
  return item.tags.includes('#milestone');
}

// Parsed result from ParsingEngine
export interface ParsedInput {
  title: string;
  type: ItemType;
  tags: string[];
  due_date: string | null;
  ritual_slot: RitualSlot;
  module: string | null;
  raw_input: string;
  detected_tokens: {
    token: string;
    type: string;
    value: string;
  }[];
}

// Engine Log Entry
export interface EngineLogEntry {
  timestamp: string;
  engine: string;
  action: string;
  details?: Record<string, unknown>;
}

// Create/Update item payload
export type CreateItemPayload = Omit<AtomItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateItemPayload = Partial<Omit<AtomItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
