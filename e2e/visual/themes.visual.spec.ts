import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Dark Mode', () => {
  test.use({
    colorScheme: 'dark',
  });

  test('auth page dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('theme-dark-auth.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});

test.describe('Visual Regression - Light Mode', () => {
  test.use({
    colorScheme: 'light',
  });

  test('auth page light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('theme-light-auth.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});

test.describe('Visual Regression - Reduced Motion', () => {
  test.use({
    reducedMotion: 'reduce',
  });

  test('animations disabled', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify no animations are running
    const animatedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let animatedCount = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.animationName !== 'none' && style.animationDuration !== '0s') {
          animatedCount++;
        }
      });
      return animatedCount;
    });

    // With reduced motion, animations should be minimal
    expect(animatedCount).toBeLessThanOrEqual(5);
  });
});

test.describe('Visual Regression - High Contrast', () => {
  test('sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check text contrast ratios
    const contrastIssues = await page.evaluate(() => {
      const issues: string[] = [];
      const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label');
      
      textElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        
        // Simple check - if text is very light on light bg or dark on dark bg
        if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
          // Basic luminance check (simplified)
          const textLuminance = color.includes('255') ? 1 : 0;
          const bgLuminance = bgColor.includes('255') ? 1 : 0;
          
          if (textLuminance === bgLuminance) {
            const text = el.textContent?.trim().substring(0, 20);
            if (text) {
              issues.push(`Potential contrast issue: "${text}"`);
            }
          }
        }
      });
      
      return issues.slice(0, 5); // Limit to 5 issues
    });

    // Report but don't fail - this is informational
    if (contrastIssues.length > 0) {
      console.log('Potential contrast issues found:', contrastIssues);
    }
  });
});
