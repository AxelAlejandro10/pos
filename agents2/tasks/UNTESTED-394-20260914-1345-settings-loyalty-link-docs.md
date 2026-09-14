# Hyperlink club loyalty docs in Settings → Loyalty club (#394)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/394
- **394**

## Status
- **Started:** 2026-09-14T13:59:07Z
- **Implemented:** 2026-09-14T14:02:00Z

## Problem / goal
Settings → **Loyalty club** should link to **`docs/0066-club-loyalty.md`** so owners can open the club loyalty runbook without hunting the repo. Same discoverability pattern as Settings → Printing → `docs/0070-hardware-printing.md` (#397).

## High-level instructions for coder
- Add a clear, visible help link in Settings → Loyalty club that points to `docs/0066-club-loyalty.md` in the same user-friendly way other Settings sections link markdown docs (prefer the Printing docs-link pattern if still present).
- Do not invent a second docs system; keep existing Loyalty club controls working.
- i18n for the link label in all locale files.
- Smoke: open Settings → Loyalty club → follow the link → expected docs URL or in-app docs content loads. Check `docker logs --since 10m pos-front` for compile errors.
- Reference: `docs/0066-club-loyalty.md`, issue #397 / Settings Printing docs link for UI pattern.

## What changed
- Settings → Loyalty club: visible docs link (`data-testid="settings-loyalty-docs-link"`) to GitHub `docs/0066-club-loyalty.md` (same pattern as Printing).
- i18n key `SETTINGS.LOYALTY_DOCS_LINK` in all locale files.
- Smoke: `npm run test:settings-loyalty-docs --prefix front`; documented in `docs/testing.md`.
- Bonus unblock: fixed broken mobile sidebar brand `<a>` markup that blocked Angular compile (#390).

## Testing instructions
1. App up on HAProxy (e.g. `http://127.0.0.1:4202`).
2. Confirm front compile: `docker logs --since 10m pos-front` has no `Application bundle generation failed` / `NG5002` for loyalty or sidebar.
3. Run: `BASE_URL=http://127.0.0.1:4202 HEADLESS=1 npm run test:settings-loyalty-docs --prefix front`
4. Expect: PASS; href `https://github.com/satisfecho/pos/blob/master/docs/0066-club-loyalty.md`, `target=_blank`.
5. Manual (optional): Settings → Loyalty club → click the runbook link → GitHub docs page opens.
