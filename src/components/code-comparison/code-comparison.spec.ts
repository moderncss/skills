import { expect, test } from "@playwright/test";

test.describe("code comparison slider", () => {
  test("renders at 50% with slider handle", async ({ page }) => {
    await page.goto("/");

    const handle = page.getByRole("separator");
    await expect(handle).toBeVisible();
    await expect(handle).toHaveAttribute("aria-valuenow", "50");
  });

  test("drag changes position", async ({ page }) => {
    await page.goto("/");

    const handle = page.getByRole("separator");
    const box = await handle.boundingBox();

    await handle.dispatchEvent("pointerdown", {
      clientX: box!.x + box!.width / 2,
      clientY: box!.y + box!.height / 2,
      pointerId: 1,
    });

    const comparison = page.locator("code-comparison");
    const compBox = await comparison.boundingBox();

    await handle.dispatchEvent("pointermove", {
      clientX: compBox!.x + compBox!.width * 0.7,
      clientY: box!.y + box!.height / 2,
      pointerId: 1,
    });

    await handle.dispatchEvent("pointerup", { pointerId: 1 });

    const value = await handle.getAttribute("aria-valuenow");
    expect(Number(value)).toBeGreaterThan(50);
  });

  test("keyboard: Arrow keys adjust position by 1", async ({ page }) => {
    await page.goto("/");

    const handle = page.getByRole("separator");
    await handle.focus();
    await handle.press("ArrowRight");

    await expect(handle).toHaveAttribute("aria-valuenow", "51");
  });

  test("keyboard: Shift+Arrow adjusts position by 10", async ({ page }) => {
    await page.goto("/");

    const handle = page.getByRole("separator");
    await handle.focus();
    await handle.press("Shift+ArrowLeft");

    await expect(handle).toHaveAttribute("aria-valuenow", "40");
  });

  test("keyboard: Home/End jump to 0/100", async ({ page }) => {
    await page.goto("/");

    const handle = page.getByRole("separator");
    await handle.focus();

    await handle.press("Home");
    await expect(handle).toHaveAttribute("aria-valuenow", "0");

    await handle.press("End");
    await expect(handle).toHaveAttribute("aria-valuenow", "100");
  });

  test("boundary clamping: position stays at 0 when pressing ArrowLeft", async ({ page }) => {
    await page.goto("/");

    const handle = page.getByRole("separator");
    await handle.focus();

    await handle.press("Home");
    await expect(handle).toHaveAttribute("aria-valuenow", "0");

    await handle.press("ArrowLeft");
    await expect(handle).toHaveAttribute("aria-valuenow", "0");
  });

  test("both code blocks visible at 50%", async ({ page }) => {
    await page.goto("/");

    const before = page.locator('code-comparison [slot="before"]');
    const after = page.locator('code-comparison [slot="after"]');

    await expect(before).toBeVisible();
    await expect(after).toBeVisible();

    await expect(before.locator("pre")).toHaveCount(1);
    await expect(after.locator("pre")).toHaveCount(1);
  });

  test("ARIA attributes on handle", async ({ page }) => {
    await page.goto("/");

    const handle = page.getByRole("separator");
    await expect(handle).toHaveAttribute("aria-valuemin", "0");
    await expect(handle).toHaveAttribute("aria-valuemax", "100");
    await expect(handle).toHaveAttribute("aria-valuenow", "50");
  });

  test("progressive enhancement: stacked layout without JS", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");

    const before = page.locator('code-comparison [slot="before"]');
    const after = page.locator('code-comparison [slot="after"]');

    await expect(before).toBeVisible();
    await expect(after).toBeVisible();

    const handle = page.getByRole("separator");
    await expect(handle).toHaveCount(0);

    await context.close();
  });
});
