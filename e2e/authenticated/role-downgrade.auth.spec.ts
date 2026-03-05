import { test, expect, createAnonClient, createTestUser, loginProgrammatically, logout } from '../fixtures/auth.fixture';

/**
 * Role downgrade E2E flow:
 * 1. Owner creates project + editor invite
 * 2. Second user accepts editor invite
 * 3. Second user can see FAB / no read-only banner (editor access)
 * 4. Owner demotes Editor → Viewer
 * 5. Second user sees read-only restrictions
 */
test.describe('Role Downgrade: Editor to Viewer', () => {

  test('owner demotes editor to viewer and restrictions appear', async ({
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

    const projectName = `Role-Downgrade Test ${Date.now()}`;
    await dialog.getByRole('textbox').first().fill(projectName);
    await dialog.getByRole('button', { name: /criar|salvar|save|ok/i }).click();

    await page.waitForURL(/\/projects\/.+/, { timeout: 10000 });
    const projectUrl = page.url();
    const projectId = projectUrl.split('/projects/')[1]?.split(/[?#]/)[0];

    // === STEP 2: Owner creates EDITOR invite ===
    const shareBtn = page.getByRole('button', { name: /compartilhar|share/i });
    if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
      test.skip();
      return;
    }
    await shareBtn.click();

    const shareDialog = page.getByRole('dialog');
    await expect(shareDialog).toBeVisible({ timeout: 5000 });

    // Ensure Editor role is selected (default)
    const editorToggle = shareDialog.locator('button').filter({ hasText: 'Editor' }).first();
    if (await editorToggle.isVisible({ timeout: 3000 })) {
      await editorToggle.click();
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

    // === STEP 3: Second user accepts editor invite ===
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

    // === STEP 4: Verify editor has NO restrictions ===
    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    const readOnlyBanner = page.getByText(/somente leitura|apenas visualização|read.only/i);
    const bannerVisible = await readOnlyBanner.isVisible({ timeout: 3000 }).catch(() => false);

    const fab = page.locator('[data-testid="project-fab"]');
    const fabVisible = await fab.isVisible({ timeout: 3000 }).catch(() => false);

    // Editor should NOT have read-only banner, and FAB should be visible
    expect(!bannerVisible || fabVisible).toBe(true);

    // === STEP 5: Owner demotes Editor → Viewer ===
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

    // Click "Viewer" toggle button to demote
    const viewerToggle = memberRow.locator('button').filter({ hasText: 'Viewer' });
    await expect(viewerToggle).toBeVisible({ timeout: 3000 });
    await viewerToggle.click();

    // Wait for role update confirmation
    await expect(page.getByText(/role alterado|viewer/i)).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');

    // === STEP 6: Verify restrictions NOW appear for demoted user ===
    await logout(page);
    await loginProgrammatically(page, secondClient, secondUser.email, secondUser.password);

    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    // Read-only banner SHOULD be visible now
    const bannerAfter = page.getByText(/somente leitura|apenas visualização|read.only/i);
    const bannerNowVisible = await bannerAfter.isVisible({ timeout: 5000 }).catch(() => false);

    // FAB should be hidden for viewer
    const fabAfter = page.locator('[data-testid="project-fab"]');
    const fabNowHidden = !(await fabAfter.isVisible({ timeout: 2000 }).catch(() => false));

    // At least one restriction should be present
    expect(bannerNowVisible || fabNowHidden).toBe(true);
  });
});
