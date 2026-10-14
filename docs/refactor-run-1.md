# Refactor UI Run 1

Task: https://app.notion.com/p/3f8dda2c05b280d39d7bc77d5376af71

All four portals retain the existing white and teal identity. New interactions use shadcn Radix primitives: blurred full-list dialogs, guided creation/editing forms, filters, notifications, and chat surfaces. The rounded workspace surface includes the full page content. Existing device-local simulation remains the persistence adapter.

Admin programs now have image cards, guided creation, and their own editable detail route. NEET search, combined filters, profile creation, and spotlight dialogs work. Dashboard and NEET screens share funnel and blocker components. Mediator, opportunity, and micro-action creation persists locally; the micro-action calendar supports month navigation, date selection, detail inspection, and edits.

Mediator searches, filters, appointments, referrals, participants, and exports use working controls. The messenger occupies the page without a visible page title and preserves recipient isolation, drafts, and conversations. Youth messaging has Arabic fixtures and RTL presentation.

The youth portal is Arabic, RTL, and uses self-hosted Cairo. The sidebar sits on the right. Notifications open a menu and support marking all read. The assistant is accessible on every youth page, preserves local conversation history, answers predefined Arabic questions, and opens with GSAP animation that respects reduced motion. Youth cards include a full-image motivational quote, four larger story covers per page, a circular mediator avatar, and searchable/filterable opportunities.

Partner cohort styling matches the platform palette. Authentication screens use the existing transparent PNG brand, new generated photography, concise copy, and shadcn form controls. All four roles and all four modes preserve input/password validation. Youth authentication is Arabic RTL. Authentication remains a demonstration without accounts or sessions.

## Interactive map

Both map surfaces now use [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) with Esri World Imagery satellite tiles. The self-hosted combined Natural Earth geometry displays the requested national extent with Laâyoune and Dakhla and no internal dividing line. City labels are controlled by the application, while the satellite source has no political boundary labels. This is a coverage display using demonstration figures.

Pan, zoom, national/regional extent, accessible commune selection, layer changes, and persistent heat radius/intensity/visibility controls work. Satellite imagery requires a network connection; coverage geometry and data remain app-hosted. WebGL is required for canvas rendering; an accessible commune list remains usable if it is unavailable.

MapLibre 6 ships an ESM worker whose URL is affected by bundlers. `scripts/sync-map-assets.mjs` runs before development and production builds to copy the locked package's worker modules and BSD license to `public/vendor/maplibre/`. The application explicitly sets that same-origin worker URL. Generated vendor assets are ignored by Git and reproduced by the build.

## Validation

Final production build and TypeScript checks passed. ESLint and diff checks passed. The complete browser run finished with 78 passed and two intentional viewport-specific skips in 2.1 minutes. Tests cover all 30 workspace routes, 16 auth screens, creation/editing, combined filters, messaging isolation, Arabic layout, assistant controls, persistence, map workers, heat controls, and dashboard map sizing at 1440 and 390 pixels.

Final review screenshots are saved under `output/design/run-1/`. The final check fixed a flex sizing issue that could clip the dashboard map and made coverage controls available as soon as the map style loads, independently of satellite tile download time.

The final CSS pass moved the legacy anchor reset into the base layer so shadcn link-button text keeps its intended white color on teal backgrounds. The subsequent build/lint passed, and white CTA text was checked in the production browser at both viewport sizes.

Validation commands: `npm run build`, `npm run lint`, and the full Playwright suite using the same repository desktop/mobile projects against the final production preview. An earlier combined build/test run was interrupted; the completed run reused a separately started production server without modifying build files during testing.

Production dependencies have zero reported vulnerabilities. The development-only shadcn/ESLint toolchain retains the upstream braces advisory GHSA-vfj7-8cjw-p6xm; the current npm registry has no patched braces release. Available non-breaking patches were applied. No dependency downgrade or forced breaking fix was performed.

This iteration remains local. Production publication, when requested, must follow GitHub CI/CD as required by AGENTS.md.

Image generation details and the saved prompt are in `docs/refactor-run-1-assets.md`.

The pre-existing shadcn skill was used, and official GSAP core/React skills were installed under `~/.codex/skills/`. They are available on subsequent turns.
