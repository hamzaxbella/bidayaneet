import { test, expect } from "@playwright/test";

test("youth workspace is Arabic RTL with four reels and notifications", async ({
  page,
}) => {
  await page.goto("/neet");
  const shell = page.locator(".workspace-neet");
  await expect(shell).toHaveAttribute("lang", "ar");
  await expect(shell).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".reel-card")).toHaveCount(4);
  await expect(
    page.getByRole("heading", { name: "قصص تلهم بدايتك" }),
  ).toBeVisible();
  await page
    .locator(".portal-topbar")
    .getByRole("button", { name: "الإشعارات", exact: true })
    .click();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.getByRole("menuitem", { name: "تحديد الكل كمقروء" }).click();
  await page
    .locator(".portal-topbar")
    .getByRole("button", { name: "الإشعارات", exact: true })
    .click();
  await expect(
    page.getByRole("menuitem", { name: "كل الإشعارات مقروءة" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "القصص التالية", exact: true })
    .click();
  await expect(page.locator(".reel-card")).toHaveCount(4);
  await expect(page.locator(".reel-card").last()).toContainText("خالد");
});

test("assistant opens from dashboard and launcher with persistent predefined Arabic replies", async ({
  page,
}) => {
  await page.goto("/neet");
  await page.getByRole("button", { name: "تحدّث الآن", exact: true }).click();
  const chat = page.getByRole("dialog", { name: "مساعد بداية" });
  await expect(chat).toBeVisible();
  await chat.getByRole("button", { name: "كيف أجهّز سيرتي الذاتية؟" }).click();
  await expect(chat).toContainText("ابدأ بمعلومات التواصل");
  await chat
    .getByRole("textbox", { name: "رسالتك للمساعد" })
    .fill("أحتاج إلى توجيه");
  await chat.getByRole("button", { name: "إرسال للمساعد" }).click();
  await expect(chat).toContainText("لا تحتاج إلى معرفة كل الإجابات");
  await page.keyboard.press("Escape");
  await expect(chat).toHaveCount(0);
  await page.goto("/neet/journey");
  await page.getByRole("button", { name: "فتح مساعد بداية" }).click();
  await expect(page.getByRole("dialog", { name: "مساعد بداية" })).toContainText(
    "أحتاج إلى توجيه",
  );
});

test("shadcn Arabic opportunity filters combine search location favorites and applications", async ({
  page,
}) => {
  await page.goto("/neet/opportunities");
  await page.getByRole("combobox", { name: "نوع الفرصة" }).click();
  await page.getByRole("option", { name: "تكوين", exact: true }).click();
  await expect(page.locator(".youth-opportunity-card")).toHaveCount(1);
  await page.getByRole("button", { name: /إضافة إلى المفضلة/ }).click();
  await page.getByRole("tab", { name: "المفضلة (1)", exact: true }).click();
  await expect(page.locator(".youth-opportunity-card")).toHaveCount(1);
  await page.getByRole("link", { name: "اكتشف الفرصة", exact: true }).click();
  await page.getByRole("button", { name: "حضّر ترشيحي", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "تم تحضير الترشيح", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "تم تحضير الترشيح", exact: true }),
  ).toBeDisabled();
  await page.goto("/neet/opportunities");
  await page.getByRole("tab", { name: "ترشيحاتي (1)", exact: true }).click();
  await expect(page.locator(".youth-opportunity-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "ابحث عن فرصة" }).fill("غيرموجود");
  await expect(page.locator(".youth-opportunity-card")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "لا توجد فرص هنا بعد" }),
  ).toBeVisible();
});

test("Arabic profile edits and activity enrollment survive reload", async ({
  page,
}) => {
  await page.goto("/neet/profile");
  await page
    .getByRole("textbox", { name: "الاسم الشخصي", exact: true })
    .fill("أحمد");
  await page.getByRole("button", { name: "حفظ معلوماتي", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "الاسم الشخصي", exact: true }),
  ).toHaveValue("أحمد");
  await page.goto("/neet/micro-actions");
  await page
    .locator(".action-visual")
    .first()
    .getByRole("button", { name: "اختيار سيرة ذاتية تعبّر عنك" })
    .click();
  await page.reload();
  await page.getByRole("tab", { name: "تسجيلاتي (1)", exact: true }).click();
  await expect(page.locator(".action-visual")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "إلغاء اختيار سيرة ذاتية تعبّر عنك" }),
  ).toBeVisible();
});
