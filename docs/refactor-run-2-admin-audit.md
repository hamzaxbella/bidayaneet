# Admin refactor acceptance evidence

Scope follows the Admin Portal requirements in `refactor-run-1-source.md`: whole-page shared surface; dashboard full-list dialogs, geography and partner cards; program imagery/create/detail/edit; NEET search/filters/create/spotlight and exact reused pipeline/blockers; mediator and opportunity creation; micro-action create/calendar/profile/edit; dedicated editable map.

The dashboard now uses a chart/funnel stack beside the geographic map, a compact directory beside blockers, a full-width partner grid, and a separate activity/retention row. Card height follows content rather than stretching to a taller neighbour. The dedicated map has its own responsive grid and no empty lower card region.

Program covers use four generated subject-specific assets plus existing career-guidance, digital, community and visitor-route imagery. Crops and alt text describe the scene. Generated asset prompts and provenance are in `refactor-run-2-assets.md`. The geographic perimeter uses actual Natural Earth longitude/latitude data; source and dissolve procedure are in `map-data-provenance.md`.

All View all controls in the scoped pages use blurred, accessible shadcn dialogs with complete lists. PipelineCard and BlockersCard are imported unchanged by both overview and NEET directory. Searches and filters compose and reset; profile links select the requested record. Program, mediator, opportunity and action forms validate, retain values across steps, review before saving and preserve local data. Existing mediator filter placeholders now work, and mediator/opportunity detail editing is available. Calendar day/month selection and capacity-aware editing remain functional. The chart export contains the selected reporting months.

The map renders Esri satellite imagery through MapLibre, with verified image responses and decoded raster readiness. Geographic coverage and heat controls remain available when external tiles fail. Loading, partial failure and total failure have distinct feedback. English admin controls and optional French locale are supported.

Regression coverage: `tests/admin-refactor.spec.ts` and `tests/map-refactor.spec.ts`. Requested viewport matrix: 1440×1000, 1366×768, 1024×768, 390×844, 320×568 and 1366×500. Checks include horizontal bounds, non-stretched map/chart cards, dialog viewport bounds, keyboard closing/focus restoration, complete list counts, create/edit/reload, composed filters, integer capacity validation, period-aware export, actual raster delivery and blocked-tile fallback.

Pre-existing reports, alerts and settings controls were inspected but are outside the requested control-refactor checklist. Several of their older export/rules/invitation/configuration buttons remain prototypes. This work does not claim that every control in the entire admin application is operational.
