# Improve public loyalty page layout (#405)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/405
- **405**

## Problem / goal
Public loyalty at `/loyalty/{tenantId}` (example `/loyalty/1`) lacks usable spacing, CSS, and visual structure. Staff and guests need a clear, readable join/card layout that matches other public pages (menu, book, delivery).

Program behaviour stays as in `docs/0066-club-loyalty.md`. Related UI work: CTAs on loyalty pages (#374) — do not fight that task; share spacing if both touch the same template.

## High-level instructions for coder
- Open `/loyalty/1` on the local stack. Review join form, card, and empty/error states. Note missing margins and cramped blocks.
- Apply the existing public-page layout patterns (padding, max width, card surfaces, tenant branding). Keep the page usable on a phone and on a desktop.
- Do not change loyalty rules, APIs, or wallet issuance. This task is layout and CSS.
- Keep i18n; add keys only if new visible strings are needed.
- Smoke: `/loyalty/1` loads; join/recover still work; front build is clean in `docker logs --since 10m pos-front`. Prefer a Puppeteer check if a loyalty public script already exists.
