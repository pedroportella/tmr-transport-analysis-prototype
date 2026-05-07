import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  test: {
    environment: "jsdom",
    exclude: ["src/tests/e2e/**", "node_modules/**"],
  },
});
