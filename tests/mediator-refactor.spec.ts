import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function choose(page: Page, label: string, value: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: value, exact: true }).click();
}

test("mediator filters compose and reset a caseload", async ({ page }) => {
  await page.goto("/mediator/caseload");
  await choose(page, "Étape du parcours", "Identifié");
  await choose(page, "Priorité du suivi", "Prioritaire");
  await expect(page.locator(".data-table tbody tr")).toHaveCount(2);
  await page.getByRole("textbox", { name: "Rechercher un jeune" }).fill("Tata");
  await expect(page.locator(".data-table tbody tr")).toHaveCount(1);
  await page
    .getByRole("textbox", { name: "Rechercher un jeune" })
    .fill("no-result");
  await expect(page.locator(".empty-state")).toBeVisible();
  await page.getByRole("button", { name: "Réinitialiser" }).click();
  await expect(page.locator(".data-table tbody tr")).toHaveCount(5);
});

test("terrain activity filtering, participants, details and CSV use persistent demo data", async ({
  page,
}) => {
  await page.goto("/mediator/micro-actions");
  await choose(page, "Catégorie de l’action", "Atelier");
  await expect(page.locator(".mediator-terrain-card")).toHaveCount(1);
  const activity = page
    .locator(".mediator-terrain-card")
    .filter({ hasText: "Un CV qui te ressemble" });
  await choose(
    page,
    "Participant pour Un CV qui te ressemble",
    "Fatima Zahra A.",
  );
  await activity
    .getByRole("button", { name: "Ajouter le participant" })
    .click();
  await expect(
    activity.getByRole("button", { name: "Participant ajouté" }),
  ).toBeDisabled();
  await activity.getByRole("button", { name: "Voir l’activité" }).click();
  await expect(page.getByRole("dialog")).toContainText("Fatima Zahra A.");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Fermer", exact: true })
    .click();
  await page.reload();
  await expect(activity.locator(".mediator-attendees")).toContainText(
    "Fatima Zahra A.",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter les participants" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "bidayaneet-participants-demo.csv",
  );
  await activity
    .getByRole("button", {
      name: "Retirer Fatima Zahra A. de Un CV qui te ressemble",
    })
    .click();
  await page.reload();
  await expect(activity.locator(".mediator-attendees")).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Rechercher une action de terrain" })
    .fill("does-not-exist");
  await expect(page.locator(".empty-state")).toBeVisible();
  await page.getByRole("button", { name: "Réinitialiser" }).click();
  await expect(page.locator(".mediator-terrain-card")).toHaveCount(4);
});

test("mediator opportunity filters and orientation persist by selected recipient", async ({
  page,
}) => {
  await page.goto("/mediator/opportunities");
  await choose(page, "Type d’opportunité", "Formation");
  await choose(page, "Lieu de l’opportunité", "Agadir");
  await expect(page.locator(".mediator-offer-card")).toHaveCount(1);
  const offer = page.locator(".mediator-offer-card").first();
  await offer.getByRole("button", { name: "Voir l’offre" }).click();
  await expect(page.getByRole("dialog")).toContainText("Débutant accepté");
  await page.keyboard.press("Escape");
  await choose(
    page,
    "Orienter un jeune vers Développement web full stack",
    "Fatima Zahra A.",
  );
  await offer.getByRole("button", { name: "Préparer l’orientation" }).click();
  await expect(offer.getByRole("status")).toContainText("Fatima Zahra A.");
  await page.reload();
  const webOffer = page
    .locator(".mediator-offer-card")
    .filter({ hasText: "Développement web full stack" });
  await choose(
    page,
    "Orienter un jeune vers Développement web full stack",
    "Fatima Zahra A.",
  );
  await expect(
    webOffer.getByRole("button", { name: "Orientation préparée" }),
  ).toBeDisabled();
  await choose(
    page,
    "Orienter un jeune vers Développement web full stack",
    "Yassine El Amrani",
  );
  await expect(
    webOffer.getByRole("button", { name: "Préparer l’orientation" }),
  ).toBeEnabled();
});

