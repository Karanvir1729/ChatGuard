import { expect, test } from "@playwright/test";

const APP_URL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const API_URL = process.env.PLAYWRIGHT_API_URL || "http://127.0.0.1:8000";

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function apiUrlPattern(path) {
  return new RegExp(`^${escapeForRegex(API_URL)}${path}$`);
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

async function reachReviewPage(page) {
  await loginToDashboard(page);

  await page.goto(`${APP_URL}/check/start`);
  await page.getByLabel("AI Conversation").fill(
    "User: Can you help me outline my essay?\nAssistant: Yes, here is a possible structure."
  );
  await page
    .getByLabel(
      "I confirm this conversation is complete and belongs to the submission I want checked."
    )
    .check();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/context$`)
  );

  await page.getByLabel("Institution").fill("University of Toronto");
  await page.getByLabel("Course Code").fill("CSC108");
  await page
    .getByLabel("I am a University of Toronto student")
    .check();
  await page.getByLabel("Assignment Type").selectOption("Coding assignment");
  await page.getByLabel("Student Status").selectOption("Undergraduate");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/review$`)
  );
}

async function mockReviewActions(page) {
  await page.route(apiUrlPattern("/checks/draft"), async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "draft-review-001",
        title: "Coding assignment",
        course_code: "CSC108",
        status: "draft",
        decision: "Draft",
        updated_at: "2026-03-20T10:30:00Z"
      })
    });
  });

  await page.route(apiUrlPattern("/checks/analyze"), async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "mock-check-001",
        status: "completed",
        summary:
          "This review suggests the conversation reads like planning and revision support for a coding assignment.",
        suspected_course: "CSC108",
        classification: "Allowed With Advisory",
        risk_level: "Minimal",
        reasoning: [
          "The conversation shows planning support rather than full answer submission."
        ],
        matched_policies: [
          {
            course_code: "CSC108",
            section_title: "Use of AI Tools",
            snippet:
              "Planning and revision support may be acceptable when the final work remains the student's own."
          }
        ],
        safer_next_steps: [
          "Review the final submission in your own words before turning it in."
        ],
        created_at: "2026-03-20T10:31:00Z",
        updated_at: "2026-03-20T10:31:00Z"
      })
    });
  });
}

async function mockCheckById(page, checkId, overrides = {}) {
  await page.route(apiUrlPattern(`/checks/${checkId}`), async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: checkId,
        status: "completed",
        summary:
          "This review suggests the conversation reads like planning and revision support.",
        suspected_course: "CSC108",
        classification: "Allowed With Advisory",
        risk_level: "Minimal",
        reasoning: [
          "The conversation appears to support planning and revision rather than direct answer submission."
        ],
        matched_policies: [
          {
            course_code: "CSC108",
            section_title: "Use of AI Tools",
            snippet:
              "Planning and revision support may be acceptable when the final work remains the student's own."
          }
        ],
        safer_next_steps: [
          "Review the final submission in your own words before turning it in."
        ],
        created_at: "2026-03-20T10:31:00Z",
        updated_at: "2026-03-20T10:31:00Z",
        ...overrides
      })
    });
  });
}

async function mockHistoryItems(page, items) {
  await page.route(apiUrlPattern("/history"), async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(items)
    });
  });
}

async function failApiRequests(page, paths) {
  for (const path of paths) {
    await page.route(apiUrlPattern(path), async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          detail: "Backend unavailable in fallback test."
        })
      });
    });
  }
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

test("course context page renders fields and routes back or forward correctly", async ({
  page
}) => {
  await loginToDashboard(page);

  await page.goto(`${APP_URL}/check/context`);

  await expect(
    page.getByRole("heading", { name: "Add Course Context" })
  ).toBeVisible();

  const institutionInput = page.getByLabel("Institution");
  const courseCodeInput = page.getByLabel("Course Code");
  const uoftCheckbox = page.getByLabel(
    "I am a University of Toronto student"
  );
  const assignmentTypeSelect = page.getByLabel("Assignment Type");
  const studentStatusSelect = page.getByLabel("Student Status");

  await expect(institutionInput).toBeVisible();
  await expect(courseCodeInput).toBeVisible();
  await expect(uoftCheckbox).toBeVisible();
  await expect(assignmentTypeSelect).toBeVisible();
  await expect(studentStatusSelect).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/start$`)
  );

  await page.goto(`${APP_URL}/check/context`);

  await institutionInput.fill("University of Toronto");
  await courseCodeInput.fill("CSC108");
  await uoftCheckbox.check();
  await assignmentTypeSelect.selectOption("Coding assignment");
  await studentStatusSelect.selectOption("Undergraduate");

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/review$`)
  );
});

