# Add `#` anchors to URL in `/settings`

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/365
- **365**

## Status
- **Implemented:** 2026-09-15T09:50:00Z (UTC) — Agent 010
- Nav clicks sync both `?section=` (legacy #395) and `#hash` (#365).
- Docs-friendly hash for hours: `#openinghours` (aliases `opening-hours`, `hours`).
- Hash wins over query when both are present; unknown non-empty hash → default (general).
- Example anchors noted in `docs/testing.md` (§2d2).

## Problem / goal
Staff on `/settings` need deep links such as `/settings#openinghours` so they can jump to a section and so docs can point at exact settings areas. Today the settings vertical nav switches sections in-page without updating the URL hash (or reading it on load).

## High-level instructions for coder
- Inspect `/settings` layout (`settings.component` + `settings-nav` / section tabs). Map each nav target to a stable hash slug (e.g. `openinghours`, `payments`, `loyalty`). Prefer kebab or lowercase ids that match docs-friendly names.
- On section change (nav click / tab), update the location hash without a full reload (`Location` / `Router` fragment or equivalent). Preserve query params if any.
- On load (and on `hashchange`), if a known fragment is present, activate that section and scroll it into view.
- Unknown hashes: ignore safely; stay on default section.
- Do not break existing `data-testid` settings nav smoke; keep multi-tenant scoping untouched (settings stay tenant-scoped as today).
- Optional: document a few example anchors in a short note if a settings doc already lists sections.
- Smoke: open `/settings#…` for at least two sections; refresh keeps the section; nav clicks update the hash; `docker logs --since 10m pos-front` shows a clean bundle.

## What changed
- `front/src/app/settings/settings.component.ts` — fragment + query deep links; `SETTINGS_SECTION_HASH` / aliases; scroll on deep link; `data-testid` for hours tab/section.
- `front/scripts/test-settings-vertical-nav.mjs` — asserts `#payments`, `#openinghours`, `#loyalty`, unknown hash.
- `docs/testing.md` — example anchors for #365.

## Testing instructions
1. App up on `http://127.0.0.1:4202` (or HAProxy port from `docker compose ps`).
2. Run: `BASE_URL=http://127.0.0.1:4202 HEADLESS=1 npm run test:settings-vertical-nav --prefix front` (needs `DEMO_LOGIN_*` or `LOGIN_*`).
3. Manual: log in → open `/settings#openinghours` → Opening Hours active; `/settings#loyalty` → Loyalty; click Payments → URL has `?section=payments#payments`; refresh keeps section; `/settings#not-a-real-section` → Business Profile (general).
4. Confirm `docker logs --since 10m pos-front` has a clean settings bundle (no TS/NG errors).
