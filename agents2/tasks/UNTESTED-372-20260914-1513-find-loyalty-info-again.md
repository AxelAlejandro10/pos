# Way for customers and staff to find loyalty info again (#372)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/372
- **372**

## Status
- **WIP → UNTESTED** (agent 010, 2026-09-14)
- Implemented public recover + staff search/copy card link.

## Problem / goal
If a guest does not add the loyalty card to a wallet or bookmark `/loyalty/{tenantId}` (or their member token URL), they have no clear way to recover membership / balance. Staff also need a reliable path to look up a member again. See `docs/0066-club-loyalty.md` for public and staff loyalty surfaces.

## High-level instructions for coder
- Map current recovery paths: public join `/loyalty/{tenantId}`, member token URLs, wallet passes, staff memberships list / search. Identify the gap when wallet/bookmark is missing.
- Add a practical recovery path for **customers** (e.g. look up by email/phone on the public loyalty page, or resend link) and ensure **staff** can find members from the existing loyalty admin UI without new portals unless required.
- Prefer extending existing loyalty APIs and pages over a new subsystem. Keep tenant scoping and rate limits (`docs/0066-club-loyalty.md`).
- Do not paste secrets or raw tokens into docs/UI; use opaque member tokens as today.
- Coordinate with #374 (CTAs on loyalty pages) only if you touch the same public loyalty chrome — do not expand into marketing CTAs unless needed for recovery UX.
- Smoke: join or look up a demo membership; confirm recover path works for guest and staff; front/back logs clean for the flows you touch.

## What was implemented
- **Public:** `POST /public/tenants/{id}/loyalty/recover` (email or phone → existing membership + card token). UI section **Already a member?** on `/loyalty/{tenantId}`. Join/recover always show the balance card link + Open my card (not only when Wallet is available).
- **Staff:** Settings → Loyalty club member search (existing `?search=` API) + **Copy card link**.
- Docs: `docs/0066-club-loyalty.md` recover section. Tests: `test_club_loyalty.py` recover + search. Smoke: `npm run test:loyalty-recover --prefix front`.

## Testing instructions
1. App up on `http://127.0.0.1:4202` (or HAProxy port from `docker compose ps`).
2. Backend: `docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T back python3 -m pytest tests/test_club_loyalty.py::TestClubLoyalty::test_public_recover_by_email_and_phone tests/test_club_loyalty.py::TestClubLoyalty::test_staff_membership_search -q`
3. Smoke: `BASE_URL=http://127.0.0.1:4202 npm run test:loyalty-recover --prefix front` (needs `DEMO_LOGIN_*` or `LOGIN_*` in `.env`).
4. Manual guest: open `/loyalty/1` → join with email → note card link → clear session → use **Find my card** with same email → same card link + Open my card.
5. Manual staff: Settings → Loyalty club → search by email → **Copy card link** → open URL → balance page loads.
6. Confirm `docker logs --since 10m pos-front` has no TS/NG errors for loyalty components; `pos-back` clean for recover/join.
