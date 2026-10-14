# Run 2 — youth, partner and authentication evidence

Implementation is stable. **Youth, partner and authentication independently accepted by Astra.** The coordinating agent confirms the final production build passed compilation, TypeScript and all 63 pages. Original production coverage completed with 152 unique passes and two intentional viewport skips across the interrupted main run and targeted batches. The additional CV production evidence below was verified directly in this scope.

## Actual verification

| Scope | Verified evidence | Remaining gate |
| --- | --- | --- |
| Youth Arabic/RTL | All eight youth routes inspected at 1440×1000, 1366×768, 1024×768, 390×844, 320×568 and 1366×500; loaded Cairo checked; no horizontal document/control clipping. Portalled select/notification menus and story dialog have RTL/Cairo. Profile native validation replaced by accessible Arabic field errors, verified in English and French browser locales. Appointment time isolated in LTR. | Complete; production coverage confirmed by coordinator. |
| Legacy profiles | Every original French goal option tested against its Arabic equivalent. Original names/skills/interests migrate and persist. Personal names, custom goals and freeform notes remain intact. Casablanca remains selectable. | Complete; production coverage confirmed by coordinator. |
| Youth notifications / assistant | Notification read state persists. Assistant uses GSAP with reduced-motion support and shadcn chat primitives. Latest reply bounds verified after multiple preset replies, manual history scrolling and typed submission across six sizes. Input reachable; Escape restores the original trigger focus. Compact launcher in messenger integrated by shell owner. | Complete; production coverage confirmed by coordinator. |
| Youth dashboard / stories / mediator | Full image quote retained with readable overlay. Four portrait story cards, pagination and keyboard viewer navigation work. Lower dashboard rebalanced into independent rows. Mediator avatar remains fixed square with a circular crop. | Complete; production coverage confirmed by coordinator. |
| Youth opportunities / profile / help | Combined Arabic search/type/city/favorite/application filters work. Selected filter labels render immediately. Arabic custom CV chooser validates file type and size locally. Accessible contextual activity labels and normalized Arabic help search. | Complete; production coverage confirmed by coordinator. |
| Authentication, all four roles and four modes | Functional suite passed validation, password visibility, mismatch/focus/error associations, reset behavior and demo-only success without network mutations. Six-size visual matrix generated all 96 role/mode screenshots. Desktop form width is at least 350px and constrained to 390px; sign-in submit fits each tested viewport. PNG logo is RGBA with alpha range 0–255. Existing generated community photo retained, with provenance in `refactor-run-1-assets.md`. | Complete; production coverage confirmed by coordinator. |
| Partner overview | Compact operational introduction replaces the large marketing card. Four KPI cards, referral/detail/capacity/offer/activity cards follow shared platform tokens. Mobile referrals retain labels and reachable actions. Status filters align selected candidates, discard another candidate’s unsaved draft, and show a useful empty state. Associated capacity updates once, survives reload and stays correct if a demo decision changes. | Complete; production coverage confirmed by coordinator. |

## Commands and results

- `npx tsc --noEmit` and scoped ESLint passed after the coordinating agent isolated the separate video project from the app's TypeScript project.
- Youth: original functional suite and the migration/menu/CV checks passed. The final six-size route/reply matrix and both browser-locale validation cases passed together (**8/8**); reduced-motion/focus case passed separately (**1/1**). The current scoped configuration collects **22 tests**. A prior CV test initially matched Next's route announcer as a second alert; it was corrected to the youth-content alert and passed. No product failures remain in the scoped cases.
- Partner/authentication: full suite **14/14 passed**. Following the legacy width/padding/footer correction, final visual/width/navigation matrix **6/6 passed**. Capacity decision/reversal case then passed separately (**1/1**).
- The dev server at `localhost:3000` was reused. This scope did not start servers, build, install dependencies, commit, push, deploy or modify Notion.

## Screenshot artifacts

- Youth: `output/design/run-2/youth/<width>x<height>/` contains the eight route captures and assistant capture for each size.
- Partner/authentication: `output/design/run-2/partner-auth/<width>x<height>/` contains every role/mode and the partner overview for each size.
- Representative captures: `youth/1440x1000/neet.png`, `youth/320x568/assistant.png`, `partner-auth/1366x768/neet-register.png`, `partner-auth/1440x1000/partner-overview.png`, `partner-auth/320x568/partner-overview.png` under that output root.

## Files in this scope

Youth workspace components, `lib/youth-ar.ts`, `app/youth-refactor.css`, `app/neet/loading.tsx`, shared `components/workspace/UI.tsx` (Arabic `/neet/` panel links only), `components/AuthPage.tsx`, `app/auth-refactor.css`, `app/partner/page.tsx`, `app/partner-refactor.css`, and scoped youth/partner/auth tests/configurations. Shared shell, root tokens, route metadata, production build and delivery remain with the coordinating agent.


## Final CV production addendum

A real first-load race was reproduced on the previous production build in desktop and mobile: with Next JavaScript held, the native file control was enabled and accepted `notes.txt`, but its change event happened before React attached its handler, so no Arabic validation appeared after hydration. Normal visible selection after hydration worked.

The control now uses a `useSyncExternalStore` readiness sentinel: the server and hydration snapshots keep it disabled and mark the Arabic label busy; the committed client snapshot enables it. The existing local validation, personal filename and demo-only behavior are preserved. The original direct-file regression waits for the actual enabled control. No arbitrary delay or unrelated form submission was added.

Verified on rebuilt `http://localhost:3102`:

- `PLAYWRIGHT_BASE_URL=http://localhost:3102 npx playwright test --config=tests/youth-cv.config.ts` — **4/4 passed**, most recent run 10.1 seconds. Desktop and mobile cover disabled/busy before JavaScript, enabled afterward, invalid/valid files, visible chooser click, keyboard Tab focus with a 3px outline, keyboard activation, Arabic filename preservation and no mutation requests/uploads.
- The delayed-hydration case was strengthened to press Enter **before any chooser click**, at desktop 1440×1000 and mobile 320×568. Five fresh runs per viewport passed **10/10** in 16.5 seconds.
- The coordinator separately verified the original CV regression on desktop/mobile: **2/2 passed**. Astra independently accepted delayed readiness, native Space keyboard activation, visible selection, focus styling and Arabic/local behavior.
- Astra observed intermittent native Enter file-picker timeouts in its separate automation harness. The exact Enter-first repeated regression above did not reproduce a product fault. This browser/harness limitation is recorded; Space and pointer paths independently passed. The native chooser was retained without another product-code change solely for that automation discrepancy.

Evidence, copied unchanged from the final production run:

- [Desktop keyboard focus](../output/design/run-2/youth/cv-production/desktop-keyboard-focus.png)
- [Desktop selected Arabic PDF](../output/design/run-2/youth/cv-production/desktop-selected.png)
- [Mobile keyboard focus](../output/design/run-2/youth/cv-production/mobile-keyboard-focus.png)
- [Mobile selected Arabic PDF](../output/design/run-2/youth/cv-production/mobile-selected.png)

The only product changes for this addendum are the profile file-control readiness guard in `components/workspace/YouthPages.tsx` and its disabled appearance in `app/youth-refactor.css`. Tests are `tests/youth-cv-readiness.spec.ts`, `tests/youth-cv.config.ts` and the enabled-control assertion in `tests/youth-run2.spec.ts`. The coordinating agent confirms all 27 requirements plus Arabic/RTL are independently approved; there is no remaining CV gate.
