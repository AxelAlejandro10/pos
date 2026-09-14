# Sidebar Logout navigates to embedded Satisfecho site (#402)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/402
- **402**

## Status
- **Implemented:** 2026-09-14 — sidebar staff logout navigates to `/login` (was `/`).

## Problem / goal
Staff **Logout** in the sidebar ends on `/` (marketing / embedded Satisfecho landing) instead of a clear auth exit screen. Related pattern: public **Back to home** / loyalty root embedding the marketing site (#386, closed #373). Current code: `SidebarComponent.logout()` calls `router.navigate(['/'])` after API logout.

## High-level instructions for coder
- After successful staff logout, navigate to the staff **login** route (e.g. `/login`), not `/` or an iframe marketing page.
- Keep logout clearing session/tokens as today; only fix the post-logout destination (and any duplicate logout paths that also send users to `/`).
- Do not break provider / courier / platform / customer logout destinations — each portal should return to its own login if it has one.
- Smoke: log in as staff → sidebar Logout → land on staff login (no embedded marketing chrome). Confirm `docker logs --since 10m pos-front` has no compile errors.
- Optional: small Puppeteer or extend an existing auth smoke if one already covers logout.

## Implementation notes
- Changed only `SidebarComponent.logout()` in `front/src/app/shared/sidebar.component.ts` to `router.navigate(['/login'])`, matching Settings and paywall staff logout.
- Left provider / courier / platform / customer logout routes unchanged (they already use their own login paths).
- No other staff path still navigated to `/` after logout.

## Testing instructions
1. App up on `http://127.0.0.1:4202` (Docker compose + HAProxy).
2. Log in as staff (e.g. `DEMO_LOGIN_EMAIL` / `DEMO_LOGIN_PASSWORD` from `.env`).
3. Click sidebar **Logout**.
4. Expect URL `/login` with the staff login form (password field). Must **not** land on `/` or show embedded marketing chrome.
5. Confirm `docker logs --since 10m pos-front` has no compile errors.
6. Optional smoke: `BASE_URL=http://127.0.0.1:4202 node tmp/smoke-sidebar-logout.mjs` (uses DEMO_LOGIN_* from `.env`).
7. Coder verified: smoke PASS (login → dashboard → logout → `/login`); front rebuild completed without TS errors.
