# Sidebar language control as flat icon by POS (#384)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/384
- **384**
- Related density: https://github.com/satisfecho/pos/issues/383 (Log Out icon — separate FEAT; coordinate header chrome only)

## Status
- **Implemented:** 2026-09-14T14:48:01Z
- Language picker removed from sidebar footer; compact globe+code icon sits in `.logo-row` immediately right of `POS` (slot left of POS left free for #383).

## Problem / goal
The sidebar language control is a full drop-down that burns vertical space. Move it to a **flat icon** to the **right of `POS`** at the top of the sidebar so the menu needs less scrolling (issue screenshots). Related density ask: #383 (Log Out icon) — do not implement #383 in this task unless already planned; leave a clean header slot for both.

## High-level instructions for coder
- Locate the current language selector in the staff sidebar.
- Replace the bulky control with a compact icon (or icon+menu) placed to the **right of the `POS` brand** at the top.
- Keep language switching working for all existing locales (`ngx-translate` / current i18n pattern).
- Preserve accessibility: keyboard open, labelled control, clear current language.
- Coordinate layout with #383 if that lands later (Log Out icon left of `POS`); do not block on #383.
- Smoke: change language from the new control; sidebar shorter; front build clean in `docker logs --since 10m pos-front`.

## What changed
- `LanguagePickerComponent`: new `appearance` input (`select` default | `icon`). Icon mode is a labelled button (globe + current code), listbox menu, Escape / outside click to close.
- `sidebar.component`: `<app-language-picker appearance="icon">` in header `.logo-row` next to POS; removed from footer.
- Login / public / loyalty pickers unchanged (`select`).

## Testing instructions
1. Log in as staff (tenant 1). Confirm the bulky language `<select>` is **gone** from the sidebar footer.
2. Confirm a globe + language code control sits **immediately right of `POS`** in the sidebar header (`data-testid="language-picker-icon"`).
3. Open the control (click or keyboard). Pick another locale (e.g. Español). UI strings update; the code badge shows `ES` (or equivalent).
4. Escape or click outside closes the menu without changing language when no option is chosen.
5. Confirm POS brand still navigates to `/dashboard` (`npm run test:sidebar-brand-home --prefix front`).
6. Front build: `docker logs --since 10m pos-front` shows no compile errors for these files.
7. Optional smoke: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
