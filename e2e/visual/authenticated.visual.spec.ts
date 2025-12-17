import { test, expect } from '../fixtures/auth.fixture';

test.describe('Visual Regression - Dashboard', () => {
  test('dashboard empty state', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Capture dashboard view
    await expect(authenticatedPage).toHaveScreenshot('dashboard-main.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('dashboard with greeting', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Capture header section with greeting
    const header = authenticatedPage.locator('header, [data-testid="dashboard-header"]').first();
    if (await header.isVisible()) {
      await expect(header).toHaveScreenshot('dashboard-header.png', {
        maxDiffPixels: 100,
      });
    }
  });

  test('focus block section', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    const focusBlock = authenticatedPage.locator('[data-testid="focus-block"]');
    if (await focusBlock.isVisible()) {
      await expect(focusBlock).toHaveScreenshot('dashboard-focus-block.png', {
        maxDiffPixels: 100,
      });
    }
  });

  test('today list section', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    const todayList = authenticatedPage.locator('[data-testid="today-list"]');
    if (await todayList.isVisible()) {
      await expect(todayList).toHaveScreenshot('dashboard-today-list.png', {
        maxDiffPixels: 100,
      });
    }
  });

  test('ritual banner', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    const ritualBanner = authenticatedPage.locator('[data-testid="ritual-banner"]');
    if (await ritualBanner.isVisible()) {
      await expect(ritualBanner).toHaveScreenshot('dashboard-ritual-banner.png', {
        maxDiffPixels: 100,
      });
    }
  });
});

test.describe('Visual Regression - Inbox', () => {
  test('inbox page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/inbox');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('inbox-main.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('inbox capture input', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/inbox');
    await authenticatedPage.waitForLoadState('networkidle');

    const captureInput = authenticatedPage.getByPlaceholder(/mente|mind|capturar/i);
    if (await captureInput.isVisible()) {
      await expect(captureInput).toHaveScreenshot('inbox-capture-input.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('inbox empty state', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/inbox');
    await authenticatedPage.waitForLoadState('networkidle');

    const emptyState = authenticatedPage.locator('[data-testid="empty-inbox"]');
    if (await emptyState.isVisible()) {
      await expect(emptyState).toHaveScreenshot('inbox-empty-state.png', {
        maxDiffPixels: 100,
      });
    }
  });

  test('inbox item card', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/inbox');
    await authenticatedPage.waitForLoadState('networkidle');

    const itemCard = authenticatedPage.locator('[data-testid="inbox-item"]').first();
    if (await itemCard.isVisible()) {
      await expect(itemCard).toHaveScreenshot('inbox-item-card.png', {
        maxDiffPixels: 50,
      });
    }
  });
});

test.describe('Visual Regression - Projects', () => {
  test('projects page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/projects');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('projects-main.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('project card', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/projects');
    await authenticatedPage.waitForLoadState('networkidle');

    const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
    if (await projectCard.isVisible()) {
      await expect(projectCard).toHaveScreenshot('project-card.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('project filters', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/projects');
    await authenticatedPage.waitForLoadState('networkidle');

    const filters = authenticatedPage.locator('[data-testid="project-filters"]');
    if (await filters.isVisible()) {
      await expect(filters).toHaveScreenshot('project-filters.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('project detail page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/projects');
    await authenticatedPage.waitForLoadState('networkidle');

    const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/);
      await authenticatedPage.waitForLoadState('networkidle');

      await expect(authenticatedPage).toHaveScreenshot('project-detail.png', {
        fullPage: true,
        maxDiffPixels: 200,
      });
    }
  });
});

test.describe('Visual Regression - Ritual', () => {
  test('ritual view', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/ritual');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('ritual-main.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('ritual header with period', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/ritual');
    await authenticatedPage.waitForLoadState('networkidle');

    const header = authenticatedPage.locator('[data-testid="ritual-header"]');
    if (await header.isVisible()) {
      await expect(header).toHaveScreenshot('ritual-header.png', {
        maxDiffPixels: 100,
      });
    }
  });

  test('habit card in ritual', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/ritual');
    await authenticatedPage.waitForLoadState('networkidle');

    const habitCard = authenticatedPage.locator('[data-testid="habit-card"]').first();
    if (await habitCard.isVisible()) {
      await expect(habitCard).toHaveScreenshot('ritual-habit-card.png', {
        maxDiffPixels: 50,
      });
    }
  });
});

test.describe('Visual Regression - Calendar', () => {
  test('calendar monthly view', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/calendar');
    await authenticatedPage.waitForLoadState('networkidle');

    // Ensure monthly view
    await authenticatedPage.keyboard.press('m');
    await authenticatedPage.waitForTimeout(500);

    await expect(authenticatedPage).toHaveScreenshot('calendar-monthly.png', {
      fullPage: true,
      maxDiffPixels: 300,
    });
  });

  test('calendar weekly view', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/calendar');
    await authenticatedPage.waitForLoadState('networkidle');

    // Switch to weekly view
    await authenticatedPage.keyboard.press('w');
    await authenticatedPage.waitForTimeout(500);

    await expect(authenticatedPage).toHaveScreenshot('calendar-weekly.png', {
      fullPage: true,
      maxDiffPixels: 300,
    });
  });

  test('calendar day cell', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/calendar');
    await authenticatedPage.waitForLoadState('networkidle');

    const dayCell = authenticatedPage.locator('[data-testid="day-cell"]').first();
    if (await dayCell.isVisible()) {
      await expect(dayCell).toHaveScreenshot('calendar-day-cell.png', {
        maxDiffPixels: 50,
      });
    }
  });
});

test.describe('Visual Regression - Journal', () => {
  test('journal page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/journal');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('journal-main.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('journal composer', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/journal');
    await authenticatedPage.waitForLoadState('networkidle');

    const composer = authenticatedPage.locator('[data-testid="journal-composer"]');
    if (await composer.isVisible()) {
      await expect(composer).toHaveScreenshot('journal-composer.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('journal reflection card', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/journal');
    await authenticatedPage.waitForLoadState('networkidle');

    const reflectionCard = authenticatedPage.locator('[data-testid="reflection-card"]').first();
    if (await reflectionCard.isVisible()) {
      await expect(reflectionCard).toHaveScreenshot('journal-reflection-card.png', {
        maxDiffPixels: 50,
      });
    }
  });
});

test.describe('Visual Regression - Analytics', () => {
  test('analytics dashboard', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/analytics');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('analytics-main.png', {
      fullPage: true,
      maxDiffPixels: 300,
    });
  });

  test('analytics summary cards', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/analytics');
    await authenticatedPage.waitForLoadState('networkidle');

    const summaryCards = authenticatedPage.locator('[data-testid="analytics-summary"]');
    if (await summaryCards.isVisible()) {
      await expect(summaryCards).toHaveScreenshot('analytics-summary.png', {
        maxDiffPixels: 100,
      });
    }
  });
});

test.describe('Visual Regression - Lists', () => {
  test('lists page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/lists');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('lists-main.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('list card', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/lists');
    await authenticatedPage.waitForLoadState('networkidle');

    const listCard = authenticatedPage.locator('[data-testid="list-card"]').first();
    if (await listCard.isVisible()) {
      await expect(listCard).toHaveScreenshot('list-card.png', {
        maxDiffPixels: 50,
      });
    }
  });
});
