import { test as base, expect } from '@playwright/test';
import { TmrScenarioExplorerPO } from './TmrScenarioExplorerPO';

type Fixtures = {
  explorer: TmrScenarioExplorerPO;
};

export const test = base.extend<Fixtures>({
  explorer: async ({ page }, provide) => {
    page.setDefaultTimeout(12_000);
    await provide(new TmrScenarioExplorerPO(page));
  }
});

export { expect };
