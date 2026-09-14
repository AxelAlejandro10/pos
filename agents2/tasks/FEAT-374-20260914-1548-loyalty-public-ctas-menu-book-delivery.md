# CTAs on public loyalty pages for menu, book, delivery (#374)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/374
- **374**

## Problem / goal
Public loyalty surfaces (`/loyalty/card/…`, `/loyalty/:tenantId`, and similar) miss easy next steps into the sales flow. Add clear CTAs so guests can open the public menu, reservations, and deliveries without leaving the product.

Related: public nav / pills work on #364 (coordinate; do not duplicate conflicting chrome). Floating public header work may already exist from prior FEAT/UNTESTED cycles — reuse shared public nav patterns if present.

## High-level instructions for coder
- Inventory public loyalty routes (`/loyalty/…`, card view, join/recover flows) and where a guest lands after scan or link.
- Add concise CTAs (links or buttons) to tenant public **menu**, **book**, and **delivery** URLs for that tenant. Hide a CTA when that channel is disabled or unavailable for the tenant.
- Match existing public-page visual language; avoid a second competing nav if #364 / floating header already covers the same destinations — prefer one consistent pattern.
- i18n for new CTA labels.
- Smoke: open `/loyalty/1` (and card URL if seeded) → CTAs reach `/public-menu/1`, `/book/1`, `/delivery/1` (or current public paths); front build clean in `docker logs --since 10m pos-front`.
