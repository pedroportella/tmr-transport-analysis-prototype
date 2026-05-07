import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMockTmrScenarioService, createTmrScenarioService } from './TmrScenarioService';
import { mockScenarioDataset, mockScenarioDatasetResponse } from './mockScenarioData';
import { TMR_SCENARIO_DATASET_PATH } from './env';
import { mapScenarioDatasetDto } from './utils/mapScenarioDatasetDto';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createMockTmrScenarioService', () => {
  it('returns scenarios and a network dataset', async () => {
    const dataset = await createMockTmrScenarioService().getScenarioDataset();
    expect(dataset.scenarios.length).toBeGreaterThan(1);
    expect(dataset.network.features.length).toBeGreaterThan(0);
  });
});

describe('createTmrScenarioService', () => {
  it('fetches the API-shaped scenario dataset endpoint and maps it for the frontend', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockScenarioDatasetResponse), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    const dataset = await createTmrScenarioService().getScenarioDataset();

    expect(dataset).toEqual(mockScenarioDataset);
    expect(dataset.network.features[1].properties).toEqual(
      expect.objectContaining({
        id: 'link-002',
        mode: 'bus',
        baseSpeedKph: 43,
        scenarioSpeedKph: 52,
        timePeriod: 'AM_PEAK'
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `https://no-fallback-for-tmr-api${TMR_SCENARIO_DATASET_PATH}`,
      expect.objectContaining({
        method: 'GET',
        credentials: 'include'
      })
    );
  });
});

describe('mapScenarioDatasetDto', () => {
  it('maps API DTO fields into scenario summaries, KPI lookup and GeoJSON features', () => {
    const dataset = mapScenarioDatasetDto(mockScenarioDatasetResponse);

    expect(dataset.scenarios[0]).toEqual({
      id: 'base-2026',
      name: 'Base 2026',
      description: 'Current committed network and demand profile.',
      horizonYear: 2026
    });
    expect(dataset.kpisByScenario['bus-priority'].averageDelayMinutes).toBe(6.1);
    expect(dataset.network.type).toBe('FeatureCollection');
    expect(dataset.network.features[2].properties.mode).toBe('freight');
  });
});
