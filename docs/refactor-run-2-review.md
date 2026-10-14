# Independent review gate — run 2

Status: **APPROVED — all 27 original UI requirements plus Arabic/RTL; final CV readiness, visible chooser and native keyboard Space flows independently verified on fresh production.** See the final acceptance section. Earlier sections preserve the baseline rejection and repair history.

Scope: source task `docs/refactor-run-1-source.md`, all 27 checkboxes plus full Arabic/RTL requirement. Baseline isolated app `localhost:3102`. Evidence captured with isolated Chromium at 1440×1000, 1366×768, 1024×768, 390×844, 320×568, and 1366×500. Full route captures at 1440 and 390; messenger at every size. Raw DOM/rect/control evidence: `/tmp/review-audit.json`, `/tmp/review-interactions.json`. Screenshots `/tmp/audit-*.png`, `/tmp/dialog-*.png`.

## Confirmed blockers and required improvements

1. **Messenger scroll viewport overlaps its own header at short heights.** At 1366×500, both roles' `[role=log]` starts y=39 while thread header ends y=156. At 320×568 mediator log starts y=1, youth y=51, while header ends y=138. First message is visibly clipped beneath header. Evidence `/tmp/audit-_mediator_messages-1366x500.png`, `/tmp/audit-_neet_messages-320x568.png`. Correct the height chain and constrain only the internal message viewport; test actual element bounds after long messages and resizing.
2. **Arabic completeness fails.** `/neet/journey` visibly contains `Tout voir`; `/neet/profile` native file input visibly contains `Choose File / No file chosen`; messenger scroll button has English `Scroll to end` screen-reader text. Known legacy profile strings are read directly from persisted state without migration in baseline. Number/date convention not centralized (Western digits throughout). User-entered names must be preserved while known prototype fixtures migrate.
3. **Messenger wastes vertical space.** Composer is 171–187px tall, even when empty. Compact input/send layout needed. Chatbot launcher overlaps mobile disclaimer; desktop document height is viewport +1px at all measured sizes. Main shell still reads as large inset rounded container; acceptable rounding should follow shared workspace while content fills every available pixel.
4. **Dashboard density/coherence needs correction.** Admin chart stretches to tall map, creating roughly 300px blank chart-card space. Partner grid leaves a large blank right column below retention. Youth dashboard has similarly unbalanced blank space beside tall microactions. Use balanced row composition and chart sizing rather than stretched card blanks.
5. **Program imagery is repetitive and often unrelated.** Same workshop image for ANAPEC/Local Internships/OFPPT/Economic Inclusion; café/service image reused for unrelated agriculture/tourism programs. Better visual relevance and deliberate crops needed.

An initial immediate screenshot showed blank messenger before hydration; later delayed screenshots show messages. This is not counted as a persistent blocker.

## Requirement-by-requirement baseline assessment

“Partial” means something is implemented but insufficient to approve. “Observed” is limited to actual inspection and does not imply all state paths passed. No checkbox is granted final approval until revised implementation review.

