# BidayaNeet UI refactor

## Requested refinements — October 7, 2026

The restored white and teal interface remains the foundation. `app/refinement.css` adds floating, rounded sidebars with 10 px outer margins, persistent desktop collapse, accessible icon labels, and the existing mobile drawer. Partner navigation now opens its referral, program, and activity sections.

Youth stories use six 9:16 portrait covers and a full-screen narrative reader with keyboard navigation, Escape dismissal, and focus restoration. These are still-image stories; no video playback is simulated. Micro-actions have four distinct photographic backgrounds, readable overlays, and persistent selections. The mediator home presents an agenda and priority list, field actions use an itinerary, and the partner home presents a program showcase and referral pipeline. Regional admin retains its data-focused composition.

Eighteen assets were generated with the built-in `image_gen` tool and visually inspected in `output/design/refined-assets-contact-sheet.png`. Final files are in `public/editorial/`; exact prompts and file paths are recorded in `output/design/refinement-prompts.json` and `output/design/refinement-assets.json`. Real organization logos are preserved. Generated photography illustrates demo records and does not depict verified participants.

The user chose a simulated backend for this iteration. `lib/simulated-backend.ts` stores demo state under `bidayaneet.demo.v2.*` in localStorage, updates components within the page, and synchronizes changes across tabs. If storage is unavailable, the demo remains usable in memory. Replace this adapter with the business API when it is supplied.

## Original visual restored — October 7, 2026

The user requested the original appearance after reviewing the broader redesign. `git pull --ff-only origin master` was run before this restoration and reported that the checkout was already up to date at `75b4e63`. The original interface at `cf8b6a3` supplies the visual reference.

White sidebars, bright teal actions, the original font stack, compact admin and partner layouts, and the youth dashboard's profile, assistant, quote, opportunity, and story panels are restored. Completed mediator and youth pages and auth forms follow that same visual style. The original youth portal now lives at `/neet`; `/mediator` retains its dedicated mediator workflows.

Responsive layouts, the keyboard-accessible mobile drawer, useful dashboard search, URL-only role access, completed page flows, auth screens, and the map replacement remain. The restoration changes presentation without reverting these features.

`app/original-youth.css` scopes the original youth styles. `app/original-theme.css` restores shared colors, navigation, typography, cards, and headers across the workspaces. Original screenshots are saved in `output/design/`: `neet-before.png`, `admin-before.png`, and `partner-before.png`. Restoration screenshots use the `restored-` prefix.

The earlier imagegen proposal, `output/design/dashboard-concept.png`, and its prompt remain as historical design artifacts. That proposal is no longer the visual direction for the application.

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

- Youth favorites, prepared applications, checklists, workshop selections, and youth/mediator profiles persist on the current device across navigation and reloads.
- Messages, follow-up notes, appointments, participant lists, mediator referrals, partner referrals/offers, and activity logs also persist locally. They do not send notifications, submit applications, create accounts, or persist to a server.
- CV selection validates PDF type and the 5 MB limit locally; it does not upload a file.
- CSV exports produce real UTF-8 downloads and escape potential spreadsheet formula cells.
- Loading, empty, validation, error, and not-found states are included.

Before using real accounts, connect an authentication provider, enforce role authorization on the server and data layer, and replace the demo fixtures with the business API. The demo repository models UI state; real accounts, authorization, and network delivery remain separate integration tasks.

## Maps

Both map surfaces use `components/MoroccoMap.tsx`. All Leaflet scripts, OpenStreetMap tiles, GeoBoundaries requests, and duplicated loaders were removed.

The default map is a self-hosted geographic coverage overview. Its combined silhouette covers the requested full-country display, including Laâyoune and Dakhla, with no internal dividing line. The small-scale outline comes from the public-domain Natural Earth Admin 0 dataset; provenance is stored in `lib/morocco-outline.json`. This is a geographic overview, not a street-level or cadastral map.

National and Souss-Massa views are available. The coverage page retains its youth/mediator/program layers, commune selection, values, and rollups. SVG points support pointer and keyboard selection. No synthetic counts were added to southern cities: they are geographic reference labels.

Set `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` to enable the Google Maps view. Enable the Maps Embed API for that key and restrict it to the deployment's HTTP referrers. The embed uses `region=ma`, `language=fr`, and a national extent that includes the southern cities. Google's own boundary rendering remains provider-controlled. Without a key, the complete self-hosted overview and an external Google Maps link remain available.

Documentation: [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/embedding-map). Map data: [Natural Earth source dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson).

## Verification

`npm run lint` checks all application code. `npm run test:e2e` builds the production application and runs desktop/mobile tests covering workspace routes, auth modes, invalid URLs, URL-only role navigation, search, favorites, application preparation, caseload notes, appointments, isolated conversations, password validation, map selection, CSV downloads, and the mobile menu.

Final desktop and mobile screenshots are saved under `output/design/`. Release work must follow the repository's GitHub delivery path when publishing is requested.

The suite checks overflow against the configured viewport width, including mobile browsers that expand their layout viewport when content overflows. It also checks the restored youth panels and dashboard search, drawer focus cycling, Escape dismissal, focus restoration, and the map container width.

Restoration validation: the production build and TypeScript checks passed, ESLint passed, and the desktop/mobile browser suite passed 23 tests with one intentional desktop skip for the mobile-only menu test. All 30 workspace routes and 16 auth screens were checked.

Next.js and its ESLint configuration were upgraded to 16.3.8, with Playwright 1.63.0 and patched transitive dependencies. `npm audit` reported zero vulnerabilities after the dependency updates.

Refinement validation: the production build and TypeScript checks passed; ESLint passed without warnings; the desktop/mobile suite passed 32 tests, with two intentional skips for controls specific to the other viewport. Checks include all 30 workspace routes and 16 auth screens, persistent role profiles and greetings, isolated messages and dossier notes, appointments, referrals, enrollments, desktop sidebar collapse, story opening focus, navigation, dismissal, and focus restoration.

Final refinement screenshots use `refined-<page>-desktop.png`, `refined-<page>-tablet.png`, and `refined-<page>-mobile.png` for youth home, stories, micro-actions, mediator home/field actions, partner, and admin. Additional captures show the story viewer, collapsed sidebar, and phone navigation. Screens were reviewed at 1440, 1024, and 390 px; lazy images were loaded and chart animations settled before capturing. No horizontal page overflow was found.
