import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const storageKey = "bidayaneet.demo.v2.neet.profile";

test("known French prototype profile migrates to Arabic while retaining personal data", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({
      firstName: "Yassine", lastName: "El Amrani", email: "old@example.com", phone: "+212600112233", city: "Casablanca",
      goal: "Un emploi", skills: "Relation client, outils bureautiques, communication, Angular",
      interests: "J’aimerais découvrir le développement web et travailler dans une équipe.",
    }));
  }, storageKey);
  await page.goto("/neet/profile");
  await expect(page.getByLabel("الاسم الشخصي", { exact: true })).toHaveValue("ياسين");
  await expect(page.getByLabel("الاسم العائلي", { exact: true })).toHaveValue("العمراني");
  await expect(page.getByLabel("البريد الإلكتروني", { exact: true })).toHaveValue("old@example.com");
  await expect(page.getByLabel("الهاتف", { exact: true })).toHaveValue("+212600112233");
  await expect(page.getByLabel("المدينة", { exact: true })).toHaveValue("Casablanca");
  await expect(page.getByLabel("هدفي", { exact: true })).toHaveValue("عمل");
  await expect(page.getByLabel("مهاراتي", { exact: true })).toHaveValue("خدمة العملاء، الأدوات المكتبية، التواصل، Angular");
  await expect(page.getByLabel("ما أريد اكتشافه", { exact: true })).toHaveValue("أرغب في اكتشاف تطوير الويب والعمل ضمن فريق.");
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).goal, storageKey)).toBe("عمل");
  await expect(page.locator(".profile-summary")).toContainText("الدار البيضاء");
});

for (const [legacy, arabic] of [["Une formation", "تكوين"], ["Un stage", "تدريب"], ["Un emploi", "عمل"], ["Créer mon projet", "إنشاء مشروعي"], ["J’ai besoin d’orientation", "أحتاج إلى توجيه"]]) {
  test(`original French goal ${legacy} selects its Arabic equivalent`, async ({ page }) => {
    await page.addInitScript(({ key, goal }) => localStorage.setItem(key, JSON.stringify({ goal })), { key: storageKey, goal: legacy });
    await page.goto("/neet/profile");
    await expect(page.getByLabel("هدفي", { exact: true })).toHaveValue(arabic);
    await page.getByRole("button", { name: "حفظ معلوماتي", exact: true }).click();
    await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).goal, storageKey)).toBe(arabic);
  });
}

test("profile migration keeps a personal name, freeform interests and custom goal", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ firstName: "Sara", lastName: "El Fassi", email: "sara@example.com", phone: "", city: "Rabat", goal: "Mon projet personnel", skills: "Design, Figma", interests: "Mon texte personnel." })), storageKey);
  await page.goto("/neet/profile");
  await expect(page.getByLabel("الاسم الشخصي", { exact: true })).toHaveValue("Sara");
  await expect(page.getByLabel("المدينة", { exact: true })).toHaveValue("Rabat");
  await expect(page.getByLabel("هدفي", { exact: true })).toHaveValue("Mon projet personnel");
  await expect(page.getByLabel("ما أريد اكتشافه", { exact: true })).toHaveValue("Mon texte personnel.");
});

