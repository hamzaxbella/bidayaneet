# BidayaNeet UI refactor

## Design review

The original youth portal lived at `/mediator`. Its supporting pages were short placeholder cards, and the logo exposed a menu for switching between unrelated dashboards. The desktop interface used almost uniformly bold text, crowded panels, inconsistent spacing, and a fixed layout that was difficult to use on a phone.

Before screenshots are saved in `output/design/`: `neet-before.png`, `admin-before.png`, and `partner-before.png`.

The built-in imagegen tool received the youth screenshot as a visual reference. Its proposed redesign is saved at `output/design/dashboard-concept.png`. The complete prompt is in `output/design/imagegen-prompt.md`. This image is a design reference; the product is implemented with real components.

Notes taken from the generated concept and applied to the interface:

- Use a quiet navy navigation panel and a light canvas to establish hierarchy.
- Give the greeting and the next useful action more room than secondary information.
- Keep an appointment card and a short checklist close to the main youth journey.
- Use teal for actions and progress, and orange sparingly for attention.
- Reduce bold text, add a clear heading scale, and use a locally hosted variable font.
- Keep photographic opportunities aligned, with consistent metadata and actions.
- Share spacing, buttons, panels, navigation, forms, and empty states across roles.
- Make navigation a drawer on small screens, and allow tables to scroll within their own containers.

## Route ownership

| Workspace | Dashboard | Auth entry |
| --- | --- | --- |
| Young person | `/neet` | `/auth/neet/sign-in` |
| Mediator | `/mediator` | `/auth/mediator/sign-in` |
| Regional admin | `/` (`/admin` redirects here) | `/auth/admin/sign-in` |
| Program partner | `/partner` | `/auth/partner/sign-in` |

Dashboard switching is URL-only. Branding is a static image, and each workspace navigation contains only its own pages. Sign-in links remain within the current role.

The former youth journey and story routes under `/mediator` redirect to `/neet/journey` and `/neet/stories`. Other `/mediator` pages now serve mediator-specific workflows. The admin list of young people remains `/neets`, distinct from the young person's own `/neet` dashboard.

Auth supports `sign-in`, `register`, `forgot-password`, and `reset-password` for each role. Professional registration is an access request, rather than open creation of privileged accounts. Password visibility, required fields, email format, minimum new-password length, and password confirmation are implemented. Unknown roles, auth modes, opportunity IDs, and dossier IDs return 404.

## UI behavior and integration boundary

This work completes the requested workspace pages and visual refactor. The user explicitly deferred the authentication provider. Dashboards remain demonstration workspaces; there are no authenticated sessions or server-side access controls yet.

- Youth favorites, application preparation, checklists, and workshop selections survive client navigation inside the youth layout for the current session. Reloading clears them.
- Messages, follow-up notes, appointments, participant lists, and profile edits are local demonstrations. They do not send notifications, submit applications, create accounts, or persist to a server.
- CV selection validates PDF type and the 5 MB limit locally; it does not upload a file.
- CSV exports produce real UTF-8 downloads and escape potential spreadsheet formula cells.
- Loading, empty, validation, error, and not-found states are included.

Before using real accounts, connect an authentication provider, enforce role authorization on the server and data layer, and replace the demo fixtures with the business API. These are separate integration tasks, not simulated by the UI.

## Maps

Both map surfaces use `components/MoroccoMap.tsx`. All Leaflet scripts, OpenStreetMap tiles, GeoBoundaries requests, and duplicated loaders were removed.

The default map is a self-hosted geographic coverage overview. Its combined silhouette covers the requested full-country display, including Laâyoune and Dakhla, with no internal dividing line. The small-scale outline comes from the public-domain Natural Earth Admin 0 dataset; provenance is stored in `lib/morocco-outline.json`. This is a geographic overview, not a street-level or cadastral map.

National and Souss-Massa views are available. The coverage page retains its youth/mediator/program layers, commune selection, values, and rollups. SVG points support pointer and keyboard selection. No synthetic counts were added to southern cities: they are geographic reference labels.

Set `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` to enable the Google Maps view. Enable the Maps Embed API for that key and restrict it to the deployment's HTTP referrers. The embed uses `region=ma`, `language=fr`, and a national extent that includes the southern cities. Google's own boundary rendering remains provider-controlled. Without a key, the complete self-hosted overview and an external Google Maps link remain available.

Documentation: [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/embedding-map). Map data: [Natural Earth source dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson).

## Verification

`npm run lint` checks all application code. `npm run test:e2e` builds the production application and runs desktop/mobile tests covering workspace routes, auth modes, invalid URLs, URL-only role navigation, search, favorites, application preparation, caseload notes, appointments, isolated conversations, password validation, map selection, CSV downloads, and the mobile menu.

Final desktop and mobile screenshots are saved under `output/design/`. Release work must follow the repository's GitHub delivery path when publishing is requested.

Final results: production build and TypeScript checks passed, ESLint passed, and the browser suite passed 21 tests with one intentional desktop skip for the mobile-only menu test. The suite checks overflow against the configured viewport width, including mobile browsers that expand their layout viewport when content overflows. It also checks drawer focus cycling, Escape dismissal, focus restoration, and the map container width.

Next.js and its ESLint configuration were upgraded to 16.3.8, with Playwright 1.63.0 and patched transitive dependencies. `npm audit` reported zero vulnerabilities after the dependency updates.
