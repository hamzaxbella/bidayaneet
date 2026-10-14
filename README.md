# BidayaNeet — Web platform

Next.js 16 web platform for field mediation and youth integration in Souss-Massa. The revised design uses authenticated, role-scoped PostgreSQL data. Android intake is maintained in a separate repository.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Configure `DATABASE_URL` and `APP_ORIGIN` in `.env.local`. Without `DATABASE_URL`, a single local Node.js process uses PGlite in `.data/postgres`. Preserve this folder if it contains dossiers; never use local filesystem storage as a Vercel production database.

For an empty local demonstration database only, set `DEMO_PASSWORD` (at least 12 characters) and run `npm run db:seed`. The seed creates fictional accounts and dossiers and refuses a database that already contains users. Do not seed the existing hosted database.

## Workspaces

- Administration: `/` — dossiers, staff, programs, opportunities, activities, aggregate GPS map, alerts, reports and settings.
- Mediator: `/mediator` — assigned dossiers, review, referrals, nominal journey, notes, appointments and follow-up.
- Partner: `/partner` — owned offers/programs, referral decisions and application feedback.
- Young person: `/neet` — linked profile, private CV, opportunities, applications, journey and messages.

New diagnoses are collected in the mediator Android app. The web platform manages the subsequent process. French/Arabic interfaces and RTL layouts are supported.

## API and persistence

`/api/workspace` exposes authenticated role-scoped reads and commands. Native intake uses bearer authentication at `/api/mobile/intake`. Existing native endpoints remain compatible. Server-side checks protect permissions, consent, capacity and retry identifiers.

Data persists in PostgreSQL, including appointments, notes, programs, memberships, messages, report exports and private CV PDFs (maximum 4 MiB). Password recovery uses administrator-issued, one-use links expiring after one hour. Optional GPS contributes approximate aggregate map cells rather than exposing precise dossier locations.

## Validate and deploy

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

CI runs lint, type checking and the production build. Automated test files were removed from this delivery branch at the project owner's request; they are not part of the current checks.

The current deployment is [bidayaneet.vercel.app](https://bidayaneet.vercel.app), on Vercel with Neon PostgreSQL. Set production environment variables in Vercel; never commit local environment files, database URLs or authentication secrets. See `docs/VERCEL_DEPLOYMENT.md` for deployment guidance.

## Scope and local artifacts

Institutional APIs, SMS and email delivery are not connected. A referral or enrollment is not proof of employment. Seeded stories and offers are demonstration examples. Real outcomes require independent verification.

`output/` contains local presentation artifacts and is ignored. `.env*`, `.data/`, `.vercel/`, build output and dependencies remain local and are excluded from Git. No existing hosted dossiers are deleted by this repository cleanup.
