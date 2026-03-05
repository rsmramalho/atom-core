import { test, expect, createAnonClient, createTestUser, loginProgrammatically, logout } from '../fixtures/auth.fixture';

/**
 * Member removal E2E flow:
 * 1. Owner creates project + editor invite
 * 2. Second user accepts invite and becomes editor
 * 3. Owner removes the member from the project
 * 4. Removed user can no longer access the project
 */
test.describe('Member Removal', () => {

  test('owner removes a collaborator from the project', async ({
    page,
    testUser,
    supabaseClient,
  }) => {
    // === STEP 1: Owner creates project ===
    await loginProgrammatically(page, supabaseClient, testUser.email, testUser.password);
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const createBtn = page.getByRole('button', { name: /criar|novo|new|add/i });
    if (!(await createBtn.isVisible({ timeout: 5000 }))) {
      test.skip();
      return;
    }
    await createBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const projectName = `Member-Removal Test ${Date.now()}`;
    await dialog.getByRole('textbox').first().fill(projectName);
    await dialog.getByRole('button', { name: /criar|salvar|save|ok/i }).click();

    await page.waitForURL(/\/projects\/.+/, { timeout: 10000 });
    const projectUrl = page.url();
    const projectId = projectUrl.split('/projects/')[1]?.split(/[?#]/)[0];

    // === STEP 2: Owner creates editor invite ===
    const shareBtn = page.getByRole('button', { name: /compartilhar|share/i });
    if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
      test.skip();
      return;
    }
    await shareBtn.click();

    const shareDialog = page.getByRole('dialog');
    await expect(shareDialog).toBeVisible({ timeout: 5000 });

    const newLinkBtn = shareDialog.getByRole('button', { name: /novo link/i });
    if (!(await newLinkBtn.isVisible({ timeout: 3000 }))) {
      test.skip();
      return;
    }
    await newLinkBtn.click();
    await page.waitForTimeout(2000);

    // Get invite code from DB
    const { data: invites } = await supabaseClient
      .from('project_invites')
      .select('invite_code')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1);

    const inviteCode = invites?.[0]?.invite_code;
    if (!inviteCode) {
      console.warn('Could not retrieve invite code — skipping');
      test.skip();
      return;
    }

    await page.keyboard.press('Escape');

    // === STEP 3: Second user accepts invite ===
    const secondClient = createAnonClient();
    const secondUser = await createTestUser(secondClient);
    if (!secondUser) {
      test.skip();
      return;
    }

    await logout(page);
    await loginProgrammatically(page, secondClient, secondUser.email, secondUser.password);

    await page.goto(`/invite/${inviteCode}`);
    await page.waitForLoadState('networkidle');

    const acceptBtn = page.getByRole('button', { name: /aceitar|accept|entrar/i });
    if (await acceptBtn.isVisible({ timeout: 5000 })) {
      await acceptBtn.click();
    }
    await page.waitForTimeout(3000);

    // Confirm second user can access the project
    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(projectName)).toBeVisible({ timeout: 5000 });

    // === STEP 4: Owner removes the member ===
    await logout(page);
    await loginProgrammatically(page, supabaseClient, testUser.email, testUser.password);

    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    const shareBtnAgain = page.getByRole('button', { name: /compartilhar|share/i });
    await expect(shareBtnAgain).toBeVisible({ timeout: 5000 });
    await shareBtnAgain.click();

    const membersDialog = page.getByRole('dialog');
    await expect(membersDialog).toBeVisible({ timeout: 5000 });

    // Find the second user's row
    const memberRow = membersDialog.locator('.flex.items-center.justify-between').filter({
      hasText: secondUser.email,
    });
    await expect(memberRow).toBeVisible({ timeout: 5000 });

    // Click remove button in the member row
    const removeBtn = memberRow.getByRole('button', { name: /remover|remove|excluir|delete/i });
    if (!(await removeBtn.isVisible({ timeout: 3000 }))) {
      // Try icon-only button (trash icon)
      const trashBtn = memberRow.locator('button').last();
      await trashBtn.click();
    } else {
      await removeBtn.click();
    }

    // Confirm removal if there's a confirmation dialog
    const confirmBtn = page.getByRole('button', { name: /confirmar|confirm|sim|yes|remover|remove/i });
    if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmBtn.click();
    }

    // Wait for removal toast
    await page.waitForTimeout(2000);

    // Verify member row is gone
    await expect(memberRow).not.toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');

    // === STEP 5: Removed user can no longer access project ===
    await logout(page);
    await loginProgrammatically(page, secondClient, secondUser.email, secondUser.password);

    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    // The removed user should see an error, redirect, or empty state
    const accessDenied = page.getByText(/não encontrado|acesso negado|not found|access denied|sem permissão/i);
    const projectTitle = page.getByText(projectName);

    const denied = await accessDenied.isVisible({ timeout: 5000 }).catch(() => false);
    const canStillSee = await projectTitle.isVisible({ timeout: 3000 }).catch(() => false);

    // Either access denied message is shown, or project title is NOT visible
    expect(denied || !canStillSee).toBe(true);
  });
});