| # | Requirement | Baseline evidence / disposition |
|---|---|---|
| 1 | All admin layouts rounded whole-content container | Observed on overview/programs/NEETs/mediators/opportunities/microactions/heatmap. Shared white shell wraps content. |
| 2 | All View all actions open blurred shadcn full lists | Partial: controls and dialog implementation/tests exist; mobile creation dialogs confirmed blur; exhaustive View all interaction still pending. |
| 3 | Dashboard real editable geographic heatmap | Observed MapLibre canvas, full requested outline, controls. Editing behavior needs final direct check. |
| 4 | Partner logo cards left logo/name, larger count, unified width/height/CTA | Observed; final dashboard composition still has major empty space. |
| 5 | Better program images, clear unified cards | Partial: unified cards, repeated unrelated imagery as above. |
| 6 | Add program multistep shadcn popup | Observed opening at 390px, 3 stages, labels, Next/Cancel, blur, fits viewport. Creation/edit tests exist, independent final persistence check pending. |
| 7 | Single program info/edit page | Implemented routes and edit test inspected; final direct interaction pending. |
| 8 | NEET search/filter/add functional shadcn | Implemented tests cover combined filters and creation; mobile add popup directly observed. Final direct persistence check pending. |
| 9 | Shared pipeline/blocker components | Visually consistent on overview and NEET directory; source review needed for exact reuse. |
| 10 | Modern icons, clearer profile spotlight, working View all | Spotlight visually clearer, Lucide-style icons; all action behavior pending. |
| 11 | Mediator multistep form | Popup directly opened at 390px; 3 stages and accessible labels observed. |
| 12 | Opportunity multistep form | Popup directly opened at 390px; 3 stages, required fields observed. |
| 13 | Microaction multistep form | Popup directly opened at 390px; 3 stages, required fields observed. |
| 14 | Interactive calendar, microaction profile/edit popup | Existing tests exercise navigation/day/edit; screenshot captured. Final direct editing pending. |
| 15 | Dedicated real editable full map | Map screenshot/canvas observed, interaction verification pending. |
| 16 | Mediator searches/filters/actions all work with shadcn | Tests cover representative caseload, activities, opportunity, appointment actions; not exhaustive proof of “all”. |
| 17 | Terrain cards shadcn alternative | Implementation/tests exist, final visual comparison pending. |
| 18 | Mediator full-page messenger without page title | **FAIL** short-height overlap and oversized composer. No page intro/title observed; composer reachable in baseline captures. |
| 19 | Youth bell shadcn notification menu | Directly opened. Portal computed `Cairo, sans-serif`, `direction:rtl`; Arabic entries. |
| 20 | GSAP chatbot, dashboard trigger, always-accessible circular launcher | Implemented/tests cover both triggers and replies; launcher overlaps mobile messenger disclaimer. Final motion/short-height check pending. |
| 21 | Full-image stylized quote card | Observed full image and overlaid Arabic quote; contrast satisfactory in baseline screenshot. |
| 22 | Four larger social-story cards | Four observed on desktop; portrait format, overlay text, navigation. Final mobile count/layout interaction pending. |
| 23 | Mediator card and circular avatar | Circle observed; dashboard placement/empty-space balance could improve. |
| 24 | Youth opportunities shadcn working search/filter | Arabic cards/filters observed, tests cover composition, final direct interaction pending. |
| 25 | Youth full-page messenger without page title | **FAIL** same short-height geometry plus English accessible scroll control. |
| 26 | All auth pages polished, transparent PNG, contrast/generated imagery | Correct routes use `/auth/{role}/sign-in`. Arabic youth sign-in and partner mobile captured. Full role/mode visual pass pending. Wrong `/login` mode returns expected not-found, not a bug. |
| 27 | Partner overview matches design system | Observed shared shell/teal/navy typography. Hero is very tall (~450px) and pushes working referral tools down; consider compact operational introduction. |
| Arabic | Entire youth portal Arabic RTL/Cairo, right nav | RTL/right nav/Cairo largely pass on fresh state; **FAIL** residual strings, native chooser, persisted profile coverage and accessible system control. |

## Why prior tests cannot justify Done

Messenger tests check a CSS class, absence of page intro, DOM text presence/persistence, and horizontal document width. They do not assert message viewport position, clipping, vertical document fit, composer geometry, internal scroll ownership, short-height behavior, browser zoom/keyboard resize, or visual quality. Arabic test checks shell `lang/dir`, four reel nodes and some translated strings; it does not audit all routes, portals, native controls, accessible labels, persisted pre-localization fixtures, or invalid-form messages. Functional success does not establish visual completion.

### Additional functional verification during baseline review

Executed original admin/map/auth/partner tests against isolated baseline on port 3102 at 1366×768 without a production build. Confirmed passing: five dashboard View all dialogs, program creation/validation/edit/reload, NEET combined filters/create/profile, mediator and opportunity creation/reload, map heat control persistence and point selection, four roles' auth validation, and partner referral filtering/keyboard selection. These add functional evidence to rows 2, 3, 6–8, 11–12, 15, 26–27 but do not resolve visual blockers.

Additional visual concerns: dedicated heatmap panel has ~364px blank area below map; rendered baseline map has uniform teal background with coarse geographic outline despite Esri attribution—verify raster tiles actually arrive before calling this a visually completed real-map replacement. Notification portal font/direction measured Cairo/RTL. Mobile auth is coherent and legible; role sign-in screenshot evidence `/tmp/auth-partner.png`, `/tmp/auth-neet.png`.

