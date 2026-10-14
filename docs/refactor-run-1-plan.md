# Refactor UI Run 1 implementation plan

Source task: https://app.notion.com/p/3f8dda2c05b280d39d7bc77d5376af71

The existing teal and white UI and device-local simulated backend remain the foundation. The attached BidayaNeet solution document informs program, youth, mediator, and orientation terminology; its future mobile/backend architecture is outside this UI task.

1. Shared controls: add shadcn Radix dialogs, menus, fields, search/filter controls, cards, and chat primitives. Preserve existing pages and styles; add whole-content rounded surfaces and blurred dialogs.
2. Admin: full-list dialogs, aligned partner cards, program imagery/create/detail/edit, working NEET search/filter/add, shared pipeline/blocker displays, mediator/opportunity/micro-action creation, calendar and action edit dialogs. Root handles interactive MapLibre geographic coverage and heat controls.
3. Mediator: working searches, filters and actions, consistent field-action cards, full-page messenger.
4. Youth: complete Arabic translation, RTL sidebar on right, self-hosted Cairo, notification menu, persistent assistant launcher and predefined chat animated with GSAP, image quote, four larger story reels, circular mediator photo, opportunity controls, full-page Arabic messenger.
5. Partner and auth: align partner cohort panel with platform tokens; redesign all auth modes with a transparent brand asset, new generated imagery, concise copy, and preserved form validation. Youth auth uses Arabic and RTL.
6. Validation: production build, lint, desktop/mobile browser coverage, persistent add/edit workflows, keyboard dismissal/focus, Arabic and responsive layout, and final screenshots. Publishing is not requested; no production push.

The user approved a four-portal team. Admin, mediator, and youth run as GPT-6.1 Sol with high reasoning; the primary agent handles partner, shared components, and integration.
