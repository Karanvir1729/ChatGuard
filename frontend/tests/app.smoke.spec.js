import { expect, test } from "@playwright/test";

const APP_URL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function mockSupabaseAuth(page) {
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
}

async function loginToDashboard(page) {
  await mockSupabaseAuth(page);

  await page.goto(`${APP_URL}/login`);

  await expect(page).toHaveTitle(/ChatGuard/i);
  await expect(
    page.getByRole("heading", { name: "Welcome to ChatGuard" })
  ).toBeVisible();

  await page.getByLabel("University Email").fill("student@university.edu");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(new RegExp(`^${escapeForRegex(APP_URL)}/?$`));
}

test("app loads, renders login, and reaches dashboard after simple login", async ({
  page
}) => {
  await loginToDashboard(page);

  await expect(
    page.getByRole("heading", {
      name: "Check your AI conversation before you submit"
    })
  ).toBeVisible();
});

test("start new check requires text and confirmation before continuing", async ({
  page
}) => {
  await loginToDashboard(page);

  await page.goto(`${APP_URL}/check/start`);

  await expect(
    page.getByRole("heading", { name: "Start a New Check" })
  ).toBeVisible();

  const continueButton = page.getByRole("button", { name: "Continue" });
  const conversationInput = page.getByLabel("AI Conversation");
  const confirmationCheckbox = page.getByLabel(
    "I confirm this conversation is complete and belongs to the submission I want checked."
  );

  await expect(continueButton).toBeDisabled();

  await conversationInput.fill(
    "User: Can you help me outline my essay?\nAssistant: Yes, here is a possible structure."
  );
  await expect(continueButton).toBeDisabled();

  await confirmationCheckbox.check();
  await expect(continueButton).toBeEnabled();

  await continueButton.click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/context$`)
  );
});
