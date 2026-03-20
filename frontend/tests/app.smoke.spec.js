import { expect, test } from "@playwright/test";

const APP_URL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("app loads, renders login, and reaches dashboard after simple login", async ({
  page
}) => {
  await page.route("**/auth/v1/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "test-access-token",
        token_type: "bearer",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: "test-refresh-token",
        user: {
          id: "test-user",
          email: "student@university.edu",
          aud: "authenticated",
          role: "authenticated"
        }
      })
    });
  });

  await page.goto(`${APP_URL}/login`);

  await expect(page).toHaveTitle(/ChatGuard/i);
  await expect(
    page.getByRole("heading", { name: "Welcome to ChatGuard" })
  ).toBeVisible();

  await page.getByLabel("University Email").fill("student@university.edu");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(new RegExp(`^${escapeForRegex(APP_URL)}/?$`));
  await expect(
    page.getByRole("heading", {
      name: "Check your AI conversation before you submit"
    })
  ).toBeVisible();
});
