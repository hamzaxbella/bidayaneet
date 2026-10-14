import { test, expect } from "@playwright/test";
const invalid = { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("notes") };
const valid = { name: "سيرتي الشخصية.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 demo") };

test("CV chooser waits for hydration before becoming interactive", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") await page.setViewportSize({ width: 320, height: 568 });
  let release!: () => void;
  const hydration = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/_next/static/**/*.js", async route => { await hydration; await route.continue(); });
  await page.goto("/neet/profile", { waitUntil: "commit" });
  const chooser = page.getByLabel("اختيار سيرتي الذاتية", { exact: true });
  await chooser.waitFor({ state: "attached" });
  try {
    await expect(chooser).toBeDisabled();
    await expect(page.locator(".file-upload")).toHaveAttribute("aria-busy", "true");
  } finally { release(); }
  await expect(chooser).toBeEnabled();
  await expect(page.locator(".file-upload")).toHaveAttribute("aria-busy", "false");
  await page.getByRole("button", { name: "حفظ معلوماتي", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(chooser).toBeFocused();
  await expect(page.locator(".file-upload")).toHaveCSS("outline-width", "3px");
  const firstKeyboardSelection = page.waitForEvent("filechooser", { timeout: 5000 });
  await page.keyboard.press("Enter");
  await (await firstKeyboardSelection).setFiles(invalid);
  await expect(page.locator(".workspace-content").getByRole("alert")).toContainText("اختر ملف PDF");
  await chooser.setInputFiles(valid);
  await expect(page.locator(".document-row")).toContainText(valid.name);
  await expect(page.locator(".document-row")).toContainText("تم اختيار الملف محلياً");
  await expect(page.locator(".workspace-content").getByRole("alert")).toHaveCount(0);
});

test("visible Arabic chooser and keyboard activation validate files on a fresh load", async ({ page }, testInfo) => {
  const mutations: string[] = [];
  page.on("request", request => { if (!["GET", "HEAD"].includes(request.method())) mutations.push(request.url()); });
  await page.goto("/neet/profile");
  const chooser = page.getByLabel("اختيار سيرتي الذاتية", { exact: true });
  const label = page.locator(".file-upload");
  await expect(chooser).toBeEnabled();
  const invalidEvent = page.waitForEvent("filechooser");
  await label.click();
  await (await invalidEvent).setFiles(invalid);
  await expect(page.locator(".workspace-content").getByRole("alert")).toContainText("اختر ملف PDF");
  await page.getByRole("button", { name: "حفظ معلوماتي", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(chooser).toBeFocused();
  await expect(label).toHaveCSS("outline-width", "3px");
  await page.screenshot({ path: testInfo.outputPath("arabic-cv-keyboard-focus.png") });
  const validEvent = page.waitForEvent("filechooser");
  await page.keyboard.press("Enter");
  await (await validEvent).setFiles(valid);
  await expect(page.locator(".document-row")).toContainText(valid.name);
  await expect(page.locator(".workspace-content").getByRole("alert")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("arabic-cv-selected.png") });
  expect(mutations).toEqual([]);
});
