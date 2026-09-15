# Public pages nav menu / tabs (remaining gap after guest header)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/364
- **364**
- Related (done): https://github.com/satisfecho/pos/issues/376 — sticky public guest header with Menu / Book / Waitlist / Delivery / Loyalty / Feedback links (`CLOSED-376-…`).

## Status
- **Blocked — waiting for human** (product: confirm #376 closes #364, or name remaining pill/chrome gap)
- **Waiting notice posted:** 2026-09-15T09:51:37Z

## Problem / goal
Guests on public surfaces (e.g. `/book/1`) wanted a quick way to switch to menu and other public pages. **#376** already shipped a sticky guest header with those links. Issue **#364** is still open; the author also asked for more “pills” in the upper UI (screenshot on the issue). Goal: verify what is still missing vs #376, then implement only the remaining UX gap — **do not** add a second competing chrome bar.

## High-level instructions for coder
- Open `/book/1`, `/public-menu/1`, `/waitlist/1`, `/delivery/1` and confirm the existing `public-guest-header` nav. Compare to the #364 comment screenshot (“pills” in the upper UI).
- If #376 already satisfies the ask, document that on the issue and leave a short note in this task for the closer — **no duplicate header**. Prefer closing scope via product confirmation over rework.
- If a real gap remains (e.g. pill styling, missing link, loyalty/menu entry not reachable from a specific route), extend the **existing** guest-header pattern only — one coherent public chrome.
- Keep mobile usable (no cover of primary CTAs). Prefer tenant branding; see `docs/0028-tenant-public-branding.md`.
- i18n for any new strings; run `BASE_URL=http://127.0.0.1:4202 npm run test:public-guest-header --prefix front` if the header changes.
- Smoke: navigate between public pages via the header; front build clean in `docker logs --since 10m pos-front`.

## Agent notes (010)
Live check 2026-09-15: `/book/1` sticky `public-guest-header` has six linked pill-radius nav items (Menu, Book, Waitlist, Delivery, Loyalty, Feedback). Issue screenshot is the hero “Book a table” pill; #376 already added the upper hyperlinked nav. No code until human confirms close vs remaining styling gap. Waiting comment: https://github.com/satisfecho/pos/issues/364#issuecomment-5678175951