## Revised development review — mediator/messenger accepted, youth pending

Independently reran 12 current mediator + messenger tests against port3000: **12 passed**. Own live screenshot/rect matrix at1440×1000,1366×768,1024×768,390×844,320×568,1366×500 confirms exact viewport-sized document, log below thread header and above composer, composer89–106px and entirely reachable. Long-message tests also cover390×450 and320×360,35long messages, horizontal wrapping, internal scroll/latest jump, keyboard input, mobile back, recipient isolation and persisted drafts. Own evidence `/tmp/revised-audit.json` and `/tmp/revised-audit-*-messages-*.png` (actual file names use underscores in route).

Current terrain/caseload dropdown labels independently verified at1440,390,320; no horizontal overflow; participant choices visible. Evidence `/tmp/reviewer-live.json` and `/tmp/reviewer-live-_mediator_*.png`. Mediator overview/terrain visual hierarchy is coherent. **Rows16–18 and25 scoped revised acceptance passes**, subject to final production regression. Global review not approved yet.

Arabic improvements observed: profile upload has Arabic chooser; journey no longer leaks Tout voir; institutional names translated; fresh page text/accessibility labels across all youth routes contain no non-Arabic system copy except brand/PDF. Right sidebar bounds correct on real viewport (earlier fullpage screenshot displacement was a capture artifact). Arabic story/notification/filter portals retain Cairo/RTL. Legacy fixture migration and personal-data preservation passed independently. Western digits with Arabic month names are acceptable Moroccan locale conventions; Eastern digits are not a source requirement.

**New youth blocker:** at320×568 after submitting predefined “أحتاج إلى توجيه” and waiting1.5s, newest assistant reply bottom368.42 extends below scroller bottom291.86; scrollTop42 vs maximum118. User sees only opening lines until manually jumping. Screenshot `/tmp/reviewer-assistant320.png`. Current test asserts DOM reply text and dialog bounds, not reply readability. Asked owner to anchor latest reply/scroll to end and verify last bubble geometry after animation.

Second revised youth blocker: submitting empty profile first name produces native browser validation `Please fill out this field.` independently confirmed by `HTMLInputElement.validationMessage`; screenshot `/tmp/reviewer-profile-validation.png`. Required/name/email errors need Arabic custom validation with accessible field associations. Youth regression run:17pass/1failure from ambiguous CV alert selector matching Next route announcer (selector was being scoped during run; this is test timing/selector coverage, not evidence upload behavior is broken).

Third revised youth issue: appointment range `10:00 – 11:00` visually reverses under RTL to `11:00 – 10:00`. Observed in320px opportunity detail and1024px journey screenshots. Isolate time range with LTR bidi semantics. Four portrait stories, full-image quote, circular mediator image, card hierarchy and filter layout otherwise visually coherent across requested five sizes.

### Youth revised acceptance after three requested repairs

**Rows19–25 and full Arabic/RTL requirement pass scoped revised development acceptance.** Independent targeted rerun4/4pass:320px all routes/assistant; CV chooser; profile and all youth auth-mode Arabic errors under en-US and fr-FR browser locales. Other17youth cases passed earlier. Own320px assistant screenshot now shows complete latest answer:scrollTop118=max118; bubble bottom292.42 vs viewport291.86 (subpixel tolerance). Profile screenshot shows Arabic inline required error, field focus and invalid state; form uses noValidate so native English validity strings are not surfaced. Updated320px journey screenshot visually reads10:00–11:00 correctly. Evidence `/tmp/reviewer-assistant320.png`, `/tmp/reviewer-profile-validation.png`, `output/design/run-2/youth/320x568/neet-journey.png`.

No remaining youth or mediator blocker observed. Global gate remains pending revised admin/partner review and final fresh production-server regression. Current acceptance is specifically development-state evidence and must not be represented as final deployed approval.

### Admin source coverage and scope boundaries

