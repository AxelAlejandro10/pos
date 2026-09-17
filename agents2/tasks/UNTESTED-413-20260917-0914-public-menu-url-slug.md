# Public menu URL with restaurant name / location (#413)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/413
- **413**

## Status
- **Implemented** — name-city `public_slug` + dual `/public-menu/{id|slug}` (human chose name-city on the issue)

## Problem / goal
Public menu URLs use the numeric tenant id today (e.g. `https://satisfecho.de/public-menu/175`). Prefer a human-readable path that includes restaurant name and location (or a stable slug derived from them), while keeping links from internal pages correct.

See `docs/0028-tenant-public-branding.md` (public page routes) and reservation notes in `docs/0010-table-reservation-implementation-plan.md` (tenant slug called out as optional later for `/book`). Align public-menu with any existing slug pattern if one exists; do not invent a second parallel scheme.

## High-level instructions for coder
- Confirm current route: `/public-menu/:tenantId` and every in-app / marketing link that points at it (guest header, book, delivery, platform, QR, emails, docs).
- Decide a stable public identifier: slug from name+location (or city), unique per tenant, URL-safe; keep numeric id working (redirect or dual route) so old links and bookmarks do not break.
- Persist the slug on the tenant (or reuse an existing field) and resolve it in Angular routes + public API lookups the same way as id today.
- Update all internal link builders to emit the slug URL when available.
- Handle collisions (same name/city), rename/reslug rules, and multi-tenant safety (no cross-tenant resolve).
- i18n: no user-facing copy change required unless UI shows the URL; keep smoke strings stable.
- Smoke: open new slug URL and old `/public-menu/{id}`; guest header / book / delivery links; `docker logs --since 10m pos-front` clean; landing smoke if shared chrome changes.

## Out of scope / notes
- Do not require a full marketing-site rewrite. Prefer minimal dual-route or redirect.
- If product must choose between name-only vs name+location slug format, post one short question on the issue and wait (FEAT waiting-for-human pattern) before large schema work.

## What was done
- Human decision on #413: **name-city** format; keep numeric URLs working.
- Added `Tenant.city` + unique `Tenant.public_slug`; migration `20260917141754_tenant_public_slug.sql`; migrate backfill (demo tenant 1 → city Barcelona → `demo-pizzeria-barcelona`).
- `GET /public/tenants/{ref}` and `…/menu` resolve numeric id or slug (`app/tenant_public_slug.py`).
- Settings → Business profile: city + public slug fields (i18n in all locales).
- Front: dual route, canonicalize id → slug; landing QR, guest header, delivery, loyalty CTAs, platform shortcuts prefer slug.
- Docs: `0028`, `0010`; changelog Unreleased; smoke `npm run test:public-menu-slug --prefix front`.

## Testing instructions

1. API: `curl -s http://127.0.0.1:4202/api/public/tenants/1 | jq '.city,.public_slug'` — expect city + a name-city slug (demo: `Barcelona` / `demo-pizzeria-barcelona`).
2. API by slug: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4202/api/public/tenants/demo-pizzeria-barcelona` and same for `…/menu` — expect **200**.
3. Browser: open `http://127.0.0.1:4202/public-menu/demo-pizzeria-barcelona` — menu loads; sticky guest header present.
4. Browser: open `http://127.0.0.1:4202/public-menu/1` — menu loads; URL should rewrite to the slug path.
5. Landing `/`: restaurant demo QR/link targets the slug when `public_slug` is set.
6. Settings → Business profile: City and Public menu URL slug fields visible; save keeps uniqueness (collision → 400).
7. Pytest: `docker compose … exec -T back python3 -m pytest /app/tests/test_tenant_public_slug.py -q`
8. Smoke: `BASE_URL=http://127.0.0.1:4202 npm run test:public-menu-slug --prefix front` — PASS.
9. Landing: `BASE_URL=http://127.0.0.1:4202 LANDING_VERSION_ONLY=1 npm run test:landing-version --prefix front` — PASS.
10. Front logs: `docker logs --since 10m pos-front` — no TS/NG build errors.
