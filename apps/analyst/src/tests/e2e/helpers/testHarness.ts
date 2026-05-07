import { test as base, expect } from '@playwright/test';
import { TmrScenarioExplorerPO } from './TmrScenarioExplorerPO';

type Fixtures = {
  explorer: TmrScenarioExplorerPO;
};

export const test = base.extend<Fixtures>({
  explorer: async ({ page }, use) => {
    page.setDefaultTimeout(12_000);
    await use(new TmrScenarioExplorerPO(page));
  }
});

export { expect };
