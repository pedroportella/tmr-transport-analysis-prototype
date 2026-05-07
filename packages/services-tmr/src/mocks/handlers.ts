import { http, HttpResponse } from "msw";
import { TMR_SCENARIO_DATASET_PATH } from "../env";
import { mockScenarioDatasetResponse } from "../mockScenarioData";

export const tmrHandlers = [
  http.get(`*${TMR_SCENARIO_DATASET_PATH}`, () =>
    HttpResponse.json(mockScenarioDatasetResponse, { status: 200 })
  ),
];
