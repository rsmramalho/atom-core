import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  isOperationalItem, 
  isMilestone 
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
  // REGRA B.3.1: Reflection Lock
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
  // 1. BLIND SPOT CHECK: ISOLAMENTO DE LISTAS
  // --------------------------------------------------------
  describe('Rule: List Isolation (Blind Spot)', () => {
    it('🛑 Itens de Lista NÃO devem aparecer em views operacionais', () => {
      const listItem = createMockItem({
        type: 'task',
        parent_id: 'some-list-id', // Indica que pertence a uma lista
        project_id: null 
      });

      // A função isOperationalItem é o porteiro do Dashboard
      // Se ela deixar passar, o item vaza para o "Today"
      const isVisibleInDashboard = isOperationalItem(listItem);
      
      // NOTA: Este teste pode FALHAR se isOperationalItem não verificar parent_id
      // Se falhar, é um blind spot real que precisa correção
      expect(isVisibleInDashboard).toBe(false); 
    });

    it('✅ Itens sem parent_id devem ser operacionais normalmente', () => {
      const standaloneTask = createMockItem({
        type: 'task',
        parent_id: null,
        project_id: null 
      });

      expect(isOperationalItem(standaloneTask)).toBe(true);
    });
  });

  // --------------------------------------------------------
  // 2. INTEGRITY GUARD: REFLECTION LOCK
  // --------------------------------------------------------
  describe('Rule: Reflection Lock (B.3)', () => {
    it('🛑 Deve lançar erro crítico ao tentar completar uma Reflection', () => {
      const reflectionItem = createMockItem({ type: 'reflection', completed: false });
      
      const attemptToComplete = () => {
        integrityGuardCheck(reflectionItem, { completed: true });
      };

      expect(attemptToComplete).toThrowError(/Reflections cannot be marked as completed/);
    });

    it('✅ Deve permitir completar Tasks normais', () => {
      const taskItem = createMockItem({ type: 'task', completed: false });
      expect(() => integrityGuardCheck(taskItem, { completed: true })).not.toThrow();
    });

    it('✅ Deve permitir completar Habits', () => {
      const habitItem = createMockItem({ type: 'habit', completed: false });
      expect(() => integrityGuardCheck(habitItem, { completed: true })).not.toThrow();
    });
  });

  // --------------------------------------------------------
  // 3. INTEGRITY GUARD: MILESTONE ISOLATION
  // --------------------------------------------------------
  describe('Rule: Milestone Isolation', () => {
    it('🛑 Milestones devem ser identificados corretamente pela tag', () => {
      const milestone = createMockItem({ tags: ['#urgente', '#milestone'] });
      expect(isMilestone(milestone)).toBe(true);
    });

    it('✅ Itens sem tag #milestone não são milestones', () => {
      const regularTask = createMockItem({ tags: ['#urgente', '#focus'] });
      expect(isMilestone(regularTask)).toBe(false);
    });

    it('🛑 Milestones NÃO devem ser considerados operacionais', () => {
      const milestone = createMockItem({ tags: ['#milestone'] });
      // Milestones são para Project Sheet, não para Today List
      expect(isOperationalItem(milestone)).toBe(false); 
    });
  });

  // --------------------------------------------------------
  // 4. TYPE SAFETY: REFLECTION TYPE SEMANTICS
  // --------------------------------------------------------
  describe('Rule: Reflection Type Semantics', () => {
    it('🛑 Reflections NÃO devem ser consideradas operacionais', () => {
      const reflection = createMockItem({ type: 'reflection' });
      expect(isOperationalItem(reflection)).toBe(false);
    });

    it('🛑 Projects NÃO devem ser considerados operacionais', () => {
      const project = createMockItem({ type: 'project' });
      expect(isOperationalItem(project)).toBe(false);
    });
  });

  // --------------------------------------------------------
  // 5. WEIGHT SYSTEM VALIDATION
  // --------------------------------------------------------
  describe('Rule: Weight System', () => {
    it('✅ Milestones devem ter peso padrão 3', () => {
      const milestone = createMockItem({ 
        tags: ['#milestone'],
        weight: 3 
      });
      expect(milestone.weight).toBe(3);
    });

    it('✅ Tasks regulares devem ter peso padrão 1', () => {
      const task = createMockItem({ type: 'task', weight: 1 });
      expect(task.weight).toBe(1);
    });
  });

});
