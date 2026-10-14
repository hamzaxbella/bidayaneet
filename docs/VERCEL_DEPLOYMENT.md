# Vercel deployment

Production deployment is live at https://bidayaneet.vercel.app. The user explicitly authorized direct Vercel CLI deployment on 2026-10-03; this overrides the earlier GitHub-only delivery instruction for this deployment. The implementation is committed locally on `codex/vercel-deployment`, with no configured remote; the original friend repository still contains the earlier interface. Importing that repository unchanged will not deploy this implementation.

## Git delivery

Publish this code to a repository you can write to (or a branch/PR in the original repo), then import that repository in Vercel. Keep `.env.local`, `.data`, `.next`, `node_modules` and database credentials out of Git. GitHub checks are provided in `.github/workflows/checks.yml`. Require them before merging the production branch; Vercel's Git integration performs deployment from the selected branch. This workflow validates; it does not contain a deployment token.

## Project and database

Use Next.js, root directory `./`, Node.js 24.x, install `npm ci`, build `npm run build`. `vercel.json` supplies framework/build settings. Do not configure a static export: the application requires server routes.

Connect a new dedicated PostgreSQL database via Vercel Storage/Marketplace (for example Neon), or an existing compatible PostgreSQL database. Set `DATABASE_URL` to the provider's SSL-enabled connection URL. The application refuses local PGlite fallback on Vercel. Never disable certificate verification. Use separate databases for Production and Preview.

Set `APP_ORIGIN` in the Production environment to the exact HTTPS application origin (no path/trailing slash). Once Vercel assigns the hostname, save the value and redeploy. Preview needs its own matching origin or no APP_ORIGIN override; do not copy the production override into Preview. Secrets must be server environment variables, never `NEXT_PUBLIC_*`. Environment changes require a new deployment.

## Initialize fictional demo data once

Use an empty database dedicated to the hackathon. From a trusted local shell with `DATABASE_URL` and a new random `DEMO_PASSWORD` set in the environment, run:

```sh
node node_modules/tsx/dist/cli.mjs scripts/seed.ts
```

Do not run the seed during builds or enable a public seed endpoint. It refuses a database with existing users. Choose a fresh password for the hosted demo; the known local demo password is unsuitable for a public deployment. The four emails remain `<role>@bidayaneet.demo`. Verify the database connection and seed before the live demonstration.

## Acceptance checks

- `/api/health` responds 200 with `{"status":"ok"}`; 503 indicates database/setup failure without leaking details.
- Sign in, save a fictional youth diagnosis, refresh and verify persistence.
- Finish administrator validation, mediator referral and partner response.
- Android Chrome: open `/terrain` online, wait for “Prêt hors connexion”, install the PWA, switch to airplane mode, save, close/reopen, reconnect and verify exactly one record in the platform.
- Confirm session cookies are Secure/HttpOnly and external-origin writes fail.

The localhost PGlite demo is not copied to Vercel. Cloud PostgreSQL (Neon Free, Frankfurt), Vercel deployment, four-role login, Secure/HttpOnly cookies, persistence, idempotent retry, admin validation, private referral, partner acceptance, follow-ups and CSRF were verified. One extra fictional verification record was created, bringing the demo to 31 youth records. Physical Android testing and a GitHub push have not been performed. Provisioning provider accounts, permission grants, paid resources or legal terms may need the account owner to complete those steps.

Official references: https://vercel.com/docs/postgres and https://vercel.com/docs/git and https://vercel.com/docs/environment-variables

## Delivered production configuration

Vercel project `zodiacs-projects-e45ae488/bidayaneet`, Node 24, production deployment `dpl_ArkjgiTAzvj2oygrmwT9K7esaCD3`. Neon resource `bidayaneet-db`, free plan, linked only to Production. APP_ORIGIN is the exact public HTTPS origin. Credentials for the four demo roles are saved in ignored `.env.hosted-access.local`; database credentials remain in ignored environment files. No credentials were committed. This is a fictional-data hackathon demo.
