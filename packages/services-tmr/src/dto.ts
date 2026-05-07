import type { TimePeriod } from './types';

export type TransportModeDto = 'ROAD' | 'BUS' | 'FREIGHT';

export interface ScenarioSummaryDto {
  scenarioId: string;
  displayName: string;
  summary: string;
  horizonYear: number;
}

export interface ScenarioKpisDto {
  scenarioId: string;
  metrics: {
    averageDelayMinutes: number;
    corridorTravelTimeMinutes: number;
    populationWithinThirtyMinutes: number;
    freightReliabilityPercent: number;
  };
}

export interface CorridorLinkDto {
  linkId: string;
  displayName: string;
  corridorName: string;
  transportMode: TransportModeDto;
  baselineSpeedKph: number;
  modelledSpeedKph: number;
  trafficVolume: number;
  delayMinutes: number;
  reliabilityPercent: number;
  period: TimePeriod;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}

export interface ScenarioDatasetResponseDto {
  scenarios: ScenarioSummaryDto[];
  kpis: ScenarioKpisDto[];
  network: {
    links: CorridorLinkDto[];
  };
}
