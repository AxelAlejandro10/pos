# Catalog & Inventory hub like Dashboard (#391)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/391
- **391**
- Related UX: https://github.com/satisfecho/pos/issues/385 (sidebar alignment — do not conflate; this task owns the hub page)

## Problem / goal
Catalog & Inventory children sit too deep in the sidebar expand/collapse tree. Tapping **Catalog & Inventory** should open a `/dashboard`-style hub page with clear tiles/links to inventory destinations, instead of only expanding a nested submenu.

## High-level instructions for coder
- Mirror the existing Dashboard hub pattern (route + tile grid) for Catalog & Inventory destinations shown in the sidebar today.
- Clicking the parent **Catalog & Inventory** label/nav item should navigate to that hub (not only toggle expand). Keep deep links to child routes working.
- Hub content: one place to reach the same inventory/catalog children (products, categories, stock, etc. — match current menu items).
- Keep mobile usable; reuse existing dashboard layout/styles where they fit; avoid a second competing nav system.
- Coordinate lightly with #385 if you touch sidebar markup, but do not turn this task into a pure alignment fix.
- i18n for new hub labels; smoke: open Catalog & Inventory → hub loads → each tile reaches the right route; check `docker logs --since 10m pos-front`.
