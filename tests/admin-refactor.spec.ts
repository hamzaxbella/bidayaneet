import { test, expect, type Page } from "@playwright/test";

async function choose(page: Page, label: string, value: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: value, exact: true }).click();
}

test("admin dashboard full lists are accessible dialogs and dismiss with Escape", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".admin-partner-card")).toHaveCount(6);
  for (const name of ["ANAPEC", "ONMT Tourism Careers", "Ministry of Agriculture", "ADA Agripreneurship", "Ministry of Economic Inclusion"]) {
    await expect(page.locator(".admin-partner-card").getByText(name, {exact:true})).toBeVisible();
  }
  for (const title of ["Top Blockers", "Recent NEET Profiles", "Opportunities & Collaborating Programs", "Mediator Activity", "Retention Rates"]) {
    const section = page.locator("section, .card").filter({ has: page.getByRole("heading", { name: title, exact: true }) }).first();
    await section.getByRole("button", { name: /View all/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog").getByRole("heading")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
});

test("program creation validates, persists, and can be edited on its own route", async ({ page }) => {
  await page.goto("/programs");
  await page.getByRole("button", { name: "Add Program", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Add Program" });
  await dialog.getByRole("button", { name: "Next", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("program name");
  await dialog.getByLabel("Program name").fill("Souss skills pathway");
  await dialog.getByLabel("Description").fill("A practical skills pathway for local youth.");
  await dialog.getByRole("button", { name: "Next", exact: true }).click();
  await dialog.getByLabel("Enrollment capacity").fill("45");
  await choose(page, "Commune", "Taroudant");
  await dialog.getByRole("button", { name: "Next", exact: true }).click();
  await expect(dialog).toContainText("Taroudant");
  await dialog.getByRole("button", { name: "Create program", exact: true }).click();
  const card = page.locator('[data-slot="card"]').filter({ has: page.getByText("Souss skills pathway", { exact: true }) });
  await card.getByRole("link", { name: "View program" }).click();
  await expect(page).toHaveURL(/\/programs\/[^/]+$/);
  await page.getByRole("button", { name: "Edit program", exact: true }).click();
  const edit = page.getByRole("dialog", { name: "Edit program" });
  await edit.getByLabel("Program name").fill("Souss skills revised");
  await edit.getByRole("button", { name: "Next", exact: true }).click();
  await edit.getByRole("button", { name: "Next", exact: true }).click();
  await edit.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Souss skills revised", exact: true }).first()).toBeVisible();
  await expect(page.getByText("Delivery commune: Taroudant")).toBeVisible();
});

test("NEET directory filters combine and newly added profiles survive reload", async ({ page }) => {
  await page.goto("/neets");
  await page.getByRole("textbox", { name: "Search NEET profiles" }).fill("Yassine");
  await expect(page.locator(".admin-table tbody tr")).toHaveCount(1);
  await choose(page, "Filter commune", "Tata");
  await expect(page.getByText("No profiles match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".admin-table tbody tr")).toHaveCount(8);
  await page.getByRole("button", { name: "Add NEET", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Add NEET" });
  await dialog.getByLabel("Full name").fill("Salma Refactor");
  await dialog.getByRole("button", { name: "Next", exact: true }).click();
  await choose(page, "Primary blocker", "Transport & Mobility");
  await choose(page, "Assigned mediator", "Imane Rachidi");
  await dialog.getByLabel("Next action").fill("Orientation meeting");
  await dialog.getByRole("button", { name: "Next", exact: true }).click();
  await dialog.getByRole("button", { name: "Create profile", exact: true }).click();
  await page.reload();
  await page.getByRole("textbox", { name: "Search NEET profiles" }).fill("Salma Refactor");
  const row = page.locator(".admin-table tbody tr");
  await expect(row).toHaveCount(1);
  await row.getByRole("button", { name: "View profile" }).click();
  await expect(page.getByRole("dialog", { name: "NEET profile" })).toContainText("Orientation meeting");
});

test("mediator and opportunity multistep forms persist their new records", async ({ page }) => {
  await page.goto("/mediators");
  await page.getByRole("button", { name: "Add Mediator", exact: true }).click();
  const mediator = page.getByRole("dialog", { name: "Add Mediator" });
  await mediator.getByLabel("Full name").fill("Sara Refactor");
  await mediator.getByLabel("Email").fill("sara@example.test");
  await mediator.getByRole("button", { name: "Next", exact: true }).click();
  await mediator.getByLabel("Association").fill("AMAL Association");
  await mediator.getByRole("button", { name: "Next", exact: true }).click();
  await mediator.getByRole("button", { name: "Create mediator", exact: true }).click();
  await page.reload();
  await expect(page.getByText("Sara Refactor", { exact: true })).toBeVisible();
  await page.goto("/opportunities");
  await page.getByRole("button", { name: "Add Opportunity", exact: true }).click();
  const opportunity = page.getByRole("dialog", { name: "Add Opportunity" });
  await opportunity.getByLabel("Opportunity title").fill("Souss apprenticeship");
  await opportunity.getByLabel("Partner / program").fill("ANAPEC");
  await opportunity.getByRole("button", { name: "Next", exact: true }).click();
  await opportunity.getByLabel("Application deadline").fill("2026-12-15");
  await opportunity.getByRole("button", { name: "Next", exact: true }).click();
  await opportunity.getByRole("button", { name: "Create opportunity", exact: true }).click();
  await page.reload();
  await expect(page.getByText("Souss apprenticeship", { exact: true })).toBeVisible();
});

test("micro-action calendar navigates, filters a day, and edits a persisted action", async ({ page }) => {
  await page.goto("/micro-actions");
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await expect(page.getByText("July 2025", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Previous month", exact: true }).click();
  await page.getByRole("button", { name: "Jun 3, 2025, 1 actions", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Actions on Jun 3, 2025" })).toBeVisible();
  await page.getByRole("button", { name: "View micro-action", exact: true }).click();
  await page.getByRole("button", { name: "Edit micro-action", exact: true }).click();
  const edit = page.getByRole("dialog", { name: "Edit micro-action" });
  await edit.getByLabel("Action title").fill("CV Workshop Revised");
  await edit.getByRole("button", { name: "Next", exact: true }).click();
  await edit.getByLabel("Participant capacity").fill("40");
  await edit.getByRole("button", { name: "Next", exact: true }).click();
  await edit.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "CV Workshop Revised" })).toContainText("40 places");
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.getByRole("heading", { name: "CV Workshop Revised", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Add Micro-action", exact: true }).click();
  const add = page.getByRole("dialog", { name: "Add Micro-action" });
  await add.getByLabel("Action title").fill("Community orientation");
  await add.getByLabel("Organizer").fill("AMAL");
  await add.getByRole("button", { name: "Next", exact: true }).click();
  await add.getByLabel("Date", { exact: false }).fill("2026-10-20");
  await add.getByRole("button", { name: "Next", exact: true }).click();
  await add.getByRole("button", { name: "Create micro-action", exact: true }).click();
  await expect(page.getByText("October 2026", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Community orientation", exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "View all", exact: false }).click();
  await expect(page.getByRole("dialog", { name: "All micro-actions" })).toContainText("Community orientation");
});

test("dashboard periods export the visible months and profile actions open the correct record", async ({ page }) => {
  await page.goto("/");
  await choose(page, "Journey chart period", "Last 6 months");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export overview", exact: true }).click();
  const download = await downloading;
  const { readFile } = await import("node:fs/promises");
  const csv = await readFile((await download.path())!, "utf8");
  expect(csv.split("\r\n")).toHaveLength(7);
  expect(csv).toContain("Last 6 months");
  expect(csv).not.toContain("Jun'24");
  await page.getByRole("link", { name: "View profile for Yassine El Amrani", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "NEET profile", exact: true })).toContainText("Yassine El Amrani");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("all scoped full-list dialogs expose complete lists and return focus", async ({ page }) => {
  const lists = [
    { route: "/programs", index: 0, title: "All collaborating programs", count: 13 },
    { route: "/neets", index: 0, title: "All NEET profiles", count: 8 },
    { route: "/neets", index: 1, title: "All active blockers", count: 6 },
    { route: "/neets", index: 2, title: "All recent activities", count: 5 },
    { route: "/neets", index: 3, title: "All local opportunities", count: 6 },
    { route: "/mediators", index: 0, title: "All mediators", count: 6 },
    { route: "/opportunities", index: 0, title: "All opportunities", count: 6 },
    { route: "/micro-actions", index: 0, title: "All micro-actions", count: 6 },
  ];
  for (const item of lists) {
    await page.goto(item.route);
    const trigger = page.getByRole("button", { name: /view all/i }).nth(item.index);
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: item.title, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(item.title === "All active blockers" ? ".admin-blocker" : ".admin-record-row")).toHaveCount(item.count);
    const overlay = page.locator('[data-slot="dialog-overlay"]');
    expect(await overlay.evaluate((element) => getComputedStyle(element).backdropFilter)).toContain("blur");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test("mediator and opportunity filters compose, detail edits persist, and capacity validation stays on the correct step", async ({ page }) => {
  await page.goto("/mediators");
  await choose(page, "Mediator zone", "Agadir");
  await choose(page, "Mediator status", "active");
  await expect(page.locator(".admin-table tbody tr")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search mediators" }).fill("  imane  ");
  await expect(page.locator(".admin-table tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "View mediator", exact: false }).click();
  await page.getByRole("button", { name: "Edit mediator", exact: true }).click();
  const mediator = page.getByRole("dialog", { name: "Edit mediator", exact: true });
  await mediator.getByLabel("Full name").fill("Imane Updated");
  await mediator.getByRole("button", { name: "Next", exact: true }).click();
  await choose(page, "Assigned commune", "Tiznit");
  await mediator.getByRole("button", { name: "Next", exact: true }).click();
  await mediator.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.reload();
  await expect(page.getByText("Imane Updated", { exact: true }).first()).toBeVisible();
  await page.goto("/opportunities");
  await choose(page, "Opportunity type", "Training");
  await choose(page, "Opportunity commune", "Agadir");
  await expect(page.locator(".admin-table tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "View opportunity", exact: false }).click();
  await page.getByRole("button", { name: "Edit opportunity", exact: true }).click();
  const opportunity = page.getByRole("dialog", { name: "Edit opportunity", exact: true });
  await opportunity.getByLabel("Opportunity title").fill("Mechanics Updated");
  await opportunity.getByRole("button", { name: "Next", exact: true }).click();
  await opportunity.getByLabel("Application deadline").fill("2026-12-20");
  await opportunity.getByRole("button", { name: "Next", exact: true }).click();
  await opportunity.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.reload();
  await expect(page.getByText("Mechanics Updated", { exact: true }).first()).toBeVisible();
  await page.goto("/programs");
  await page.getByRole("button", { name: "Add Program", exact: true }).click();
  const program = page.getByRole("dialog", { name: "Add Program", exact: true });
  await program.getByLabel("Program name").fill("Capacity validation");
  await program.getByLabel("Description").fill("Testing a realistic enrollment limit.");
  await program.getByRole("button", { name: "Next", exact: true }).click();
  const capacity = program.getByLabel("Enrollment capacity");
  await capacity.fill("0");
  await program.getByRole("button", { name: "Next", exact: true }).click();
  await expect(program.getByRole("alert")).toContainText("enrollment capacity");
  await expect(capacity).toBeFocused();
  await expect(capacity).toHaveAttribute("aria-invalid", "true");
  await capacity.fill("1.5");
  await program.getByRole("button", { name: "Next", exact: true }).click();
  await expect(program.getByRole("alert")).toBeVisible();
  await capacity.fill("30");
  await program.getByRole("button", { name: "Next", exact: true }).click();
  await expect(program.locator(".admin-review")).toBeVisible();
});

test("admin content and dialogs fit every requested viewport without stretched empty map cards", async ({ page }) => {
  test.setTimeout(180000);
  for (const size of [{width:1440,height:1000},{width:1366,height:768},{width:1024,height:768},{width:390,height:844},{width:320,height:568},{width:1366,height:500}]) {
    await page.setViewportSize(size);
    for (const path of ["/", "/programs", "/neets", "/mediators", "/opportunities", "/micro-actions", "/heatmap"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
      if (path === "/" || path === "/heatmap") {
        await expect(page.locator(".map-loading")).toHaveCount(0);
        const mapBounds = await page.locator(".interactive-national-map").boundingBox();
        const cardBounds = await page.locator(".interactive-national-map").locator("..").boundingBox();
        expect(cardBounds!.y + cardBounds!.height - mapBounds!.y - mapBounds!.height).toBeLessThan(26);
      }
      if (path === "/heatmap" && size.width <= 390) {
        const valuesFit = await page.locator(".admin-commune-grid button").evaluateAll((buttons, requireSingleLine) => buttons.every((button) => {
          const cell = button.getBoundingClientRect();
          const value = button.querySelector("strong")!.getBoundingClientRect();
          const label = button.querySelector("span")!;
          const style = getComputedStyle(label);
          const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
          return value.right <= cell.right - 4 && value.left >= cell.left + 4 && label.scrollWidth <= label.clientWidth && (!requireSingleLine || label.getBoundingClientRect().height <= lineHeight + 1);
        }), size.width <= 380);
        expect(valuesFit).toBe(true);
      }
      if (path === "/") {
        const card = await page.locator(".admin-journey-chart").boundingBox();
        const chart = await page.locator(".admin-journey-chart .recharts-responsive-container").boundingBox();
        expect(card!.y + card!.height - chart!.y - chart!.height).toBeLessThan(26);
      }
      if (path === "/programs") {
        await page.getByRole("button", { name: "Add Program", exact: true }).click();
        const dialog = page.getByRole("dialog", { name: "Add Program", exact: true });
        const bounds = await dialog.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(size.width);
        expect(bounds!.y).toBeGreaterThanOrEqual(0);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(size.height);
        await page.keyboard.press("Escape");
      }
    }
  }
});
