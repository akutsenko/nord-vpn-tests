import { devices } from "@playwright/test";
const testDir = "./src/tests/ui";
const testMatch = /.*\.spec\.ts/;

export const getUiProject = (browser: string) => {
  switch (browser.toLowerCase()) {
    case "chromium": {
      return {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
        testDir,
        testMatch,
      };
    }
    case "firefox": {
      return {
        name: "firefox",
        use: {
          ...devices["Desktop Firefox"],
        },
        testDir,
        testMatch,
      };
    }
    case "webkit": {
      return {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },
        testDir,
        testMatch,
      };
    }
    default: {
      throw new Error(
        `${browser} browser is not supported. Supported browsers are chromium, firefox, webkit`,
      );
    }
  }
};
