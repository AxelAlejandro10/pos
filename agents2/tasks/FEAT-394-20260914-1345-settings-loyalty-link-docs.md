# Hyperlink club loyalty docs in Settings → Loyalty club (#394)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/394
- **394**

## Problem / goal
Settings → **Loyalty club** should link to **`docs/0066-club-loyalty.md`** so owners can open the club loyalty runbook without hunting the repo. Same discoverability pattern as Settings → Printing → `docs/0070-hardware-printing.md` (#397).

## High-level instructions for coder
- Add a clear, visible help link in Settings → Loyalty club that points to `docs/0066-club-loyalty.md` in the same user-friendly way other Settings sections link markdown docs (prefer the Printing docs-link pattern if still present).
- Do not invent a second docs system; keep existing Loyalty club controls working.
- i18n for the link label in all locale files.
- Smoke: open Settings → Loyalty club → follow the link → expected docs URL or in-app docs content loads. Check `docker logs --since 10m pos-front` for compile errors.
- Reference: `docs/0066-club-loyalty.md`, issue #397 / Settings Printing docs link for UI pattern.
