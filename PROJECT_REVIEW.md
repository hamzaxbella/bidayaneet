# BidayaNeet — initial review

Reviewed on 2026-10-03. Repository snapshot: `75b4e6335f39a0bbe7f0e9affd1497498578c898` (`master`). Read-only checkout: `/tmp/bidayaneet-review`.

## Sources reviewed

- https://github.com/hamzaxbella/bidayaneet — source, README, AGENTS.md, integration notes, role routes and selected state components.
- https://drive.google.com/drive/folders/1DtwzBMyNtqHeRvs0WdMr85yikPvTD9ho — MVP scope (5 pages), detailed conception (40-page viewer), technical audit (3 pages), coaching guide (10 slides), original pitch (9 slides), architecture image. The remaining text file points to the same repository.

## Product

A human-led outreach and integration service for young people outside employment, education and training, initially in Souss-Massa. Field mediators find and diagnose young people, collect consent, recommend local activation activities, orient them toward partner opportunities and follow their progress. The first MVP's primary user is the field mediator; a young person does not need to install an app.

Profiles: A = ready for employment; B = needs qualification; C = distant from employment with significant barriers. Classification can evolve and does not determine access to support.

## Current implementation

Next.js 16.3.8, React 19.2.4, TypeScript, Tailwind 4, Recharts, Lucide, Playwright. Four web workspaces: youth `/neet`, mediator `/mediator`, regional administration `/`, partner `/partner`. Auth screens exist at `/auth/<role>/<mode>`.

The frontend has demonstration dashboards, caseloads, opportunities, appointments, messages, reports and maps. README explicitly says there are no real sessions, server-side role enforcement, submissions, messaging, uploads or account creation. Selected components confirm in-memory UI state and static demo fixtures. No mobile Expo app, backend API or persistent business database was found in this repository snapshot.

Repository notes report previously passing build/lint/browser checks. These were not rerun during this read-only review; no runtime verification is claimed.

## Required demonstration

1. On a real phone, open the mediator tool with no network and register a fictional young person: consent, identity/contact, situation, constraints, skills, aspirations and proposed A/B/C profile.
2. Keep the record locally, including after closing/reopening the tool; show pending synchronization.
3. Restore the network and synchronize to a real database without duplicate creation on retries.
4. Show the new record in the mediation console, with completeness/consent/duplicate checks and validation.
5. Recommend an activation activity and 2–3 partner pathways using transparent eligibility and scoring rules.
6. Record the advisor decision and young person's agreement; update the follow-up dashboard.

Demo data target: approximately 30 fictional young people, 12 activities, 10 partner offers, plus coherent follow-up history. Record a backup video showing both phone and console.

## Implementation priorities

- P1: confirm any backend/mobile work outside this repository, actual final deadline and target phone platform.
- P1: durable data model, API, authentication and server/data-level role permissions.
- P1: offline diagnostic, protected local storage, consent evidence, synchronization queue, retry idempotency and explicit conflict handling.
- P1: connect the mediator console and implement explainable rules-based matching with human validation.
- P2: seed coherent demo data, follow-up flags, funnel metrics and complete the end-to-end phone test.
- P2: reconcile documents and presentation with actual delivered behavior; rehearse and record the fallback.

## Scope and claims

Proposed architecture in the conception: Expo/React Native with encrypted SQLite, Next.js console and PostgreSQL. MVP scope also names Laravel as an internal skill, but no Laravel implementation was found here. Final backend choice should take existing work and available time into account.

Partner offers and historical data are simulated. Live institutional APIs, ML matching and predictive models belong to the roadmap. Proposed institutional sponsorship should not be presented as confirmed without evidence. Security/conformity claims in the original pitch are not established by the current frontend.

The July final date in older documents is stale relative to this review; the coaching file was modified in September. Obtain the actual deadline before scheduling delivery.

## Subsequent implementation

The review above records the initial frontend-only snapshot. A working web MVP has since been implemented in this workspace. See [the delivery record](docs/WEB_MVP_DELIVERY.md) and [current setup instructions](README.md) for features, verification and remaining boundaries. Android offline work remains deferred.
