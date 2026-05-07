# TMR Transport Analysis Prototype

This repository contains a React, TypeScript and pnpm workspace prototype for a Transport Analysis Unit scenario-analysis experience. It uses shared design tokens, shared presentational UI components, service-layer API adapters, DTO-to-frontend mapping, mocked API responses through MSW, and Playwright coverage for the analyst application.

## Prototype Scope

The current application is a SEQ corridor scenario explorer. It demonstrates:

- Design-system header, footer, layout, theme and UI components.
- Scenario selection and KPI comparison.
- MapLibre corridor rendering.
- Time-period and transport-layer controls.
- Link detail display after map interaction.
- API-shaped service calls with mock responses enabled through `NEXT_PUBLIC_USE_API_MOCKS=true`.
- DTO mapping from backend-style JSON into frontend-ready objects.
- Unit and Playwright e2e tests.

## Workspace Structure

```txt
apps/analyst
  React analyst-facing application.

packages/services-tmr
  TMR API contracts, DTO types, mapper utilities, MSW handlers and mock API JSON.

packages/ui-library
  Shared presentational components and layout primitives.

packages/ui-tokens
  Design token snapshot and SCSS token sources.

packages/ui-assets
  Shared image and icon assets.

packages/map-engine
  MapLibre integration and transport map helpers.

packages/utils
  Formatting and calculation helpers.
```

## Environment

Create `apps/analyst/.env.local`:

```bash
NEXT_PUBLIC_USE_API_MOCKS=true
NEXT_PUBLIC_TMR_API=https://no-fallback-for-tmr-api
```

When `NEXT_PUBLIC_USE_API_MOCKS=true`, the browser MSW worker intercepts the TMR API request and returns local mock JSON. The `NEXT_PUBLIC_TMR_API` value still needs to exist because the frontend builds the real API-shaped URL before MSW intercepts it.

For a real backend:

```bash
NEXT_PUBLIC_USE_API_MOCKS=false
NEXT_PUBLIC_TMR_API=https://your-real-tmr-api.example.gov.au
```

Restart Vite after changing `.env.local`.

## API Mock Flow

The app does not read frontend mock objects directly. It calls `createTmrScenarioService()` from `@tmr/services-tmr`, which fetches:

```txt
GET /api/v1/au/gov/qld/tmr/transport-analysis/scenarios/dataset
```

With mocks enabled:

1. `apps/analyst/src/main.tsx` calls `enableApiMocks()` before rendering React.
2. `apps/analyst/src/mocks/browser.ts` starts MSW.
3. `packages/services-tmr/src/mocks/handlers.ts` intercepts the API endpoint.
4. MSW returns `packages/services-tmr/src/mocks/data/scenario-dataset-response.json`.
5. `packages/services-tmr/src/utils/mapScenarioDatasetDto.ts` maps the API DTO into the frontend `ScenarioDataset`.
6. `apps/analyst/src/App.tsx` renders the mapped scenarios, KPIs and map network.

This keeps the service boundary clean: raw API response in mock data, DTO types in the service package, and transformation before data reaches the UI.

## Key Files

```txt
apps/analyst/src/App.tsx
  Main analyst application container. Owns data loading and page state.

apps/analyst/src/main.tsx
  Starts MSW when NEXT_PUBLIC_USE_API_MOCKS=true, then renders React.

apps/analyst/vite.config.ts
  Enables NEXT_PUBLIC_* env variables and configures Vitest for app unit tests.

apps/analyst/playwright.config.ts
  Starts Vite with NEXT_PUBLIC_USE_API_MOCKS=true for e2e tests.

packages/services-tmr/src/TmrScenarioService.ts
  Real API-shaped frontend service adapter.

packages/services-tmr/src/dto.ts
  Backend/API response DTO contracts.

packages/services-tmr/src/utils/mapScenarioDatasetDto.ts
  Mapper from API DTOs to frontend-ready objects.

packages/services-tmr/src/mocks/data/scenario-dataset-response.json
  Mock API response returned by MSW.

packages/services-tmr/src/mocks/handlers.ts
  MSW endpoint handlers.
```

