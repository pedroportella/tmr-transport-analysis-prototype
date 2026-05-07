import { test } from './helpers/testHarness';

test.describe('TMR scenario explorer', () => {
  test('loads the mocked API dataset into the shell', async ({ explorer }) => {
    await explorer.goto();
    await explorer.expectShell();
    await explorer.expectScenarioControls();
    await explorer.expectBusPriorityKpis();
    await explorer.expectMapWorkspace();
  });

  test('updates KPI cards when a different scenario is selected', async ({ explorer }) => {
    await explorer.goto();
    await explorer.chooseGrowthScenario();
    await explorer.expectGrowthScenarioKpis();
  });
});
