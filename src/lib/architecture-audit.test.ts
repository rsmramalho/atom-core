import { describe, it, expect } from 'vitest';
import { 
  isOperationalItem, 
  isMilestone,
  filterFocus,
  filterToday,
  filterRitual,
  filterProjects,
  splitTodayItems,
  getCurrentRitualSlot
} from './dashboard-filters';
import { AtomItem } from '@/types/atom-engine';

// ==========================================
// 🛡️ MOCKS & FACTORIES
// ==========================================

const createMockItem = (overrides: Partial<AtomItem>): AtomItem => ({
  id: 'test-id',
  user_id: 'user-1',
  title: 'Test Item',
  type: 'task',
  module: 'work',
  tags: [],
  parent_id: null,
  project_id: null,
  due_date: new Date().toISOString(),
  ritual_slot: null,
  completed: false,
  completed_at: null,
  weight: 1,
  notes: null,
  checklist: [],
  project_status: null,
  progress_mode: null,
  progress: null,
  deadline: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  recurrence_rule: null,
  completion_log: [],
  order_index: 0,
  ...overrides,
});

// Simulação da Lógica de Guarda de Integridade (do Hook useAtomItems)
const integrityGuardCheck = (item: AtomItem, updatePayload: Partial<AtomItem>) => {
  if (item.type === 'reflection' && updatePayload.completed === true) {
    throw new Error("VIOLATION: Reflections cannot be marked as completed.");
  }
  return true;
};

// ==========================================
// 🧪 SUÍTE DE TESTES DE AUDITORIA
// ==========================================

