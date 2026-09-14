# Replace horizontal settings tabs with a vertical menu (#395)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/395
- **395**
- **Related:** https://github.com/satisfecho/pos/issues/396 (Payment Settings breakdown — benefits from this nav)

## Problem / goal
`/settings` uses horizontal scrolling tabs. As sections grow, that becomes hard to use. Replace with a **vertical settings menu** (Invoice Ninja–style sidebar within Settings), so more areas can be added without horizontal scroll.

## High-level instructions for coder
- Map current Settings tab list, active-tab state, and deep-link/hash behaviour (coordinate with #365 anchors if present). Prefer reusing the same panel components; change navigation chrome only.
- Replace horizontal tab strip with a vertical menu (desktop); keep a usable pattern on narrow viewports (e.g. stacked list or select — match existing app patterns).
- Preserve all existing settings sections and save flows; no behaviour change beyond navigation layout.
- i18n any new chrome strings; keep existing section title keys where possible.
- Smoke: open `/settings`, walk several sections via the new menu, save one field, hard-refresh and reopen the same section (hash/deeplink if supported). Check `pos-front` logs for compile errors. Desktop + one mobile width.
- Coordinate with #396 regrouping only if both are in flight; do not block this nav change on #396.
