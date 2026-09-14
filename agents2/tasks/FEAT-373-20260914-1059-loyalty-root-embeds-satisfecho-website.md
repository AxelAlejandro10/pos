# Fix `/loyalty/` embedding Satisfecho website (#373)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/373
- **373**

## Problem / goal
Opening **`/loyalty/`** (no tenant id) shows or embeds the **Satisfecho marketing website** instead of a clear loyalty entry. Guests and staff hit a dead or confusing page. Documented public join URL is **`/loyalty/{tenantId}`** (`docs/0066-club-loyalty.md`).

## High-level instructions for coder
- Trace Angular routing for `/loyalty`, `/loyalty/`, `/loyalty/:tenantId`, and `/loyalty/card/:token`. Find why the bare `/loyalty/` path renders marketing / embedded site content.
- Fix so `/loyalty/` does **not** embed or show the marketing site. Prefer a clear guest outcome: redirect helper, short “choose restaurant / need a link” message, or redirect to a known demo tenant only if product already does that elsewhere — do not invent a second loyalty product.
- Keep `/loyalty/{tenantId}` join and `/loyalty/card/{memberToken}` balance card working (`docs/0066`).
- Avoid iframes of satisfecho.de for this path.
- After edits, check `docker logs --since 10m pos-front`; smoke `curl`/browser on `/loyalty/` and `/loyalty/1`.

## Acceptance criteria
- [ ] `/loyalty/` no longer embeds or displays the Satisfecho marketing website.
- [ ] `/loyalty/{tenantId}` join flow still works (e.g. `/loyalty/1`).
- [ ] `/loyalty/card/{token}` still works when a valid token exists.
- [ ] Front build has no new TS/Angular errors.
