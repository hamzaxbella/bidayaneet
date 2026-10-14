# Web MVP delivery

Implemented in the local workspace on 2026-10-03, using the repository snapshot `75b4e6335f39a0bbe7f0e9affd1497498578c898` as the starting point. This file supersedes the frontend-only integration status in the original UI refactor notes. `PROJECT_REVIEW.md` records the initial state before implementation.

The current entry is `/platform`; legacy workspace layouts redirect there. Authentication, role-scoped SQL reads/writes, diagnoses, review, partner offers, explainable matching, referrals, activities, attendance, follow-up, appointments, private internal messages, reports and account administration are connected to persistent data.

## Verification

- Production Next.js build and TypeScript: passed.
- ESLint: passed without warnings.
- Playwright: 12 passed, desktop and Pixel 7 viewport, against the production build and a separate seeded test database.
- The main test exercises mobile API registration of a diagnosis, persistence after reload, administrator validation, advisor referral, minimal partner dossier projection, partner acceptance and creation of J+7/J+30 tasks.
- Other tests check professional approval, cross-origin rejection, wrong-role login, foreign dossier denial, youth scope, message privacy, logout revocation, activity capacity, follow-up results, appointment persistence, CSV download, mobile focus restoration and horizontal overflow.
- Runtime dependency audit (`npm audit --omit=dev`): zero vulnerabilities. The full audit reports 5 high findings in the development lint tool chain (braces/fast-glob and dependent packages); the registry currently exposes braces 3.0.3, so no incompatible framework downgrade was applied.
- Browser screenshots: `output/design/platform-desktop.png` and `output/design/platform-mobile.png`. They show the isolated test database after test-created records, not real beneficiaries.

## Demo flow

1. Mediator creates a diagnosis in the mobile app and synchronizes it; the web console lists the received dossier in **Jeunes accompagnés**.
2. Administrator validates the diagnosis. Mediator documents program entry, confirmed activity attendance, observed abilities and the clarified project in **Le parcours nominal**.
3. Mediator reads recommendations informed by the activation results and confirms the young person's agreement before referral.
4. Partner accepts or declines the referral using the minimum shared dossier.
5. Mediator separately records an actual activity start, the host organization, evidence and a planned maintenance verification date.
6. Mediator records dated continued/interrupted activity checks. Continued activity at or after the agreed date confirms maintenance; an earlier check remains progress only.
7. Administrator reviews documented milestones in reports and CSV exports. The current implementation and validation are described in `NOMINAL_PROCESS.md`.

Choose a separate browser profile or private window for each role, or log out before changing roles. The cookie represents one account per browser session.

## Remaining boundaries

This delivery is a local web demo, not an externally published production service. It uses fictional seed data. Local PGlite is persistent but not encrypted and must have a single process. External PostgreSQL support is implemented but was not exercised against a remote database during this delivery. Configure an HTTPS origin, persistent PostgreSQL, backups and the GitHub delivery pipeline for hosting.

Offline collection of new diagnoses and synchronization are now implemented in the `/terrain` PWA; see `ANDROID_OFFLINE.md`. Physical Android validation awaits HTTPS deployment. Partner API integrations, email recovery, certified consent signatures and production legal/security validation are not implemented. Institution logos and simulated offers do not establish partner agreements.
