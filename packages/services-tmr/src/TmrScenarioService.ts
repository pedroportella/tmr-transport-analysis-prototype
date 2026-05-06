import { mockScenarioDataset } from './mockScenarioData';
import type { ScenarioDataset } from './types';

export interface TmrScenarioService {
  getScenarioDataset(): Promise<ScenarioDataset>;
}

export function createMockTmrScenarioService(): TmrScenarioService {
  return {
    async getScenarioDataset() {
      await new Promise((resolve) => setTimeout(resolve, 80));
      return mockScenarioDataset;
    }
  };
}
