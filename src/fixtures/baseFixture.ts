import { test as base } from "@playwright/test";
import { LandingPage, createLandingPage } from "../pages/landingPage";
import { createCookiesBanner } from "../components/banners/cookiesBanner";
import { CommonPage, createCommonPage } from "../pages/common/commonPage";
import { PricingPage, createPricingPage } from "../pages/pricingPage";
import { CheckoutPage, createCheckoutPage } from "../pages/checkoutPage";
import { HomePage, createHomePage } from "../pages/homePage";
import { LoginPage, createLoginPage } from "../pages/loginPage";

const noOperation = async () => Promise.resolve();

interface BaseFixture {
  acceptCookiesBanner: () => Promise<void>;
  setCustomUserAgent: () => Promise<void>;
  commonPage: CommonPage;
  landingPage: LandingPage;
  pricingPage: PricingPage;
  checkoutPage: CheckoutPage;
  homePage: HomePage;
  loginPage: LoginPage;
}

const test = base.extend<BaseFixture>({
  acceptCookiesBanner: [
    async ({ page }, use) => {
      const cookiesBanner = createCookiesBanner(page);
      await page.addLocatorHandler(
        cookiesBanner.acceptButton,
        async (locator) => {
          await test.step("user accepts the cookies", async () => {
            await locator.click();
          });
        },
        { times: 1 },
      );
      await use(noOperation);
    },
    { auto: true },
  ],
  // to prevent Cloudflare verification
  setCustomUserAgent: async ({ page }, use) => {
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    });
    await use(noOperation);
  },

  landingPage: async ({ page }, use) => {
    const landingPage = createLandingPage(page);
    use(landingPage);
  },
  commonPage: async ({ page }, use) => {
    const commonPage = createCommonPage(page);
    use(commonPage);
  },
  pricingPage: async ({ page }, use) => {
    const pricingPage = createPricingPage(page);
    use(pricingPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = createCheckoutPage(page);
    use(checkoutPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = createHomePage(page);
    use(homePage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = createLoginPage(page);
    use(loginPage);
  },
});

export { test };
export const expect = test.expect;
