# Sidebar "Catalog & Inventory" alignment (#385)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/385
- **385**

## Problem / goal
In the staff sidebar, **Catalog & Inventory** looks right-justified while other items align left (see issue screenshot). Visual inconsistency only; not the Catalog hub page work in #391.

## High-level instructions for coder
- Open the staff sidebar after login and compare **Catalog & Inventory** alignment to peers (issue image).
- Fix CSS/markup so this item matches other sidebar nav rows (left-aligned text/icon). Prefer fixing the shared sidebar styles over one-off hacks.
- Do not conflate with #391 (Catalog & Inventory **sub-dashboard** / hub). This task is alignment only.
- Keep collapse/expand behaviour and active-state styles intact.
- Smoke: sidebar looks consistent on desktop width from the issue; `docker logs --since 10m pos-front` has no compile errors.
