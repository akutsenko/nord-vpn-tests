import { defineConfig, devices } from "@playwright/test";
import { TimeoutValues } from "./src/constants/config";
import envConfig from "./src/utils/envConfig";
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(__dirname + `/.env.${envConfig().ENVIRONMENT}`) });
const IS_CI = envConfig().CI === "true" || envConfig().CI === "1";
const IS_DOCKER = envConfig().DOCKER === "true" || envConfig().DOCKER === "1";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 3 : 1,
  reporter: [["html", { open: "never" }], ["blob"]],
  timeout: 5 * 60_000,
  expect: {
    timeout: TimeoutValues.LONG_TIMEOUT,
  },
  use: {
    baseURL: envConfig().BASE_WEB_URL,
    navigationTimeout: TimeoutValues.HUGE_TIMEOUT,
    actionTimeout: IS_CI
      ? TimeoutValues.LONG_TIMEOUT
      : TimeoutValues.DEFAULT_TIMEOUT,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: IS_CI || IS_DOCKER,
    testIdAttribute: "data-testid",
    video: "off",
  },

  projects: [
    envConfig().UI_PROJECT,
    {
      name: "api",
      use: {
        ...devices["Desktop Chrome"],
      },
      testDir: "./src/tests/api",
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
