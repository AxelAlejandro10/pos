# Public pages nav menu / tabs (remaining gap after guest header)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/364
- **364**
- Related (done): https://github.com/satisfecho/pos/issues/376 — sticky public guest header with Menu / Book / Waitlist / Delivery / Loyalty / Feedback links (`CLOSED-376-…`).

## Status
- **Implemented** — hero "Book a table" pill on `/book/:tenantId` scrolls to the booking form (human decision 2026-09-17 on #364).
- Cleared prior blocked/waiting gate after product reply.

## Problem / goal
Guests on public surfaces (e.g. `/book/1`) wanted a quick way to switch to menu and other public pages. **#376** already shipped a sticky guest header with those links. Remaining gap from human: the hero **"Book a table"** pill looked clickable but did nothing — it should scroll to the booking form.

## High-level instructions for coder
- Open `/book/1`, `/public-menu/1`, `/waitlist/1`, `/delivery/1` and confirm the existing `public-guest-header` nav. Compare to the #364 comment screenshot (“pills” in the upper UI).
- If #376 already satisfies the ask, document that on the issue and leave a short note in this task for the closer — **no duplicate header**. Prefer closing scope via product confirmation over rework.
- If a real gap remains (e.g. pill styling, missing link, loyalty/menu entry not reachable from a specific route), extend the **existing** guest-header pattern only — one coherent public chrome.
- Keep mobile usable (no cover of primary CTAs). Prefer tenant branding; see `docs/0028-tenant-public-branding.md`.
- i18n for any new strings; run `BASE_URL=http://127.0.0.1:4202 npm run test:public-guest-header --prefix front` if the header changes.
- Smoke: navigate between public pages via the header; front build clean in `docker logs --since 10m pos-front`.

## Agent notes (010)
Live check 2026-09-15: `/book/1` sticky `public-guest-header` has six linked pill-radius nav items (Menu, Book, Waitlist, Delivery, Loyalty, Feedback). Issue screenshot is the hero “Book a table” pill; #376 already added the upper hyperlinked nav.

Human reply 2026-09-17: make hero "Book a table" scroll to the booking form. Implemented: pill → `button` with `scrollToBookingForm()` → `#book-form` (scroll-margin clears sticky guest header). Extended `test:public-guest-header` to assert scroll. No second chrome bar.

## Testing instructions
1. Open `http://127.0.0.1:4202/book/1` (or production equivalent). Confirm sticky guest header still has Menu / Book / Waitlist / Delivery / Loyalty / Feedback.
2. With the page scrolled to the top of the hero, click the **"Book a table"** pill under the restaurant name. The view should smooth-scroll so the booking form is near the top (below the sticky header), not stay idle.
3. Confirm the pill has hover/focus styling and is a real button (keyboard focusable).
4. Run: `BASE_URL=http://127.0.0.1:4202 npm run test:public-guest-header --prefix front` — expect OK including hero CTA scroll.
5. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
6. Check `docker logs --since 10m pos-front` for no Angular compile errors after the change.
