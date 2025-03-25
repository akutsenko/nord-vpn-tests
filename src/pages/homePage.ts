import { type Page, test, Locator, BrowserContext } from "@playwright/test";
import { createCommonPage } from "./common/commonPage";
import { Header, createHeader } from "../components/header";
import { createLoginPage } from "./loginPage";

export const createHomePage = (page: Page) => {
  const commonPage = createCommonPage(page);
  const header: Header = createHeader(page);
  const yourIpLabel: Locator = page.locator("slot[name = 'IPText']");

  const visit = async (): Promise<void> => {
    await test.step("user opens Home page", async () => {
      await commonPage.visit("/");
      await yourIpLabel.waitFor({ state: "visible" });
      await header.homeButton.waitFor({ state: "visible" });
    });
  };

  const navigateToLoginPage = async (context: BrowserContext) => {
    return await test.step("user navigates to Login page", async () => {
      const newTabPromise = context.waitForEvent("page");
      await header.loginLink.scrollIntoViewIfNeeded();
      await header.loginLink.click();
      const newTab = await newTabPromise;
      await newTab.waitForLoadState();
      return createLoginPage(newTab);
    });
  };

  return {
    commonPage,
    visit,
    navigateToLoginPage,
    header,
  };
};

export type HomePage = ReturnType<typeof createHomePage>;
