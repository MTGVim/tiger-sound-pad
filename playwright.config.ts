import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);
const port = 4173;
const host = "127.0.0.1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: isCi ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL: `http://${host}:${port}/tiger-sound-pad/`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview:e2e",
    url: `http://${host}:${port}/tiger-sound-pad/`,
    reuseExistingServer: !isCi,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
