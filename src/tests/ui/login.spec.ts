import { test, expect } from "../../fixtures/baseFixture";
import { LoginPage } from "../../pages/loginPage";
import { PricingPlans, PricingPlansPeriods } from "../../pages/pricingPage";
import { getRandomNumberWithinRange } from "../../utils/numberUtil";
import { waitForRandomTimeoutWithinRange } from "../../utils/waitUtil";

test(
  "redirection to Login page from Home page works and all supported login options are shown",
  {
    tag: ["@ui", "@iam", "@p0"],
  },
  async ({ homePage, context, setCustomUserAgent }) => {
    await homePage.visit();
    // not sure if it's needed and if it helps.
    // I've seen the cloudflare verification once when I was browsing nordvpn.com manually
    // in addition to these actions the custom user agent is set in fixtures
    await test.step(`user simulates mouse scrolling with delays to prevent Cloudflare verification`, async () => {
      await waitForRandomTimeoutWithinRange(1, 5);
      const pixelsNumber = getRandomNumberWithinRange(5, 10);
      await homePage.commonPage.scrollDownByPixels(pixelsNumber);
      await homePage.commonPage.scrollDownByPixels(pixelsNumber);
      await waitForRandomTimeoutWithinRange(1, 5);
    });
    const loginPage = await homePage.navigateToLoginPage(context);
    await loginPage.waitForLoad();

    checkThatAvailableLoginOptionsAreCorrect({ loginPage });
  },
);

test(
  "redirection to Login page from Checkout page works and all supported login options are shown",
  {
    tag: ["@ui", "@iam", "@p0"],
  },
  async ({ pricingPage, checkoutPage, loginPage, setCustomUserAgent }) => {
    await pricingPage.visit();
    await pricingPage.selectPricingPlan(
      PricingPlansPeriods.ONE_YEAR,
      PricingPlans.ULTRA,
    );
    await checkoutPage.navigateToLoginPage();
    await loginPage.waitForLoad();
    await checkThatAvailableLoginOptionsAreCorrect({ loginPage });
  },
);

const checkThatAvailableLoginOptionsAreCorrect = async ({
  loginPage,
}: {
  loginPage: LoginPage;
}) => {
  const softExpect = expect.configure({ soft: true });
  await test.step(`user checks that option to login via email & password is shown`, async () => {
    await Promise.all([
      softExpect(loginPage.emailAddressInput).toBeVisible(),
      softExpect(loginPage.continueButton).toBeVisible(),
    ]);
  });
  await test.step(`user checks that option to login via Google account is shown`, async () => {
    await softExpect(loginPage.signinWithGoogleButton).toBeVisible();
  });
  await test.step(`user checks that option to login via Apple account is shown`, async () => {
    await softExpect(loginPage.signinWithAppleButton).toBeVisible();
  });
  await test.step(`user checks that option to login via One-time code is shown`, async () => {
    await softExpect(loginPage.getOneTimeLoginCodeButton).toBeVisible();
  });
  await test.step(`user checks that 'Sign up' link is shown`, async () => {
    await softExpect(loginPage.signUpLink).toBeVisible();
  });
  await test.step(`user checks that 'Forgot your password' link is shown`, async () => {
    await softExpect(loginPage.forgotYourPasswordLink).toBeVisible();
  });
};
