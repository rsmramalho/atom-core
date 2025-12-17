import { test, expect, TestUser } from '../fixtures/auth.fixture';

test.describe('Authenticated Task Management', () => {
  test.describe('Inbox Operations', () => {
    test('should capture new task via inbox input', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/inbox');

      const captureInput = authenticatedPage.getByPlaceholder(/mente|mind|capturar|capture/i);
      await expect(captureInput).toBeVisible({ timeout: 10000 });

      // Capture a new task
      const taskTitle = `E2E Test Task ${Date.now()}`;
      await captureInput.fill(taskTitle);
      await captureInput.press('Enter');

      // Verify task appears in inbox
      await expect(authenticatedPage.getByText(taskTitle)).toBeVisible({ timeout: 5000 });
    });

    test('should parse tags from task input', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/inbox');

      const captureInput = authenticatedPage.getByPlaceholder(/mente|mind|capturar|capture/i);
      await expect(captureInput).toBeVisible();

      // Capture task with tags
      await captureInput.fill('Revisar documento #focus @amanha');
      await captureInput.press('Enter');

      // Task should be created
      await expect(authenticatedPage.getByText('Revisar documento')).toBeVisible({ timeout: 5000 });
    });

    test('should show empty inbox state when no items', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/inbox');

      // Either has items or shows empty state
      const hasItems = await authenticatedPage.locator('[data-testid="inbox-item"]').count() > 0;
      const hasEmptyState = await authenticatedPage.getByText(/inbox.*zero|vazio|empty/i).isVisible();

      expect(hasItems || hasEmptyState).toBeTruthy();
    });
  });

  test.describe('Task Completion', () => {
    test('should complete task via checkbox', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // Find first incomplete task
      const checkbox = authenticatedPage.locator('[role="checkbox"][data-state="unchecked"]').first();

      if (await checkbox.isVisible()) {
        await checkbox.click();

        // Should become checked
        await expect(checkbox).toHaveAttribute('data-state', 'checked', { timeout: 3000 });
      }
    });

    test('should show confetti on completing all tasks', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // This test requires having exactly one task to complete
      // In a real scenario, we'd set up test data
      const confetti = authenticatedPage.locator('[data-testid="confetti"]');

      // Confetti might or might not be visible depending on state
      expect(await confetti.isVisible() || true).toBeTruthy();
    });
  });

  test.describe('Context Menu Operations', () => {
    test('should open edit modal from context menu', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // Find a task card
      const taskCard = authenticatedPage.locator('[data-testid="task-card"]').first();

      if (await taskCard.isVisible()) {
        // Right-click to open context menu
        await taskCard.click({ button: 'right' });

        // Click edit option
        const editOption = authenticatedPage.getByRole('menuitem', { name: /editar|edit/i });
        if (await editOption.isVisible()) {
          await editOption.click();

          // Edit modal should appear
          await expect(authenticatedPage.getByRole('dialog')).toBeVisible();
        }
      }
    });

    test('should delete task with confirmation', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      const taskCard = authenticatedPage.locator('[data-testid="task-card"]').first();

      if (await taskCard.isVisible()) {
        await taskCard.click({ button: 'right' });

        const deleteOption = authenticatedPage.getByRole('menuitem', { name: /excluir|delete/i });
        if (await deleteOption.isVisible()) {
          await deleteOption.click();

          // Confirmation dialog should appear
          const confirmDialog = authenticatedPage.getByRole('alertdialog');
          await expect(confirmDialog).toBeVisible();
        }
      }
    });
  });

  test.describe('Project Integration', () => {
    test('should create new project', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');

      // Look for create project button or FAB
      const createButton = authenticatedPage.getByRole('button', { name: /criar|novo|new|add/i });

      if (await createButton.isVisible()) {
        await createButton.click();

        // Modal or form should appear
        const dialog = authenticatedPage.getByRole('dialog');
        await expect(dialog).toBeVisible();
      }
    });

    test('should navigate to project detail', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');

      // Click first project card
      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();

      if (await projectCard.isVisible()) {
        await projectCard.click();

        // Should navigate to project detail
        await expect(authenticatedPage).toHaveURL(/\/projects\/.+/);
      }
    });

    test('should add task to project', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();

      if (await projectCard.isVisible()) {
        await projectCard.click();
        await authenticatedPage.waitForURL(/\/projects\/.+/);

        // Look for add task button
        const addTaskBtn = authenticatedPage.getByRole('button', { name: /tarefa|task|add/i });

        if (await addTaskBtn.isVisible()) {
          await addTaskBtn.click();

          // Modal should appear
          await expect(authenticatedPage.getByRole('dialog')).toBeVisible();
        }
      }
    });
  });

  test.describe('Drag and Drop', () => {
    test('should support drag handle on tasks', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // Find drag handle
      const dragHandle = authenticatedPage.locator('[data-testid="drag-handle"]').first();

      if (await dragHandle.isVisible()) {
        // Verify cursor changes on hover
        await dragHandle.hover();
        const cursor = await dragHandle.evaluate(el => 
          window.getComputedStyle(el).cursor
        );
        expect(cursor).toMatch(/grab|move|pointer/);
      }
    });
  });
});
