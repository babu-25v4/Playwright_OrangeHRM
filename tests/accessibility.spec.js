import { test,expect } from '@playwright/test';
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility test - homepage', () => { 

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
   
     await page.goto('/'); 
     const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['WCAG 2.0', 'WCAG 2.1', 'BS 8878'])
    .analyze(); // 4
    expect(accessibilityScanResults.violations).toEqual([]);
  });

});

// command to run - npx playwright test ./tests/accessibility_demo.spec.js