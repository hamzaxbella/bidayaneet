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

The frontend uses labeled demonstration data. The authentication provider was deferred; no real sessions, server-side role enforcement, application submissions, messages, uploads, or account creation are implemented. Local interactions demonstrate the intended flows without sending data to anyone.

## Google Maps

The complete self-hosted coverage overview works without external services. To enable the optional Google Maps view, set this public, referrer-restricted browser key in `.env.local` before starting or building:

```dotenv
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=your_restricted_maps_embed_key
```

Enable the Maps Embed API and restrict the key to your app's domains. Both maps use the shared component with `region=ma` and full-country/Souss-Massa views. No OpenStreetMap or Leaflet resources are loaded.

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

See [the UI refactor notes](docs/ui-refactor.md) for routes, design decisions, map provenance, and the backend integration boundary. The imagegen reference, prompt, and screenshots are saved in `output/design/`. DM Sans is self-hosted under `public/fonts/` with its OFL license; its source is the [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/dmsans).

When production publishing is requested, validate, commit, and push through the configured GitHub delivery pipeline. Do not bypass that pipeline with a hosting-provider deployment.
