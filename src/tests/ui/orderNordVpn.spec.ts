import { test, expect } from "../../fixtures/baseFixture";
import { PricingPlans, PricingPlansPeriods } from "../../pages/pricingPage";
import { PricingCTA } from "../../pages/landingPage";
import { CheckoutPage } from "../../pages/checkoutPage";

test(
  "all pricing CTAs on Landing page properly redirect to Pricing page",
  {
    tag: ["@ui", "@orders"],
  },
  async ({ landingPage, pricingPage }) => {
    await landingPage.visit();
    for (let [ctaName, cta] of landingPage.pricingCtas) {
      await test.step(`user checks that ${ctaName} is a link to Pricing page`, async () => {
        await cta.scrollIntoViewIfNeeded();
        await expect.soft(cta).toHaveAttribute("href", pricingPage.URL_REGEX);
      });
    }
  },
);

Object.values(PricingPlansPeriods).forEach((period) => {
  Object.values(PricingPlans).forEach((plan) => {
    test(
      `order summary has correct info about chosen ${plan} plan from ${period} on Checkout page`,
      {
        tag: ["@ui", "@orders", "@p0"],
      },
      async ({ pricingPage, checkoutPage }) => {
        await pricingPage.visit();
        await pricingPage.selectPricingPlan(period, plan);
        await checkThatProperPlanIsShownOnCheckoutPage({
          period,
          plan,
          checkoutPage,
        });
      },
    );
  });
});

test.only(
  "pricing plan on Checkout page corresponds to newly selected period",
  {
    tag: ["@ui", "@orders", "@p0"],
  },
  async ({ landingPage, pricingPage, checkoutPage }) => {
    const initialPeriod = PricingPlansPeriods.ONE_YEAR;
    const newPeriod = PricingPlansPeriods.ONE_MONTH;
    const plan = PricingPlans.COMPLETE;

    await landingPage.visit();
    await landingPage.navigateToPricingPageUsing(PricingCTA.PRIMARY_BUTTON);
    await pricingPage.commonPage.shouldHaveUrl(pricingPage.URL_REGEX);
    await pricingPage.selectPricingPlan(initialPeriod, plan);
    await checkThatProperPlanIsShownOnCheckoutPage({
      period: initialPeriod,
      plan: plan,
      checkoutPage,
    });

    await checkoutPage.commonPage.goBack(pricingPage.URL_REGEX);
    await pricingPage.waitForPricingPlanToLoad();
    await pricingPage.selectPricingPlan(newPeriod, plan);
    await checkThatProperPlanIsShownOnCheckoutPage({
      period: newPeriod,
      plan: plan,
      checkoutPage,
    });
  },
);

const checkThatProperPlanIsShownOnCheckoutPage = async ({
  period,
  plan,
  checkoutPage,
}: {
  period: PricingPlansPeriods;
  plan: PricingPlans;
  checkoutPage: CheckoutPage;
}) => {
  await test.step(`user checks that the chosen ${plan} plan from ${period} is shown on Checkout page`, async () => {
    await Promise.all([
      await checkoutPage.commonPage.shouldHaveUrl(checkoutPage.URL_REGEX),
      expect(checkoutPage.chosenPricingPlan).toHaveText(plan),
      expect(checkoutPage.getChosenPricingPlanPeriod(period)).toBeVisible(),
    ]);
  });
};
