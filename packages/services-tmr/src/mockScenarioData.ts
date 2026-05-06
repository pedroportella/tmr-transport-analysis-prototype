import type { CorridorFeatureCollection, ScenarioDataset, ScenarioSummary } from './types';

const scenarios: ScenarioSummary[] = [
  { id: 'base-2026', name: 'Base 2026', description: 'Current committed network and demand profile.', horizonYear: 2026 },
  { id: 'growth-2031', name: '2031 Growth', description: 'Population and employment growth without major corridor intervention.', horizonYear: 2031 },
  { id: 'bus-priority', name: 'Bus Priority Upgrade', description: 'Targeted bus priority and intersection improvements on key corridors.', horizonYear: 2031 }
];

const network: CorridorFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[153.001, -27.469], [153.016, -27.465], [153.031, -27.461]] }, properties: { id: 'link-001', name: 'Coronation Drive inbound', corridor: 'Western corridor', mode: 'road', baseSpeedKph: 34, scenarioSpeedKph: 41, volume: 4200, delayMinutes: 8.4, reliabilityPercent: 82, timePeriod: 'AM_PEAK' } },
    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[153.025, -27.498], [153.036, -27.486], [153.048, -27.474]] }, properties: { id: 'link-002', name: 'Busway south approach', corridor: 'South East busway', mode: 'bus', baseSpeedKph: 43, scenarioSpeedKph: 52, volume: 2600, delayMinutes: 4.1, reliabilityPercent: 91, timePeriod: 'AM_PEAK' } },
    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[153.042, -27.438], [153.035, -27.452], [153.028, -27.468]] }, properties: { id: 'link-003', name: 'Inner north freight link', corridor: 'Freight access', mode: 'freight', baseSpeedKph: 28, scenarioSpeedKph: 31, volume: 1800, delayMinutes: 11.6, reliabilityPercent: 74, timePeriod: 'PM_PEAK' } },
    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[152.992, -27.505], [153.01, -27.494], [153.023, -27.482]] }, properties: { id: 'link-004', name: 'Moggill Road approach', corridor: 'Western corridor', mode: 'road', baseSpeedKph: 24, scenarioSpeedKph: 29, volume: 3700, delayMinutes: 13.2, reliabilityPercent: 68, timePeriod: 'PM_PEAK' } }
  ]
};

export const mockScenarioDataset: ScenarioDataset = {
  scenarios,
  network,
  kpisByScenario: {
    'base-2026': { averageDelayMinutes: 7.8, corridorTravelTimeMinutes: 42, populationWithinThirtyMinutes: 812000, freightReliabilityPercent: 76 },
    'growth-2031': { averageDelayMinutes: 11.4, corridorTravelTimeMinutes: 51, populationWithinThirtyMinutes: 768000, freightReliabilityPercent: 69 },
    'bus-priority': { averageDelayMinutes: 6.1, corridorTravelTimeMinutes: 37, populationWithinThirtyMinutes: 846000, freightReliabilityPercent: 81 }
  }
};