test("Arabic controls retain Cairo and RTL inside portalled menus and story dialog", async ({ page }) => {
  await page.goto("/neet/opportunities");
  await expect(page.getByRole("combobox", { name: "نوع الفرصة" })).toContainText("كل الأنواع");
  await expect(page.getByRole("combobox", { name: "المدينة" })).toContainText("كل المدن");
  await page.getByRole("combobox", { name: "نوع الفرصة" }).click();
  const list = page.getByRole("listbox");
  await expect(list).toHaveCSS("direction", "rtl");
  await expect(list).toHaveCSS("font-family", /Cairo/);
  await page.getByRole("option", { name: "تكوين", exact: true }).click();
  await expect(page.locator(".youth-opportunity-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "ابحث عن فرصة" }).fill("تطوير الويب");
  await expect(page.locator(".youth-opportunity-card")).toHaveCount(1);
  await page.goto("/neet/stories");
  await page.getByRole("button", { name: "اكتشف قصة سلمى", exact: true }).click();
  const story = page.getByRole("dialog");
  await expect(story).toHaveCSS("direction", "rtl");
  await expect(story).toHaveCSS("font-family", /Cairo/);
  await expect(story).toContainText("سلمى، مطوّرة ويب");
  await page.keyboard.press("ArrowLeft");
  await expect(story).toContainText("عمر، رائد أعمال");
  await page.keyboard.press("Escape");
  await expect(story).not.toBeVisible();
  await page.goto("/neet");
  await page.locator(".portal-topbar").getByRole("button", { name: "الإشعارات", exact: true }).click();
  await expect(page.getByRole("menu")).toHaveCSS("direction", "rtl");
  await expect(page.getByRole("menu")).toHaveCSS("font-family", /Cairo/);
});

const viewports = [{ width: 1366, height: 768 }, { width: 1440, height: 1000 }, { width: 1024, height: 768 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 1366, height: 500 }];
const routes = ["/neet", "/neet/opportunities", "/neet/opportunities/web", "/neet/stories", "/neet/journey", "/neet/micro-actions", "/neet/profile", "/neet/help"];
for (const viewport of viewports) {
  test(`youth pages and assistant remain within ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const output = path.resolve("output/design/run-2/youth", `${viewport.width}x${viewport.height}`);
    await mkdir(output, { recursive: true });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(async () => { await document.fonts.ready; });
      expect(await page.evaluate(() => document.fonts.check("14px Cairo"))).toBeTruthy();
      await expect(page.locator(".workspace-neet")).toHaveAttribute("lang", "ar");
      await expect(page.locator(".workspace-neet")).toHaveCSS("font-family", /Cairo/);
      await expect(page.locator(".workspace-content h1").first()).toBeVisible();
      await expect(page.locator(".workspace-content")).not.toContainText(/Tout voir|Relation client|Une formation|Préparation/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), route).toBeTruthy();
      const clipped = await page.locator(".workspace-content").evaluate((main) => [...main.querySelectorAll("input, button, select, textarea")].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 2 && rect.height > 2 && (rect.left < -1 || rect.right > innerWidth + 1);
      }).map((element) => element.getAttribute("aria-label") || element.textContent));
      expect(clipped, route).toEqual([]);
      await page.screenshot({ path: path.join(output, `${route.replaceAll("/", "-").slice(1)}.png`), fullPage: true });
    }
    await page.goto("/neet");
    await page.getByRole("button", { name: "فتح مساعد بداية", exact: true }).click();
    const assistant = page.getByRole("dialog", { name: "مساعد بداية", exact: true });
    await expect(assistant.getByRole("textbox", { name: "رسالتك للمساعد" })).toBeFocused();
    const box = await assistant.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    await expect(assistant.getByRole("region", { name: "محادثتك مع مساعد بداية" })).toBeVisible();
    const assertLatestVisible = async () => {
      await expect.poll(() => assistant.evaluate((element) => {
        const viewport = element.querySelector('[data-slot="message-scroller-viewport"]')!.getBoundingClientRect();
        const replies = element.querySelectorAll('[data-slot="bubble"]');
        return replies[replies.length - 1].getBoundingClientRect().bottom <= viewport.bottom + 1;
      })).toBeTruthy();
    };
    for (const question of ["أحتاج إلى توجيه", "كيف أجهّز سيرتي الذاتية؟", "أبحث عن تكوين"]) {
      await assistant.getByRole("button", { name: question, exact: true }).click();
      await assertLatestVisible();
    }
    const scroller = assistant.getByRole("region", { name: "محادثتك مع مساعد بداية" });
    await scroller.hover();
    await page.mouse.wheel(0, -1200);
    await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeLessThan(10);
    await assistant.getByRole("textbox", { name: "رسالتك للمساعد" }).fill("أحتاج إلى توجيه");
    await assistant.getByRole("button", { name: "إرسال للمساعد", exact: true }).click();
    await assertLatestVisible();
    await page.screenshot({ path: path.join(output, "assistant.png") });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "فتح مساعد بداية", exact: true })).toBeFocused();
  });
}


test("the Arabic CV chooser validates locally and never exposes native English labels", async ({ page }) => {
  await page.goto("/neet/profile");
  const chooser = page.getByLabel("اختيار سيرتي الذاتية", { exact: true });
  await expect(chooser).toBeEnabled();
  await chooser.setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("notes") });
  await expect(page.locator(".workspace-content").getByRole("alert")).toContainText("اختر ملف PDF");
  await chooser.setInputFiles({ name: "سيرتي.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 demo") });
  await expect(page.locator(".document-row")).toContainText("سيرتي.pdf");
  await expect(page.locator(".document-row")).toContainText("تم اختيار الملف محلياً");
  await expect(page.locator(".workspace-content").getByRole("alert")).toHaveCount(0);
  expect(await chooser.evaluate((element) => element.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
});

for (const locale of ["en-US", "fr-FR"]) {
  test.describe(`Arabic validation under ${locale} browser locale`, () => {
    test.use({ locale });
    test("youth profile and all youth auth modes use Arabic custom errors", async ({ page }) => {
      await page.goto("/neet/profile");
      const first = page.getByLabel("الاسم الشخصي", { exact: true });
      await first.fill("");
      await page.getByRole("button", { name: "حفظ معلوماتي", exact: true }).click();
      await expect(first).toBeFocused();
      await expect(first).toHaveAttribute("aria-invalid", "true");
      await expect(page.locator(".workspace-content").getByRole("alert")).toContainText("أدخل اسمك الشخصي");
      await first.fill("اسم شخصي محفوظ");
      await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("not-an-email");
      await page.getByRole("button", { name: "حفظ معلوماتي", exact: true }).click();
      await expect(page.getByLabel("البريد الإلكتروني", { exact: true })).toBeFocused();
      await expect(page.locator(".workspace-content").getByRole("alert")).toContainText("بريداً إلكترونياً صحيحاً");
      await expect(first).toHaveValue("اسم شخصي محفوظ");
      for (const mode of ["sign-in", "register", "forgot-password", "reset-password"]) {
        await page.goto(`/auth/neet/${mode}`);
        const form = page.locator(".auth-form");
        await form.getByRole("button", { name: /تسجيل الدخول|إنشاء حسابي|طلب الاسترجاع|تعيين كلمة المرور/ }).click();
        await expect(form.getByRole("alert")).toContainText("أدخل");
        await expect(form.locator('[aria-invalid="true"]')).toBeFocused();
        if (mode !== "reset-password") {
          if (mode === "register") await page.locator("#auth-name").fill("اسم تجريبي");
          await page.locator("#auth-email").fill("invalid-address");
          await form.locator('button[type="submit"]').click();
          await expect(form.getByRole("alert")).toContainText("بريداً إلكترونياً صحيحاً");
          await expect(page.locator("#auth-email")).toHaveAttribute("aria-invalid", "true");
          await expect(page.locator("#auth-email")).toBeFocused();
        }
      }
    });
  });
}

test("reduced-motion assistant opens with a reachable input and restores the dashboard trigger focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/neet");
  const trigger = page.getByRole("button", { name: "تحدّث الآن", exact: true });
  await trigger.click();
  const assistant = page.getByRole("dialog", { name: "مساعد بداية", exact: true });
  await expect(assistant).toBeVisible();
  await expect(assistant.getByRole("textbox", { name: "رسالتك للمساعد", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(assistant).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
