import { expect, test, type Page } from "@playwright/test";

const viewportSizes = [
  { width: 1366, height: 768 },
  { width: 1440, height: 1000 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
  { width: 390, height: 450 },
  { width: 320, height: 360 },
];
const localPrefix = "bidayaneet.demo.v2.";

async function assertContained(page: Page) {
  const bounds = await page.evaluate(() => {
    const rect = (selector: string) => {
      const element = document.querySelector(selector)!;
      const { top, bottom, left, right, height } = element.getBoundingClientRect();
      return { top, bottom, left, right, height };
    };
    const scroller = document.querySelector<HTMLElement>(".messenger-viewport")!;
    return {
      height: window.visualViewport?.height ?? innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      width: innerWidth,
      main: rect("#workspace-content"),
      page: rect(".messenger-page:not(.messenger-loading)"),
      header: rect(".messenger-thread-header"),
      log: rect(".messenger-viewport"),
      composer: rect(".messenger-composer"),
      innerScrollHeight: scroller.scrollHeight,
      innerClientHeight: scroller.clientHeight,
    };
  });
  expect(bounds.scrollHeight).toBeLessThanOrEqual(Math.ceil(bounds.height));
  expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width);
  expect(bounds.page.top).toBeCloseTo(bounds.main.top, 0);
  expect(bounds.page.bottom).toBeCloseTo(bounds.main.bottom, 0);
  expect(bounds.log.top).toBeGreaterThanOrEqual(bounds.header.bottom - 1);
  expect(bounds.log.bottom).toBeLessThanOrEqual(bounds.composer.top + 1);
  expect(bounds.log.height).toBeGreaterThan(45);
  expect(bounds.composer.bottom).toBeLessThanOrEqual(bounds.height + 1);
  expect(bounds.innerScrollHeight).toBeGreaterThan(bounds.innerClientHeight);
}

for (const role of ["mediator", "neet"] as const) {
  test(`${role}: a long conversation scrolls internally through resizes and navigation`, async ({ page }) => {
    const arabic = role === "neet";
    const person = arabic ? "imane" : "yassine";
    const body = arabic
      ? "أحضّر أسئلتي حول التكوين وفرص العمل. أريد مناقشة أهدافي والخطوات القادمة في موعدنا. "
      : "Je prépare mes questions sur la formation et les opportunités. Nous pourrons revoir mon projet et les prochaines étapes ensemble. ";
    await page.addInitScript(({ role, person, body, localPrefix }) => {
      localStorage.setItem(`${localPrefix}messages.${role}`, JSON.stringify({
        [person]: Array.from({ length: 35 }, (_, index) => ({ text: `${index + 1}. ${body.repeat(5)}\n${index === 34 ? "https://example.test/" + "a".repeat(180) : body}`, time: "10:20" })),
      }));
    }, { role, person, body, localPrefix });
    await page.goto(`/${role}/messages`);
    await page.locator(".messenger-contact").first().click();
    await expect(page.locator('[data-slot="message"]')).toHaveCount(37);
    for (const size of viewportSizes) {
      await page.setViewportSize(size);
      await expect(page.locator(".messenger-thread")).toBeVisible();
      await assertContained(page);
      const viewport = page.locator(".messenger-viewport");
      await expect.poll(() => viewport.evaluate((element) => element.hasAttribute("data-autoscrolling"))).toBe(false);
      await viewport.hover();
      await page.mouse.wheel(0, -100000);
      const latest = page.getByRole("button", { name: arabic ? "أحدث الرسائل" : "Derniers messages", exact: true });
      await expect(latest).toHaveAttribute("data-active", "true");
      await latest.click();
      await expect.poll(() => page.locator(".messenger-viewport").evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(2);
      await assertContained(page);
      await page.screenshot({ path: `output/design/rework-mediator/${role}-long-${size.width}x${size.height}.png` });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const input = page.getByRole("textbox", { name: arabic ? "رسالتك" : "Votre message", exact: true });
    await input.fill(body.repeat(8));
    await page.setViewportSize({ width: 390, height: 450 });
    await input.focus();
    await assertContained(page);
    await input.fill(arabic ? "مسودة إلى إيمان" : "Brouillon pour Yassine");
    await page.goto(`/${role}`);
    await page.goto(`/${role}/messages`);
    await page.locator(".messenger-contact").first().click();
    await expect(input).toHaveValue(arabic ? "مسودة إلى إيمان" : "Brouillon pour Yassine");
    await assertContained(page);
  });

  test(`${role}: recipient drafts persist, mobile back restores contacts, and keyboard sending respects newlines`, async ({ page }) => {
    const arabic = role === "neet";
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${role}/messages`);
    const contacts = page.locator(".messenger-contact");
    const input = page.getByRole("textbox", { name: arabic ? "رسالتك" : "Votre message", exact: true });
    const back = page.getByRole("button", { name: arabic ? "العودة إلى المحادثات" : "Retour aux conversations", exact: true });
    await expect(page.locator(".messenger-contacts")).toBeVisible();
    await contacts.first().click();
    await input.fill("First recipient draft");
    await back.click();
    await expect(page.locator(".messenger-contacts")).toBeVisible();
    await expect(page.getByRole("textbox", { name: arabic ? "البحث في المحادثات" : "Rechercher une conversation" })).toBeFocused();
    await contacts.nth(1).click();
    await expect(input).toHaveValue("");
    await input.fill("Second recipient draft");
    await page.reload();
    await contacts.nth(1).click();
    await expect(input).toHaveValue("Second recipient draft");
    await back.click();
    await contacts.first().click();
    await expect(input).toHaveValue("First recipient draft");
    await input.fill("\n   ");
    const send = page.locator('.messenger-composer button[type="submit"]');
    await expect(send).toBeDisabled();
    await input.fill(arabic ? "السطر الأول" : "Première ligne");
    await input.press("Shift+Enter");
    await input.pressSequentially(arabic ? "السطر الثاني" : "Deuxième ligne");
    await expect(input).toHaveValue(arabic ? "السطر الأول\nالسطر الثاني" : "Première ligne\nDeuxième ligne");
    await input.press("Enter");
    await expect(input).toHaveValue("");
    await expect(input).toBeFocused();
    await expect(page.getByRole("log")).toContainText(arabic ? "السطر الثاني" : "Deuxième ligne");
    await back.click();
    await contacts.nth(1).click();
    await expect(page.getByRole("log")).not.toContainText(arabic ? "السطر الثاني" : "Deuxième ligne");
    await back.click();
    const search = page.getByRole("textbox", { name: arabic ? "البحث في المحادثات" : "Rechercher une conversation" });
    await search.fill("no-match");
    await expect(page.getByText(arabic ? "لا توجد محادثة مطابقة" : "Aucune conversation correspondante")).toBeVisible();
    await page.getByRole("button", { name: arabic ? "مسح البحث" : "Effacer la recherche", exact: true }).last().click();
    await expect(contacts).toHaveCount(arabic ? 2 : 3);
    await expect(search).toBeFocused();
    await page.getByRole("button", { name: arabic ? "فتح القائمة" : "Ouvrir le menu", exact: true }).click();
    await page.getByRole("link", { name: arabic ? "الرئيسية" : "Vue d’ensemble", exact: true }).click();
    await expect(page.locator(".workspace-messenger")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeGreaterThan(844);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflowY)).not.toBe("hidden");
  });
}
