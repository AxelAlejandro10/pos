# Sidebar language control as flat icon by POS (#384)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/384
- **384**
- Related density: https://github.com/satisfecho/pos/issues/383 (Log Out icon — separate FEAT; coordinate header chrome only)

## Problem / goal
The sidebar language control is a full drop-down that burns vertical space. Move it to a **flat icon** to the **right of `POS`** at the top of the sidebar so the menu needs less scrolling (issue screenshots). Related density ask: #383 (Log Out icon) — do not implement #383 in this task unless already planned; leave a clean header slot for both.

## High-level instructions for coder
- Locate the current language selector in the staff sidebar.
- Replace the bulky control with a compact icon (or icon+menu) placed to the **right of the `POS` brand** at the top.
- Keep language switching working for all existing locales (`ngx-translate` / current i18n pattern).
- Preserve accessibility: keyboard open, labelled control, clear current language.
- Coordinate layout with #383 if that lands later (Log Out icon left of `POS`); do not block on #383.
- Smoke: change language from the new control; sidebar shorter; front build clean in `docker logs --since 10m pos-front`.
