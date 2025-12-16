// useRecurrence Hook - Manages recurrence state and completion logging
import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEngineLogger } from '@/hooks/useEngineLogger';
import type { AtomItem } from '@/types/atom-engine';
import {
  generateRecurrenceInstances,
  getInstancesForDate,
  calculateStreak,
  getLongestStreak,
  getCompletionRate,
  describeRRule,
  type RecurrenceInstance,
} from '@/lib/recurrence-engine';

interface UseRecurrenceOptions {
  items: AtomItem[];
}

export function useRecurrence({ items }: UseRecurrenceOptions) {
  const { toast } = useToast();
  const { addLog } = useEngineLogger();

  // Filter items with recurrence rules
  const recurrentItems = useMemo(
    () => items.filter(item => item.recurrence_rule),
    [items]
  );

  // Generate instances for a date range
  const getInstances = useCallback(
    (rangeStart: Date, rangeEnd: Date): RecurrenceInstance[] => {
      return generateRecurrenceInstances(recurrentItems, rangeStart, rangeEnd);
    },
    [recurrentItems]
  );

  // Get instances for today
  const getTodayInstances = useCallback((): RecurrenceInstance[] => {
    return getInstancesForDate(recurrentItems, new Date());
  }, [recurrentItems]);

  // Toggle completion for a specific instance date
  const toggleInstanceCompletion = useCallback(
    async (itemId: string, instanceDate: string) => {
      const item = items.find(i => i.id === itemId);
      if (!item) {
        toast({
          title: 'Erro',
          description: 'Item não encontrado',
          variant: 'destructive',
        });
        return false;
      }

      const completionLog = item.completion_log || [];
      const isCurrentlyCompleted = completionLog.includes(instanceDate);
      
      let newCompletionLog: string[];
      if (isCurrentlyCompleted) {
        // Remove from log
        newCompletionLog = completionLog.filter(d => d !== instanceDate);
        addLog('RecurrenceEngine', `Instância desmarcada: ${instanceDate}`, { itemId });
      } else {
        // Add to log
        newCompletionLog = [...completionLog, instanceDate];
        addLog('RecurrenceEngine', `Instância concluída: ${instanceDate}`, { itemId });
      }

      const { error } = await supabase
        .from('items')
        .update({ 
          completion_log: newCompletionLog,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) {
        console.error('Failed to update completion log:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao atualizar conclusão',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: isCurrentlyCompleted ? 'Desmarcado' : 'Concluído!',
        description: isCurrentlyCompleted 
          ? 'Instância removida do registro'
          : `Hábito registrado para ${instanceDate}`,
      });

      return true;
    },
    [items, addLog, toast]
  );

  // Set recurrence rule for an item
  const setRecurrence = useCallback(
    async (itemId: string, rruleString: string | null) => {
      addLog('RecurrenceEngine', rruleString ? 'Recorrência definida' : 'Recorrência removida', { 
        itemId, 
        rrule: rruleString 
      });

      const { error } = await supabase
        .from('items')
        .update({ 
          recurrence_rule: rruleString,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) {
        console.error('Failed to set recurrence:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao definir recorrência',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: rruleString ? 'Recorrência definida' : 'Recorrência removida',
        description: rruleString ? describeRRule(rruleString) : undefined,
      });

      return true;
    },
    [addLog, toast]
  );

  // Get streak info for an item
  const getStreakInfo = useCallback(
    (itemId: string) => {
      const item = items.find(i => i.id === itemId);
      if (!item) return { current: 0, longest: 0 };

      const completionLog = item.completion_log || [];
      return {
        current: calculateStreak(completionLog),
        longest: getLongestStreak(completionLog),
      };
    },
    [items]
  );

  // Get completion rate for an item
  const getItemCompletionRate = useCallback(
    (itemId: string, rangeStart: Date, rangeEnd: Date) => {
      const item = items.find(i => i.id === itemId);
      if (!item || !item.recurrence_rule) return 0;

      return getCompletionRate(
        item.recurrence_rule,
        item.completion_log || [],
        rangeStart,
        rangeEnd
      );
    },
    [items]
  );

  // Check if instance is completed
  const isInstanceCompleted = useCallback(
    (itemId: string, instanceDate: string) => {
      const item = items.find(i => i.id === itemId);
      if (!item) return false;
      return (item.completion_log || []).includes(instanceDate);
    },
    [items]
  );

  return {
    recurrentItems,
    getInstances,
    getTodayInstances,
    toggleInstanceCompletion,
    setRecurrence,
    getStreakInfo,
    getItemCompletionRate,
    isInstanceCompleted,
  };
}
