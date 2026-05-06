import { describe, expect, it } from 'vitest';
import { createMockTmrScenarioService } from './TmrScenarioService';

describe('createMockTmrScenarioService', () => {
  it('returns scenarios and a network dataset', async () => {
    const dataset = await createMockTmrScenarioService().getScenarioDataset();
    expect(dataset.scenarios.length).toBeGreaterThan(1);
    expect(dataset.network.features.length).toBeGreaterThan(0);
  });
});
