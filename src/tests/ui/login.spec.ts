import { test, expect } from "../../fixtures/baseFixture";
import { getRandomNumberWithinRange } from "../../utils/numberUtil";
import { waitForRandomTimeoutWithinRange } from "../../utils/waitUtil";

test(
  "user navigates to Login page",
  {
    tag: ["@ui", "@iam", "@p0"],
  },
  async ({ homePage, context, setCustomUserAgent }) => {
    await homePage.visit();
    // not sure if it's needed and if it help.
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
    await test.step(`user checks that Login page has been loaded`, async () => {
      await Promise.all([
        loginPage.commonPage.shouldHaveUrl(loginPage.URL_REGEX),
        expect(loginPage.nordAccountLogo).toBeVisible(),
        expect(loginPage.loginText).toBeVisible(),
      ]);
    });

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
  },
);
