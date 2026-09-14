# Sidebar Log Out as icon left of POS (#383)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/383
- **383**

## Problem / goal
Staff sidebar **Log Out** is a full-width control that burns vertical space and forces extra scrolling. Move it to a **subtle icon to the left of `POS`** at the top of the sidebar (issue screenshots). Related density work: language control is already a flat icon to the **right** of `POS` (#384); keep logout destination as staff `/login` (#402) — this task is **placement/chrome only**.

## High-level instructions for coder
- Inspect current sidebar header (`.logo-row` / POS title) and the existing Log Out control (footer or bottom of nav).
- Replace the bulky Log Out control with a compact icon button immediately **left of `POS`**. Keep accessible label / tooltip / `aria-label` (i18n).
- Preserve logout behaviour from #402: clear session, navigate to staff `/login` (not marketing `/`).
- Coordinate with #384 (language icon right of POS) and #390 (POS → dashboard link) so the header stays one row: logout | POS | language (and version if present). Do not rework language or version in this task.
- Remove unused i18n keys only if nothing else references them.
- Smoke: staff login → sidebar shows logout icon left of POS → logout lands on `/login`; front build clean in `docker logs --since 10m pos-front`.
