import { setupWorker } from "msw/browser";
import { tmrHandlers } from "@tmr/services-tmr/mocks";

export const worker = setupWorker(...tmrHandlers);
