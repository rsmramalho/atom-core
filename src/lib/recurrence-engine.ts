// Recurrence Engine (B.5) - RRULE-based recurrence logic
// Uses rrule library for complex repetition patterns

import { RRule, rrulestr, Frequency, Weekday } from 'rrule';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import type { AtomItem } from '@/types/atom-engine';

// Recurrence presets for quick selection
export type RecurrencePreset = 
  | 'daily'
  | 'weekdays'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly'
  | 'custom';

export interface RecurrenceConfig {
  preset: RecurrencePreset;
  rruleString?: string;
  endDate?: string;
  count?: number;
}

// Virtual instance of a recurrent item for a specific date
export interface RecurrenceInstance {
  item: AtomItem;
  instanceDate: string; // ISO date (YYYY-MM-DD)
  isCompleted: boolean;
  isVirtual: true;
}

// Preset configurations
const PRESET_RULES: Record<Exclude<RecurrencePreset, 'custom'>, Partial<{ freq: Frequency; byweekday: Weekday[]; interval: number }>> = {
  daily: { freq: Frequency.DAILY },
  weekdays: { freq: Frequency.WEEKLY, byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR] },
  weekly: { freq: Frequency.WEEKLY },
  biweekly: { freq: Frequency.WEEKLY, interval: 2 },
  monthly: { freq: Frequency.MONTHLY },
  yearly: { freq: Frequency.YEARLY },
};

// Human-readable labels for presets
export const PRESET_LABELS: Record<RecurrencePreset, string> = {
  daily: 'Diariamente',
  weekdays: 'Dias úteis',
  weekly: 'Semanalmente',
  biweekly: 'Quinzenalmente',
  monthly: 'Mensalmente',
  yearly: 'Anualmente',
  custom: 'Personalizado',
};

// Generate RRULE string from preset
export function presetToRRule(preset: RecurrencePreset, options?: {
  startDate?: Date;
  endDate?: Date;
  count?: number;
  byweekday?: Weekday[];
  interval?: number;
}): string {
  if (preset === 'custom' && !options) {
    throw new Error('Custom preset requires options');
  }

  const baseOptions = preset === 'custom' ? {} : PRESET_RULES[preset];
  const dtstart = options?.startDate || new Date();

  const ruleOptions: Partial<{ freq: Frequency; dtstart: Date; until: Date; count: number; byweekday: Weekday[]; interval: number }> = {
    ...baseOptions,
    dtstart,
    ...(options?.endDate && { until: options.endDate }),
    ...(options?.count && { count: options.count }),
    ...(options?.byweekday && { byweekday: options.byweekday }),
    ...(options?.interval && { interval: options.interval }),
  };

  const rule = new RRule(ruleOptions as any);
  return rule.toString();
}

// Parse RRULE string and get RRule object
export function parseRRule(rruleString: string): RRule | null {
  try {
    return rrulestr(rruleString) as RRule;
  } catch (error) {
    console.error('Failed to parse RRULE:', error);
    return null;
  }
}

// Generate occurrences within a date range
export function generateOccurrences(
  rruleString: string,
  rangeStart: Date,
  rangeEnd: Date,
  maxCount: number = 100
): Date[] {
  const rule = parseRRule(rruleString);
  if (!rule) return [];

  try {
    return rule.between(startOfDay(rangeStart), endOfDay(rangeEnd), true).slice(0, maxCount);
  } catch (error) {
    console.error('Failed to generate occurrences:', error);
    return [];
  }
}

// Check if a specific date is an occurrence
export function isOccurrence(rruleString: string, date: Date): boolean {
  const rule = parseRRule(rruleString);
  if (!rule) return false;

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const occurrences = rule.between(dayStart, dayEnd, true);
  
  return occurrences.length > 0;
}

// Generate virtual instances for recurrent items
export function generateRecurrenceInstances(
  items: AtomItem[],
  rangeStart: Date,
  rangeEnd: Date
): RecurrenceInstance[] {
  const instances: RecurrenceInstance[] = [];

  for (const item of items) {
    if (!item.recurrence_rule) continue;

    const occurrences = generateOccurrences(item.recurrence_rule, rangeStart, rangeEnd);
    const completionLog = item.completion_log || [];

    for (const occurrence of occurrences) {
      const instanceDate = format(occurrence, 'yyyy-MM-dd');
      const isCompleted = completionLog.includes(instanceDate);

      instances.push({
        item,
        instanceDate,
        isCompleted,
        isVirtual: true,
      });
    }
  }

  return instances;
}

