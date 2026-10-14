import { test, expect } from "@playwright/test";

for (const role of ["admin", "mediator", "partner", "neet"]) {
  test(`${role} auth modes validate and clearly preserve demo authentication`, async ({ page }) => {
    const errors: string[] = [];
    const mutations: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (!["GET", "HEAD"].includes(request.method())) mutations.push(request.url());
    });
    for (const mode of ["sign-in", "register", "forgot-password", "reset-password"]) {
      await page.goto(`/auth/${role}/${mode}`);
      await expect(page.locator(".auth-page")).toHaveAttribute("dir", role === "neet" ? "rtl" : "ltr");
      await expect(page.locator(".auth-page")).toHaveAttribute("lang", role === "neet" ? "ar" : "fr");
      const form = page.locator(".auth-form");
      const submit = form.locator('button[type="submit"]');
      const status = form.locator('[role="status"]');
      await submit.click();
      await expect(status).toHaveCount(0);
      await expect(form.locator(":invalid").first()).toBeFocused();
      if (mode === "register") {
        await page.locator("#auth-name").fill("Amina Test");
        if (role !== "neet") {
          await page.locator("#auth-organization").fill("Association Souss");
          await expect(page.locator("#auth-password")).toHaveCount(0);
        }
      }
      if (mode !== "reset-password") {
        await page.locator("#auth-email").fill("invalid-address");
        await submit.click();
        await expect(page.locator("#auth-email")).toBeFocused();
        await expect(status).toHaveCount(0);
        await page.locator("#auth-email").fill("amina@example.com");
      }
      const password = page.locator("#auth-password");
      if (await password.count()) {
        if (mode !== "sign-in") {
          await password.fill("short");
          await submit.click();
          await expect(password).toBeFocused();
          await expect(status).toHaveCount(0);
        }
        await password.fill("DemoPass2026");
        const toggle = form.locator('button[aria-pressed]');
        await toggle.click();
        await expect(password).toHaveAttribute("type", "text");
        await expect(toggle).toHaveAttribute("aria-pressed", "true");
      }
      if (mode === "reset-password") {
        const confirm = page.locator("#auth-confirm");
        await confirm.fill("DifferentPass2026");
        await submit.click();
        await expect(form.getByRole("alert")).toContainText(role === "neet" ? "تتطابق" : "identiques");
        await expect(confirm).toBeFocused();
        await expect(confirm).toHaveAttribute("aria-invalid", "true");
        await expect(confirm).toHaveAttribute("aria-describedby", "auth-password-error");
        await confirm.fill("DemoPass2026");
        await expect(form.getByRole("alert")).toHaveCount(0);
      }
      await submit.click();
      await expect(status).toContainText(role === "neet" ? "تم التحقق" : "Formulaire vérifié");
      await expect(page).toHaveURL(`/auth/${role}/${mode}`);
      if (await password.count()) {
        await expect(password).toHaveValue("");
        await expect(password).toHaveAttribute("type", "password");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
    }
    expect(errors).toEqual([]);
    expect(mutations).toEqual([]);
  });
}

test("partner cohort links, filters and keyboard referral selection work", async ({ page }) => {
  await page.goto("/partner");
  await page.getByRole("link", { name: "Review referrals", exact: true }).click();
  await expect(page).toHaveURL(/#referrals$/);
  await page.getByRole("combobox", { name: "Filter referrals by status" }).selectOption("Interview");
  await expect(page.locator("#referrals tbody tr")).toHaveCount(1);
  const candidate = page.getByRole("button", { name: "Select Omar T.", exact: true });
  await candidate.focus();
  await page.keyboard.press("Enter");
  await expect(candidate).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("textbox", { name: "Partner feedback" })).toHaveValue("");
  await expect(page.getByRole("button", { name: "Record demo feedback" })).toBeDisabled();
  await page.getByRole("textbox", { name: "Partner feedback" }).fill("Documents reviewed during the demo.");
  await page.getByRole("button", { name: "Record demo feedback" }).click();
  await expect(page.getByRole("status")).toContainText("Nothing was sent");
  await page.reload();
  await page.getByRole("button", { name: "Select Omar T.", exact: true }).click();
  await expect(page.locator("#referrals .card").last()).toContainText("Documents reviewed during the demo.");
  await expect(page.locator(".partner-showcase")).toHaveCSS("background-color", "rgb(244, 251, 250)");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("partner opportunity capacity validates and persists on this device", async ({ page }) => {
  await page.goto("/partner");
  const title = page.getByRole("textbox", { name: "Opportunity title", exact: true });
  await title.fill("Regional skills cohort");
  const capacity = page.getByRole("spinbutton", { name: "Opportunity capacity" });
  await capacity.fill("-5");
  await page.getByRole("button", { name: "Publish opportunity", exact: true }).click();
  await expect(capacity).toBeFocused();
  await expect(page.getByRole("status")).toContainText("Partner workspace ready");
  await capacity.fill("12");
  await page.getByRole("button", { name: "Publish opportunity", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Published opportunity: Regional skills cohort");
  await page.reload();
  const opportunity = page.locator("#programs .card").first().locator("div").filter({ has: page.getByText("Regional skills cohort", { exact: true }) }).filter({ has: page.getByRole("button", { name: "+5 seats", exact: true }) }).last();
  await expect(page.locator("#programs .card").first()).toContainText("0/12");
  await opportunity.getByRole("button", { name: "+5 seats", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Added 5 seats to Regional skills cohort");
  await page.reload();
  await expect(page.locator("#programs .card").first()).toContainText("0/17");
});
