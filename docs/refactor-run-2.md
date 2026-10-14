# UI refactor rework — run 2

The first completion claim was withdrawn after owner feedback. Repeated implementation and independent review have now resolved the scoped faults. Astra approved all 27 source requirements plus full youth Arabic/RTL on the rebuilt local production preview. The independent review in `refactor-run-2-review.md` preserves the rejection, repair requests and final acceptance evidence.

## Review setup

- Frozen first-pass review checkout: `/home/onobrain/.codex/worktrees/refactor-ui-review/bidayaneet`. It contains the working source changes and new assets from the first attempt, copied before rework.
- Independent reviewer: GPT-6 Astra, low reasoning, as requested for the light review.
- Implementation workers: GPT-6.1 Sol, xhigh reasoning. Workers handle the four portal scopes sequentially within the available agent slots.
- Source: `refactor-run-1-source.md`, original Notion screenshots, and product context from the attached DOCX. Product context does not extend this UI task into a new production backend.

## Shared layout corrections

Messenger routes use one viewport-bound shell. The workspace body is a grid with the actual header height and a remaining content track; its inner messenger owns contact and transcript scrolling. Hard-coded header-height subtraction was removed. The shell tracks visual viewport resizing, including keyboard changes. Mobile messenger headers retain navigation, notifications and a compact assistant trigger without overlapping the composer. Other youth pages keep the floating circular assistant launcher.

The shared shell displays the saved profile city in Arabic. Loading surfaces choose the portal language, including youth auth. Messenger document scrolling is constrained through route-scoped CSS, avoiding conflicting inline scroll-lock cleanup when navigating from the mobile menu.

Youth directional icons now follow the right-side navigation. Menu accessible names match each portal's language. Auth route titles use Arabic for youth and English for admin/partner. Legacy muted text uses the same readable color as the new shadcn controls. Next's documented smooth-scroll attribute preserves immediate route navigation while keeping in-page scrolling smooth.

The separate concurrent `video/bidaya-explainer` project has its own package and TypeScript configuration. The app's TypeScript and ESLint configurations exclude that standalone project; its source and dependencies were not modified by this UI rework.

## Portal corrections

- Youth: known French prototype profiles migrate to Arabic while personal edits remain intact; custom Arabic validation and CV selection remove native English messages; time ranges are isolated in LTR; assistant replies remain visible after animation and manual history scrolling. Dashboard rows, portrait stories and circular avatars were verified at six sizes.
- Mediator: the messenger uses viewport containment, compact auto-growing input, internal scroll, recipient drafts and native localized controls. Search/filter/details, profile choices, follow-up notes, field actions and period-based reporting were verified.
- Admin: dashboard rows and full-width partner cards remove stretched blank areas. Required search/filter/create/edit controls, all full-list dialogs, calendar and profile navigation work. Geographic GeoJSON replaces the coarse SVG-derived map outline. Raster readiness and unavailable/partial imagery states are explicit; heat controls remain usable without tiles.
- Partner/auth: the tall promotional hero becomes a compact operational introduction. Referral selection/filter/draft handling and capacity updates remain correlated and persistent. Auth forms use consistent full-width tracks, localized errors and readable mobile layouts across all sixteen role/mode combinations.

Program image prompts and saved paths are in `refactor-run-2-assets.md`; geographic data attribution is in `map-data-provenance.md`. Detailed portal evidence is in `refactor-run-2-youth-partner-auth.md` and the independent review report.

## Validation standard

Acceptance requires actual visible content and interaction outcomes. DOM presence, a CSS class or an absence of horizontal overflow cannot establish messenger or Arabic completion.

- Messenger: long conversations, internal scrolling, jump-to-latest, actual header/transcript/composer bounds, short screens, resizing, drafts, mobile navigation and keyboard behavior.
- Arabic: all youth routes, known pre-localization saved fixtures, preservation of personal edits, visible and accessible labels, popup fonts/direction, file inputs, invalid-form errors, and isolated LTR identifiers/time ranges.
- Visual quality: balanced dashboard rows, relevant imagery, consistent controls, readable contrast, responsive cards and usable form layouts.
- Functionality: every required list dialog, search/filter/add/edit flow, calendar, map controls and persisted outcomes.

At UI acceptance, changes were local and uncommitted. The owner's subsequent publishing request uses the existing GitHub `master` branch and its production deployment integration; deployment status is verified against the published commit.

## Production gate

Fresh production build passed compilation, TypeScript and generation of 63 pages on 2026-10-14, including the final CV readiness repair. Application-wide ESLint and `git diff --check` passed. The updated preview is served on `http://localhost:3102`.

The original 154-case desktop/mobile regression coverage is complete: **152 unique cases passed and 2 intentional viewport-specific cases skipped**. This is aggregate coverage across runs, not a claim that one uninterrupted suite passed. The main run was terminated before completion; five stale test expectations were corrected for the revised accessible labels, loading fallback, map controls and period-specific CSV name, and their reruns passed. Remaining cases ran in smaller batches. The final mobile youth batch exposed a real pre-hydration CV selection race; its original regression now passes on desktop and mobile after repair.

CV selection is disabled in server-rendered HTML until React attaches its handlers. The Arabic label exposes a temporary busy state and retains visible keyboard focus. Independent Astra checks deliberately held JavaScript loading, then verified native keyboard Space, actual visible file selection, Arabic rejection of invalid files and acceptance of an Arabic-named PDF at desktop and 320px mobile sizes. The added CV readiness and visible-picker/keyboard regression suite passed **4/4** on the fresh production preview. The implementation worker strengthened the first case to use keyboard activation before any click and repeated it five times per viewport: **10/10 passed**. Astra's intermittent native Enter observation is retained in the review rather than omitted; Space, pointer, readiness and file validation independently passed, and Enter passed in the worker's repeated exact flow. No further source change was required for that automation inconsistency.

Final screenshots are in `output/design/run-2/final/`. Messenger geometry was measured with 35 long messages at desktop, short-height and narrow mobile sizes: the transcript stays between the thread header and composer, document size matches the viewport, and only the intended internal surfaces scroll. All 11 full-list dialogs were directly checked, and the 16 authentication role/mode combinations have six-size captures. The frozen first-pass checkout remains attached for comparison.
