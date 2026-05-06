# TMR Transport Analysis Prototype

A React and TypeScript prototype for a Transport Analysis Unit style, map-centric analytics platform. It reuses the architectural direction proven in the RBDM work: pnpm workspaces, design tokens, shared UI components, service adapters, container-owned state, and presentational components.

## Prototype focus

The prototype demonstrates a **SEQ Corridor Scenario Explorer** rather than another complex form flow. It focuses on transport network analysis, scenario comparison, temporal playback, and link-level map inspection.

## Workspace structure

```txt
apps/analyst              React analyst-facing application
packages/ui-tokens        Shared design tokens and status colours
packages/ui-library       Dumb/presentational components
packages/services-tmr     Mock TMR data contracts and API client
packages/map-engine       MapLibre integration and map layer helpers
packages/utils            Scenario comparison and formatting utilities
```

## Architecture rules

- App containers own data loading, state, orchestration and routing.
- Shared UI components are presentational only.
- Services are isolated in `packages/services-tmr`.
- Map framework code is isolated in `packages/map-engine`.
- Design tokens are centralised in `packages/ui-tokens`.
- Components do not use inline styles.

## Features delivered

- Scenario selector and KPI comparison.
- MapLibre-based corridor map.
- Base vs scenario network styling.
- Link-level detail panel.
- Time-of-day playback control.
- Layer toggles for congestion, public transport, freight and accessibility.
- FastAPI-style mock contracts for future backend integration.
- Unit test examples and Playwright smoke test.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm test:e2e
pnpm lint
```

## Future integration path

The mock service is intentionally shaped like a backend API contract. It can be replaced with FastAPI endpoints returning scenario summaries, GeoJSON/vector-tile metadata, corridor links, and time-series performance slices.
