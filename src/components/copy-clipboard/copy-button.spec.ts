import { expect, test } from "@playwright/test";

test.describe("copy button", () => {
  test("copies textarea content to clipboard and shows feedback", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    const section = page.getByRole("heading", { name: "Get started" }).locator("..");
    const copyBtn = section.getByRole("button", { name: "Copy" });
    await expect(copyBtn).toBeVisible();

    // Wait for the initial auto-type to finish before copying
    const textarea = section.getByRole("textbox");
    await expect(textarea).toHaveValue(/you write\.$/, { timeout: 10_000 });

    await copyBtn.click();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    const textareaValue = await section.getByRole("textbox").inputValue();
    expect(clipboardText).toBe(textareaValue);

    // Button shows "Copied" state via aria-hidden toggling
    const copiedBtn = section.getByRole("button", { name: "Copied" });
    const copySpan = copiedBtn.locator("span").nth(0);
    const copiedSpan = copiedBtn.locator("span").nth(1);
    await expect(copySpan).toHaveAttribute("aria-hidden", "true");
    await expect(copiedSpan).toHaveAttribute("aria-hidden", "false");
  });
});
