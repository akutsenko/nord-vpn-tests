import type { Locator, Page } from "@playwright/test";

export const createCookiesBanner = (page: Page) => {
  const acceptButton: Locator = page.getByTestId("consent-widget-accept-all");

  return {
    acceptButton,
  };
};

export type CookiesBanner = ReturnType<typeof createCookiesBanner>;