## Install

```bash
pnpm install
```

The repository expects pnpm and Node compatible with the current workspace lockfile.

## Development

Run the analyst app:

```bash
pnpm dev
```

This starts `@tmr/analyst` through Vite. By default, the app script binds to:

```txt
http://127.0.0.1:5173/
```

If another local server is already running, stop it or run Vite manually on another port:

```bash
NEXT_PUBLIC_USE_API_MOCKS=true pnpm --filter @tmr/analyst exec vite --host 127.0.0.1 --port 5177
```

## Quality Commands

Run TypeScript checks across the workspace:

```bash
pnpm typecheck
```

Run the full production build:

```bash
pnpm build
```

Run only the analyst production build:

```bash
pnpm --filter @tmr/analyst exec vite build
```

Run the TMR services unit tests:

```bash
pnpm --filter @tmr/services-tmr test
```

Run the analyst unit tests:

```bash
pnpm --filter @tmr/analyst test
```

Run Playwright e2e tests:

```bash
pnpm --filter @tmr/analyst test:e2e
```

Run the root e2e alias:

```bash
pnpm test:e2e
```

Run lint:

```bash
pnpm lint
```

Note: `pnpm test` runs every package test. The copied `ui-tokens` package currently has upstream generated token tests that expect generated CSS outputs and extra config/dependencies. Prefer the focused commands above for the current application handover unless `ui-tokens` test generation is restored.

## Playwright E2E

The e2e suite lives in:

```txt
apps/analyst/src/tests/e2e
```

Important files:

```txt
apps/analyst/src/tests/e2e/home.spec.ts
apps/analyst/src/tests/e2e/helpers/testHarness.ts
apps/analyst/src/tests/e2e/helpers/TmrScenarioExplorerPO.ts
apps/analyst/playwright.config.ts
```

The Playwright config starts the Vite app with:

```bash
NEXT_PUBLIC_USE_API_MOCKS=true pnpm exec vite --host 127.0.0.1 --port 5173 --strictPort
```

This means Playwright always tests the API-mocked workflow, including the real service call, MSW interception and DTO mapping.

Current tests cover:

- The mocked API dataset loads into the app shell.
- Header and footer shell content render.
- Scenario controls render.
- Default Bus Priority KPI cards render.
- Selecting the Growth scenario updates KPI values.
- The map workspace and link detail panel render.

Playwright artifacts:

```txt
apps/analyst/playwright-report
apps/analyst/test-results
```

These folders are generated on runs/failures and should not be committed.

## Common Workflows

Smoke test the app locally with mocks:

```bash
NEXT_PUBLIC_USE_API_MOCKS=true pnpm --filter @tmr/analyst exec vite --host 127.0.0.1 --port 5177
```

Then open:

```txt
http://127.0.0.1:5177/
```

Validate before handover:

```bash
pnpm typecheck
pnpm --filter @tmr/services-tmr test
pnpm --filter @tmr/analyst test
pnpm --filter @tmr/analyst test:e2e
pnpm --filter @tmr/analyst exec vite build
```

## Known Warnings

The design-system SCSS currently emits Sass deprecation warnings for legacy `@import` and `if()` syntax during Vite builds. These are inherited from the theme sources and do not currently block builds.

Vite may warn about large chunks because the prototype includes the QGDS theme, MapLibre and MSW browser bundle. This is acceptable for the prototype; production hardening should add bundle splitting if required.

## Handover Notes

- Keep app orchestration in `apps/analyst/src/App.tsx`.
- Keep backend contract and transformation logic inside `packages/services-tmr`.
- Keep shared UI presentational and framework-agnostic in `packages/ui-library`.
- Keep map-specific implementation in `packages/map-engine`.
- Add future mock endpoints as raw JSON under `packages/services-tmr/src/mocks/data` and expose them through MSW handlers.
- Add DTO mapping tests whenever an API response shape changes.
- Extend Playwright through page objects/helpers instead of putting long selector flows directly in specs.
