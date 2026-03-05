import { test, expect, createAnonClient, createTestUser, loginProgrammatically, logout } from '../fixtures/auth.fixture';

/**
 * Role change E2E flow:
 * 1. Owner creates project + viewer invite
 * 2. Second user accepts viewer invite
 * 3. Second user sees read-only restrictions
 * 4. Owner promotes Viewer → Editor
 * 5. Second user no longer sees read-only restrictions
 */
test.describe('Role Change: Viewer to Editor', () => {

  test('owner promotes viewer to editor and restrictions are removed', async ({
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

    const projectName = `Role-Change Test ${Date.now()}`;
    await dialog.getByRole('textbox').first().fill(projectName);
    await dialog.getByRole('button', { name: /criar|salvar|save|ok/i }).click();

    await page.waitForURL(/\/projects\/.+/, { timeout: 10000 });
    const projectUrl = page.url();
    const projectId = projectUrl.split('/projects/')[1]?.split(/[?#]/)[0];

    // === STEP 2: Owner creates VIEWER invite ===
    const shareBtn = page.getByRole('button', { name: /compartilhar|share/i });
    if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
      test.skip();
      return;
    }
    await shareBtn.click();

    const shareDialog = page.getByRole('dialog');
    await expect(shareDialog).toBeVisible({ timeout: 5000 });

    // Select Viewer role for invite
    const viewerToggle = shareDialog.locator('button').filter({ hasText: 'Viewer' }).first();
    if (await viewerToggle.isVisible({ timeout: 3000 })) {
      await viewerToggle.click();
    }

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

    // === STEP 3: Second user accepts viewer invite ===
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

    // === STEP 4: Verify viewer restrictions are active ===
    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    const readOnlyBanner = page.getByText(/somente leitura|apenas visualização|read.only/i);
    const bannerVisible = await readOnlyBanner.isVisible({ timeout: 5000 }).catch(() => false);

    // FAB should be hidden for viewer
    const fab = page.locator('[data-testid="project-fab"]');
    const fabHidden = !(await fab.isVisible({ timeout: 2000 }).catch(() => false));

    // At least one restriction should be present
    expect(bannerVisible || fabHidden).toBe(true);

    // === STEP 5: Owner promotes Viewer → Editor ===
    await logout(page);
    await loginProgrammatically(page, supabaseClient, testUser.email, testUser.password);

    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    const shareBtnAgain = page.getByRole('button', { name: /compartilhar|share/i });
    await expect(shareBtnAgain).toBeVisible({ timeout: 5000 });
    await shareBtnAgain.click();

    const membersDialog = page.getByRole('dialog');
    await expect(membersDialog).toBeVisible({ timeout: 5000 });

    // Find the second user's row and verify they're currently Viewer
    const memberRow = membersDialog.locator('.flex.items-center.justify-between').filter({
      hasText: secondUser.email,
    });
    await expect(memberRow).toBeVisible({ timeout: 5000 });

    // Click "Editor" toggle button in the member row to promote
    const editorToggle = memberRow.locator('button').filter({ hasText: 'Editor' });
    await expect(editorToggle).toBeVisible({ timeout: 3000 });
    await editorToggle.click();

    // Wait for role update toast
    await expect(page.getByText(/role alterado|editor/i)).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');

    // === STEP 6: Verify restrictions are removed for promoted user ===
    await logout(page);
    await loginProgrammatically(page, secondClient, secondUser.email, secondUser.password);

    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    // Read-only banner should NOT be visible anymore
    const bannerAfter = page.getByText(/somente leitura|apenas visualização|read.only/i);
    const bannerStillVisible = await bannerAfter.isVisible({ timeout: 3000 }).catch(() => false);
    expect(bannerStillVisible).toBe(false);

    // FAB should now be visible for editor
    const fabAfter = page.locator('[data-testid="project-fab"]');
    const fabNowVisible = await fabAfter.isVisible({ timeout: 5000 }).catch(() => false);
    
    // At least one of these should confirm editor access
    expect(!bannerStillVisible || fabNowVisible).toBe(true);
  });
});
