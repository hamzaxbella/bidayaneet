import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
const sizes = [{ width: 1440, height: 1000 }, { width: 1366, height: 768 }, { width: 1024, height: 768 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 1366, height: 500 }];
for (const size of sizes) {
  test(`all auth modes and partner overview fit ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    const output = path.resolve("output/design/run-2/partner-auth", `${size.width}x${size.height}`);
    await mkdir(output, { recursive: true });
    for (const role of ["neet", "mediator", "admin", "partner"]) {
      for (const mode of ["sign-in", "register", "forgot-password", "reset-password"]) {
        await page.goto(`/auth/${role}/${mode}`);
        await expect(page.locator(".auth-form-shell h2")).toBeVisible();
        await page.evaluate(async () => { await document.fonts.ready; });
        await expect(page.locator(".auth-main-brand img")).toHaveAttribute("src", /logo\.png/);
        const form = page.locator(".auth-form");
        if (size.width > 760) expect((await page.locator(".auth-form-shell").boundingBox())!.width).toBeGreaterThanOrEqual(350);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
        const clipped = await form.evaluate(element => [...element.querySelectorAll("input, button")].filter(control => { const box = control.getBoundingClientRect(); return box.width > 0 && (box.left < 0 || box.right > innerWidth + 1); }).map(control => control.id || control.textContent));
        expect(clipped).toEqual([]);
        await expect(page.locator(".auth-page")).toHaveAttribute("lang", role === "neet" ? "ar" : "fr");
        if (role === "neet") {
          await expect(page.locator(".auth-form-shell")).toHaveCSS("font-family", /Cairo/);
          await expect(page.locator(".auth-main")).not.toContainText(/Mot de passe|Adresse e-mail|Demander/);
        }
        if (mode === "sign-in") {
          const submit = await form.locator('button[type="submit"]').boundingBox();
          expect(submit!.y + submit!.height).toBeLessThanOrEqual(size.height + 1);
          await page.getByRole("link", { name: role === "neet" ? "نسيت كلمة المرور؟" : "Mot de passe oublié ?", exact: true }).focus();
          await page.keyboard.press("Enter");
          await expect(page).toHaveURL(`/auth/${role}/forgot-password`);
          await page.getByRole("link", { name: role === "neet" ? "العودة إلى تسجيل الدخول" : "Retour à la connexion", exact: true }).click();
          await expect(page).toHaveURL(`/auth/${role}/sign-in`);
        }
        await page.screenshot({ path: path.join(output, `${role}-${mode}.png`), fullPage: true });
      }
    }
    await page.goto("/partner");
    await expect(page.getByRole("heading", { name: "Partner workspace", exact: true })).toBeVisible();
    await expect(page.locator(".partner-stat-strip .kpi-card")).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    if (size.width > 1000) expect((await page.locator(".partner-showcase").boundingBox())!.height).toBeLessThan(260);
    await page.screenshot({ path: path.join(output, "partner-overview.png"), fullPage: true });
    if (size.width < 760) {
      await page.getByRole("button", { name: "Select Yassine El Amrani", exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("button", { name: "Select Yassine El Amrani", exact: true })).toHaveAttribute("aria-pressed", "true");
      const controls = await page.locator("#referrals").evaluate(element => [...element.querySelectorAll("button, input, select, textarea")].filter(control => { const box = control.getBoundingClientRect(); return box.width > 0 && (box.left < 0 || box.right > innerWidth + 1); }).map(control => control.getAttribute("aria-label") || control.textContent));
      expect(controls).toEqual([]);
    }
  });
}

test("partner status filters keep selected profiles aligned and clear another candidate's unsaved draft", async ({ page }) => {
  await page.goto("/partner");
  const draft = page.getByRole("textbox", { name: "Partner feedback", exact: true });
  await draft.fill("A draft only for Yassine");
  await page.getByRole("combobox", { name: "Filter referrals by status" }).selectOption("Interview");
  await expect(page.locator("#referrals .card").last()).toContainText("Omar T.");
  await expect(draft).toHaveValue("");
  await page.getByRole("combobox", { name: "Filter referrals by status" }).selectOption("Rejected");
  await expect(page.locator("#referrals")).toContainText("No candidates match this status");
  await expect(draft).toHaveCount(0);
});

test("accepting a referred candidate updates the associated cohort once and survives reload", async ({ page }) => {
  await page.goto("/partner");
  const capacity = page.locator(".partner-capacity-card").filter({ hasText: "Auto Mechanics Cohort" });
  await expect(capacity).toContainText("18/25");
  await page.getByRole("button", { name: "Accept Yassine El Amrani", exact: true }).click();
  await expect(capacity).toContainText("19/25");
  await expect(page.getByRole("button", { name: "Accept Yassine El Amrani", exact: true })).toBeDisabled();
  await page.reload();
  await expect(capacity).toContainText("19/25");
  await expect(page.getByRole("button", { name: "Accept Yassine El Amrani", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Reject Yassine El Amrani", exact: true }).click();
  await expect(capacity).toContainText("18/25");
  await page.getByRole("button", { name: "Accept Yassine El Amrani", exact: true }).click();
  await expect(capacity).toContainText("19/25");
});
