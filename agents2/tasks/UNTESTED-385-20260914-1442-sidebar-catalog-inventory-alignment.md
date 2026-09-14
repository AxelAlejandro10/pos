# Sidebar "Catalog & Inventory" alignment (#385)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/385
- **385**

## Status
- **WIP → UNTESTED:** Alignment fix shipped in shared sidebar SCSS.

## Problem / goal
In the staff sidebar, **Catalog & Inventory** looks right-justified while other items align left (see issue screenshot). Visual inconsistency only; not the Catalog hub page work in #391.

## High-level instructions for coder
- Open the staff sidebar after login and compare **Catalog & Inventory** alignment to peers (issue image).
- Fix CSS/markup so this item matches other sidebar nav rows (left-aligned text/icon). Prefer fixing the shared sidebar styles over one-off hacks.
- Do not conflate with #391 (Catalog & Inventory **sub-dashboard** / hub). This task is alignment only.
- Keep collapse/expand behaviour and active-state styles intact.
- Smoke: sidebar looks consistent on desktop width from the issue; `docker logs --since 10m pos-front` has no compile errors.

## What changed
- Root cause: the split hub row used a flex chevron column (44px), so the long label wrapped to two lines and looked out of line with peer groups.
- Fix in `front/src/app/shared/sidebar.component.scss`:
  - Overlay the expand chevron (`position: absolute`) so the hub link keeps the same horizontal padding as other section headers.
  - Force `text-align: left` on section headers (override button UA center).
  - Keep labels on one line with ellipsis (`white-space: nowrap` + `text-overflow: ellipsis`) on header/link spans.
- Expand/collapse and hub link behaviour unchanged.

## Testing instructions
1. Log in as staff/owner; open the desktop sidebar (~240px).
2. Confirm **Catalog & Inventory** is a **single line**, with icon and label left-aligned to match **Operations** / **Planning** (same left edge for icon and text).
3. Click the chevron: submenu (Products / Catalog / Inventory) opens; click again to close.
4. Click the **Catalog & Inventory** label: navigates to `/catalog-inventory` (hub).
5. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:catalog-inventory-hub` (with `LOGIN_EMAIL` / `LOGIN_PASSWORD`) and `npm run test:landing-version`.
6. `docker logs --since 10m pos-front` shows no compile errors.
