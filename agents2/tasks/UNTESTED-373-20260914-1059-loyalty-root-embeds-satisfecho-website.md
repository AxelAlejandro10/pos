# Fix `/loyalty/` embedding Satisfecho website (#373)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/373
- **373**

## Status
- **Implemented:** 2026-09-14T11:15:25Z
- Bare `/loyalty` no longer falls through to landing; shows need-link page.

## Problem / goal
Opening **`/loyalty/`** (no tenant id) shows or embeds the **Satisfecho marketing website** instead of a clear loyalty entry. Guests and staff hit a dead or confusing page. Documented public join URL is **`/loyalty/{tenantId}`** (`docs/0066-club-loyalty.md`).

## High-level instructions for coder
- Trace Angular routing for `/loyalty`, `/loyalty/`, `/loyalty/:tenantId`, and `/loyalty/card/:token`. Find why the bare `/loyalty/` path renders marketing / embedded site content.
- Fix so `/loyalty/` does **not** embed or show the marketing site. Prefer a clear guest outcome: redirect helper, short “choose restaurant / need a link” message, or redirect to a known demo tenant only if product already does that elsewhere — do not invent a second loyalty product.
- Keep `/loyalty/{tenantId}` join and `/loyalty/card/{memberToken}` balance card working (`docs/0066`).
- Avoid iframes of satisfecho.de for this path.
- After edits, check `docker logs --since 10m pos-front`; smoke `curl`/browser on `/loyalty/` and `/loyalty/1`.

## What changed
- Root cause: no `loyalty` route → `**` redirected to Satisfecho landing.
- Added `path: 'loyalty'` (full match) before `loyalty/:tenantId`.
- Bare path shows `LOYALTY_PUBLIC.NEED_LINK` + hint + home link (`data-testid="loyalty-need-link"`).
- Docs note in `docs/0066-club-loyalty.md`; i18n keys in all locales.

## Acceptance criteria
- [x] `/loyalty/` no longer embeds or displays the Satisfecho marketing website.
- [x] `/loyalty/{tenantId}` join flow still works (e.g. `/loyalty/1`).
- [x] `/loyalty/card/{token}` still works when a valid token exists.
- [x] Front build has no new TS/Angular errors.

## Testing instructions

1. Open `http://127.0.0.1:4202/loyalty` and `http://127.0.0.1:4202/loyalty/`.
2. Expect the Loyalty club need-link page (`[data-testid="loyalty-need-link"]`), **not** the Satisfecho landing (`app-landing` absent). Title ≈ “Loyalty club”.
3. Open `/loyalty/1` — join form still loads (`[data-testid="loyalty-public-page"]`, `.join-form`).
4. Open `/loyalty/card/<invalid>` — still shows “Membership not found” on the card page (not landing).
5. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
6. Confirm `docker logs --since 10m pos-front` has no new TS/Angular compile errors.
