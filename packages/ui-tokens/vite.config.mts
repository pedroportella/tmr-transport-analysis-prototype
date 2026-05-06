import { defineConfig } from "vite";
import path from "path";
import glob from "fast-glob";

const entries = Object.fromEntries(
  glob.sync("src/scss/**/*.scss").map((file) => {
    const name = path.basename(file, ".scss");
    return [name, path.resolve(__dirname, file)];
  }),
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: entries,
      output: {
        assetFileNames: "[name].css",
        entryFileNames: "[name].js", // unused, but Vite requires it
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/scss/styles/qld-default.scss" as *;`,
      },
    },
  },
});
