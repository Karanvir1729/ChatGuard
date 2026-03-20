import { expect, test } from "@playwright/test";

const API_URL = process.env.PLAYWRIGHT_API_URL || "http://127.0.0.1:8000";
const RESULT_STATUS = "Allowed With Advisory";

const ROUTES = {
  login: "/login",
  dashboard: "/",
  start: "/check/start",
  context: "/check/context",
  review: "/check/review",
  result: "/check/result/mock-check-001",
  history: "/history",
  learnMore: "/learn-more"
};

const HEADINGS = {
  login: "Welcome to ChatGuard",
  dashboard: "Check your AI conversation before you submit",
  start: "Start a New Check",
  context: "Add Course Context",
  review: "Review Submission",
  result: "Final Analysis",
  history: "History",
  learnMore: "Learn More",
  notFound: "Page not found"
};

const LABELS = {
  email: "University Email",
  password: "Password",
  conversation: "AI Conversation",
  confirmation:
    "I confirm this conversation is complete and belongs to the submission I want checked.",
  institution: "Institution",
  courseCode: "Course Code",
  uoft: "I am a University of Toronto student",
  assignmentType: "Assignment Type",
  studentStatus: "Student Status"
};

const VALUES = {
  email: "student@university.edu",
  password: "password123",
  institution: "University of Toronto",
  courseCode: "CSC108",
  assignmentType: "Coding assignment",
  studentStatus: "Undergraduate",
  conversation:
    "User: Can you help me outline my essay?\nAssistant: Yes, here is a possible structure.",
  happyPathConversation:
    "User: Can you help me plan my coding assignment?\nAssistant: Yes, here is a step-by-step outline you can review and adapt."
};

const DEFAULT_HISTORY_ITEMS = [
  {
    id: "hist-check-001",
    title: "Reflection Memo 2",
    course_code: "EDS345",
    status: "completed",
    decision: RESULT_STATUS,
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
];

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function apiUrlPattern(path) {
  return new RegExp(`^${escapeForRegex(API_URL)}${path}(\\?.*)?$`);
}

function buildCheckPayload(checkId, overrides = {}) {
  return {
    id: checkId,
    status: "completed",
    summary:
      "This review suggests the conversation reads like planning and revision support.",
    suspected_course: VALUES.courseCode,
    classification: RESULT_STATUS,
    risk_level: "Minimal",
    reasoning: [
      "The conversation appears to support planning and revision rather than direct answer submission."
    ],
    matched_policies: [
      {
        course_code: VALUES.courseCode,
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
  };
}

async function routeJson(page, path, body, status = 200) {
  await page.route(apiUrlPattern(path), async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body)
    });
  });
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
          email: VALUES.email,
          aud: "authenticated",
          role: "authenticated"
        }
      })
    });
  });
}

async function mockReviewActions(page) {
  await routeJson(page, "/checks/draft", {
    id: "draft-review-001",
    title: VALUES.assignmentType,
    course_code: VALUES.courseCode,
    status: "draft",
    decision: "Draft",
    updated_at: "2026-03-20T10:30:00Z"
  });

  await routeJson(page, "/checks/analyze", {
    ...buildCheckPayload("mock-check-001"),
    summary:
      "This review suggests the conversation reads like planning and revision support for a coding assignment.",
    reasoning: [
      "The conversation shows planning support rather than full answer submission."
    ]
  });
}

async function mockCheckById(page, checkId, overrides = {}) {
  await routeJson(page, `/checks/${checkId}`, buildCheckPayload(checkId, overrides));
}

async function mockHistoryItems(page, items) {
  await routeJson(page, "/history", items);
}

async function failApiRequests(page, paths) {
  for (const path of paths) {
    await routeJson(
      page,
      path,
      { detail: "Backend unavailable in fallback test." },
      503
    );
  }
}

async function expectHeading(page, heading) {
  await expect(
    page.getByRole("heading", { name: heading, exact: true }).first()
  ).toBeVisible();
}

async function expectPath(page, path) {
  await expect.poll(() => new URL(page.url()).pathname).toBe(path);
}

async function goToAndExpectHeading(page, path, heading) {
  await page.goto(path);
  await expectPath(page, path);
  await expectHeading(page, heading);
}

function statusBadge(page, label = RESULT_STATUS) {
  return page.locator("span").filter({ hasText: label }).first();
}

function historyRow(page, title) {
  return page.locator("div").filter({
    has: page.getByText(title, { exact: true }),
    hasText: title
  }).filter({
    has: page.getByRole("button")
  }).first();
}

async function loginToDashboard(page) {
  await goToAndExpectHeading(page, ROUTES.login, HEADINGS.login);
  await expect(page).toHaveTitle(/ChatGuard/i);

  await page.getByLabel(LABELS.email).fill(VALUES.email);
  await page.getByLabel(LABELS.password).fill(VALUES.password);
  await page.getByRole("button", { name: "Continue" }).click();

  await expectPath(page, ROUTES.dashboard);
  await expectHeading(page, HEADINGS.dashboard);
}

