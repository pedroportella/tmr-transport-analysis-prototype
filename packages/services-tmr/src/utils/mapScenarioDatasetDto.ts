import type { ScenarioDatasetResponseDto, TransportModeDto } from '../dto';
import type { CorridorFeature, ScenarioDataset } from '../types';

function mapTransportMode(mode: TransportModeDto): CorridorFeature['properties']['mode'] {
  switch (mode) {
    case 'BUS':
      return 'bus';
    case 'FREIGHT':
      return 'freight';
    case 'ROAD':
    default:
      return 'road';
  }
}

export function mapScenarioDatasetDto(dto: ScenarioDatasetResponseDto): ScenarioDataset {
  return {
    scenarios: dto.scenarios.map((scenario) => ({
      id: scenario.scenarioId,
      name: scenario.displayName,
      description: scenario.summary,
      horizonYear: scenario.horizonYear
    })),
    kpisByScenario: Object.fromEntries(
      dto.kpis.map((item) => [
        item.scenarioId,
        {
          averageDelayMinutes: item.metrics.averageDelayMinutes,
          corridorTravelTimeMinutes: item.metrics.corridorTravelTimeMinutes,
          populationWithinThirtyMinutes: item.metrics.populationWithinThirtyMinutes,
          freightReliabilityPercent: item.metrics.freightReliabilityPercent
        }
      ])
    ),
    network: {
      type: 'FeatureCollection',
      features: dto.network.links.map((link) => ({
        type: 'Feature',
        geometry: link.geometry,
        properties: {
          id: link.linkId,
          name: link.displayName,
          corridor: link.corridorName,
          mode: mapTransportMode(link.transportMode),
          baseSpeedKph: link.baselineSpeedKph,
          scenarioSpeedKph: link.modelledSpeedKph,
          volume: link.trafficVolume,
          delayMinutes: link.delayMinutes,
          reliabilityPercent: link.reliabilityPercent,
          timePeriod: link.period
        }
      }))
    }
  };
}
