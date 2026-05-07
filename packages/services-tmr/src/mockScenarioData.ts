import scenarioDatasetResponse from './mocks/data/scenario-dataset-response.json';
import type { ScenarioDatasetResponseDto } from './dto';
import { mapScenarioDatasetDto } from './utils/mapScenarioDatasetDto';

export const mockScenarioDatasetResponse = scenarioDatasetResponse as ScenarioDatasetResponseDto;

export const mockScenarioDataset = mapScenarioDatasetDto(mockScenarioDatasetResponse);
