import { type Page, test, Locator } from "@playwright/test";
import { createCommonPage } from "./common/commonPage";
import envConfig from "../utils/envConfig";

export enum PricingPlansPeriods {
  TWO_YEARS = "2-year plans",
  ONE_YEAR = "1-year plans",
  ONE_MONTH = "1-month plans",
}

export enum PricingPlans {
  ULTRA = "Ultra",
  COMPLETE = "Complete",
  PLUS = "Plus",
  BASIC = "Basic",
}

export const createPricingPage = (page: Page) => {
  const commonPage = createCommonPage(page);
  const URL_REGEX = new RegExp(
    `${envConfig().BASE_WEB_URL}/offer/pricing/|/offer/pricing/`,
  );
  const pricingPlansPeriodsDropDown: Locator = page
    .locator("[id^='MultipleHighlightedCards']")
    .getByRole("combobox");
  const genericPricingPlanCard: Locator = page
    .getByTestId("Pricing-highlighted")
    .getByTestId("PlanCard");
  const getPricingPlanCard = (period: string, planName: string) =>
    genericPricingPlanCard.filter({
      has: page.locator(
        `[data-ga-slug="${planName} card"][data-ga-extra-plans-selected*="${period.substring(0, period.length - 1)}"]`,
      ),
    });
  const getPricingPlanButton = (period: string, planName: string) =>
    getPricingPlanCard(period, planName).getByRole("button", {
      name: `Get ${planName}`,
    });

  const visit = async (): Promise<void> => {
    await test.step("user opens Pricing page", async () => {
      await commonPage.visit("/offer/pricing");
      await waitForPricingPlanToLoad();
    });
  };

  const selectPricingPlansPeriod = async (period: string): Promise<void> => {
    await test.step(`user selects the '${period}' period`, async () => {
      await pricingPlansPeriodsDropDown.selectOption({ label: period });
      await waitForPricingPlanToLoad(period as PricingPlansPeriods);
    });
  };

  const selectPricingPlan = async (
    period: string,
    planName: string,
  ): Promise<void> => {
    await test.step(`user selects '${planName}' from the '${period}'`, async () => {
      await selectPricingPlansPeriod(period);
      await getPricingPlanButton(period, planName).click();
    });
  };

  const waitForPricingPlanToLoad = async (
    period: PricingPlansPeriods = PricingPlansPeriods.TWO_YEARS,
    plan: PricingPlans = PricingPlans.ULTRA,
  ): Promise<void> => {
    await test.step(`user waits till ${plan} plan for ${period} period is loaded`, async () => {
      await getPricingPlanCard(period, plan)
        .filter({ visible: true })
        .waitFor();
    });
  };

  return {
    URL_REGEX,
    commonPage,
    selectPricingPlansPeriod,
    selectPricingPlan,
    visit,
    waitForPricingPlanToLoad,
  };
};

export type PricingPage = ReturnType<typeof createPricingPage>;
