import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: ["youth-refactor.spec.ts", "youth-run2.spec.ts"],
  timeout: 90_000,
  expect: { timeout: 12_000 },
  workers: 1,
  reporter: [["list"]],
  outputDir: "/tmp/bidaya-youth-run2-results",
  use: { baseURL: "http://localhost:3000", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" },
});
