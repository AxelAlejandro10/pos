# Way for customers and staff to find loyalty info again (#372)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/372
- **372**

## Problem / goal
If a guest does not add the loyalty card to a wallet or bookmark `/loyalty/{tenantId}` (or their member token URL), they have no clear way to recover membership / balance. Staff also need a reliable path to look up a member again. See `docs/0066-club-loyalty.md` for public and staff loyalty surfaces.

## High-level instructions for coder
- Map current recovery paths: public join `/loyalty/{tenantId}`, member token URLs, wallet passes, staff memberships list / search. Identify the gap when wallet/bookmark is missing.
- Add a practical recovery path for **customers** (e.g. look up by email/phone on the public loyalty page, or resend link) and ensure **staff** can find members from the existing loyalty admin UI without new portals unless required.
- Prefer extending existing loyalty APIs and pages over a new subsystem. Keep tenant scoping and rate limits (`docs/0066-club-loyalty.md`).
- Do not paste secrets or raw tokens into docs/UI; use opaque member tokens as today.
- Coordinate with #374 (CTAs on loyalty pages) only if you touch the same public loyalty chrome — do not expand into marketing CTAs unless needed for recovery UX.
- Smoke: join or look up a demo membership; confirm recover path works for guest and staff; front/back logs clean for the flows you touch.
