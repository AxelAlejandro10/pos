# Sidebar Logout navigates to embedded Satisfecho site (#402)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/402
- **402**

## Problem / goal
Staff **Logout** in the sidebar ends on `/` (marketing / embedded Satisfecho landing) instead of a clear auth exit screen. Related pattern: public **Back to home** / loyalty root embedding the marketing site (#386, closed #373). Current code: `SidebarComponent.logout()` calls `router.navigate(['/'])` after API logout.

## High-level instructions for coder
- After successful staff logout, navigate to the staff **login** route (e.g. `/login`), not `/` or an iframe marketing page.
- Keep logout clearing session/tokens as today; only fix the post-logout destination (and any duplicate logout paths that also send users to `/`).
- Do not break provider / courier / platform / customer logout destinations — each portal should return to its own login if it has one.
- Smoke: log in as staff → sidebar Logout → land on staff login (no embedded marketing chrome). Confirm `docker logs --since 10m pos-front` has no compile errors.
- Optional: small Puppeteer or extend an existing auth smoke if one already covers logout.