test("review page shows the submission summary and edit actions route correctly", async ({
  page
}) => {
  await reachReviewPage(page);

  await expect(
    page.getByRole("heading", { name: "Review Submission" })
  ).toBeVisible();
  await expect(
    page.getByText("User: Can you help me outline my essay?", { exact: false })
  ).toBeVisible();
  await expect(page.getByText("University of Toronto")).toBeVisible();
  await expect(page.getByText("CSC108")).toBeVisible();

  await page.getByRole("button", { name: "Edit Conversation" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/start$`)
  );

  await reachReviewPage(page);
  await page.getByRole("button", { name: "Edit Course Info" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/context$`)
  );
});

test("review page save as draft routes to history", async ({ page }) => {
  await mockReviewActions(page);
  await reachReviewPage(page);

  await page.getByRole("button", { name: "Save as Draft" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/history$`)
  );
});

test("review page submit check routes to the mock result page", async ({ page }) => {
  await mockReviewActions(page);
  await reachReviewPage(page);

  await page.getByRole("button", { name: "Submit Check" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/result/mock-check-001$`)
  );
});

test("result page renders key analysis sections and start new check routes back", async ({
  page
}) => {
  await mockCheckById(page, "mock-check-001");
  await loginToDashboard(page);

  await page.goto(`${APP_URL}/check/result/mock-check-001`);

  await expect(
    page.getByRole("heading", { name: "Final Analysis" })
  ).toBeVisible();
  await expect(page.getByText("Allowed With Advisory")).toBeVisible();
  await expect(page.getByText("Reasoning Behind Verdict")).toBeVisible();

  await page.getByRole("button", { name: "Start New Check" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/start$`)
  );
});

test("history page renders rows and can open a completed item", async ({ page }) => {
  await mockHistoryItems(page, [
    {
      id: "hist-check-001",
      title: "Reflection Memo 2",
      course_code: "EDS345",
      status: "completed",
      decision: "Allowed With Advisory",
      updated_at: "2026-03-20T10:19:00Z"
    },
    {
      id: "hist-draft-001",
      title: "Lab Summary Draft",
      course_code: "BIO201",
      status: "draft",
      decision: "Draft",
      updated_at: "2026-03-19T18:42:00Z"
    }
  ]);
  await mockCheckById(page, "hist-check-001", {
    suspected_course: "EDS345"
  });
  await loginToDashboard(page);

  await page.goto(`${APP_URL}/history`);

  await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
  await expect(page.getByText("Reflection Memo 2")).toBeVisible();
  await expect(page.getByText("Lab Summary Draft")).toBeVisible();

  await page.getByRole("button", { name: "View" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/result/hist-check-001$`)
  );
  await expect(
    page.getByRole("heading", { name: "Final Analysis" })
  ).toBeVisible();
});

test("review submit falls back to mock result when backend analyze calls fail", async ({
  page
}) => {
  await failApiRequests(page, [
    "/checks/analyze",
    "/checks/mock-check-001"
  ]);
  await reachReviewPage(page);

  await page.getByRole("button", { name: "Submit Check" }).click();

  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/result/mock-check-001$`)
  );
  await expect(
    page.getByRole("heading", { name: "Final Analysis" })
  ).toBeVisible();
  await expect(page.getByText("Allowed With Advisory")).toBeVisible();
  await expect(
    page.getByText("brainstorming, outlining, and language cleanup", {
      exact: false
    })
  ).toBeVisible();
});

test("history page falls back to mock rows when the history api is unavailable", async ({
  page
}) => {
  await failApiRequests(page, [
    "/history",
    "/checks/chk_1024"
  ]);
  await loginToDashboard(page);

  await page.goto(`${APP_URL}/history`);

  await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
  await expect(page.getByText("Reflection Memo 2")).toBeVisible();
  await expect(page.getByText("Lab Summary Draft")).toBeVisible();

  await page.getByRole("button", { name: "View" }).first().click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/result/chk_1024$`)
  );
  await expect(
    page.getByRole("heading", { name: "Final Analysis" })
  ).toBeVisible();
});

