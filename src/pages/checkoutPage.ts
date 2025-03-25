import { type Page, Locator } from "@playwright/test";
import { PricingPlansPeriods } from "./pricingPage";
import { CommonPage, createCommonPage } from "./common/commonPage";

const pricingPeriodsMap: Map<string, string> = new Map([
  [PricingPlansPeriods.ONE_MONTH, "Monthly plan"],
  [PricingPlansPeriods.TWO_YEARS, "2-year plan"],
  [PricingPlansPeriods.ONE_YEAR, "1-year plan"],
]);

export const createCheckoutPage = (page: Page) => {
  const URL_REGEX: RegExp = /payment/;
  const commonPage: CommonPage = createCommonPage(page);
  const orderSummaryContainer: Locator = page.getByTestId(
    "order-summary-container",
  );
  const chosenPricingPlan: Locator =
    orderSummaryContainer.getByTestId("CardTitle-title");
  const getChosenPricingPlanPeriod = (period: string) =>
    orderSummaryContainer.getByText(
      pricingPeriodsMap.get(period) || "Unsupported plan",
    );

  return {
    commonPage,
    URL_REGEX,
    chosenPricingPlan,
    getChosenPricingPlanPeriod,
  };
};

export type CheckoutPage = ReturnType<typeof createCheckoutPage>;
