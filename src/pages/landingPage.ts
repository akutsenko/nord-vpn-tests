import { type Page, test, Locator } from "@playwright/test";
import { createCommonPage } from "./common/commonPage";
import { Header, createHeader } from "../components/header";

export enum PricingCTA {
  PRIMARY_BUTTON = "primary 'Get NordVPN' button",
  SCROLLABLE_HEADER = "'Get NordVPN' button in scrollable header",
  GET_DEAL_IN_COMPETITORS_TABLE = "'Get the Deal' button in competitors table",
  EXTRA_SAVINGS_BUTTON = "'Get Extra Savings' button",
  GET_DEAL_IN_SAFETY_SECTION = "'Get the Deal' button in safety section",
  GET_DEAL_IN_CONNECTION_SECTION = "'Get the Deal' button in connection section",
  RISK_FREE_BUTTON = "'Try NordVPN Risk Free' button",
  SAVINGS_SECTION = "Get NordVPN' button in savings section",
}

export const createLandingPage = (page: Page) => {
  const commonPage = createCommonPage(page);
  const header: Header = createHeader(page);
  const yourIpLabel: Locator = page.locator("slot[name = 'IPText']");
  const primaryGetNordVpnButton: Locator = page
    .locator("header[data-section='Hero']")
    .getByRole("button", {
      name: "Get NordVPN",
    });
  const getTheDealButtonInCompetitorsTable: Locator = page
    .locator("table")
    .getByRole("button", {
      name: "Get the Deal",
    });
  const getExtraSavingsButton: Locator = page.getByRole("button", {
    name: "Get Extra Savings",
  });
  const getTheDealButtonInSafetySection: Locator = page
    .locator("section")
    .filter({ hasText: "data safe" })
    .getByRole("button", {
      name: "Get the Deal",
    });
  const getTheDealButtonInConnectionSection: Locator = page
    .locator("section")
    .filter({ hasText: "fast and stable connection" })
    .getByRole("button", {
      name: "Get the Deal",
    });
  const tryNordVpnRiskFreeButton: Locator = page.getByRole("button", {
    name: "Try NordVPN Risk Free",
  });
  const getNordVpnButtonInSavingsSection: Locator = page
    .locator("section[data-section='Banner']")
    .getByRole("button", {
      name: "Get NordVPN",
    });
  const pricingCtas: Map<string, Locator> = new Map([
    ["Primary 'Get NordVPN' button", primaryGetNordVpnButton],
    [
      "'Get Deal' button in Competitors table",
      getTheDealButtonInCompetitorsTable,
    ],
    ["'Get Extra Savings' button", getExtraSavingsButton],
    ["'Get Deal' button in Safety section", getTheDealButtonInSafetySection],
    [
      "'Get NordVPN' button in Connection section",
      getTheDealButtonInConnectionSection,
    ],
    ["'Try NordVPN risk free' button", tryNordVpnRiskFreeButton],
    [
      "'Get NordVPN' button in Savings section",
      getNordVpnButtonInSavingsSection,
    ],
    ["'Get NordVPN' button in scrollable header", header.getNordVpnButton],
  ]);

  const visit = async (): Promise<void> => {
    await test.step("user opens Landing page", async () => {
      await commonPage.visit("/offer");
      await yourIpLabel.waitFor({ state: "visible" });
      await header.homeButton.waitFor({ state: "visible" });
    });
  };

  const navigateToPricingPageUsing = async (cta: PricingCTA): Promise<void> => {
    await test.step(`user navigates to 'pricing' page using ${cta}`, async () => {
      switch (cta) {
        case PricingCTA.PRIMARY_BUTTON: {
          await primaryGetNordVpnButton.click();
          break;
        }
        case PricingCTA.SCROLLABLE_HEADER: {
          await getNordVpnButtonInSavingsSection.scrollIntoViewIfNeeded();
          await header.getNordVpnButton.click();
          break;
        }
        case PricingCTA.GET_DEAL_IN_COMPETITORS_TABLE: {
          await getTheDealButtonInCompetitorsTable.click();
          break;
        }
        case PricingCTA.EXTRA_SAVINGS_BUTTON: {
          await getExtraSavingsButton.click();
          break;
        }
        case PricingCTA.GET_DEAL_IN_SAFETY_SECTION: {
          await getTheDealButtonInSafetySection.click();
          break;
        }
        case PricingCTA.GET_DEAL_IN_CONNECTION_SECTION: {
          await getTheDealButtonInConnectionSection.click();
          break;
        }
        case PricingCTA.RISK_FREE_BUTTON: {
          await tryNordVpnRiskFreeButton.click();
          break;
        }
        case PricingCTA.SAVINGS_SECTION: {
          await getNordVpnButtonInSavingsSection.click();
          break;
        }
        default: {
          throw new Error(
            `Cannot navigate to '/pricing' page. Non-existent pricing CTA: ${cta}`,
          );
        }
      }
    });
  };

  return {
    commonPage,
    pricingCtas,
    visit,
    navigateToPricingPageUsing,
  };
};

export type LandingPage = ReturnType<typeof createLandingPage>;