async function completeStartCheckStep(page, conversation = VALUES.conversation) {
  await goToAndExpectHeading(page, ROUTES.start, HEADINGS.start);

  await page.getByLabel(LABELS.conversation).fill(conversation);
  await page.getByLabel(LABELS.confirmation).check();
  await page.getByRole("button", { name: "Continue" }).click();

  await expectPath(page, ROUTES.context);
  await expectHeading(page, HEADINGS.context);
}

async function completeCourseContextStep(page) {
  await expectHeading(page, HEADINGS.context);

  await page.getByLabel(LABELS.institution).fill(VALUES.institution);
  await page.getByLabel(LABELS.courseCode).fill(VALUES.courseCode);
  await page.getByLabel(LABELS.uoft).check();
  await page.getByLabel(LABELS.assignmentType).selectOption(VALUES.assignmentType);
  await page.getByLabel(LABELS.studentStatus).selectOption(VALUES.studentStatus);
  await page.getByRole("button", { name: "Continue" }).click();

  await expectPath(page, ROUTES.review);
  await expectHeading(page, HEADINGS.review);
}

async function reachReviewPage(page, conversation = VALUES.conversation) {
  await loginToDashboard(page);
  await completeStartCheckStep(page, conversation);
  await completeCourseContextStep(page);
}

test.beforeEach(async ({ page }) => {
  await mockSupabaseAuth(page);
});

test("app loads, renders login, and reaches dashboard after simple login", async ({
  page
}) => {
  await loginToDashboard(page);
  await expectHeading(page, HEADINGS.dashboard);
});

test("start new check requires text and confirmation before continuing", async ({
  page
}) => {
  await loginToDashboard(page);
  await goToAndExpectHeading(page, ROUTES.start, HEADINGS.start);

  const continueButton = page.getByRole("button", { name: "Continue" });

  await expect(continueButton).toBeDisabled();
  await page.getByLabel(LABELS.conversation).fill(VALUES.conversation);
  await expect(continueButton).toBeDisabled();

  await page.getByLabel(LABELS.confirmation).check();
  await expect(continueButton).toBeEnabled();

  await continueButton.click();
  await expectPath(page, ROUTES.context);
});

test("course context page renders fields and routes back or forward correctly", async ({
  page
}) => {
  await loginToDashboard(page);
  await goToAndExpectHeading(page, ROUTES.context, HEADINGS.context);

  await expect(page.getByLabel(LABELS.institution)).toBeVisible();
  await expect(page.getByLabel(LABELS.courseCode)).toBeVisible();
  await expect(page.getByLabel(LABELS.uoft)).toBeVisible();
  await expect(page.getByLabel(LABELS.assignmentType)).toBeVisible();
  await expect(page.getByLabel(LABELS.studentStatus)).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expectPath(page, ROUTES.start);
  await expectHeading(page, HEADINGS.start);

  await goToAndExpectHeading(page, ROUTES.context, HEADINGS.context);
  await completeCourseContextStep(page);
});