test("appointment dialog closes, searches, and restores completed appointments", async ({
  page,
}) => {
  await page.goto("/mediator/appointments");
  await page.getByRole("button", { name: "Ajouter un rendez-vous" }).click();
  await page
    .getByLabel("Lieu", { exact: true })
    .fill("Bureau du test refactor");
  await choose(page, "Jeune accompagné", "Fatima Zahra A.");
  await page.getByRole("button", { name: "Ajouter à l’agenda" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Rechercher un rendez-vous" })
    .fill("Bureau du test refactor");
  const appointment = page.locator(".appointment-card");
  await expect(appointment).toHaveCount(1);
  await appointment.getByRole("button", { name: "Marquer terminé" }).click();
  await page.getByRole("radio", { name: "Terminés", exact: true }).click();
  await expect(appointment).toContainText("Fatima Zahra A.");
  await page.reload();
  await page.getByRole("radio", { name: "Terminés", exact: true }).click();
  await expect(
    page
      .locator(".appointment-card")
      .filter({ hasText: "Bureau du test refactor" }),
  ).toBeVisible();
});

for (const role of ["mediator", "neet"] as const) {
  test(`${role} full page messenger searches contacts, isolates messages and persists replies`, async ({
    page,
  }, testInfo) => {
    const arabic = role === "neet";
    await page.goto(`/${role}/messages`);
    const liveMessenger = page.locator(".messenger-page:not(.messenger-loading)");
    await expect(liveMessenger).toBeVisible();
    await expect(page.locator(".messenger-contacts")).toBeVisible();
    await expect(page.locator(".workspace")).toHaveClass(/workspace-messenger/);
    await expect(page.locator(".page-intro")).toHaveCount(0);
    await expect(liveMessenger).toHaveAttribute(
      "dir",
      arabic ? "rtl" : "ltr",
    );
    const firstContact = page.locator(".messenger-contact").first();
    await firstContact.click();
    const message = arabic
      ? "حضّرت أسئلتي للموعد القادم."
      : "Je prépare mes questions pour notre rendez-vous.";
    await page
      .getByRole("textbox", {
        name: arabic ? "رسالتك" : "Votre message",
        exact: true,
      })
      .fill(message);
    await page
      .getByRole("button", {
        name: arabic
          ? "إضافة الرسالة إلى المحادثة التجريبية"
          : "Ajouter le message à la démonstration",
      })
      .click();
    await expect(page.getByRole("log")).toContainText(message);
    if (testInfo.project.name === "mobile")
      await page
        .getByRole("button", {
          name: arabic ? "العودة إلى المحادثات" : "Retour aux conversations",
        })
        .click();
    await page.locator(".messenger-contact").nth(1).click();
    await expect(page.getByRole("log")).not.toContainText(message);
    if (testInfo.project.name === "mobile")
      await page
        .getByRole("button", {
          name: arabic ? "العودة إلى المحادثات" : "Retour aux conversations",
        })
        .click();
    await firstContact.click();
    await expect(page.getByRole("log")).toContainText(message);
    await page.reload();
    await firstContact.click();
    await expect(page.getByRole("log")).toContainText(message);
    if (testInfo.project.name === "mobile")
      await page
        .getByRole("button", {
          name: arabic ? "العودة إلى المحادثات" : "Retour aux conversations",
        })
        .click();
    await page
      .getByRole("textbox", {
        name: arabic ? "البحث في المحادثات" : "Rechercher une conversation",
      })
      .fill("no-contact-match");
    await expect(
      page.getByText(
        arabic ? "لا توجد محادثة مطابقة" : "Aucune conversation correspondante",
      ),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}


test("mediator profile dropdown labels and saved follow-up notes stay consistent", async ({ page }) => {
  await page.goto("/mediator/profile");
  await expect(page.getByRole("combobox", { name: "Zone principale", exact: true })).toHaveText("Agadir");
  await choose(page, "Zone principale", "Tiznit");
  await expect(page.getByRole("combobox", { name: "Zone principale", exact: true })).toHaveText("Tiznit");
  await choose(page, "Langue d’accompagnement", "Amazigh");
  await expect(page.getByRole("combobox", { name: "Langue d’accompagnement", exact: true })).toHaveText("Amazigh");
  await page.getByRole("button", { name: "Enregistrer mes informations" }).click();
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Zone principale", exact: true })).toHaveText("Tiznit");
  await expect(page.getByRole("combobox", { name: "Langue d’accompagnement", exact: true })).toHaveText("Amazigh");
  await page.goto("/mediator/caseload");
  await page.getByRole("textbox", { name: "Rechercher un jeune" }).fill("  yassine  ");
  await expect(page.locator(".data-table tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Ouvrir", exact: true }).click();
  await page.getByLabel("Note", { exact: true }).fill("Préparer les questions pour la prochaine formation.");
  await choose(page, "Prochaine action", "Atelier CV");
  await page.getByRole("button", { name: "Ajouter au suivi de démo" }).click();
  await page.reload();
  await expect(page.locator(".timeline")).toContainText("Préparer les questions pour la prochaine formation.");
  await expect(page.locator(".timeline")).toContainText("Atelier CV");
});

test("mediator report export follows the selected period", async ({ page }) => {
  await page.goto("/mediator/reports");
  await choose(page, "Période de démonstration", "Juillet");
  await expect(page.getByRole("combobox", { name: "Période de démonstration" })).toHaveText("Juillet");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger le CSV" }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe("bidayaneet-activite-juillet-demo.csv");
  const csv = await readFile((await download.path())!, "utf8");
  expect(csv).toContain('"Juillet","12","8","3"');
  expect(csv).not.toContain("Septembre");
});
