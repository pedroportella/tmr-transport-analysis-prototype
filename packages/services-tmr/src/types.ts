export type TimePeriod = 'AM_PEAK' | 'INTER_PEAK' | 'PM_PEAK';
export type TransportLayerId = 'congestion' | 'publicTransport' | 'freight' | 'accessibility';

export interface ScenarioSummary {
  id: string;
  name: string;
  description: string;
  horizonYear: number;
}

export interface ScenarioKpis {
  averageDelayMinutes: number;
  corridorTravelTimeMinutes: number;
  populationWithinThirtyMinutes: number;
  freightReliabilityPercent: number;
}

export interface CorridorLinkProperties {
  id: string;
  name: string;
  corridor: string;
  mode: 'road' | 'bus' | 'freight';
  baseSpeedKph: number;
  scenarioSpeedKph: number;
  volume: number;
  delayMinutes: number;
  reliabilityPercent: number;
  timePeriod: TimePeriod;
}

export interface CorridorFeature {
  type: 'Feature';
  geometry: { type: 'LineString'; coordinates: [number, number][] };
  properties: CorridorLinkProperties;
}

export interface CorridorFeatureCollection {
  type: 'FeatureCollection';
  features: CorridorFeature[];
}

export interface ScenarioDataset {
  scenarios: ScenarioSummary[];
  kpisByScenario: Record<string, ScenarioKpis>;
  network: CorridorFeatureCollection;
}
