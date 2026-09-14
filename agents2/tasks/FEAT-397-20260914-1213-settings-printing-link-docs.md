# Link hardware printing docs in Settings → Printing (#397)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/397
- **397**

## Problem / goal
Settings → **Printing** should link users to **`docs/0070-hardware-printing.md`** so owners can open the hardware printing ADR/runbook without hunting the repo.

## High-level instructions for coder
- Add a clear, visible help link in Settings → Printing that opens or points to `docs/0070-hardware-printing.md` in a user-friendly way (same pattern as other Settings doc links if they already exist).
- Prefer an in-app docs viewer or GitHub/raw docs URL consistent with how other settings sections link markdown docs; do not invent a second docs system.
- Keep the Printing agent/token UI working; this is documentation discoverability only.
- i18n for the link label; smoke: open Settings → Printing → follow the link → docs content or expected URL loads. Check `docker logs --since 10m pos-front`.
- Reference: `docs/0070-hardware-printing.md`, `docs/PRINTING.md`.
