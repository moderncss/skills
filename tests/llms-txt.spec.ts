import { expect, test } from "@playwright/test";

test.describe("llms.txt endpoint", () => {
  test("returns 200 with expected content sections", async ({ request }) => {
    const response = await request.get("/llms.txt");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");

    const body = await response.text();

    expect(body).toContain("# Modern CSS");
  });
});
