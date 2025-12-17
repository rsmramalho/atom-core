import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import 'fake-indexeddb/auto';

// Reset module cache before importing to ensure clean IndexedDB state
let offlineQueue: typeof import('./offline-queue');

describe('🔄 Offline Queue - IndexedDB Integration', () => {
  
  beforeEach(async () => {
    // Clear IndexedDB before each test
    const databases = await indexedDB.databases();
    for (const db of databases) {
      if (db.name) {
        indexedDB.deleteDatabase(db.name);
      }
    }
    
    // Reset module to get fresh db connection
    vi.resetModules();
    offlineQueue = await import('./offline-queue');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------
  // 1. BASIC QUEUE OPERATIONS
  // --------------------------------------------------------
  describe('Basic Operations', () => {
    it('✅ addToQueue: adiciona operação e retorna ID', async () => {
      const id = await offlineQueue.addToQueue({
        type: 'insert',
        table: 'items',
        data: { title: 'Test Task' }
      });

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('✅ getQueuedOperations: retorna operações enfileiradas', async () => {
      await offlineQueue.addToQueue({
        type: 'insert',
        table: 'items',
        data: { title: 'Task 1' }
      });

      const operations = await offlineQueue.getQueuedOperations();
      
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe('insert');
      expect(operations[0].table).toBe('items');
      expect(operations[0].data.title).toBe('Task 1');
    });

    it('✅ getQueueCount: retorna contagem correta', async () => {
      expect(await offlineQueue.getQueueCount()).toBe(0);

      await offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} });
      expect(await offlineQueue.getQueueCount()).toBe(1);

      await offlineQueue.addToQueue({ type: 'update', table: 'items', data: {} });
      expect(await offlineQueue.getQueueCount()).toBe(2);
    });

    it('✅ removeFromQueue: remove operação pelo ID', async () => {
      const id = await offlineQueue.addToQueue({
        type: 'insert',
        table: 'items',
        data: { title: 'To Remove' }
      });

      expect(await offlineQueue.getQueueCount()).toBe(1);

      await offlineQueue.removeFromQueue(id);
      
      expect(await offlineQueue.getQueueCount()).toBe(0);
    });

    it('✅ clearQueue: limpa todas as operações', async () => {
      await offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} });
      await offlineQueue.addToQueue({ type: 'update', table: 'items', data: {} });
      await offlineQueue.addToQueue({ type: 'delete', table: 'items', data: {} });

      expect(await offlineQueue.getQueueCount()).toBe(3);

      await offlineQueue.clearQueue();

      expect(await offlineQueue.getQueueCount()).toBe(0);
    });
  });

  // --------------------------------------------------------
  // 2. FIFO ORDERING
  // --------------------------------------------------------
  describe('FIFO Ordering', () => {
    it('✅ Operações são retornadas na ordem de inserção (FIFO)', async () => {
      await offlineQueue.addToQueue({ type: 'insert', table: 'items', data: { order: 1 } });
      
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await offlineQueue.addToQueue({ type: 'update', table: 'items', data: { order: 2 } });
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await offlineQueue.addToQueue({ type: 'delete', table: 'items', data: { order: 3 } });

      const operations = await offlineQueue.getQueuedOperations();

      expect(operations[0].data.order).toBe(1);
      expect(operations[1].data.order).toBe(2);
      expect(operations[2].data.order).toBe(3);
    });

    it('✅ Timestamps são atribuídos corretamente', async () => {
      const before = Date.now();
      
      await offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} });
      
      const after = Date.now();
      
      const operations = await offlineQueue.getQueuedOperations();
      
      expect(operations[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(operations[0].timestamp).toBeLessThanOrEqual(after);
    });
  });

  // --------------------------------------------------------
  // 3. RETRY COUNT
  // --------------------------------------------------------
  describe('Retry Count Management', () => {
    it('✅ Operações iniciam com retryCount = 0', async () => {
      await offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} });

      const operations = await offlineQueue.getQueuedOperations();
      
      expect(operations[0].retryCount).toBe(0);
    });

    it('✅ updateRetryCount incrementa contador', async () => {
      const id = await offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} });

      await offlineQueue.updateRetryCount(id);
      
      let operations = await offlineQueue.getQueuedOperations();
      expect(operations[0].retryCount).toBe(1);

      await offlineQueue.updateRetryCount(id);
      
      operations = await offlineQueue.getQueuedOperations();
      expect(operations[0].retryCount).toBe(2);
    });

    it('✅ updateRetryCount com ID inexistente não quebra', async () => {
      // Should not throw
      await expect(offlineQueue.updateRetryCount('non-existent-id')).resolves.toBeUndefined();
    });
  });

  // --------------------------------------------------------
  // 4. OPERATION TYPES
  // --------------------------------------------------------
  describe('Operation Types', () => {
    it('✅ Suporta operação INSERT', async () => {
      await offlineQueue.addToQueue({
        type: 'insert',
        table: 'items',
        data: { title: 'New Item', type: 'task' }
      });

      const operations = await offlineQueue.getQueuedOperations();
      expect(operations[0].type).toBe('insert');
    });

    it('✅ Suporta operação UPDATE', async () => {
      await offlineQueue.addToQueue({
        type: 'update',
        table: 'items',
        data: { id: '123', title: 'Updated Title' }
      });

      const operations = await offlineQueue.getQueuedOperations();
      expect(operations[0].type).toBe('update');
    });

    it('✅ Suporta operação DELETE', async () => {
      await offlineQueue.addToQueue({
        type: 'delete',
        table: 'items',
        data: { id: '123' }
      });

      const operations = await offlineQueue.getQueuedOperations();
      expect(operations[0].type).toBe('delete');
    });
  });

  // --------------------------------------------------------
  // 5. DATA INTEGRITY
  // --------------------------------------------------------
  describe('Data Integrity', () => {
    it('✅ Preserva dados complexos (nested objects)', async () => {
      const complexData = {
        title: 'Complex Task',
        tags: ['#focus', '#work'],
        checklist: [
          { id: '1', label: 'Step 1', completed: false },
          { id: '2', label: 'Step 2', completed: true }
        ],
        metadata: {
          source: 'offline',
          priority: 'high'
        }
      };

      await offlineQueue.addToQueue({
        type: 'insert',
        table: 'items',
        data: complexData
      });

      const operations = await offlineQueue.getQueuedOperations();
      
      expect(operations[0].data).toEqual(complexData);
      expect(operations[0].data.tags).toEqual(['#focus', '#work']);
      expect(operations[0].data.checklist).toHaveLength(2);
    });

    it('✅ Preserva diferentes tabelas', async () => {
      await offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} });
      await offlineQueue.addToQueue({ type: 'insert', table: 'onboarding_progress', data: {} });
      await offlineQueue.addToQueue({ type: 'update', table: 'items', data: {} });

      const operations = await offlineQueue.getQueuedOperations();
      
      expect(operations[0].table).toBe('items');
      expect(operations[1].table).toBe('onboarding_progress');
      expect(operations[2].table).toBe('items');
    });

    it('✅ IDs são únicos', async () => {
      const ids = await Promise.all([
        offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} }),
        offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} }),
        offlineQueue.addToQueue({ type: 'insert', table: 'items', data: {} }),
      ]);

      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });

  // --------------------------------------------------------
  // 6. EDGE CASES
  // --------------------------------------------------------
  describe('Edge Cases', () => {
    it('✅ Queue vazia retorna array vazio', async () => {
      const operations = await offlineQueue.getQueuedOperations();
      expect(operations).toEqual([]);
    });

    it('✅ Remover de queue vazia não quebra', async () => {
      await expect(offlineQueue.removeFromQueue('non-existent')).resolves.toBeUndefined();
    });

    it('✅ Limpar queue vazia não quebra', async () => {
      await expect(offlineQueue.clearQueue()).resolves.toBeUndefined();
    });

    it('✅ Múltiplas operações paralelas funcionam', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        offlineQueue.addToQueue({
          type: 'insert',
          table: 'items',
          data: { index: i }
        })
      );

      await Promise.all(promises);

      expect(await offlineQueue.getQueueCount()).toBe(10);
    });

    it('✅ Dados vazios são aceitos', async () => {
      await offlineQueue.addToQueue({
        type: 'insert',
        table: 'items',
        data: {}
      });

      const operations = await offlineQueue.getQueuedOperations();
      expect(operations[0].data).toEqual({});
    });
  });

  // --------------------------------------------------------
  // 7. SYNC SIMULATION
  // --------------------------------------------------------
  describe('Sync Workflow Simulation', () => {
    it('✅ Simula fluxo completo: queue → process → remove', async () => {
      // 1. Queue operations while "offline"
      const id1 = await offlineQueue.addToQueue({
        type: 'insert',
        table: 'items',
        data: { title: 'Offline Task 1' }
      });
      
      const id2 = await offlineQueue.addToQueue({
        type: 'update',
        table: 'items',
        data: { id: 'existing-id', completed: true }
      });

      expect(await offlineQueue.getQueueCount()).toBe(2);

      // 2. "Go online" - process queue
      const operations = await offlineQueue.getQueuedOperations();
      
      // 3. Simulate successful sync
      for (const op of operations) {
        // In real code, this would be a Supabase call
        // await supabase.from(op.table)...
        
        // Remove from queue after success
        await offlineQueue.removeFromQueue(op.id);
      }

      // 4. Queue should be empty
      expect(await offlineQueue.getQueueCount()).toBe(0);
    });

    it('✅ Simula retry com falha', async () => {
      const id = await offlineQueue.addToQueue({
        type: 'insert',
        table: 'items',
        data: { title: 'Will Fail' }
      });

      // Simulate 3 failed attempts
      await offlineQueue.updateRetryCount(id);
      await offlineQueue.updateRetryCount(id);
      await offlineQueue.updateRetryCount(id);

      const operations = await offlineQueue.getQueuedOperations();
      expect(operations[0].retryCount).toBe(3);

      // After max retries, remove from queue
      if (operations[0].retryCount >= 3) {
        await offlineQueue.removeFromQueue(id);
      }

      expect(await offlineQueue.getQueueCount()).toBe(0);
    });
  });

});
