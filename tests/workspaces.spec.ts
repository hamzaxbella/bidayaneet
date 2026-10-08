import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/neets",
  "/mediators",
  "/programs",
  "/opportunities",
  "/micro-actions",
  "/heatmap",
  "/reports",
  "/alerts",
  "/settings",
  "/partner",
  "/neet",
  "/neet/opportunities",
  "/neet/opportunities/web",
  "/neet/stories",
  "/neet/journey",
  "/neet/micro-actions",
  "/neet/messages",
  "/neet/profile",
  "/neet/help",
  "/mediator",
  "/mediator/caseload",
  "/mediator/caseload/YE",
  "/mediator/appointments",
  "/mediator/opportunities",
  "/mediator/micro-actions",
  "/mediator/messages",
  "/mediator/reports",
  "/mediator/profile",
  "/mediator/help",
];
test("every workspace route renders without errors or horizontal page overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  const viewportWidth = page.viewportSize()!.width;
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1").first(), route).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        (width) => document.documentElement.scrollWidth <= width + 1,
        viewportWidth,
      ),
      `Overflow at ${route}`,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("all auth screens render; unknown roles and records return 404", async ({
  page,
}) => {
  const viewportWidth = page.viewportSize()!.width;
  for (const role of ["neet", "mediator", "partner", "admin"]) {
    for (const mode of [
      "sign-in",
      "register",
      "forgot-password",
      "reset-password",
    ]) {
      const response = await page.goto(`/auth/${role}/${mode}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator(".auth-form")).toBeVisible();
      expect(
        await page.evaluate(
          (width) => document.documentElement.scrollWidth <= width + 1,
          viewportWidth,
        ),
      ).toBe(true);
    }
  }
  for (const route of [
    "/auth/unknown/sign-in",
    "/auth/neet/unknown",
    "/neet/opportunities/unknown",
    "/mediator/caseload/unknown",
  ]) {
    expect((await page.goto(route))?.status()).toBe(404);
  }
});

test("logos have no dashboard switcher and role navigation stays within its workspace", async ({
  page,
}) => {
  for (const role of ["neet", "mediator", "partner"]) {
    await page.goto(`/${role}`);
    await expect(
      page.locator(
        ".workspace-brand button:not(.mobile-close):not(.sidebar-collapse)",
      ),
    ).toHaveCount(0);
    await expect(page.locator(".workspace-brand a")).toHaveCount(0);
    const hrefs = await page
      .locator(".workspace-sidebar nav a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(hrefs.every((href) => href?.startsWith(`/${role}`))).toBe(true);
  }
});

test("opportunities support search, favorites, details, and prepared applications", async ({
  page,
}) => {
  await page.goto("/neet/opportunities");
  await page
    .getByRole("textbox", { name: "Rechercher une opportunité" })
    .fill("web");
  await expect(page.locator(".opportunity-card")).toHaveCount(1);
  await page.getByRole("button", { name: /Ajouter aux favoris/ }).click();
  await page
    .getByRole("button", { name: "Mes favoris (1)", exact: true })
    .click();
  await expect(page.locator(".opportunity-card")).toHaveCount(1);
  await page.getByRole("link", { name: "Découvrir l’opportunité" }).click();
  await page.getByRole("button", { name: "Préparer ma candidature" }).click();
  await expect(
    page.getByRole("button", { name: "Candidature préparée" }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Aucune candidature");
  await page
    .getByRole("link", { name: "Toutes les opportunités", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mes candidatures (1)", exact: true })
    .click();
  await expect(page.locator(".opportunity-card")).toHaveCount(1);
  await page
    .getByRole("textbox", { name: "Rechercher une opportunité" })
    .fill("zzzz");
  await expect(page.locator(".empty-state")).toBeVisible();
});

test("restored youth dashboard keeps its original panels and searches opportunities", async ({
  page,
}) => {
  await page.goto("/neet");
  const dashboard = page.locator(".original-youth-dashboard");
  await expect(dashboard.locator(".profile-card")).toBeVisible();
  await expect(dashboard.locator(".assistant-card")).toBeVisible();
  await expect(dashboard.locator(".quote-card")).toBeVisible();
  const search = dashboard.getByRole("textbox", {
    name: "Rechercher des opportunités, programmes",
  });
  await search.fill("web");
  await search.press("Enter");
  await expect(page).toHaveURL("/neet/opportunities?q=web");
  await expect(page.locator(".opportunity-card")).toHaveCount(1);
  await expect(
    page.getByRole("textbox", { name: "Rechercher une opportunité" }),
  ).toHaveValue("web");

  await page.goto("/");
  await page
    .getByRole("searchbox", { name: "Search NEET profiles" })
    .fill("Yassine");
  await expect(page.locator("table tbody tr")).toHaveCount(1);
  await expect(page.locator("table tbody")).toContainText("Yassine");
});

test("mediator can search a caseload and record a local follow-up", async ({
  page,
}) => {
  await page.goto("/mediator/caseload");
  await page
    .getByRole("textbox", { name: "Rechercher un jeune" })
    .fill("Yassine");
  await expect(page.locator(".data-table tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Ouvrir", exact: true }).click();
  await page
    .getByLabel("Note", { exact: true })
    .fill("Préparer le CV avant le prochain rendez-vous.");
  await page.getByRole("button", { name: "Ajouter au suivi de démo" }).click();
  await expect(page.locator(".timeline")).toContainText(
    "Préparer le CV avant le prochain rendez-vous.",
  );
  await page.reload();
  await expect(page.locator(".timeline")).toContainText(
    "Préparer le CV avant le prochain rendez-vous.",
  );
  await page.goto("/mediator/caseload/FZ");
  await expect(page.locator(".timeline")).not.toContainText(
    "Préparer le CV avant le prochain rendez-vous.",
  );
});

test("appointments can be created and completed locally", async ({ page }) => {
  await page.goto("/mediator/appointments");
  await page.getByRole("button", { name: "Ajouter un rendez-vous" }).click();
  await page.getByLabel("Date", { exact: true }).fill("2026-10-08");
  await page.getByLabel("Heure", { exact: true }).fill("10:30");
  await page.getByLabel("Lieu", { exact: true }).fill("Bureau de test");
  await page.getByRole("button", { name: "Ajouter à l’agenda" }).click();
  const appointment = page
    .locator(".appointment-card")
    .filter({ hasText: "Bureau de test" });
  await expect(appointment).toBeVisible();
  await appointment.getByRole("button", { name: "Marquer terminé" }).click();
  await page.getByRole("button", { name: "Terminés", exact: true }).click();
  await expect(appointment).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Terminés", exact: true }).click();
  await expect(appointment).toBeVisible();
});

test("conversations keep local replies isolated per recipient", async ({
  page,
}) => {
  await page.goto("/neet/messages");
  await page
    .getByRole("textbox", { name: "Votre message" })
    .fill("Bonjour Imane, je prépare mes questions.");
  await page
    .getByRole("button", { name: "Ajouter le message à la démonstration" })
    .click();
  await expect(page.getByRole("log")).toContainText(
    "Bonjour Imane, je prépare mes questions.",
  );
  await page.getByRole("button", { name: /Équipe BidayaNeet/ }).click();
  await expect(page.getByRole("log")).not.toContainText(
    "Bonjour Imane, je prépare mes questions.",
  );
  await page.getByRole("button", { name: /Imane Rami/ }).click();
  await expect(page.getByRole("log")).toContainText(
    "Bonjour Imane, je prépare mes questions.",
  );
  await page.reload();
  await expect(page.getByRole("log")).toContainText(
    "Bonjour Imane, je prépare mes questions.",
  );
});

test("floating sidebar collapses, persists, and retains accessible role links", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop collapse only");
  for (const route of ["/neet", "/mediator", "/partner", "/"]) {
    await page.goto(route);
    const sidebar = page.locator(".workspace-sidebar");
    await expect.poll(async () => (await sidebar.boundingBox())?.x).toBe(10);
    await page.getByRole("button", { name: "Réduire la navigation" }).click();
    await expect(page.locator(".workspace")).toHaveClass(/workspace-collapsed/);
    await expect
      .poll(async () => (await sidebar.boundingBox())?.width)
      .toBe(82);
    await expect(sidebar.locator("nav a").first()).toHaveAccessibleName(
      /Home|Vue d’ensemble|Overview|Dashboard/,
    );
    await page.reload();
    await expect(page.locator(".workspace")).toHaveClass(/workspace-collapsed/);
    await page
      .getByRole("button", { name: "Développer la navigation" })
      .click();
    await expect
      .poll(async () => (await sidebar.boundingBox())?.width)
      .toBe(248);
  }
});

test("portrait stories open an accessible viewer, navigate, and restore focus", async ({
  page,
}) => {
  await page.goto("/neet/stories");
  await expect(page.locator(".reel-card")).toHaveCount(6);
  const first = page.getByRole("button", {
    name: "Découvrir le récit de Salma",
    exact: true,
  });
  const box = await first.boundingBox();
  expect(box!.height / box!.width).toBeCloseTo(16 / 9, 1);
  await first.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Fermer l’histoire" }),
  ).toBeFocused();
  await expect
    .poll(() => dialog.evaluate((element) => element.scrollTop))
    .toBe(0);
  await expect(dialog.getByRole("heading")).toContainText("Salma");
  await dialog.getByRole("button", { name: "Suivant", exact: true }).click();
  await expect(dialog.getByRole("heading")).toContainText("Omar");
  await page.keyboard.press("ArrowUp");
  await expect(dialog.getByRole("heading")).toContainText("Salma");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(first).toBeFocused();
});

test("image-backed micro-actions persist selections across reload and dashboard navigation", async ({
  page,
}) => {
  await page.goto("/neet/micro-actions");
  const card = page
    .locator(".action-visual")
    .filter({ hasText: "Un CV qui te ressemble" });
  await expect(card.locator("img")).toBeVisible();
  await card.getByRole("button", { name: "M’inscrire en démo" }).click();
  await expect(card.getByRole("status")).toContainText("cet appareil");
  await page.reload();
  await page
    .getByRole("button", { name: "Mes inscriptions", exact: true })
    .click();
  await expect(page.locator(".action-visual")).toHaveCount(1);
  await page.goto("/neet");
  await expect(
    page
      .locator(".action-visual")
      .filter({ hasText: "Un CV qui te ressemble" })
      .getByRole("button", { name: "Annuler ma sélection" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("partner referrals and program capacity use the persistent demo repository", async ({
  page,
}) => {
  await page.goto("/partner");
  const referral = page
    .locator("table tbody tr")
    .filter({ hasText: "Yassine El Amrani" });
  await referral.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(referral).toContainText("Accepted");
  await page.reload();
  await expect(referral).toContainText("Accepted");
  await page
    .locator(".partner-showcase-actions")
    .getByRole("link", { name: /Manage programs/ })
    .click();
  await expect(page).toHaveURL(/#programs$/);
  await expect(page.locator("#programs")).toBeInViewport();
});

test("profile changes persist and update the correct role dashboard", async ({
  page,
}) => {
  for (const [role, firstName, button] of [
    ["neet", "Nadia", "Enregistrer mes informations"],
    ["mediator", "Siham", "Enregistrer mes informations"],
  ]) {
    await page.goto(`/${role}/profile`);
    await page.getByLabel("Prénom", { exact: true }).fill(firstName);
    await page.getByRole("button", { name: button, exact: true }).click();
    await expect(page.getByRole("status")).toContainText("cet appareil");
    await page.reload();
    await expect(page.getByLabel("Prénom", { exact: true })).toHaveValue(
      firstName,
    );
    await page.goto(`/${role}`);
    await expect(page.locator("h1").first()).toContainText(firstName);
  }
});

test("auth validates passwords without establishing a fake session", async ({
  page,
}) => {
  await page.goto("/auth/neet/reset-password");
  await page.getByLabel("Mot de passe", { exact: true }).fill("password123");
  await page.getByLabel("Confirmer le mot de passe").fill("different123");
  await page.getByRole("button", { name: "Définir le mot de passe" }).click();
  await expect(page.locator(".auth-form").getByRole("alert")).toContainText(
    "identiques",
  );
  await page.getByLabel("Confirmer le mot de passe").fill("password123");
  await page.getByRole("button", { name: "Définir le mot de passe" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Aucun mot de passe réel",
  );
  await expect(page).toHaveURL("/auth/neet/reset-password");
  expect(await page.context().cookies()).toEqual([]);
});

test("coverage map includes the south and retains layer selection", async ({
  page,
}) => {
  const legacyRequests: string[] = [];
  page.on("request", (request) => {
    if (/openstreetmap|unpkg.com\/leaflet/.test(request.url()))
      legacyRequests.push(request.url());
  });
  await page.goto("/heatmap");
  const map = page.locator(".national-map");
  await expect(map).toBeVisible();
  expect(
    await map.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeGreaterThan(280);
  await expect(map.getByText("Laâyoune", { exact: true })).toBeVisible();
  await expect(map.getByText("Dakhla", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Mediator Coverage", exact: true })
    .click();
  await expect(map.getByRole("status")).toContainText("Agadir · 12");
  await map.getByRole("button", { name: "Souss-Massa", exact: true }).click();
  await map
    .getByRole("button", {
      name: "Taroudant : 6, données de démonstration",
      exact: true,
    })
    .click();
  await expect(map.getByRole("status")).toContainText("Taroudant · 6");
  expect(legacyRequests).toEqual([]);
});

test("CSV report export creates a real download", async ({ page }) => {
  await page.goto("/mediator/reports");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger le CSV" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "bidayaneet-activite-demo.csv",
  );
});

test("mobile navigation opens and closes after selecting a page", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile menu only");
  await page.goto("/neet");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await expect(page.locator(".workspace-sidebar")).toHaveClass(/is-open/);
  await expect(page.locator(".mobile-close")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(".sidebar-support a")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".mobile-close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Ouvrir le menu" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page
    .locator(".workspace-sidebar")
    .getByRole("link", { name: "Mon parcours", exact: true })
    .click();
  await expect(page).toHaveURL("/neet/journey");
  await expect(page.locator(".workspace-sidebar")).not.toHaveClass(/is-open/);
});
