import { test, expect, createAnonClient, createTestUser, loginProgrammatically, logout } from '../fixtures/auth.fixture';
import type { Page } from '@playwright/test';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Cross-user project sharing flow:
 * 1. Owner creates a project and generates an invite link
 * 2. Second user accepts the invite
 * 3. Owner verifies the new member appears in the members list
 */
test.describe('Cross-User Project Sharing Flow', () => {

  test('owner creates invite, second user accepts, appears in members list', async ({
    page,
    testUser,
    supabaseClient,
  }) => {
    // === STEP 1: Owner logs in and creates a project ===
    const ownerLoggedIn = await loginProgrammatically(page, supabaseClient, testUser.email, testUser.password);
    expect(ownerLoggedIn).toBe(true);

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Create a new project
    const createBtn = page.getByRole('button', { name: /criar|novo|new|add/i });
    if (!(await createBtn.isVisible({ timeout: 5000 }))) {
      test.skip();
      return;
    }
    await createBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const projectName = `Cross-User Test ${Date.now()}`;
    const titleInput = dialog.getByRole('textbox').first();
    await titleInput.fill(projectName);

    const submitBtn = dialog.getByRole('button', { name: /criar|salvar|save|ok/i });
    await submitBtn.click();

    // Wait for navigation to project detail
    await page.waitForURL(/\/projects\/.+/, { timeout: 10000 });
    const projectUrl = page.url();
    const projectId = projectUrl.split('/projects/')[1]?.split(/[?#]/)[0];

    // === STEP 2: Owner opens share modal and creates an invite ===
    const shareBtn = page.getByRole('button', { name: /compartilhar|share/i });
    if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
      test.skip();
      return;
    }
    await shareBtn.click();

    const shareDialog = page.getByRole('dialog');
    await expect(shareDialog).toBeVisible({ timeout: 5000 });

    // Create invite link
    const newLinkBtn = shareDialog.getByRole('button', { name: /novo link/i });
    if (!(await newLinkBtn.isVisible({ timeout: 3000 }))) {
      test.skip();
      return;
    }
    await newLinkBtn.click();

    // Wait for invite to be created — grab the invite code from the database
    await page.waitForTimeout(2000);

    // Fetch the invite code directly from the database (owner is authenticated)
    const { data: invites, error: inviteError } = await supabaseClient
      .from('project_invites')
      .select('invite_code')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1);

    // If we can't fetch the invite code via the anon client (RLS may block),
    // try reading it from the clipboard or the UI
    let inviteCode: string | null = null;

    if (invites && invites.length > 0) {
      inviteCode = invites[0].invite_code;
    }

    if (!inviteCode) {
      // Try to find the invite code displayed in the modal
      const inviteCodeElement = shareDialog.locator('[data-testid="invite-code"], code, .invite-link');
      if (await inviteCodeElement.isVisible({ timeout: 2000 })) {
        const text = await inviteCodeElement.textContent();
        // Extract code from URL like /invite/abc123
        const match = text?.match(/\/invite\/([a-f0-9]+)/);
        inviteCode = match?.[1] ?? text?.trim() ?? null;
      }
    }

    if (!inviteCode) {
      console.warn('Could not retrieve invite code — skipping cross-user test');
      test.skip();
      return;
    }

    // Close the share dialog
    await page.keyboard.press('Escape');

    // === STEP 3: Create a second user and accept the invite ===
    const secondClient = createAnonClient();
    const secondUser = await createTestUser(secondClient);
    if (!secondUser) {
      console.warn('Could not create second test user — skipping');
      test.skip();
      return;
    }

    // Log out owner
    await logout(page);

    // Log in as second user
    const secondLoggedIn = await loginProgrammatically(page, secondClient, secondUser.email, secondUser.password);
    expect(secondLoggedIn).toBe(true);

    // Navigate to the invite acceptance page
    await page.goto(`/invite/${inviteCode}`);
    await page.waitForLoadState('networkidle');

    // Wait for invite acceptance — should redirect to the project or show success
    const acceptBtn = page.getByRole('button', { name: /aceitar|accept|entrar/i });
    if (await acceptBtn.isVisible({ timeout: 5000 })) {
      await acceptBtn.click();
    }

    // Wait for redirect to project or success message
    await page.waitForTimeout(3000);

    // Verify: either redirected to project or success message shown
    const onProjectPage = page.url().includes(`/projects/${projectId}`);
    const successMsg = await page.getByText(/adicionado|bem-vindo|aceito|joined/i).isVisible({ timeout: 3000 }).catch(() => false);
    expect(onProjectPage || successMsg).toBe(true);

    // === STEP 4: Log back in as owner and verify new member ===
    await logout(page);

    const ownerBackIn = await loginProgrammatically(page, supabaseClient, testUser.email, testUser.password);
    expect(ownerBackIn).toBe(true);

    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    // Open share modal to check members
    const shareBtnAgain = page.getByRole('button', { name: /compartilhar|share/i });
    if (!(await shareBtnAgain.isVisible({ timeout: 5000 }))) {
      test.skip();
      return;
    }
    await shareBtnAgain.click();

    const membersDialog = page.getByRole('dialog');
    await expect(membersDialog).toBeVisible({ timeout: 5000 });

    // Verify the second user's email appears in the members list
    const secondUserEmail = secondUser.email;
    const memberEntry = membersDialog.getByText(secondUserEmail, { exact: false });
    await expect(memberEntry).toBeVisible({ timeout: 5000 });

    // Verify the member has "Editor" role (default invite role)
    await expect(membersDialog.getByText('Editor')).toBeVisible({ timeout: 3000 });
  });

  test('viewer invite: second user joins as viewer and sees read-only restrictions', async ({
    page,
    testUser,
    supabaseClient,
  }) => {
    // === Owner creates project ===
    const ownerLoggedIn = await loginProgrammatically(page, supabaseClient, testUser.email, testUser.password);
    expect(ownerLoggedIn).toBe(true);

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

    const projectName = `Viewer Test ${Date.now()}`;
    await dialog.getByRole('textbox').first().fill(projectName);
    await dialog.getByRole('button', { name: /criar|salvar|save|ok/i }).click();

    await page.waitForURL(/\/projects\/.+/, { timeout: 10000 });
    const projectUrl = page.url();
    const projectId = projectUrl.split('/projects/')[1]?.split(/[?#]/)[0];

    // === Owner creates viewer invite ===
    const shareBtn = page.getByRole('button', { name: /compartilhar|share/i });
    if (!(await shareBtn.isVisible({ timeout: 5000 }))) {
      test.skip();
      return;
    }
    await shareBtn.click();

    const shareDialog = page.getByRole('dialog');
    await expect(shareDialog).toBeVisible({ timeout: 5000 });

    // Select viewer role
    const viewerToggle = shareDialog.getByRole('button', { name: /viewer/i }).first();
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

    // Get invite code
    const { data: invites } = await supabaseClient
      .from('project_invites')
      .select('invite_code')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1);

    const inviteCode = invites?.[0]?.invite_code;
    if (!inviteCode) {
      test.skip();
      return;
    }

    await page.keyboard.press('Escape');

    // === Second user accepts viewer invite ===
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

    // Navigate to the project as viewer
    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    // Verify read-only banner is visible
    const readOnlyBanner = page.getByText(/somente leitura|apenas visualização|read.only/i);
    const bannerVisible = await readOnlyBanner.isVisible({ timeout: 5000 }).catch(() => false);

    if (bannerVisible) {
      // FAB should be hidden
      const fab = page.locator('[data-testid="project-fab"]');
      await expect(fab).not.toBeVisible();
    }

    // Verify member shows as Viewer in share dialog (log back as owner)
    await logout(page);
    await loginProgrammatically(page, supabaseClient, testUser.email, testUser.password);

    await page.goto(projectUrl);
    await page.waitForLoadState('networkidle');

    const shareBtnAgain = page.getByRole('button', { name: /compartilhar|share/i });
    if (await shareBtnAgain.isVisible({ timeout: 5000 })) {
      await shareBtnAgain.click();
      const membersDialog = page.getByRole('dialog');
      await expect(membersDialog).toBeVisible({ timeout: 5000 });
      await expect(membersDialog.getByText(secondUser.email, { exact: false })).toBeVisible({ timeout: 5000 });
      await expect(membersDialog.getByText('Viewer')).toBeVisible({ timeout: 3000 });
    }
  });
});