Exact component reuse requirement9 source-proven: both `app/(admin)/page.tsx` and `app/(admin)/neets/page.tsx` import/render the same `PipelineCard` and `BlockersCard` from `components/admin/AdminUI.tsx`. Blockers expanded modal renders all6records while preview renders4. Dashboard full lists map actual complete persisted NEET/program/mediator arrays; retention shows all3periods. Program detail supports direct route and persisted editing; edit capacity minimum is existing enrollment. Microaction edit has equivalent minimum and moves calendar to saved action date.

Existing admin reports exports/customize/downloads, alerts rules/read/dismiss, and settings invite/configure actions have absent handlers. These are **outside the original explicit all-controls requirement**, which applies to mediator portal. They do not block this scoped UI acceptance but prevent claiming all application actions work. No real invitation/security/backend expansion is required. Admin mediator directory filter buttons also remain a usability concern to owner, although the original checkbox specifically requests its add form.

### Full-list requirement directly completed

All11admin ViewAll instances exercised at320×568: overview5, NEET directory4, programs1, microactions1. Every dialog populated the full underlying list; all were≤500px high within568px viewport, horizontally contained, internally scrollable where needed, Escape-dismissable, and restored focus to their trigger. Counts:8NEETs,6blockers,13programs,6mediators,3retention periods,5activities,6opportunities,6microactions. Own evidence `/tmp/reviewer-all-dialogs.json`, `/tmp/reviewer-micro-dialog.json`, `/tmp/reviewer-dialog-*.png`. Requirement2/10expanded-list behavior now directly verified beyond representative tests.

Auth logo file independently verified: `public/logo.png`, RGBA547×396, alpha extrema0–255; actual transparent PNG. New partner overview visually replaces oversized hero with compact operational banner and shared cards, improving access to referral tools.

### Partner/auth revised acceptance

**Requirements26–27 pass scoped development acceptance.** Independent14/14test run:16auth role/mode combinations across1440×1000,1366×768,1024×768,390×844,320×568,1366×500; fields horizontally contained, sign-in submit reachable, role locale correct, keyboard recovery links work, validation does not imply real backend authentication. Arabic desktop form was initially too narrow (~250px); reviewer requested consistency and final screenshots show390px. Visual review of desktop/mobile/short-height auth confirms readable contrast, generated imagery, transparent logo, simple forms.

Partner current screenshot shows compact~210px intro, unified KPIs/referral/capacity cards and responsive candidate controls. Independent functional runs verify referral selection/filter context, feedback draft separation, capacity updates exactly once on acceptance/reversal/reload, opportunity validation/persistence. Evidence `output/design/run-2/partner-auth/<viewport>/` regenerated by independent run. Global gate remains pending stable revised admin and final production-server check.

## Final fresh-production acceptance

**APPROVED for the original 27 UI requirements and full youth Arabic/RTL requirement. The final narrow-map repair has now passed rebuilt-production verification.** This supersedes the historical baseline rejection above. Final image inspection identified one narrow-map chip clipping issue after the main tests passed. Approval covers the local fresh production preview on port 3102; it is not a claim that a remote production deployment has occurred.

Independent remaining admin run: **6/6 passed on fresh production** (2.3 minutes): all scoped full-list dialogs/focus; mediator/opportunity filters and edit/capacity validation; requested viewport/card geometry; map worker/heat persistence; dashboard map bounds; actual image raster loading and blocked-basemap disclosure. The first six revised admin cases had already passed independently on stable development: dashboard lists, program create/edit/reload, NEET filtering/create/profile, mediator/opportunity creation, calendar/create/edit persistence, selected-period export/profile action. All 12 are now independently covered.

Final production captures and measurements: `output/design/run-2/final/`, raw `/tmp/final-review.json`. Thirty-two screen records at 1440×1000, 1366×500, 390×844 and 320×568 show no horizontal document overflow. Both messenger roles contain 35 long messages: document width/height exactly match viewport, header bottom equals conversation top, conversation bottom equals composer top, and composer remains visible. At 320×568 youth composer occupies y473–568 and mediator y462–568. At 1366×500 youth composer occupies y400–489 and mediator y400.5–489. The shared 22px desktop sidebar/content radius is directly measured. Desktop dashboard no longer stretches the chart into the map height; geographic raster and union outline are visible. Program cards use relevant varied imagery and consistent hierarchy. Mobile pages stack coherently.

