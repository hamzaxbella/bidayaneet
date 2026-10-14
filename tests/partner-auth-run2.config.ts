import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: ["partner-auth-refactor.spec.ts", "partner-auth-run2.spec.ts"],
  timeout: 150_000,
  expect: { timeout: 12_000 },
  workers: 1,
  reporter: [["list"]],
  outputDir: "/tmp/bidaya-partner-auth-run2-results",
  use: { baseURL: "http://localhost:3000", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" },
});
