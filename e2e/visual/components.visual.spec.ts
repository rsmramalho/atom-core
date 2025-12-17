import { test, expect } from '../fixtures/auth.fixture';

test.describe('Visual Regression - UI Components', () => {
  test.describe('Buttons', () => {
    test('primary button states', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      const primaryButton = authenticatedPage.locator('button').filter({ hasText: /criar|add|novo/i }).first();
      
      if (await primaryButton.isVisible()) {
        // Default state
        await expect(primaryButton).toHaveScreenshot('button-primary-default.png', {
          maxDiffPixels: 30,
        });

        // Hover state
        await primaryButton.hover();
        await expect(primaryButton).toHaveScreenshot('button-primary-hover.png', {
          maxDiffPixels: 30,
        });
      }
    });
  });

  test.describe('Modals', () => {
    test('command palette', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      // Open command palette
      await authenticatedPage.keyboard.press('Meta+k');
      await authenticatedPage.waitForTimeout(300);

      const commandPalette = authenticatedPage.getByRole('dialog');
      if (await commandPalette.isVisible()) {
        await expect(commandPalette).toHaveScreenshot('modal-command-palette.png', {
          maxDiffPixels: 100,
        });
      }
    });

    test('keyboard shortcuts help', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      const helpButton = authenticatedPage.locator('[data-testid="keyboard-help"]');
      if (await helpButton.isVisible()) {
        await helpButton.click();
        await authenticatedPage.waitForTimeout(300);

        const helpModal = authenticatedPage.getByRole('dialog');
        await expect(helpModal).toHaveScreenshot('modal-keyboard-help.png', {
          maxDiffPixels: 100,
        });
      }
    });

    test('delete confirmation dialog', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      // Find and right-click a task card
      const taskCard = authenticatedPage.locator('[data-testid="task-card"]').first();
      
      if (await taskCard.isVisible()) {
        await taskCard.click({ button: 'right' });
        
        const deleteOption = authenticatedPage.getByRole('menuitem', { name: /excluir|delete/i });
        if (await deleteOption.isVisible()) {
          await deleteOption.click();
          await authenticatedPage.waitForTimeout(300);

          const confirmDialog = authenticatedPage.getByRole('alertdialog');
          if (await confirmDialog.isVisible()) {
            await expect(confirmDialog).toHaveScreenshot('modal-delete-confirm.png', {
              maxDiffPixels: 50,
            });
          }
        }
      }
    });
  });

  test.describe('Context Menu', () => {
    test('task context menu', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      const taskCard = authenticatedPage.locator('[data-testid="task-card"]').first();
      
      if (await taskCard.isVisible()) {
        await taskCard.click({ button: 'right' });
        await authenticatedPage.waitForTimeout(200);

        const contextMenu = authenticatedPage.getByRole('menu');
        if (await contextMenu.isVisible()) {
          await expect(contextMenu).toHaveScreenshot('context-menu-task.png', {
            maxDiffPixels: 50,
          });
        }
      }
    });
  });

  test.describe('Badges', () => {
    test('module badges', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const moduleBadge = authenticatedPage.locator('[data-testid="module-badge"]').first();
      
      if (await moduleBadge.isVisible()) {
        await expect(moduleBadge).toHaveScreenshot('badge-module.png', {
          maxDiffPixels: 20,
        });
      }
    });

    test('streak badge', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      const streakBadge = authenticatedPage.locator('[data-testid="streak-badge"]').first();
      
      if (await streakBadge.isVisible()) {
        await expect(streakBadge).toHaveScreenshot('badge-streak.png', {
          maxDiffPixels: 20,
        });
      }
    });

    test('network status badge', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      const networkBadge = authenticatedPage.locator('[data-testid="network-status"]');
      
      if (await networkBadge.isVisible()) {
        await expect(networkBadge).toHaveScreenshot('badge-network-online.png', {
          maxDiffPixels: 20,
        });
      }
    });
  });

  test.describe('Forms', () => {
    test('quick add task modal', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      
      if (await projectCard.isVisible()) {
        await projectCard.click();
        await authenticatedPage.waitForURL(/\/projects\/.+/);

        // Find add task button
        const addTaskBtn = authenticatedPage.getByRole('button', { name: /tarefa|task/i });
        if (await addTaskBtn.isVisible()) {
          await addTaskBtn.click();
          await authenticatedPage.waitForTimeout(300);

          const modal = authenticatedPage.getByRole('dialog');
          await expect(modal).toHaveScreenshot('form-quick-add-task.png', {
            maxDiffPixels: 100,
          });
        }
      }
    });

    test('recurrence picker', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      
      if (await projectCard.isVisible()) {
        await projectCard.click();
        await authenticatedPage.waitForURL(/\/projects\/.+/);

        const addTaskBtn = authenticatedPage.getByRole('button', { name: /tarefa|task/i });
        if (await addTaskBtn.isVisible()) {
          await addTaskBtn.click();

          const recurrenceBtn = authenticatedPage.getByRole('button', { name: /recorr|repeat/i });
          if (await recurrenceBtn.isVisible()) {
            await recurrenceBtn.click();
            await authenticatedPage.waitForTimeout(300);

            const recurrencePicker = authenticatedPage.locator('[data-testid="recurrence-picker"]');
            if (await recurrencePicker.isVisible()) {
              await expect(recurrencePicker).toHaveScreenshot('form-recurrence-picker.png', {
                maxDiffPixels: 100,
              });
            }
          }
        }
      }
    });
  });

  test.describe('Empty States', () => {
    test('empty dashboard illustration', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      const emptyDashboard = authenticatedPage.locator('[data-testid="empty-dashboard"]');
      
      if (await emptyDashboard.isVisible()) {
        await expect(emptyDashboard).toHaveScreenshot('empty-state-dashboard.png', {
          maxDiffPixels: 100,
        });
      }
    });

    test('empty focus illustration', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');
      await authenticatedPage.waitForLoadState('networkidle');

      const emptyFocus = authenticatedPage.locator('[data-testid="empty-focus"]');
      
      if (await emptyFocus.isVisible()) {
        await expect(emptyFocus).toHaveScreenshot('empty-state-focus.png', {
          maxDiffPixels: 100,
        });
      }
    });
  });

  test.describe('Charts', () => {
    test('analytics line chart', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/analytics');
      await authenticatedPage.waitForLoadState('networkidle');

      const lineChart = authenticatedPage.locator('[data-testid="activity-chart"]');
      
      if (await lineChart.isVisible()) {
        await expect(lineChart).toHaveScreenshot('chart-activity-line.png', {
          maxDiffPixels: 200,
        });
      }
    });

    test('analytics pie chart', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/analytics');
      await authenticatedPage.waitForLoadState('networkidle');

      const pieChart = authenticatedPage.locator('[data-testid="module-distribution-chart"]');
      
      if (await pieChart.isVisible()) {
        await expect(pieChart).toHaveScreenshot('chart-module-pie.png', {
          maxDiffPixels: 200,
        });
      }
    });
  });

  test.describe('Progress Indicators', () => {
    test('project progress bar', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const progressBar = authenticatedPage.locator('[role="progressbar"]').first();
      
      if (await progressBar.isVisible()) {
        await expect(progressBar).toHaveScreenshot('progress-bar-project.png', {
          maxDiffPixels: 30,
        });
      }
    });

    test('ritual progress', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/ritual');
      await authenticatedPage.waitForLoadState('networkidle');

      const ritualProgress = authenticatedPage.locator('[data-testid="ritual-progress"]');
      
      if (await ritualProgress.isVisible()) {
        await expect(ritualProgress).toHaveScreenshot('progress-ritual.png', {
          maxDiffPixels: 30,
        });
      }
    });
  });
});
