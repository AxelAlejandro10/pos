# Replace horizontal settings tabs with a vertical menu (#395)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/395
- **395**
- **Related:** https://github.com/satisfecho/pos/issues/396 (Payment Settings breakdown — benefits from this nav)

## Status
- Implemented by agent 010 (feature coder).
- Renamed to **UNTESTED** — waiting for tester.

## Problem / goal
`/settings` uses horizontal scrolling tabs. As sections grow, that becomes hard to use. Replace with a **vertical settings menu** (Invoice Ninja–style sidebar within Settings), so more areas can be added without horizontal scroll.

## High-level instructions for coder
- Map current Settings tab list, active-tab state, and deep-link/hash behaviour (coordinate with #365 anchors if present). Prefer reusing the same panel components; change navigation chrome only.
- Replace horizontal tab strip with a vertical menu (desktop); keep a usable pattern on narrow viewports (e.g. stacked list or select — match existing app patterns).
- Preserve all existing settings sections and save flows; no behaviour change beyond navigation layout.
- i18n any new chrome strings; keep existing section title keys where possible.
- Smoke: open `/settings`, walk several sections via the new menu, save one field, hard-refresh and reopen the same section (hash/deeplink if supported). Check `pos-front` logs for compile errors. Desktop + one mobile width.
- Coordinate with #396 regrouping only if both are in flight; do not block this nav change on #396.

## What changed
- Replaced horizontal `.tabs` strip with `.settings-layout` + vertical `.settings-nav` (sticky sidebar from 900px; scrollable stacked list on narrow viewports).
- `selectSection()` updates `?section=` for all known section ids; query param open works for Security and other areas (not only the previous four).
- i18n: `SETTINGS.SECTION_NAV_ARIA` in all locale files.
- Smoke: `front/scripts/test-settings-vertical-nav.mjs` / `npm run test:settings-vertical-nav --prefix front`.

## Testing instructions
1. App up on HAProxy (e.g. `http://127.0.0.1:4202`). Use tenant-1 staff credentials from `.env` (`DEMO_LOGIN_*`).
2. Run: `BASE_URL=http://127.0.0.1:4202 npm run test:settings-vertical-nav --prefix front` — expect pass (desktop row layout, payments deep link after reload, mobile column + security section).
3. Manual: open `/settings`, confirm left vertical menu (desktop). Click several sections; URL should show `?section=…`. Hard-refresh; same section stays open. Save one Business Profile field and confirm save still works.
4. Narrow viewport (~390px): menu stacks above content and stays scrollable; sections still switch.
5. Regression: `BASE_URL=http://127.0.0.1:4202 npm run test:settings-providers --prefix front`.
6. Check `docker logs --since 10m pos-front` for Angular compile errors.
