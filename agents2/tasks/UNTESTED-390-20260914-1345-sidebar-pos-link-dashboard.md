# Hyperlink sidebar POS brand to `/dashboard` (#390)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/390
- **390**

## Status
- **WIP → UNTESTED** after implementation (2026-09-14).

## Problem / goal
The **POS** label at the top of the staff sidebar should navigate to **`/dashboard`** when clicked or tapped. Users expect the brand/title control to return them to the main dashboard.

## High-level instructions for coder
- Find the sidebar header / brand markup that shows **POS** (and any version line beneath it). Make the **POS** title a link or router navigation to `/dashboard`.
- Keep keyboard and screen-reader affordances clear (link or button with an accessible name).
- Do not break related sidebar work already in flight (version → changelog #399, logout placement #402/#383, language control #384). Coordinate only if you touch the same header markup; do not expand scope into those issues.
- Smoke: log in → click **POS** in the sidebar → land on `/dashboard`. Check `docker logs --since 10m pos-front`.
- Prefer existing Angular `routerLink` patterns used elsewhere in the shell.

## Implementation notes
- `front/src/app/shared/sidebar.component.ts`: **POS** is `<a routerLink="/dashboard">` in sidebar (`.logo`, `data-testid="sidebar-brand-home"`) and mobile header (`.header-title`, `data-testid="mobile-brand-home"`). Version button unchanged (changelog).
- Styles: no underline by default; underline on hover/focus-visible.

## Testing instructions

1. App up on HAProxy (e.g. `http://127.0.0.1:4202`).
2. Log in as staff/owner (`DEMO_LOGIN_*` or `LOGIN_*`).
3. Open a non-dashboard route (e.g. `/staff/orders`).
4. Click **POS** at the top of the staff sidebar → URL must be `/dashboard`.
5. Confirm the version line under **POS** still opens the changelog modal (not the dashboard).
6. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:sidebar-brand-home --prefix front`
7. Check front build: `docker logs --since 10m pos-front` — no compile errors.
