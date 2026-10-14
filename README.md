# BidayaNeet

A Next.js interface for youth integration, field mediation, regional administration, and program partners in Souss-Massa.

## Run locally

```bash
npm ci
npm run dev
```

Open the workspace directly by URL:

- Youth: `http://localhost:3000/neet`
- Mediator: `http://localhost:3000/mediator`
- Regional admin: `http://localhost:3000/`
- Partner: `http://localhost:3000/partner`

There is no dashboard switcher on the logo. Each role has an auth entry at `/auth/<role>/sign-in`, with registration/access-request, forgot-password, and reset-password screens.

## Integration status

The frontend uses labeled demonstration data. The authentication provider was deferred; no real sessions, server-side role enforcement, application submissions, messages, uploads, or account creation are implemented. The user chose a simulated backend for now: favorites, enrollments, prepared applications, profiles, messages, follow-ups, appointments, referrals, and partner offers persist on the current device through `lib/simulated-backend.ts`. Clearing site storage resets this demo. Local interactions do not send data to anyone.

## Interactive coverage maps

Both map surfaces use MapLibre with pan/zoom, national and Souss-Massa views, coverage selection, and persistent heat controls. The self-hosted combined geometry includes Laâyoune and Dakhla. Esri satellite tiles need internet access; app-hosted coverage data and the accessible commune list remain available. WebGL is needed for canvas rendering. No API key is required by the current tile endpoint.

The `predev` and `prebuild` scripts copy MapLibre's locked worker modules and license into `public/vendor/maplibre/`. These generated assets are ignored by Git and recreated by each build.

## Validate

```bash
npm run lint
npx playwright install chromium
npm run test:e2e
```

The browser suite builds the production app and tests desktop and mobile behavior. To run the production app separately:

```bash
npm run build
npm run start
```

See [Run 2 implementation and validation](docs/refactor-run-2.md) and the [independent acceptance review](docs/refactor-run-2-review.md) for the current changes. The youth portal is Arabic RTL with self-hosted Cairo. All portals retain white/teal styling and rounded navigation; new shadcn controls support creation forms, editing, filters, notifications, and messaging. Both messengers fit the viewport with internal scrolling and a reachable composer. The assistant uses predefined Arabic replies with GSAP animation. [Program image paths and prompts](docs/refactor-run-2-assets.md) and [auth imagery](docs/refactor-run-1-assets.md) document the generated assets. Final review screenshots are saved in `output/design/run-2/final/`.

## Hosted portals

Production is delivered from GitHub's `master` branch to [bidayaneet-ten.vercel.app](https://bidayaneet-ten.vercel.app).

| Portal | Workspace | Sign-in UI |
| --- | --- | --- |
| Regional admin | `/` | `/auth/admin/sign-in` |
| Mediator | `/mediator` | `/auth/mediator/sign-in` |
| Youth | `/neet` | `/auth/neet/sign-in` |
| Partner | `/partner` | `/auth/partner/sign-in` |

The workspace URLs open directly. There are no working account credentials while the authentication provider remains deferred; submitting a valid sign-in form only confirms local form validation.

[Earlier UI refactor notes](docs/ui-refactor.md) retain the restoration history, routes, and backend integration boundary.

When production publishing is requested, validate, commit, and push through the configured GitHub delivery pipeline. Do not bypass that pipeline with a hosting-provider deployment.
