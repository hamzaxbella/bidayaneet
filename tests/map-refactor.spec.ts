import { test, expect } from "@playwright/test";

test("interactive national map loads its worker and persists editable heat controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /worker|WebGL|maplibre/i.test(message.text())
    )
      errors.push(message.text());
  });
  await page.goto("/heatmap");
  const map = page.locator(".interactive-national-map");
  await expect(map.locator(".maplibregl-canvas")).toBeVisible();
  await expect(map.locator(".map-loading")).toHaveCount(0);
  await expect(map.locator(".map-value-marker")).toHaveCount(12);
  await expect(map.getByText("Laâyoune", { exact: true })).toBeVisible();
  await expect(map.getByText("Dakhla", { exact: true })).toBeVisible();
  await map.getByRole("button", { name: "Heat controls", exact: true }).click();
  const radius = page.getByRole("slider", { name: /Radius/ });
  await radius.fill("60");
  await page.getByRole("checkbox", { name: "Show heat layer" }).uncheck();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(map.locator(".map-loading")).toHaveCount(0);
  await map.getByRole("button", { name: "Heat controls", exact: true }).click();
  await expect(page.getByRole("slider", { name: /Radius/ })).toHaveValue("60");
  await expect(
    page.getByRole("checkbox", { name: "Show heat layer" }),
  ).not.toBeChecked();
  await page
    .getByRole("button", { name: "Reset heat controls", exact: true })
    .click();
  await expect(page.getByRole("slider", { name: /Radius/ })).toHaveValue("30");
  await page.keyboard.press("Escape");
  await page
    .getByRole("radio", { name: "Mediator Coverage", exact: true })
    .click();
  await map.getByRole("radio", { name: "Souss-Massa", exact: true }).click();
  await map
    .locator(".map-point-list")
    .getByRole("button", { name: /Taroudant/ })
    .click();
  await expect(map.locator(".map-selection")).toHaveText(
    "Taroudant · 6 in the selected layer",
  );
  expect(errors).toEqual([]);
});

test("dashboard map fits within its card at both viewport sizes", async ({ page }) => {
  await page.goto("/");
  const map = page.locator(".interactive-national-map");
  await expect(map.locator(".map-loading")).toHaveCount(0);
  await expect(map.getByRole("button", { name: "Heat controls", exact: true })).toBeVisible();
  const viewport = page.viewportSize()!;
  const mapBounds = await map.boundingBox();
  expect(mapBounds!.x + mapBounds!.width).toBeLessThanOrEqual(viewport.width - 10);
  const cardBounds = await map.locator("..").boundingBox();
  expect(mapBounds!.x + mapBounds!.width).toBeLessThanOrEqual(cardBounds!.x + cardBounds!.width);
  await map.getByRole("radio", { name: "Souss-Massa", exact: true }).click();
  await map.getByRole("button", { name: "Heat controls", exact: true }).click();
  await expect(page.getByRole("slider", { name: /Radius/ })).toBeVisible();
});

test("real raster tiles arrive as images and a blocked basemap is disclosed without disabling coverage controls", async ({ page, context }) => {
  const tiles: { status: number; contentType: string }[] = [];
  page.on("response", (response) => { if (response.url().includes("server.arcgisonline.com") && response.url().includes("/tile/")) tiles.push({ status: response.status(), contentType: response.headers()["content-type"] ?? "" }); });
  await page.goto("/heatmap");
  const map = page.locator(".interactive-national-map");
  await expect(map).toHaveAttribute("data-basemap", "ready");
  expect(tiles.some((tile) => tile.status === 200 && tile.contentType.startsWith("image/"))).toBe(true);
  const sharp = (await import("sharp")).default;
  const rendered = await sharp(await map.locator(".maplibregl-canvas").screenshot()).stats();
  const renderedVariance = rendered.channels.slice(0, 3).reduce((total, channel) => total + channel.stdev, 0);
  await page.screenshot({ path: "output/design/rework-admin/heatmap-with-satellite.png", fullPage: true });
  await context.route("**/server.arcgisonline.com/**", (route) => route.abort("failed"));
  await page.reload();
  await expect(map).toHaveAttribute("data-basemap", "unavailable");
  await expect(map.locator(".map-tile-notice")).toContainText("Satellite basemap unavailable");
  await expect(map.locator(".map-value-marker")).toHaveCount(12);
  const unavailable = await sharp(await map.locator(".maplibregl-canvas").screenshot()).stats();
  const fallbackVariance = unavailable.channels.slice(0, 3).reduce((total, channel) => total + channel.stdev, 0);
  expect(renderedVariance).toBeGreaterThan(fallbackVariance + 15);
  await page.screenshot({ path: "output/design/rework-admin/heatmap-basemap-unavailable.png", fullPage: true });
  await map.getByRole("button", { name: "Heat controls", exact: true }).click();
  await page.getByRole("slider", { name: /Radius/ }).fill("50");
  await expect(page.getByRole("slider", { name: /Radius/ })).toHaveValue("50");
  await page.keyboard.press("Escape");
  await map.locator(".map-point-list").getByRole("button", { name: /Taroudant/ }).click();
  await expect(map.locator(".map-selection")).toContainText("Taroudant");
});
