import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: "youth-cv-readiness.spec.ts",
  timeout: 90_000,
  expect: { timeout: 12_000 },
  workers: 1,
  reporter: [["list"]],
  outputDir: "/tmp/bidaya-youth-cv-readiness-results",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
});