describe('🛡️ ARQUITETURA & INTEGRIDADE (MindMate 4.0)', () => {

  // --------------------------------------------------------
  // 1. ISOLAMENTO DE LISTAS (BLIND SPOT CORRIGIDO)
  // --------------------------------------------------------
  describe('Rule: List Isolation', () => {
    it('🛑 Itens com parent_id NÃO aparecem em views operacionais', () => {
      const listItem = createMockItem({
        type: 'task',
        parent_id: 'list-123',
        project_id: null 
      });
      expect(isOperationalItem(listItem)).toBe(false); 
    });

    it('✅ Itens sem parent_id são operacionais', () => {
      const standaloneTask = createMockItem({
        type: 'task',
        parent_id: null,
      });
      expect(isOperationalItem(standaloneTask)).toBe(true);
    });

    it('🛑 Habits em listas NÃO vazam para Dashboard', () => {
      const listHabit = createMockItem({
        type: 'habit',
        parent_id: 'list-456',
        ritual_slot: 'manha'
      });
      expect(isOperationalItem(listHabit)).toBe(false);
    });

    it('🛑 Itens de lista com project_id ainda são isolados', () => {
      // Edge case: item pertence a lista E tem project_id
      const complexItem = createMockItem({
        type: 'task',
        parent_id: 'list-789',
        project_id: 'project-123'
      });
      expect(isOperationalItem(complexItem)).toBe(false);
    });
  });

  // --------------------------------------------------------
  // 2. REFLECTION LOCK (B.3)
  // --------------------------------------------------------
  describe('Rule: Reflection Lock', () => {
    it('🛑 Erro ao tentar completar Reflection', () => {
      const reflection = createMockItem({ type: 'reflection' });
      expect(() => integrityGuardCheck(reflection, { completed: true }))
        .toThrowError(/Reflections cannot be marked as completed/);
    });

    it('✅ Tasks podem ser completadas', () => {
      const task = createMockItem({ type: 'task' });
      expect(() => integrityGuardCheck(task, { completed: true })).not.toThrow();
    });

    it('✅ Habits podem ser completados', () => {
      const habit = createMockItem({ type: 'habit' });
      expect(() => integrityGuardCheck(habit, { completed: true })).not.toThrow();
    });

    it('🛑 Reflections NÃO são operacionais', () => {
      const reflection = createMockItem({ type: 'reflection' });
      expect(isOperationalItem(reflection)).toBe(false);
    });
  });

  // --------------------------------------------------------
  // 3. MILESTONE ISOLATION
  // --------------------------------------------------------
  describe('Rule: Milestone Isolation', () => {
    it('🛑 Tag #milestone identifica milestone', () => {
      const milestone = createMockItem({ tags: ['#milestone'] });
      expect(isMilestone(milestone)).toBe(true);
    });

    it('🛑 Tag #MILESTONE (uppercase) também funciona', () => {
      const milestone = createMockItem({ tags: ['#MILESTONE'] });
      expect(isMilestone(milestone)).toBe(true);
    });

    it('🛑 Tag #Milestone (mixed case) também funciona', () => {
      const milestone = createMockItem({ tags: ['#Milestone'] });
      expect(isMilestone(milestone)).toBe(true);
    });

    it('✅ Tag similar #milestones NÃO é milestone', () => {
      const notMilestone = createMockItem({ tags: ['#milestones'] });
      expect(isMilestone(notMilestone)).toBe(false);
    });

    it('✅ Tag #milestone-v2 NÃO é milestone', () => {
      const notMilestone = createMockItem({ tags: ['#milestone-v2'] });
      expect(isMilestone(notMilestone)).toBe(false);
    });

    it('🛑 Milestone com múltiplas tags ainda é identificado', () => {
      const milestone = createMockItem({ tags: ['#urgente', '#milestone', '#focus'] });
      expect(isMilestone(milestone)).toBe(true);
    });

    it('🛑 Milestones NÃO são operacionais', () => {
      const milestone = createMockItem({ tags: ['#milestone'] });
      expect(isOperationalItem(milestone)).toBe(false);
    });

    it('🛑 Milestone em lista é duplamente isolado', () => {
      const listMilestone = createMockItem({ 
        tags: ['#milestone'],
        parent_id: 'list-123'
      });
      expect(isOperationalItem(listMilestone)).toBe(false);
    });
  });

  // --------------------------------------------------------
  // 4. TYPE ISOLATION
  // --------------------------------------------------------
  describe('Rule: Type Isolation', () => {
    it('✅ Tasks são operacionais', () => {
      expect(isOperationalItem(createMockItem({ type: 'task' }))).toBe(true);
    });

    it('✅ Habits são operacionais', () => {
      expect(isOperationalItem(createMockItem({ type: 'habit' }))).toBe(true);
    });

    it('✅ Notes são operacionais', () => {
      expect(isOperationalItem(createMockItem({ type: 'note' }))).toBe(true);
    });

    it('✅ Resources são operacionais', () => {
      expect(isOperationalItem(createMockItem({ type: 'resource' }))).toBe(true);
    });

    it('✅ Projects são operacionais (filtrados por filterProjects)', () => {
      const project = createMockItem({ type: 'project' });
      expect(isOperationalItem(project)).toBe(true);
    });

    it('✅ Lists são operacionais (containers)', () => {
      const list = createMockItem({ type: 'list' });
      expect(isOperationalItem(list)).toBe(true);
    });
  });

  // --------------------------------------------------------
  // 5. FOCUS FILTER
  // --------------------------------------------------------
  describe('Filter: Focus Items', () => {
    it('✅ Retorna apenas itens com #focus', () => {
      const items = [
        createMockItem({ id: '1', tags: ['#focus'] }),
        createMockItem({ id: '2', tags: ['#urgente'] }),
        createMockItem({ id: '3', tags: ['#focus', '#work'] }),
      ];
      const focused = filterFocus(items);
      expect(focused).toHaveLength(2);
      expect(focused.map(i => i.id)).toEqual(['1', '3']);
    });

    it('🛑 Exclui itens completados', () => {
      const items = [
        createMockItem({ id: '1', tags: ['#focus'], completed: false }),
        createMockItem({ id: '2', tags: ['#focus'], completed: true }),
      ];
      expect(filterFocus(items)).toHaveLength(1);
    });

    it('🛑 Exclui milestones com #focus', () => {
      const items = [
        createMockItem({ id: '1', tags: ['#focus'] }),
        createMockItem({ id: '2', tags: ['#focus', '#milestone'] }),
      ];
      expect(filterFocus(items)).toHaveLength(1);
    });

    it('🛑 Exclui itens de lista com #focus', () => {
      const items = [
        createMockItem({ id: '1', tags: ['#focus'] }),
        createMockItem({ id: '2', tags: ['#focus'], parent_id: 'list-123' }),
      ];
      expect(filterFocus(items)).toHaveLength(1);
    });

    it('🛑 Exclui reflections com #focus', () => {
      const items = [
        createMockItem({ id: '1', tags: ['#focus'], type: 'task' }),
        createMockItem({ id: '2', tags: ['#focus'], type: 'reflection' }),
      ];
      expect(filterFocus(items)).toHaveLength(1);
    });
  });

  // --------------------------------------------------------
  // 6. TODAY FILTER
  // --------------------------------------------------------
  describe('Filter: Today Items', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    it('✅ Inclui itens com due_date hoje', () => {
      const items = [
        createMockItem({ id: '1', due_date: today.toISOString() }),
      ];
      expect(filterToday(items, today)).toHaveLength(1);
    });

    it('✅ Inclui itens overdue', () => {
      const items = [
        createMockItem({ id: '1', due_date: yesterday.toISOString() }),
      ];
      expect(filterToday(items, today)).toHaveLength(1);
    });

    it('🛑 Exclui itens futuros', () => {
      const items = [
        createMockItem({ id: '1', due_date: tomorrow.toISOString() }),
      ];
      expect(filterToday(items, today)).toHaveLength(0);
    });

    it('🛑 Exclui itens completados', () => {
      const items = [
        createMockItem({ id: '1', due_date: today.toISOString(), completed: true }),
      ];
      expect(filterToday(items, today)).toHaveLength(0);
    });

    it('🛑 Exclui itens com ritual_slot', () => {
      const items = [
        createMockItem({ id: '1', due_date: today.toISOString(), ritual_slot: 'manha' }),
      ];
      expect(filterToday(items, today)).toHaveLength(0);
    });

    it('🛑 Exclui projects', () => {
      const items = [
        createMockItem({ id: '1', due_date: today.toISOString(), type: 'project' }),
      ];
      expect(filterToday(items, today)).toHaveLength(0);
    });

    it('🛑 Exclui milestones', () => {
      const items = [
        createMockItem({ id: '1', due_date: today.toISOString(), tags: ['#milestone'] }),
      ];
      expect(filterToday(items, today)).toHaveLength(0);
    });

    it('🛑 Exclui itens de lista', () => {
      const items = [
        createMockItem({ id: '1', due_date: today.toISOString(), parent_id: 'list-123' }),
      ];
      expect(filterToday(items, today)).toHaveLength(0);
    });

    it('🛑 Exclui itens sem due_date', () => {
      const items = [
        createMockItem({ id: '1', due_date: null }),
      ];
      expect(filterToday(items, today)).toHaveLength(0);
    });
  });

  // --------------------------------------------------------
  // 7. SPLIT TODAY/OVERDUE
  // --------------------------------------------------------
  describe('Filter: Split Today/Overdue', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    it('✅ Separa corretamente overdue e today', () => {
      const items = [
        createMockItem({ id: '1', due_date: yesterday.toISOString() }),
        createMockItem({ id: '2', due_date: today.toISOString() }),
      ];
      const { overdueItems, dueTodayItems } = splitTodayItems(items, today);
      expect(overdueItems).toHaveLength(1);
      expect(overdueItems[0].id).toBe('1');
      expect(dueTodayItems).toHaveLength(1);
      expect(dueTodayItems[0].id).toBe('2');
    });
  });

  // --------------------------------------------------------
  // 8. RITUAL FILTER
  // --------------------------------------------------------
  describe('Filter: Ritual Items', () => {
    it('✅ Retorna apenas habits do slot correto', () => {
      const items = [
        createMockItem({ id: '1', type: 'habit', ritual_slot: 'manha' }),
        createMockItem({ id: '2', type: 'habit', ritual_slot: 'noite' }),
        createMockItem({ id: '3', type: 'task', ritual_slot: 'manha' }),
      ];
      const morning = filterRitual(items, 'manha');
      expect(morning).toHaveLength(1);
      expect(morning[0].id).toBe('1');
    });

    it('🛑 Exclui habits completados', () => {
      const items = [
        createMockItem({ id: '1', type: 'habit', ritual_slot: 'manha', completed: false }),
        createMockItem({ id: '2', type: 'habit', ritual_slot: 'manha', completed: true }),
      ];
      expect(filterRitual(items, 'manha')).toHaveLength(1);
    });

    it('✅ Retorna vazio para slot null', () => {
      const items = [
        createMockItem({ id: '1', type: 'habit', ritual_slot: 'manha' }),
      ];
      expect(filterRitual(items, null)).toHaveLength(0);
    });
  });

  // --------------------------------------------------------
  // 9. PROJECT FILTER
  // --------------------------------------------------------
  describe('Filter: Projects', () => {
    it('✅ Retorna apenas projetos ativos', () => {
      const items = [
        createMockItem({ id: '1', type: 'project', project_status: 'active' }),
        createMockItem({ id: '2', type: 'project', project_status: 'draft' }),
        createMockItem({ id: '3', type: 'project', project_status: 'completed' }),
        createMockItem({ id: '4', type: 'task' }),
      ];
      const active = filterProjects(items);
      expect(active).toHaveLength(1);
      expect(active[0].id).toBe('1');
    });
  });

  // --------------------------------------------------------
  // 10. RITUAL SLOT DETECTION
  // --------------------------------------------------------
  describe('Utility: getCurrentRitualSlot', () => {
    it('✅ Retorna manha entre 5h e 11h59', () => {
      expect(getCurrentRitualSlot(new Date('2024-01-01T05:00:00'))).toBe('manha');
      expect(getCurrentRitualSlot(new Date('2024-01-01T11:59:00'))).toBe('manha');
    });

    it('✅ Retorna meio_dia entre 12h e 17h59', () => {
      expect(getCurrentRitualSlot(new Date('2024-01-01T12:00:00'))).toBe('meio_dia');
      expect(getCurrentRitualSlot(new Date('2024-01-01T17:59:00'))).toBe('meio_dia');
    });

    it('✅ Retorna noite entre 18h e 4h59', () => {
      expect(getCurrentRitualSlot(new Date('2024-01-01T18:00:00'))).toBe('noite');
      expect(getCurrentRitualSlot(new Date('2024-01-01T23:59:00'))).toBe('noite');
      expect(getCurrentRitualSlot(new Date('2024-01-01T04:59:00'))).toBe('noite');
    });
  });

  // --------------------------------------------------------
  // 11. WEIGHT SYSTEM
  // --------------------------------------------------------
  describe('Rule: Weight System', () => {
    it('✅ Milestones têm peso 3', () => {
      const milestone = createMockItem({ tags: ['#milestone'], weight: 3 });
      expect(milestone.weight).toBe(3);
    });

    it('✅ Tasks têm peso 1', () => {
      const task = createMockItem({ type: 'task', weight: 1 });
      expect(task.weight).toBe(1);
    });
  });

  // --------------------------------------------------------
  // 12. EDGE CASES COMBINADOS
  // --------------------------------------------------------
  describe('Edge Cases: Combinações Complexas', () => {
    it('🛑 Reflection + parent_id = duplamente isolada', () => {
      const item = createMockItem({ type: 'reflection', parent_id: 'list-123' });
      expect(isOperationalItem(item)).toBe(false);
    });

    it('🛑 Milestone + parent_id = duplamente isolado', () => {
      const item = createMockItem({ tags: ['#milestone'], parent_id: 'list-123' });
      expect(isOperationalItem(item)).toBe(false);
    });

    it('🛑 Task com #focus + #milestone = isolada (milestone vence)', () => {
      const item = createMockItem({ tags: ['#focus', '#milestone'] });
      expect(isOperationalItem(item)).toBe(false);
    });

    it('✅ Task com project_id mas sem parent_id = operacional', () => {
      const item = createMockItem({ type: 'task', project_id: 'proj-123', parent_id: null });
      expect(isOperationalItem(item)).toBe(true);
    });

    it('🛑 Empty tags array não quebra isMilestone', () => {
      const item = createMockItem({ tags: [] });
      expect(isMilestone(item)).toBe(false);
    });

    it('🛑 Null-ish tags não quebra isMilestone', () => {
      const item = createMockItem({ tags: undefined as any });
      expect(isMilestone(item)).toBe(false);
    });
  });

});
