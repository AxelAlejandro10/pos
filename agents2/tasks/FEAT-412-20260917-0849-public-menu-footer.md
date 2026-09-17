# Public menu footer with restaurant contact (#412)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/412
- **412**

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