test("happy path e2e flow goes from login to final analysis", async ({ page }) => {
  await mockReviewActions(page);
  await mockCheckById(page, "mock-check-001");
  await loginToDashboard(page);

  await expect(
    page.getByRole("heading", {
      name: "Check your AI conversation before you submit"
    })
  ).toBeVisible();

  await page.getByRole("button", { name: "Start New Check" }).click();
  await expect(
    page.getByRole("heading", { name: "Start a New Check" })
  ).toBeVisible();

  await page.getByLabel("AI Conversation").fill(
    "User: Can you help me plan my coding assignment?\nAssistant: Yes, here is a step-by-step outline you can review and adapt."
  );
  await page
    .getByLabel(
      "I confirm this conversation is complete and belongs to the submission I want checked."
    )
    .check();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: "Add Course Context" })
  ).toBeVisible();
  await page.getByLabel("Institution").fill("University of Toronto");
  await page.getByLabel("Course Code").fill("CSC108");
  await page
    .getByLabel("I am a University of Toronto student")
    .check();
  await page.getByLabel("Assignment Type").selectOption("Coding assignment");
  await page.getByLabel("Student Status").selectOption("Undergraduate");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: "Review Submission" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Submit Check" }).click();

  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/result/mock-check-001$`)
  );
  await expect(
    page.getByRole("heading", { name: "Final Analysis" })
  ).toBeVisible();
});

test("main routes render their primary pages", async ({ page }) => {
  await mockCheckById(page, "mock-check-001");
  await mockHistoryItems(page, [
    {
      id: "hist-check-001",
      title: "Reflection Memo 2",
      course_code: "EDS345",
      status: "completed",
      decision: "Allowed With Advisory",
      updated_at: "2026-03-20T10:19:00Z"
    }
  ]);

  await page.goto(`${APP_URL}/login`);
  await expect(
    page.getByRole("heading", { name: "Welcome to ChatGuard" })
  ).toBeVisible();

  await loginToDashboard(page);
  await expect(
    page.getByRole("heading", {
      name: "Check your AI conversation before you submit"
    })
  ).toBeVisible();

  await page.goto(`${APP_URL}/check/start`);
  await expect(
    page.getByRole("heading", { name: "Start a New Check" })
  ).toBeVisible();

  await page.goto(`${APP_URL}/check/context`);
  await expect(
    page.getByRole("heading", { name: "Add Course Context" })
  ).toBeVisible();

  await page.goto(`${APP_URL}/check/review`);
  await expect(
    page.getByRole("heading", { name: "Review Submission" })
  ).toBeVisible();

  await page.goto(`${APP_URL}/check/result/mock-check-001`);
  await expect(
    page.getByRole("heading", { name: "Final Analysis" })
  ).toBeVisible();

  await page.goto(`${APP_URL}/history`);
  await expect(page.getByRole("heading", { name: "History" })).toBeVisible();

  await page.goto(`${APP_URL}/learn-more`);
  await expect(
    page.getByRole("heading", { name: "Learn More" })
  ).toBeVisible();

  await page.goto(`${APP_URL}/route-that-does-not-exist`);
  await expect(
    page.getByText("Page not found", { exact: true })
  ).toBeVisible();
});

test("obvious navigation links and buttons work across the main pages", async ({
  page
}) => {
  await mockCheckById(page, "hist-check-001", {
    suspected_course: "EDS345"
  });
  await mockHistoryItems(page, [
    {
      id: "hist-check-001",
      title: "Reflection Memo 2",
      course_code: "EDS345",
      status: "completed",
      decision: "Allowed With Advisory",
      updated_at: "2026-03-20T10:19:00Z"
    }
  ]);
  await loginToDashboard(page);

  await page.getByRole("button", { name: "Learn More" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/learn-more$`)
  );

  await page.getByRole("link", { name: "History" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/history$`)
  );

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page).toHaveURL(new RegExp(`^${escapeForRegex(APP_URL)}/?$`));

  await page.getByRole("button", { name: "Start New Check" }).click();
  await expect(page).toHaveURL(
    new RegExp(`^${escapeForRegex(APP_URL)}/check/start$`)
  );

  await page.goto(`${APP_URL}/missing-page`);
  await page.getByRole("button", { name: "Back to Dashboard" }).click();
  await expect(page).toHaveURL(new RegExp(`^${escapeForRegex(APP_URL)}/?$`));
});
