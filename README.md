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

## Position Description Alignment

This prototype is structured to demonstrate the core capabilities expected from a frontend/geospatial visualisation specialist working with transport analysts, data scientists and backend engineers.

| Role expectation | Prototype evidence |
| --- | --- |
| Modern frontend engineering with React and TypeScript | React + TypeScript workspace with a typed analyst app, reusable packages and strict package boundaries. |
| Scalable frontend architecture | Application, service contracts, UI components, design tokens, assets, utilities and map implementation are split into focused pnpm workspace packages. |
| Map-centric scenario analytics | The analyst app centres on a MapLibre scenario map, KPI cards, time-period controls, transport layers and link-level network details. |
| Geospatial visualisation experience | `packages/map-engine` owns MapLibre setup, GeoJSON source management, line styling, layer visibility and map interaction handling. |
| Backend API collaboration | `packages/services-tmr` defines DTOs, API-shaped service calls, endpoint configuration, error handling and DTO-to-frontend mapping. |
| Mocked data workflow for iterative delivery | MSW intercepts the same API-shaped request used by the app and returns raw mock JSON before mapping it into frontend objects. |
| Performance and maintainability awareness | Map logic is isolated for future optimisation, unit-tested with a mocked MapLibre surface, and documented with clear extension points. |
| Enterprise UI standards | The shell, form controls, buttons, cards, accordion, header, footer, tokens and theme use QGDS-aligned shared packages. |
| Quality standards | Workspace commands cover typecheck, lint, unit tests, Playwright e2e tests and production builds. |
| Knowledge sharing and supportability | README documents environment setup, API mock flow, quality commands, QGDS usage, test strategy and handover notes. |

Current deliberate prototype boundaries:

- Authentication is represented only by shell/header placeholders and credentialed API calls; production SSO, route guards and role-based UI are future work.
- Temporal analysis is represented by discrete time-period controls; animated playback is a future enhancement.
- Large geospatial dataset handling is represented architecturally, but production-scale work should add vector tiles, layer chunking, feature-state updates, render profiling and data-volume budgets.
- Scenario comparison currently uses scenario switching and KPI updates; side-by-side comparison and delta visualisation would be the next feature layer.

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
  MapLibre integration, mocked unit tests and transport map helpers.

packages/utils
  Formatting and calculation helpers.
```

## QGDS UI Components, Theme And Layout

The prototype uses QGDS, the Queensland Government Design System, as the foundation for its visual language, layout classes, typography, form styling, cards, buttons, accordion behaviour, header and footer treatment.

Local design-system assets are split across three packages:

```txt
packages/ui-library
  React components, form fields, layout shell, cards, buttons, accordion and icons.

packages/ui-tokens
  Primitive, QGDS and palette token sources used by the theme SCSS.

packages/ui-assets
  Logo and SVG sprite assets used by header/navigation/icon components.
```

The analyst app imports the theme in `apps/analyst/src/main.tsx`:

```ts
import '@tmr/ui-tokens/styles.css';
import '@tmr/ui-library/theme.scss';
import '@tmr/ui-library/styles.css';
```

The primary theme entrypoint is:

```txt
packages/ui-library/src/theme/index.scss
```

The default palette and design token wiring is in:

```txt
packages/ui-library/src/theme/css/qld-default.scss
```

That SCSS imports:

- primitive tokens
- QGDS-level tokens
- default Queensland Government palette tokens
- root CSS variable mappings
- light and dark mode variable mappings
- component defaults

### Component Usage

Prefer shared components from `@tmr/ui-library` when building application UI:

```ts
import {
  Accordion,
  Button,
  Card,
  CheckboxGroup,
  Layout,
  RadioGroup,
  SelectInput
} from '@tmr/ui-library';
```

Use the shared `Layout` component for the application shell so the pre-header, header, main region and footer remain consistent.

Use QGDS class names and grid utilities for page content:

```tsx
<section className="qld__body">
  <section className="tmr__page-header">
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12 col-md-9">...</div>
      </div>
    </div>
  </section>
