# Public menu footer with restaurant contact (#412)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/412
- **412**

## Status
- **Implemented:** 2026-09-17T09:02:00Z
- Contact footer on `/public-menu/{tenantId}` using existing `GET /public/tenants/{id}` fields (phone, email, WhatsApp, address, maps). No API change. Reused `BOOK.*` / `SETTINGS.WHATSAPP` i18n keys.

## Problem / goal
Public menu (`/public-menu/{tenantId}` and related public menu surfaces) has no general footer with restaurant contact, address, and phone. Guests on `/book/{tenantId}` already see that block (phone, WhatsApp, email, address, maps links) in the page header area. Add a similar contact footer on the public menu so guests can reach the restaurant without leaving the menu.

See `docs/0028-tenant-public-branding.md` for public page coverage and shared header patterns. Reuse existing tenant fields (`phone`, `email`, `whatsapp`, `address`, maps URLs) — do not invent new Settings fields unless data is missing from the public-menu API payload.

## High-level instructions for coder
- Open `/public-menu/1` (and token-based `/menu/...` if in scope of “related pages”) and compare with `/book/1` contact / address block in `book.component.html` (`.restaurant-contact`, address, maps).
- Add a footer (or shared partial) on public menu that shows contact, address, and phone (plus WhatsApp/email/maps when set), matching book’s information density — not a marketing site chrome rewrite.
- Prefer extracting a small shared component if book and public-menu would duplicate the same markup; otherwise mirror book’s markup once on public-menu with matching styles.
- Keep existing footer actions (back/home link, legal links) usable; place contact above or around them without clutter.
- Confirm public menu tenant payload already exposes phone/email/whatsapp/address/maps; extend the public API only if a field is missing.
- i18n: reuse existing reservation/book contact keys where possible; add keys to all locales if new strings are needed.
- Smoke: `/public-menu/1` shows contact footer when tenant has data; layout OK on mobile; `docker logs --since 10m pos-front` clean; landing smoke if you touch shared public chrome.

## What was done
- Added `public-menu-contact-footer` above existing back/legal footer actions on `PublicMenuComponent`.
- Shows phone / WhatsApp / email and address + Google Maps / OpenStreetMap when set (same density as book).
- Content-area styles (primary links) so text stays readable outside the hero.
- Token menu `/menu/...` unchanged (already has phone/WhatsApp in hero; out of this footer scope).

## Testing instructions
1. Open `http://127.0.0.1:4202/public-menu/1` (or production equivalent). Confirm `[data-testid="public-menu-contact-footer"]` shows below the menu products.
2. For tenant 1 demo: expect phone `+34717102603`, WhatsApp, email `hello@satisfecho.de`, address, and both maps buttons.
3. Confirm back/home link and legal links still work below the contact block.
4. Narrow viewport (~390px): contact block wraps cleanly; no white-on-white text.
5. Optional: clear phone/email/whatsapp/address/maps on a test tenant — footer section should hide when all empty.
6. `docker logs --since 10m pos-front` — no Angular/TS build errors.
7. `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front` passes.
