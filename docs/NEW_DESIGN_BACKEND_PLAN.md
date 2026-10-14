# Backend scope for the revised BidayaNeet design

The target is the complete interface in upstream commit f156d2cc4325919571850802e84832957bd4de59, dated 8 October 2026. The requested backend covers every business workflow represented by that interface, in addition to Android intake and GPS. The current hosted data must be preserved. The platform and React Native application remain separate projects.

The upstream README and inspected components confirm that business state currently resides in browser localStorage through lib/simulated-backend.ts. Administrative tables and indicators contain hard-coded fixtures. Restoring the frontend alone will therefore not deliver a working backend.

| Area | Required backend behavior |
| --- | --- |
| Authentication | Real sessions, role authorization, professional access approval, logout and recovery/reset workflow |
| Administration | Real dossier directory, diagnostic review, mediator management, programs, opportunities, activities, alerts, reports and validated settings |
| Mediation | Assigned caseload, dated notes and nominal journey observations, appointments, human-approved referrals, activity participation, messaging, profile and exports |
| Partners | Organization-scoped opportunities and capacity, referral stages and responses, feedback and an actor-attributed activity log |
| Youth | Own dossier and profile, favorites, applications, action completion, workshop enrollment, messages and private CV upload |
| Shared content | Stored opportunity, activity and story catalogs; editorial images retained from the upstream design |
| Dashboards | Indicators calculated from stored events and records, with filters and exports respecting the current role |
| GPS and heatmap | Optional consented foreground location on intake, coordinates plus accuracy and capture time, durable offline storage, synchronization and a protected aggregate map |
| Android | Mediator-only diagnostic form, consent, date picker, inline errors, French/Arabic, durable offline queue and synchronization |

## Implementation sequence

1. Retain the upstream visual assets and layouts, and integrate them on an isolated branch. Keep the existing deployment operational while rebuilding.
2. Define the data contracts for every page and command. Add models and migrations without deleting or recreating existing dossiers.
3. Implement session and data-layer authorization before enabling the revised routes. Keep native authentication compatible during transition.
4. Replace fixture imports and device-local business state with the new API. Keep purely visual preferences, such as sidebar collapse, local.
5. Wire administrative, mediator, partner and youth workflows. Show server confirmation and recoverable errors rather than simulated success notices.
6. Add optional GPS to the standalone intake app and publish aggregate map data. Dossiers without GPS continue to work; denied location permission must not block capture.
7. Verify the Android airplane-mode/restart/synchronization path, shared-data consistency, persistence, role isolation, private attachment access, and map aggregation. Validate all visible business controls on desktop and mobile.
8. Deploy the revised platform to Vercel and deliver a replacement Android APK with the existing package/signing identity.

## Boundaries to verify during implementation

- The Android app collects new dossiers. Follow-up, matching and program management belong to the web platform under the user's chosen MVP scope.
- Android 1.4.1 uses SQLCipher and SecureStore with a verified-copy migration of legacy drafts. The upgrade and airplane-mode restart still require acceptance on the physical Android device.
- Recovery uses administrator-issued, one-use links expiring after one hour as requested. Private CV PDFs (up to 4 MiB) are persisted in PostgreSQL with owner-only download access; no SMTP service is used.
- A rules-based assistant can use the platform's actual records. Do not imply an institutional integration or machine-learning model exists unless it is implemented and configured.
- Upstream partner logos, simulated offers and story illustrations are not evidence of real institutional agreements or verified beneficiaries.

Completion means the revised screens consume authenticated persistent data and their business actions operate across the relevant accounts. GPS alone, a theme import, or moving localStorage to an unrestricted JSON endpoint is not completion.

## Verified delivery candidate — 13 October 2026

TypeScript, ESLint (no errors), production build, isolated workspace persistence/authorization/recovery/capacity/report checks, and three native API/nominal journey regression tests passed. HTTP smoke checks cover all four roles. The final Arabic admin programs page rendered without browser errors. Android build 15879df4-2abc-4d9c-9b63-b33a8813ebcf finished (1.4.1, versionCode 6), archive integrity checked. Before deployment, production contained 32 dossiers including Mohamed Ouazzag.

Physical-device acceptance remains: install as an update without uninstalling, confirm encrypted draft migration, capture optional GPS, save in airplane mode, close/reopen and then synchronize. Remote revision fetching is not included in this intake-only APK. Institutional integrations and real-world beneficiary outcomes remain outside verified MVP delivery.
