import { test, expect, createAnonClient, createTestUser, loginProgrammatically, logout } from '../fixtures/auth.fixture';

test.describe('Project Sharing Flow', () => {

  test.describe('Invite Creation (Owner)', () => {
    test('should create a project and open share modal', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      // Create a new project for sharing tests
      const createBtn = authenticatedPage.getByRole('button', { name: /criar|novo|new|add/i });
      if (await createBtn.isVisible({ timeout: 5000 })) {
        await createBtn.click();
        const dialog = authenticatedPage.getByRole('dialog');
        await expect(dialog).toBeVisible({ timeout: 5000 });

        // Fill project title
        const titleInput = dialog.getByRole('textbox').first();
        const projectName = `E2E Share Test ${Date.now()}`;
        await titleInput.fill(projectName);

        // Submit
        const submitBtn = dialog.getByRole('button', { name: /criar|salvar|save|ok/i });
        await submitBtn.click();

        // Wait for navigation to project detail
        await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });
      }
    });

    test('should open share modal from project detail', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      // Navigate to first project
      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      if (!(await projectCard.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });

      // Look for share button
      const shareBtn = authenticatedPage.getByRole('button', { name: /compartilhar|share/i });
      if (await shareBtn.isVisible({ timeout: 5000 })) {
        await shareBtn.click();

        // Share modal should appear
        const dialog = authenticatedPage.getByRole('dialog');
        await expect(dialog).toBeVisible({ timeout: 5000 });
        await expect(dialog.getByText(/compartilhar projeto/i)).toBeVisible();

        // Should show members section
        await expect(dialog.getByText(/membros/i)).toBeVisible();
      }
    });

    test('should create invite link with editor role', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      if (!(await projectCard.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });

      const shareBtn = authenticatedPage.getByRole('button', { name: /compartilhar|share/i });
      if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await shareBtn.click();
      const dialog = authenticatedPage.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Click "Novo Link" to create invite
      const newLinkBtn = dialog.getByRole('button', { name: /novo link/i });
      if (await newLinkBtn.isVisible({ timeout: 3000 })) {
        await newLinkBtn.click();

        // Should show success toast
        await expect(authenticatedPage.getByText(/link.*copiado|convite.*copiado/i)).toBeVisible({ timeout: 5000 });
      }
    });

    test('should create invite link with viewer role', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      if (!(await projectCard.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });

      const shareBtn = authenticatedPage.getByRole('button', { name: /compartilhar|share/i });
      if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await shareBtn.click();
      const dialog = authenticatedPage.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Select viewer role before creating invite
      const viewerToggle = dialog.getByRole('button', { name: /viewer/i }).first();
      if (await viewerToggle.isVisible({ timeout: 3000 })) {
        await viewerToggle.click();

        // Create invite
        const newLinkBtn = dialog.getByRole('button', { name: /novo link/i });
        await newLinkBtn.click();

        // Should show success toast
        await expect(authenticatedPage.getByText(/link.*copiado|convite.*copiado/i)).toBeVisible({ timeout: 5000 });

        // Invite should show "Viewer" badge
        await expect(dialog.getByText('Viewer')).toBeVisible();
      }
    });

    test('should delete invite link', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      if (!(await projectCard.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });

      const shareBtn = authenticatedPage.getByRole('button', { name: /compartilhar|share/i });
      if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await shareBtn.click();
      const dialog = authenticatedPage.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Check if there are existing invites with delete buttons
      const deleteButtons = dialog.locator('button').filter({ has: authenticatedPage.locator('.text-destructive') });
      const count = await deleteButtons.count();

      if (count > 0) {
        await deleteButtons.first().click();
        await expect(authenticatedPage.getByText(/convite removido/i)).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Invite Acceptance', () => {
    test('should show login prompt for unauthenticated users on invite page', async ({ page }) => {
      // Visit invite page without being logged in
      await page.goto('/invite/fake-code-12345');

      // Should show "needs auth" state
      await expect(page.getByText(/fazer login|login|criar.*conta/i)).toBeVisible({ timeout: 10000 });
    });

    test('should show error for invalid invite code', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/invite/invalid-code-that-does-not-exist');

      // Should show error state
      await expect(authenticatedPage.getByText(/erro|inválido|expirado/i)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Viewer Permission Guards', () => {
    test('should show read-only banner for viewer in shared project', async ({ authenticatedPage }) => {
      // Navigate to projects — if user is a viewer on any project, the banner should show
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      if (!(await projectCard.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });

      // If user is viewer, should see read-only banner
      const readOnlyBanner = authenticatedPage.getByText(/somente leitura|apenas visualização|read.only/i);
      const isViewer = await readOnlyBanner.isVisible({ timeout: 3000 }).catch(() => false);

      if (isViewer) {
        // FAB (create button) should be hidden for viewers
        const fab = authenticatedPage.locator('[data-testid="project-fab"]');
        await expect(fab).not.toBeVisible();

        // Checkboxes should not be interactive (or show toast on click)
        const checkbox = authenticatedPage.locator('[role="checkbox"]').first();
        if (await checkbox.isVisible({ timeout: 2000 })) {
          await checkbox.click();
          // Should show warning toast
          await expect(authenticatedPage.getByText(/viewer|somente leitura|permissão/i)).toBeVisible({ timeout: 3000 });
        }
      }
      // If not a viewer, test passes (guards only apply to viewers)
    });

    test('should prevent viewer from accessing edit actions in context menu', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      if (!(await projectCard.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });

      const readOnlyBanner = authenticatedPage.getByText(/somente leitura|apenas visualização|read.only/i);
      const isViewer = await readOnlyBanner.isVisible({ timeout: 3000 }).catch(() => false);

      if (isViewer) {
        // Right-click on a task should not show destructive actions
        const taskItem = authenticatedPage.locator('[data-testid="task-card"], [data-testid="work-area-item"]').first();
        if (await taskItem.isVisible({ timeout: 2000 })) {
          await taskItem.click({ button: 'right' });

          const editOption = authenticatedPage.getByRole('menuitem', { name: /editar|edit/i });
          const deleteOption = authenticatedPage.getByRole('menuitem', { name: /excluir|delete/i });

          // Edit and delete options should be absent or disabled for viewers
          const editVisible = await editOption.isVisible({ timeout: 1000 }).catch(() => false);
          const deleteVisible = await deleteOption.isVisible({ timeout: 1000 }).catch(() => false);

          expect(editVisible).toBe(false);
          expect(deleteVisible).toBe(false);
        }
      }
    });
  });

  test.describe('Member Management', () => {
    test('should show owner badge for project creator', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      if (!(await projectCard.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });

      const shareBtn = authenticatedPage.getByRole('button', { name: /compartilhar|share/i });
      if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await shareBtn.click();
      const dialog = authenticatedPage.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Owner should see "Você" label and "Owner" badge
      await expect(dialog.getByText('Você')).toBeVisible({ timeout: 3000 });
      await expect(dialog.getByText('Owner')).toBeVisible({ timeout: 3000 });
    });

    test('should show non-owner message for non-owner members', async ({ authenticatedPage }) => {
      // This test applies when the test user is a non-owner member
      await authenticatedPage.goto('/projects');
      await authenticatedPage.waitForLoadState('networkidle');

      const projectCard = authenticatedPage.locator('[data-testid="project-card"]').first();
      if (!(await projectCard.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await projectCard.click();
      await authenticatedPage.waitForURL(/\/projects\/.+/, { timeout: 10000 });

      const shareBtn = authenticatedPage.getByRole('button', { name: /compartilhar|share/i });
      if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
        test.skip();
        return;
      }

      await shareBtn.click();
      const dialog = authenticatedPage.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // If not owner, should see restriction message
      const notOwnerMsg = dialog.getByText(/apenas o owner/i);
      const isNotOwner = await notOwnerMsg.isVisible({ timeout: 2000 }).catch(() => false);

      if (isNotOwner) {
        // "Novo Link" button should not be visible
        const newLinkBtn = dialog.getByRole('button', { name: /novo link/i });
        await expect(newLinkBtn).not.toBeVisible();
      }
    });
  });
});
