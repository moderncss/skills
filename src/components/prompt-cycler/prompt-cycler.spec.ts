import { expect, test } from "@playwright/test";

test.describe("prompt cycler", () => {
  test("forward/back arrows cycle through prompts with wrap-around", async ({ page }) => {
    await page.goto("/");

    const textarea = page.locator("prompt-cycler").getByRole("textbox");
    const nextBtn = page.getByRole("button", { name: "Next prompt" });
    const prevBtn = page.getByRole("button", { name: "Previous prompt" });

    await expect(nextBtn).toBeVisible();
    await expect(prevBtn).toBeVisible();

    // Wait for the initial auto-type to finish
    await expect(textarea).toHaveValue(/you write\.$/, { timeout: 10_000 });
    const initialValue = await textarea.inputValue();

    // Click next to go to prompt 2
    await nextBtn.click();
    await expect(textarea).not.toHaveValue(initialValue);

    // Click next to go to prompt 3
    await nextBtn.click();
    await expect(textarea).toHaveValue(/Available\.$/, { timeout: 10_000 });

    const prompt3Value = await textarea.inputValue();

    // Click next to wrap around to prompt 1
    await nextBtn.click();
    // Wait for typewriter to finish
    await expect(textarea).toHaveValue(initialValue, { timeout: 10_000 });

    // Click prev to wrap around to prompt 3 (last)
    await prevBtn.click();
    await expect(textarea).toHaveValue(prompt3Value, { timeout: 10_000 });
  });

  test("dot indicators update to show active prompt", async ({ page }) => {
    await page.goto("/");

    const dots = page.locator("prompt-cycler nav > span > span");
    const nextBtn = page.getByRole("button", { name: "Next prompt" });

    await expect(dots).toHaveCount(3);

    // First dot is initially active
    await expect(dots.nth(0)).toHaveAttribute("aria-current", "step");
    await expect(dots.nth(1)).not.toHaveAttribute("aria-current");
    await expect(dots.nth(2)).not.toHaveAttribute("aria-current");

    // Click next — second dot becomes active
    await nextBtn.click();
    await expect(dots.nth(0)).not.toHaveAttribute("aria-current");
    await expect(dots.nth(1)).toHaveAttribute("aria-current", "step");
    await expect(dots.nth(2)).not.toHaveAttribute("aria-current");
  });

  test("text swaps instantly with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const textarea = page.locator("prompt-cycler").getByRole("textbox");
    const nextBtn = page.getByRole("button", { name: "Next prompt" });

    const initialValue = await textarea.inputValue();

    // Click next — text should swap immediately (no typewriter)
    await nextBtn.click();

    const newValue = await textarea.inputValue();
    expect(newValue).not.toBe(initialValue);
    expect(newValue.length).toBeGreaterThan(0);

    // The full text should be present immediately (not being typed character by character)
    const valueRightAfterClick = newValue;
    await page.waitForTimeout(100);
    const valueAfterWait = await textarea.inputValue();
    expect(valueAfterWait).toBe(valueRightAfterClick);
  });

  test("clicking arrow during typewriter cancels it and starts next prompt", async ({ page }) => {
    await page.goto("/");

    const textarea = page.locator("prompt-cycler").getByRole("textbox");
    const nextBtn = page.getByRole("button", { name: "Next prompt" });

    // Wait for the initial auto-type to finish
    await expect(textarea).toHaveValue(/you write\.$/, { timeout: 10_000 });
    const initialValue = await textarea.inputValue();

    // Click next to start typewriter for prompt 2
    await nextBtn.click();

    // Immediately click next again while typewriter is running
    await nextBtn.click();

    // Wait for the third prompt to finish typing
    // The textarea should end up with prompt 3 content, not prompt 2
    const prompt3Dot = page.locator("prompt-cycler nav > span > span").nth(2);
    await expect(prompt3Dot).toHaveAttribute("aria-current", "step");

    // Click next again to wrap around
    await nextBtn.click();
    await expect(textarea).toHaveValue(initialValue, { timeout: 10_000 });
  });

  test("all prompts are visible in the textarea without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");

    const textarea = page.locator("prompt-cycler").getByRole("textbox");
    await expect(textarea).toBeVisible();

    const value = await textarea.inputValue();
    expect(value).toContain("Fetch");

    // Nav should not exist since JS is disabled
    const nav = page.getByRole("navigation", { name: "Prompt navigation" });
    await expect(nav).toHaveCount(0);

    await context.close();
  });
});