Production Arabic evidence: `arabic-assistant-320.png`, `arabic-notifications-320.png`, `arabic-select-320.png`, `arabic-form-errors-390.png`. Notification/select/assistant portals compute Cairo and RTL. Assistant scrollTop118 equals its maximum118 after a preset reply, with the entire latest answer visible. Empty profile first name shows Arabic inline validation, focuses the field, sets aria-invalid and disables native browser validation. Youth title/description are Arabic. Root HTML retains shared French language metadata, while the complete youth workspace, auth and detached portals explicitly override their language/direction to Arabic/RTL; this correctly scopes their content. Dates/time ranges retain verified readable bidi ordering. Known stored demo profiles migrate; personal content is preserved.

### Final disposition of every source requirement

| # | Result | Direct observation or source-proven evidence |
|---|---|---|
| 1 | PASS | Whole white content container; matching 22px desktop sidebar radius; all requested responsive widths; reports/alerts/settings layout inspected. |
| 2 | PASS | All 11 View all triggers directly opened; complete lists, blur, internal scrolling, Escape and focus return. |
| 3 | PASS | Dashboard real raster map, requested continuous coverage outline, editable heat controls and persistence; failed-basemap feedback tested. |
| 4 | PASS | Six partner cards: left logo/name, larger opportunity count, unified teal actions, equal row sizing and responsive grid. |
| 5 | PASS | Program imagery replaced/varied by context; unified card layout and deliberate crops visually reviewed. |
| 6 | PASS | Program shadcn multistep creation, required validation, completion and reload persistence. |
| 7 | PASS | Dedicated program details route and edit flow, including capacity validation and saved reload. |
| 8 | PASS | NEET search and combined filters, shadcn controls, creation and persisted profile opening. |
| 9 | PASS | Overview and NEET directory import the identical PipelineCard and BlockersCard implementations. |
| 10 | PASS | Modern icons, clear profile spotlight, correct profile action and full-list dialogs. |
| 11 | PASS | Mediator multistep form, required fields and persisted creation. |
| 12 | PASS | Opportunity multistep form, required fields and persisted creation. |
| 13 | PASS | Microaction multistep form, validation and persisted creation. |
| 14 | PASS | Calendar navigation/day selection; dedicated detail/edit dialog updates action and date. |
| 15 | PASS | Dedicated responsive geographic map: actual raster, zoom/coverage/heat interaction, storage and failure feedback. |
| 16 | PASS | Mediator workflow interactions: searches/filters, caseload/profile/follow-up, activity, opportunities, appointments, reports and messages; independently rerun workflow suite plus direct dropdown checks. |
| 17 | PASS | Shared shadcn terrain cards, responsive footers and operational actions; desktop/mobile visual inspection. |
| 18 | PASS | Mediator messenger fills content workspace without page title; long-message internal scrolling, drafts, keyboard, mobile navigation and exact production viewport geometry. |
| 19 | PASS | Bell opens Arabic shadcn notification menu; mark-read behavior and portal Cairo/RTL. |
| 20 | PASS | Dashboard/always-accessible assistant triggers, GSAP panel, preset/freeform replies, complete latest answer, focus and short-height layout. |
| 21 | PASS | Full-image motivational quote card with legible stylized Arabic overlay. |
| 22 | PASS | Four larger portrait story cards, interactive story viewer and keyboard navigation. |
| 23 | PASS | Balanced mediator card with circular avatar; screenshot inspection across responsive layouts. |
| 24 | PASS | Arabic opportunity cards, shadcn controls and combined search/type/city filters; selection and application persistence. |
| 25 | PASS | Youth messenger fills content workspace without page title; Arabic accessibility strings and exact production viewport geometry. |
| 26 | PASS | All 16 auth role/mode combinations over six sizes, transparent PNG confirmed, generated imagery, contrast, consistent fields, validation/recovery navigation. |
| 27 | PASS | Compact partner operational overview matches shared typography/cards/colors; responsive referral and capacity interactions verified. |
| Arabic | PASS | Youth routes, auth, stored fixture migration, labels/errors/placeholders, menus/dialogs, RTL/right navigation, Cairo, dates/time bidi, stories and assistant reviewed. |

