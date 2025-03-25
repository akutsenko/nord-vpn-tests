import { type Page, Locator } from "@playwright/test";
import { createCommonPage } from "./common/commonPage";

export const createLoginPage = (page: Page) => {
  const URL_REGEX = /^https:\/\/nordaccount\.com\/login\/.*/;
  const commonPage = createCommonPage(page);
  const loginSection = page.locator("[data-section='Card']");
  const loginText = loginSection.getByText("Log in");
  const nordAccountLogo = loginSection.getByRole("img", {
    name: "Nord Account logo",
  });
  const emailAddressInput: Locator = page.getByRole("textbox", {
    name: "Email address",
  });
  const continueButton = page.getByRole("button", { name: "Continue" });
  const signinWithGoogleButton = page.getByRole("link", {
    name: "Sign in with Google",
  });
  const signinWithAppleButton = page.getByRole("link", {
    name: "Sign in with Apple",
  });
  const getOneTimeLoginCodeButton = page.getByRole("link", {
    name: "Get a one-time login code",
  });
  const signUpLink = page.getByRole("link", {
    name: "Sign up",
  });
  const forgotYourPasswordLink = page.getByRole("link", {
    name: "Forgot your password?",
  });

  return {
    commonPage,
    URL_REGEX,
    loginText,
    nordAccountLogo,
    emailAddressInput,
    continueButton,
    signinWithGoogleButton,
    signinWithAppleButton,
    getOneTimeLoginCodeButton,
    signUpLink,
    forgotYourPasswordLink,
  };
};

export type LoginPage = ReturnType<typeof createLoginPage>;
