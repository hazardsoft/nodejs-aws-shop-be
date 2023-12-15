import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: "tests/unit/**.test.ts",
    threads: true,
    environment: "node",
    globals: false,
    watch: false,
    setupFiles: ["tests/unit/setup.ts"],
    clearMocks: true,
  },
});
