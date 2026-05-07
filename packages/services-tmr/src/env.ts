type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>;
};

function readPublicEnv(key: string, fallback = "") {
  const importMetaEnv = (import.meta as ImportMetaWithEnv).env?.[key];
  if (typeof importMetaEnv === "string" && importMetaEnv.trim()) {
    return importMetaEnv.trim();
  }

  return fallback;
}

function joinUrl(base: string, path: string) {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedPath}`;
}

export const NEXT_PUBLIC_TMR_API = readPublicEnv(
  "NEXT_PUBLIC_TMR_API",
  "https://no-fallback-for-tmr-api"
);

export const TMR_SCENARIO_DATASET_PATH =
  "/api/v1/au/gov/qld/tmr/transport-analysis/scenarios/dataset";

export const withTmrApi = (path: string) => joinUrl(NEXT_PUBLIC_TMR_API, path);
