# Catalog & Inventory hub like Dashboard (#391)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/391
- **391**
- Related UX: https://github.com/satisfecho/pos/issues/385 (sidebar alignment — do not conflate; this task owns the hub page)

## Status
- **WIP** → implementation complete; waiting for tester.
- Started: 2026-09-14T11:45:31Z

## Problem / goal
Catalog & Inventory children sit too deep in the sidebar expand/collapse tree. Tapping **Catalog & Inventory** should open a `/dashboard`-style hub page with clear tiles/links to inventory destinations, instead of only expanding a nested submenu.

## High-level instructions for coder
- Mirror the existing Dashboard hub pattern (route + tile grid) for Catalog & Inventory destinations shown in the sidebar today.
- Clicking the parent **Catalog & Inventory** label/nav item should navigate to that hub (not only toggle expand). Keep deep links to child routes working.
- Hub content: one place to reach the same inventory/catalog children (products, categories, stock, etc. — match current menu items).
- Keep mobile usable; reuse existing dashboard layout/styles where they fit; avoid a second competing nav system.
- Coordinate lightly with #385 if you touch sidebar markup, but do not turn this task into a pure alignment fix.
- i18n for new hub labels; smoke: open Catalog & Inventory → hub loads → each tile reaches the right route; check `docker logs --since 10m pos-front`.

## Implementation notes
- New route `/catalog-inventory` → `CatalogInventoryHubComponent` (dashboard-style tile grid).
- Sidebar label links to hub; chevron toggles expand/collapse independently.
- Tiles: Products; Catalog (providers module); Inventory items/suppliers/warehouses/POs/stock/reports (admin + inventory module).
- i18n: `CATALOG_INVENTORY_HUB.*`, `NAV.GROUP_CATALOG_TOGGLE` in all locale files.
- Smoke: `BASE_URL=http://127.0.0.1:4202 node front/scripts/test-catalog-inventory-hub.mjs` (PASS).

## Testing instructions

1. Log in as staff (owner/admin preferred so inventory tiles show).
2. In the sidebar, click the **Catalog & Inventory** label (not only the chevron). Confirm navigation to `/catalog-inventory` and a hub title plus tile grid.
3. Confirm the chevron still expands/collapses the nested submenu without blocking the hub link.
4. From the hub, open **Products** → `/products`. Use Back or sidebar to return to the hub.
5. If the providers module is on, open **Catalog** → `/catalog`.
6. If inventory is on and you are admin: open each inventory tile (Items, Suppliers, Warehouses, Purchase Orders, Stock Dashboard, Inventory Reports) and confirm the matching `/inventory/...` route.
7. Direct deep links still work: `/products`, `/catalog`, `/inventory/items`, etc.
8. Mobile width: hub tiles stack in one column; sidebar drawer closes after hub nav.
9. Check front build: `docker logs --since 10m pos-front` — no TS/NG compile errors for the hub or sidebar.
10. Optional automated: `BASE_URL=http://127.0.0.1:4202 node front/scripts/test-catalog-inventory-hub.mjs`
