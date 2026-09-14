# Sidebar version opens changelog like Dashboard What's new (#399)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/399
- **399**

## Status
- **Implemented:** 2026-09-14T12:30:00Z (UTC)
- Renamed FEAT → WIP → UNTESTED for tester.

## Problem / goal
The version string under **POS** in the staff sidebar is not clickable. Staff expect it to open the same changelog experience as the dashboard **What's new** tile (modal + content from the changelog API).

## High-level instructions for coder
- Make the sidebar version control open the changelog the same way `/dashboard` **What's new** does (reuse existing open/load/close flow where practical).
- Keep the control keyboard-accessible and clearly actionable (link/button semantics); do not change version display format unless needed for the click target.
- Prefer shared changelog UI/logic over copying a second modal implementation into the sidebar.
- i18n only if new visible strings are required; otherwise reuse dashboard changelog strings.
- Smoke: log in → click sidebar version → changelog modal loads (no 404); compare with dashboard **What's new**. Optional: `npm run test:changelog` / extend a small Puppeteer check. Confirm `docker logs --since 10m pos-front` has no compile errors.
- Docs: `docs/testing.md` (§ Changelog / What's new).

## What was done
- Extracted `ChangelogModalComponent` (`front/src/app/shared/changelog-modal.component.ts`) and mounted it once on the staff sidebar.
- Sidebar version is a button (`data-testid="sidebar-version-changelog"`). Dashboard **What's new** calls `SidebarComponent.openChangelog()`.
- Reused existing `DASHBOARD.CHANGELOG_*` / `COMMON.CLOSE` strings (no new i18n keys).
- Extended `front/scripts/test-changelog.mjs` and `docs/testing.md`. CHANGELOG Unreleased notes the feature.

## Testing instructions
1. App up on HAProxy (e.g. `http://127.0.0.1:4202`).
2. Run: `BASE_URL=http://127.0.0.1:4202 npm run test:changelog --prefix front` (needs `DEMO_LOGIN_*` or `LOGIN_*`).
3. Manual: log in → click sidebar version under **POS** → changelog modal loads. Compare with Dashboard **What's new**. Close with Escape or Close.
4. Confirm `docker logs --since 10m pos-front` has no compile errors.
