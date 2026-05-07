import { mockScenarioDatasetResponse } from './mockScenarioData';
import type { ScenarioDatasetResponseDto } from './dto';
import type { ScenarioDataset } from './types';
import { TMR_SCENARIO_DATASET_PATH, withTmrApi } from './env';
import { ApiError } from './api/errors';
import { mapScenarioDatasetDto } from './utils/mapScenarioDatasetDto';

export interface TmrScenarioService {
  getScenarioDataset(): Promise<ScenarioDataset>;
}

export function createTmrScenarioService(): TmrScenarioService {
  return {
    async getScenarioDataset() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(withTmrApi(TMR_SCENARIO_DATASET_PATH), {
          method: 'GET',
          headers: { Accept: 'application/json' },
          credentials: 'include',
          signal: controller.signal
        });

        clearTimeout(timeout);

        const contentType = res.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');

        if (!res.ok) {
          let details: unknown = undefined;
          try {
            details = isJson ? await res.json() : await res.text();
          } catch {
            /* ignore parse errors */
          }

          throw new ApiError(`Request failed with status ${res.status}`, {
            code: 'HTTP',
            status: res.status,
            details
          });
        }

        if (!isJson) {
          throw new ApiError('Unexpected content type from TMR API.', { code: 'UNKNOWN' });
        }

        const raw = (await res.json()) as ScenarioDatasetResponseDto;
        return mapScenarioDatasetDto(raw);
      } catch (err: unknown) {
        clearTimeout(timeout);

        if (typeof err === 'object' && err !== null && (err as { name?: unknown }).name === 'AbortError') {
          throw new ApiError('The request timed out. Please try again.', { code: 'TIMEOUT', cause: err });
        }

        if (err instanceof ApiError) throw err;

        throw new ApiError('Cannot reach the TMR transport analysis API.', {
          code: 'NETWORK',
          cause: err
        });
      }
    }
  };
}

export function createMockTmrScenarioService(): TmrScenarioService {
  return {
    async getScenarioDataset() {
      await new Promise((resolve) => setTimeout(resolve, 80));
      return mapScenarioDatasetDto(mockScenarioDatasetResponse);
    }
  };
}
