# Improve public loyalty page layout (#405)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/405
- **405**

## Status
- **WIP → UNTESTED** (layout/CSS for public join + card pages)

## Problem / goal
Public loyalty at `/loyalty/{tenantId}` (example `/loyalty/1`) lacks usable spacing, CSS, and visual structure. Staff and guests need a clear, readable join/card layout that matches other public pages (menu, book, delivery).

Program behaviour stays as in `docs/0066-club-loyalty.md`. Related UI work: CTAs on loyalty pages (#374) — do not fight that task; share spacing if both touch the same template.

## High-level instructions for coder
- Open `/loyalty/1` on the local stack. Review join form, card, and empty/error states. Note missing margins and cramped blocks.
- Apply the existing public-page layout patterns (padding, max width, card surfaces, tenant branding). Keep the page usable on a phone and on a desktop.
- Do not change loyalty rules, APIs, or wallet issuance. This task is layout and CSS.
- Keep i18n; add keys only if new visible strings are needed.
- Smoke: `/loyalty/1` loads; join/recover still work; front build is clean in `docker logs --since 10m pos-front`. Prefer a Puppeteer check if a loyalty public script already exists.

## What changed
- `/loyalty/{tenantId}` and `/loyalty/card/{token}` use the same `book-content` / `book-card` / `book-form` layout as waitlist/book.
- Tenant public background and primary colours apply on both pages.
- Join and recover forms use spaced form groups, side-by-side birthday fields, and `btn-primary` / `btn-secondary`.
- Loading, not-enabled, and need-link states sit in the same card shell.
- No API or loyalty rule changes.

## Testing instructions

1. Open `http://127.0.0.1:4202/loyalty/1` (stack up via HAProxy). Confirm a centred card with padded form, readable lede, and Join / Already a member sections.
2. Confirm header uses tenant branding (name/logo/colours) and Loyalty nav is active.
3. Join with a name + email or phone; confirm success block and Open card link still work.
4. Recover with the same contact; confirm recover still finds the card (`npm run test:loyalty-recover --prefix front` with `BASE_URL=http://127.0.0.1:4202`).
5. Open `/loyalty/card/{token}` and confirm the balance card uses the same card layout.
6. Open bare `/loyalty` and confirm the need-link message is inside a padded card with Back home.
7. Check `docker logs --since 10m pos-front` for a clean Angular build (no TS/NG errors).
