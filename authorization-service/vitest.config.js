import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: "tests/**.test.ts",
    threads: true,
    environment: "node",
    globals: false,
    watch: false,
    setupFiles: ["dotenv/config"],
  },
});