test("review page shows the submission summary and edit actions route correctly", async ({
  page
}) => {
  await reachReviewPage(page);
  await expectHeading(page, HEADINGS.review);
  await expect(
    page.getByText("User: Can you help me outline my essay?", { exact: false })
  ).toBeVisible();
  await expect(page.getByText(VALUES.institution, { exact: true })).toBeVisible();
  await expect(page.getByText(VALUES.courseCode, { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Edit Conversation" }).click();
  await expectPath(page, ROUTES.start);
  await expectHeading(page, HEADINGS.start);

  await reachReviewPage(page);
  await page.getByRole("button", { name: "Edit Course Info" }).click();
  await expectPath(page, ROUTES.context);
  await expectHeading(page, HEADINGS.context);
});

test("review page save as draft routes to history", async ({ page }) => {
  await mockReviewActions(page);
  await reachReviewPage(page);

  await page.getByRole("button", { name: "Save as Draft" }).click();
  await expectPath(page, ROUTES.history);
});

test("review page submit check routes to the mock result page", async ({ page }) => {
  await mockReviewActions(page);
  await reachReviewPage(page);

  await page.getByRole("button", { name: "Submit Check" }).click();
  await expectPath(page, ROUTES.result);
});

test("result page renders key analysis sections and start new check routes back", async ({
  page
}) => {
  await mockCheckById(page, "mock-check-001");
  await loginToDashboard(page);

  await goToAndExpectHeading(page, ROUTES.result, HEADINGS.result);
  await expect(statusBadge(page)).toBeVisible();
  await expect(page.getByText("Reasoning Behind Verdict")).toBeVisible();

  await page.getByRole("button", { name: "Start New Check" }).click();
  await expectPath(page, ROUTES.start);
  await expectHeading(page, HEADINGS.start);
});

test("history page renders rows and can open a completed item", async ({ page }) => {
  await mockHistoryItems(page, DEFAULT_HISTORY_ITEMS);
  await mockCheckById(page, "hist-check-001", {
    suspected_course: "EDS345"
  });
  await loginToDashboard(page);

  await goToAndExpectHeading(page, ROUTES.history, HEADINGS.history);
  await expect(page.getByText("Reflection Memo 2")).toBeVisible();
  await expect(page.getByText("Lab Summary Draft")).toBeVisible();

  await historyRow(page, "Reflection Memo 2")
    .getByRole("button", { name: "View" })
    .click();
  await expectPath(page, "/check/result/hist-check-001");
  await expectHeading(page, HEADINGS.result);
});

test("review submit falls back to mock result when backend analyze calls fail", async ({
  page
}) => {
  await failApiRequests(page, ["/checks/analyze", "/checks/mock-check-001"]);
  await reachReviewPage(page);

  await page.getByRole("button", { name: "Submit Check" }).click();
  await expectPath(page, ROUTES.result);
  await expectHeading(page, HEADINGS.result);
  await expect(statusBadge(page)).toBeVisible();
  await expect(
    page.getByText("brainstorming, outlining, and language cleanup", {
      exact: false
    })
  ).toBeVisible();
});

test("history page falls back to mock rows when the history api is unavailable", async ({
  page
}) => {
  await failApiRequests(page, ["/history", "/checks/chk_1024"]);
  await loginToDashboard(page);

  await goToAndExpectHeading(page, ROUTES.history, HEADINGS.history);
  await expect(page.getByText("Reflection Memo 2")).toBeVisible();
  await expect(page.getByText("Lab Summary Draft")).toBeVisible();

  await historyRow(page, "Reflection Memo 2")
    .getByRole("button", { name: "View" })
    .click();
  await expectPath(page, "/check/result/chk_1024");
  await expectHeading(page, HEADINGS.result);
});

test("happy path e2e flow goes from login to final analysis", async ({ page }) => {
  await mockReviewActions(page);
  await mockCheckById(page, "mock-check-001");
  await loginToDashboard(page);

  await page.getByRole("button", { name: "Start New Check" }).click();
  await expectPath(page, ROUTES.start);
  await expectHeading(page, HEADINGS.start);

  await page.getByLabel(LABELS.conversation).fill(VALUES.happyPathConversation);
  await page.getByLabel(LABELS.confirmation).check();
  await page.getByRole("button", { name: "Continue" }).click();

  await completeCourseContextStep(page);
  await expectHeading(page, HEADINGS.review);

  await page.getByRole("button", { name: "Submit Check" }).click();
  await expectPath(page, ROUTES.result);
  await expectHeading(page, HEADINGS.result);
});

test("main routes render their primary pages", async ({ page }) => {
  await mockCheckById(page, "mock-check-001");
  await mockHistoryItems(page, DEFAULT_HISTORY_ITEMS.slice(0, 1));

  await goToAndExpectHeading(page, ROUTES.login, HEADINGS.login);

  await loginToDashboard(page);

  await goToAndExpectHeading(page, ROUTES.start, HEADINGS.start);

  await goToAndExpectHeading(page, ROUTES.context, HEADINGS.context);

  await goToAndExpectHeading(page, ROUTES.review, HEADINGS.review);

  await goToAndExpectHeading(page, ROUTES.result, HEADINGS.result);

  await goToAndExpectHeading(page, ROUTES.history, HEADINGS.history);

  await goToAndExpectHeading(page, ROUTES.learnMore, HEADINGS.learnMore);

  await goToAndExpectHeading(page, "/route-that-does-not-exist", HEADINGS.notFound);
});

test("obvious navigation links and buttons work across the main pages", async ({
  page
}) => {
  await mockCheckById(page, "hist-check-001", {
    suspected_course: "EDS345"
  });
  await mockHistoryItems(page, DEFAULT_HISTORY_ITEMS.slice(0, 1));
  await loginToDashboard(page);

  await page.getByRole("button", { name: "Learn More" }).click();
  await expectPath(page, ROUTES.learnMore);
  await expectHeading(page, HEADINGS.learnMore);

  await page.getByRole("link", { name: "History" }).click();
  await expectPath(page, ROUTES.history);
  await expectHeading(page, HEADINGS.history);

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expectPath(page, ROUTES.dashboard);
  await expectHeading(page, HEADINGS.dashboard);

  await page.getByRole("button", { name: "Start New Check" }).click();
  await expectPath(page, ROUTES.start);
  await expectHeading(page, HEADINGS.start);

  await page.goto("/missing-page");
  await page.getByRole("button", { name: "Back to Dashboard" }).click();
  await expectPath(page, ROUTES.dashboard);
  await expectHeading(page, HEADINGS.dashboard);
});
