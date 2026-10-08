# UI refinement plan — October 7, 2026

The restored teal and white identity is the starting point. This iteration adds the changes explicitly requested by the user without replacing the whole design.

1. **Navigation:** a rounded white floating sidebar, 10 px from the screen edges; an accessible collapse control on desktop; icon labels and tooltips when collapsed; a mobile drawer with focus management. Apply it to every actor, including partners.
2. **Youth stories:** portrait 9:16 covers, a horizontal snap rail on the dashboard, and a full-screen story viewer with previous/next controls and Escape dismissal. Render available stories as readable narratives; attach actual video only when supplied by the backend.
3. **Micro-actions:** distinct generated backgrounds for CV workshops, interview practice, digital discovery, and personal reflection. Use readable overlays and preserve enrollment controls. Mediator field actions use an itinerary/list composition rather than the youth card grid.
4. **Visual assets:** generate new editorial Moroccan photography for opportunities and story covers, plus original illustrations for the assistant, progress, and action cards. Preserve BidayaNeet and organization logos. Store generated assets in `public/editorial/` and prompts in `output/design/refinement-prompts.json`.
5. **Actor layouts:** youth discovery and short stories; mediator agenda, priorities, and field preparation; partner program showcase and referral pipeline; admin concise regional monitoring and coverage. Shared navigation and form rules stay consistent, while page compositions differ.
6. **Simulated backend:** GitHub was fetched; current `origin/master` has demo fixtures and no API client/server routes. The user explicitly chose simulation for now. Use a shared, device-local repository for favorites, prepared applications, checklists, enrollments, profiles, messages, appointments, notes, referrals, workshop participants, partner offers, and activity. Persist across reloads, keep role and recipient data separate, and label demo actions clearly. Real authentication and server integration remain deferred.
7. **Verification:** production build, lint, meaningful browser checks for collapse, story navigation, enrollments, and existing flows; screenshots at desktop, tablet, and mobile sizes; inspect generated assets and final rendered pages.

Production publication follows the configured GitHub `master` branch to Vercel deployment path.

Implemented and verified: 18 generated assets, distinct actor layouts, shared persistent demo state, floating role navigation, six portrait narratives, and image-backed micro-actions. Production build, TypeScript, and lint passed. Browser suite: 32 passed, two intentional viewport-specific skips. Visual review artifacts use the `refined-` prefix in `output/design/`.
