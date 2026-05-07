import { expect, type Page } from '@playwright/test';

export class TmrScenarioExplorerPO {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: 'Transport scenario explorer' })).toBeVisible();
  }

  async expectShell() {
    await expect(this.page.getByText('TMR Transport Scenario Explorer')).toBeVisible();
    await expect(this.page.getByText('Analyst user')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Transport Analysis Unit', exact: true })).toBeVisible();
    await expect(this.page.getByRole('contentinfo')).toContainText('Queensland Government');
  }

  async expectScenarioControls() {
    await expect(this.page.getByText('Scenario controls')).toBeVisible();
    await expect(this.page.getByTestId('scenario')).toBeVisible();
    await expect(this.page.getByTestId('scenario')).toHaveValue('bus-priority');
    await expect(this.page.getByText('Targeted bus priority and intersection improvements on key corridors.')).toBeVisible();
  }

  async expectBusPriorityKpis() {
    await expect(this.page.getByText('Average delay')).toBeVisible();
    await expect(this.page.getByText('6.1 min')).toBeVisible();
    await expect(this.page.getByText('37 min')).toBeVisible();
    await expect(this.page.getByText('846,000')).toBeVisible();
    await expect(this.page.getByText('81%')).toBeVisible();
  }

  async chooseGrowthScenario() {
    await this.page.getByTestId('scenario').selectOption('growth-2031');
  }

  async expectGrowthScenarioKpis() {
    await expect(this.page.getByText('Population and employment growth without major corridor intervention.')).toBeVisible();
    await expect(this.page.getByText('11.4 min')).toBeVisible();
    await expect(this.page.getByText('51 min')).toBeVisible();
    await expect(this.page.getByText('768,000')).toBeVisible();
    await expect(this.page.getByText('69%')).toBeVisible();
  }

  async expectMapWorkspace() {
    await expect(this.page.getByRole('region', { name: 'Scenario map workspace' })).toBeVisible();
    await expect(this.page.getByText('Link detail')).toBeVisible();
  }
}
