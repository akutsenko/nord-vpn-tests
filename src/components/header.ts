import type { Locator, Page } from "@playwright/test";

export const createHeader = (page: Page) => {
  const parent: Locator = page.locator("section[data-section='Header']");
  const homeButton: Locator = parent.locator("#header-hp-link");
  const getNordVpnButton: Locator = parent.getByRole("button", {
    name: "Get NordVPN",
  });
  const loginLink = parent.getByRole("link", { name: "Log In" });

  return {
    homeButton,
    getNordVpnButton,
    loginLink,
  };
};

export type Header = ReturnType<typeof createHeader>;
