# Public menu URL with restaurant name / location (#413)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/413
- **413**

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
