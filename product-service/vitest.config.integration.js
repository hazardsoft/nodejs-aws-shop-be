import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: "tests/integration/**.test.ts",
    threads: false,
    environment: "node",
    globals: false,
    watch: false,
    setupFiles: ["dotenv/config", "tests/integration/setup.ts"],
  },
});