// Get instances for a specific date
export function getInstancesForDate(
  items: AtomItem[],
  date: Date
): RecurrenceInstance[] {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return items
    .filter(item => item.recurrence_rule)
    .flatMap(item => {
      const occurrences = generateOccurrences(item.recurrence_rule!, dayStart, dayEnd);
      const completionLog = item.completion_log || [];

      return occurrences.map(occurrence => ({
        item,
        instanceDate: dateStr,
        isCompleted: completionLog.includes(dateStr),
        isVirtual: true as const,
      }));
    });
}

// Calculate streak (consecutive days completed)
export function calculateStreak(completionLog: string[]): number {
  if (!completionLog || completionLog.length === 0) return 0;

  // Sort dates descending
  const sortedDates = [...completionLog]
    .map(d => parseISO(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = startOfDay(new Date());
  let streak = 0;
  let expectedDate = today;

  for (const date of sortedDates) {
    const dateDay = startOfDay(date);
    
    // Check if this date matches the expected date or is the day before
    const dayDiff = Math.floor((expectedDate.getTime() - dateDay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 0 || dayDiff === 1) {
      streak++;
      expectedDate = dateDay;
    } else if (dayDiff > 1) {
      break; // Streak broken
    }
  }

  return streak;
}

// Get longest streak
export function getLongestStreak(completionLog: string[]): number {
  if (!completionLog || completionLog.length === 0) return 0;

  const sortedDates = [...completionLog]
    .map(d => parseISO(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = startOfDay(sortedDates[i - 1]);
    const currDate = startOfDay(sortedDates[i]);
    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (dayDiff > 1) {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

// Get completion rate for a period
export function getCompletionRate(
  rruleString: string,
  completionLog: string[],
  rangeStart: Date,
  rangeEnd: Date
): number {
  const occurrences = generateOccurrences(rruleString, rangeStart, rangeEnd);
  if (occurrences.length === 0) return 0;

  const completedCount = occurrences.filter(occ => {
    const dateStr = format(occ, 'yyyy-MM-dd');
    return completionLog.includes(dateStr);
  }).length;

  return Math.round((completedCount / occurrences.length) * 100);
}

// Human-readable description of RRULE
export function describeRRule(rruleString: string): string {
  const rule = parseRRule(rruleString);
  if (!rule) return 'Recorrência inválida';

  try {
    return rule.toText();
  } catch {
    // Fallback to preset detection
    const options = rule.options;
    
    if (options.freq === Frequency.DAILY) {
      return options.interval === 1 ? 'Diariamente' : `A cada ${options.interval} dias`;
    }
    if (options.freq === Frequency.WEEKLY) {
      if (options.byweekday?.length === 5) return 'Dias úteis';
      return options.interval === 1 ? 'Semanalmente' : `A cada ${options.interval} semanas`;
    }
    if (options.freq === Frequency.MONTHLY) {
      return options.interval === 1 ? 'Mensalmente' : `A cada ${options.interval} meses`;
    }
    if (options.freq === Frequency.YEARLY) {
      return 'Anualmente';
    }

    return 'Recorrência personalizada';
  }
}

// Weekday helpers
export const WEEKDAY_OPTIONS = [
  { value: RRule.MO, label: 'Seg', short: 'S' },
  { value: RRule.TU, label: 'Ter', short: 'T' },
  { value: RRule.WE, label: 'Qua', short: 'Q' },
  { value: RRule.TH, label: 'Qui', short: 'Q' },
  { value: RRule.FR, label: 'Sex', short: 'S' },
  { value: RRule.SA, label: 'Sáb', short: 'S' },
  { value: RRule.SU, label: 'Dom', short: 'D' },
];

export const FREQUENCY_OPTIONS = [
  { value: Frequency.DAILY, label: 'Dia(s)' },
  { value: Frequency.WEEKLY, label: 'Semana(s)' },
  { value: Frequency.MONTHLY, label: 'Mês(es)' },
  { value: Frequency.YEARLY, label: 'Ano(s)' },
];
