# Link hardware printing docs in Settings → Printing (#397)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/397
- **397**

## Status
- **Implemented:** 2026-09-14T12:20:00Z (UTC)
- Renamed FEAT → WIP → UNTESTED for tester.

## Problem / goal
Settings → **Printing** should link users to **`docs/0070-hardware-printing.md`** so owners can open the hardware printing ADR/runbook without hunting the repo.

## High-level instructions for coder
- Add a clear, visible help link in Settings → Printing that opens or points to `docs/0070-hardware-printing.md` in a user-friendly way (same pattern as other Settings doc links if they already exist).
- Prefer an in-app docs viewer or GitHub/raw docs URL consistent with how other settings sections link markdown docs; do not invent a second docs system.
- Keep the Printing agent/token UI working; this is documentation discoverability only.
- i18n for the link label; smoke: open Settings → Printing → follow the link → docs content or expected URL loads. Check `docker logs --since 10m pos-front`.
- Reference: `docs/0070-hardware-printing.md`, `docs/PRINTING.md`.

## What was done
- Replaced plain-text `PRINTING_DOCS_HINT` with a visible GitHub link (`data-testid="settings-printing-docs-link"`) to `blob/master/docs/0070-hardware-printing.md` (`target="_blank"`), plus a short LAN agent command hint.
- i18n: `SETTINGS.PRINTING_DOCS_LINK` + `SETTINGS.PRINTING_AGENT_CMD_HINT` in all locale files; removed `PRINTING_DOCS_HINT`.
- Note in `docs/0070-hardware-printing.md`; smoke script `npm run test:settings-printing-docs`; `docs/testing.md` + CHANGELOG Unreleased.

## Testing instructions
1. App up on HAProxy (e.g. `http://127.0.0.1:4202`).
2. Run: `BASE_URL=http://127.0.0.1:4202 npm run test:settings-printing-docs --prefix front` (needs `DEMO_LOGIN_*` or `LOGIN_*`).
3. Manual: log in → Settings → Printing → click the runbook link → GitHub opens `docs/0070-hardware-printing.md`.
4. Confirm print agent create/list UI still works; check `docker logs --since 10m pos-front` for compile errors.
