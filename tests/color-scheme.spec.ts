import { expect, test } from "@playwright/test";

test.describe("light/dark mode", () => {
  test("renders in light color scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("renders in dark color scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });
});
