import { type Page, test, expect } from "@playwright/test";

export const createCommonPage = (page: Page) => {
  const visit = async (path: string): Promise<void> => {
    await test.step(`user navigates to '${path}' url`, async () => {
      await page.goto(path);
    });
  };

  const goBack = async (url: string | RegExp): Promise<void> => {
    await test.step(`user navigates back to '${url}' url`, async () => {
      await page.goBack({ waitUntil: "load" });
      await shouldHaveUrl(url);
    });
  };

  const refreshPage = async () => {
    await test.step("user refreshes the page", async () => {
      page.reload({ waitUntil: "load" });
    });
  };
  const scrollDownByPixels = async (pixelsNumber: number): Promise<void> => {
    await test.step(`user scrolls down by '${pixelsNumber}' pixels`, async () => {
      await page.mouse.wheel(0, pixelsNumber);
    });
  };

  const scrollUpByPixels = async (pixelsNumber: number): Promise<void> => {
    await test.step(`user scrolls up by '${pixelsNumber}' pixels`, async () => {
      await page.mouse.wheel(0, pixelsNumber * -1);
    });
  };

  const shouldHaveUrl = async (url: string | RegExp): Promise<void> => {
    await test.step(`user checks that current urls is '${url}'`, async () => {
      return await expect(page).toHaveURL(url);
    });
  };

  return {
    visit,
    goBack,
    shouldHaveUrl,
    scrollDownByPixels,
    scrollUpByPixels,
    refreshPage,
  };
};

export type CommonPage = ReturnType<typeof createCommonPage>;
