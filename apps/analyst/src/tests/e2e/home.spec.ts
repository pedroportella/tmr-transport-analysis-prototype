import { expect, test } from '@playwright/test';

test('loads the scenario explorer', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'TMR Transport Scenario Explorer' })).toBeVisible();
  await expect(page.getByText('Scenario controls')).toBeVisible();
  await expect(page.getByLabel('Scenario')).toBeVisible();
});