### Limits of this acceptance

This is a demo UI with local persistence and simulated messaging/authentication, not verified backend delivery. Existing admin reports/alerts/settings action stubs remain outside the explicit mediator all-controls requirement. Do not claim all application controls have production backend behavior. Network-dependent basemap availability can vary; its visible loading/error handling has been verified. Western digits with Arabic locale copy are accepted; converting user-entered personal content was deliberately avoided. Offscreen lazy images may be absent in a full-page screenshot until scrolled into view and must not be classified as broken solely from that capture.

Final visual follow-up: at320px the dedicated map Mapped Communes two-column chips clip commune names and numeric values. Requested a single-column narrow layout or shrink-safe numeric spans; pending direct re-observation. All offscreen program/youth images were scrolled into view and loaded successfully (`/tmp/final-images.json`).

First map chip repair directly rechecked on development at320px: all12values fit, but Taroudant broke into a lone final letter. Requested single-column layout below380px to preserve readable commune names. Final production recheck remains pending this refinement.

Final map refinement verified on development: <=380px uses one-column 44px rows; all 12 cells have scrollWidth=clientWidth246px at320 viewport. Full Taroudant, Oulad Teima and Ait Melloul names and all values are legible. Screenshot `output/design/run-2/final/heatmap-communes-fixed-320.png`. Source is accepted; only rebuilt production CSS confirmation is outstanding.

### Final production CSS gate closed

Re-observed the rebuilt production preview at `http://localhost:3102/heatmap`, 320×568. All 12 commune rows use the intended single-column 44px layout; every cell has scrollWidth=clientWidth246px, and each numeric value is contained. Full Taroudant, Oulad Teima and Ait Melloul names are visibly intact. Final screenshot `output/design/run-2/final/heatmap-communes-fixed-320.png` now records the production build, replacing the development capture. **Overall scoped independent acceptance: APPROVED.** Earlier evidence for all27 requirements and Arabic/RTL remains valid; no scoped visual blocker remains. Parent-owned broader regression reruns are separate from this review and should be reported with their actual outcomes.

### Newly exposed CV upload edge — gate reopened

Parent final mobile youth batch passed21/22; direct hidden-file assignment immediately after navigation did not produce the expected Arabic invalid-file error/document state. Desktop passed. Possible pre-hydration event loss is not yet established. Owner is checking the actual visible file chooser flow and readiness. Overall gate remains pending independent verification of this case; all prior27+Arabic visual and geometry evidence remains accepted.

### Independent CV repair verification

Fresh production3102 independently tested at1440×1000 and320×568 with JavaScript requests deliberately held. The server-rendered file input is disabled and its visible label is aria-busy until hydration; after release it becomes enabled and busy clears. Tab from Save reaches the input and produces a visible3px focus outline. Native **Space** activation opens the chooser; `notes.txt` produces the Arabic PDF/size error. Clicking the visible label then selecting `سيرتي الشخصية.pdf` displays its name and the Arabic local-selection confirmation and clears the error. Cairo/RTL,44px control height, and document width containment pass both viewports. Screenshots `output/design/run-2/final/cv-invalid-keyboard-{1440,320}.png` and `cv-valid-visible-{1440,320}.png`; raw result `/tmp/reviewer-cv-final.json`.

Enter activation was inconsistent in a custom isolated Chromium script (one desktop success, two timeouts across runs); the exact same first-keyboard flow using native Space passed both sizes. The upload readiness and Arabic validation behavior is verified through both native keyboard Space and visible chooser. Enter behavior remains a harness/platform observation under owner investigation, not evidence of a lost upload handler after the readiness repair.

### Overall gate closed after CV repair

**APPROVED.** The newly exposed pre-hydration upload edge is resolved by the disabled-until-ready control and passes independent delayed-hydration desktop/mobile verification. Actual visible file chooser and native keyboard Space flows both work, with Arabic invalid-file validation and Arabic-named PDF selection. No scoped acceptance blocker remains. Prior rejection and subsequent repair evidence are retained above. This approval does not claim every automation case passed in one uninterrupted suite; parent should report its aggregate regression results separately and accurately.