</section>
```

Note: some inherited class names are retained because they are part of the imported theme surface. Treat them as design-system implementation details rather than application-domain names.

### Styling Rules

- Prefer tokens, theme variables and existing QGDS utility classes over local one-off CSS.
- Keep shared UI components presentational; application state should stay in `apps/analyst`.
- Keep local app CSS focused on TMR-specific layout concerns such as map sizing, KPI grid arrangement and workflow spacing.
- Do not restyle `qld__header`, `qld__footer`, `container-fluid`, `row` or shared form/card/button classes in app CSS unless there is a deliberate design-system change.
- Add reusable UI elements to `packages/ui-library` instead of duplicating markup in the app.
- Keep raw assets in `packages/ui-assets` and import them through package exports.

### QGDS References

Queensland Government Design System:

- https://www.designsystem.qld.gov.au

QGDS components:

- https://www.designsystem.qld.gov.au/components

QGDS Vanilla Storybook:

- https://qld-gov-au.github.io/qgds-vanilla/storybook/?path=/story/0-3-templates-and-patterns-landing--landing&globals=brand:main-qld-corporate

QGDS Vanilla default look and feel:

- https://qld-gov-au.github.io/qgds-vanilla/storybook/iframe.html?globals=&args=&id=0-3-templates-and-patterns-landing--landing&viewMode=story

Cards:

- https://www.designsystem.qld.gov.au/components/cards

Tabs:

- https://www.designsystem.qld.gov.au/components/tabs

QGDS Vanilla repository:

- https://github.com/qld-gov-au/qgds-vanilla

QGDS design tokens:

- https://github.com/qld-gov-au/qgds-tokens

QGDS Bootstrap:

- https://github.com/qld-gov-au/qgds-bootstrap5

QGDS UI Kit:

- https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit

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

packages/map-engine/src/MapLibreScenarioMap.tsx
  MapLibre scenario network rendering component.

packages/map-engine/src/MapLibreScenarioMap.test.tsx
  Unit tests for MapLibre setup, source updates, layer visibility and link selection.

packages/ui-library/vite.config.ts
  Vitest DOM setup for React component tests.

packages/ui-library/test/setup.ts
  Local DOM matchers used by UI component tests.

packages/ui-tokens/vite.config.mts
  Token SCSS build input discovery and focused token test configuration.

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

Run every workspace unit test:

```bash
pnpm test
```

Run focused package unit tests:

```bash
pnpm --filter @tmr/services-tmr test
pnpm --filter @tmr/ui-tokens test
pnpm --filter @tmr/ui-library test
pnpm --filter @tmr/map-engine test
pnpm --filter @tmr/analyst test
```

Current unit coverage includes:

- service DTO mapping, API error handling and mock endpoint behaviour
- token exports, CSS variables and SCSS source entrypoints
- shared UI components and form fields in a DOM test environment
- MapLibre setup, source updates, layer visibility, load handling and link selection
- analyst app loading behaviour

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

Run lint with automatic fixes:

```bash
pnpm lint --fix
```

The root `pnpm test` command is expected to pass across all tested workspace packages. `packages/map-engine` uses a mocked MapLibre implementation for unit tests so the suite can run without WebGL or network map tiles.

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

## Unit Test Notes

Vitest is used for package-level unit tests.

`packages/ui-library` uses `jsdom` and a local setup file for DOM assertions:

```txt
packages/ui-library/vite.config.ts
packages/ui-library/test/setup.ts
```

`packages/map-engine` also uses `jsdom`, but MapLibre itself is mocked in:

```txt
packages/map-engine/src/MapLibreScenarioMap.test.tsx
```

This keeps map tests fast and deterministic while still verifying the component calls MapLibre with the expected sources, layers and event handlers.

`packages/ui-tokens` has focused tests for the token surface that exists in this prototype:

```txt
packages/ui-tokens/src/index.test.ts
```

The package excludes test files from TypeScript build/typecheck output, matching the other package build configs.

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
pnpm lint
pnpm test
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
- Add map behaviour tests with the mocked MapLibre surface rather than relying on live map rendering in unit tests.
- Extend Playwright through page objects/helpers instead of putting long selector flows directly in specs.
