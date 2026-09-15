## Status
**UNTESTED** — feature coder 010 finished; waiting for tester

# Blue primary buttons need white text (#408)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/408
- **408**

## Problem / goal
Primary / blue-background buttons often show **black text on blue**, which is hard to read. Examples called out: public book calendar “go forward”, and Google Maps / OpenStreetMap open buttons on `/book/{tenantId}`. The same contrast problem appears in other places. Prefer a **global CSS** fix for primary / solid blue button text (and icon) colour so contrast is correct everywhere, instead of one-off component patches.

Related: `docs/0028-tenant-public-branding.md` (tenant primary button colour / CSS variables). Keep readable contrast when tenants override `--color-primary`.

## High-level instructions for coder
- Reproduce on public book (e.g. `http://127.0.0.1:4202/book/1`): calendar next, map open buttons — confirm black-on-blue.
- Prefer global styles (shared button / primary CTA classes or CSS variables) so solid primary backgrounds get light/white foreground text and icons.
- Cover staff and public surfaces that share those button styles; avoid fixing only `/book`.
- When tenant primary colour is custom (`docs/0028-tenant-public-branding.md`), keep sufficient contrast (white or otherwise light text on primary fill).
- Do not change secondary / outline / link-style controls that are meant to stay dark-on-light.
- Smoke: `/book/1` calendar + map buttons readable; spot-check a few staff primary buttons; `docker logs --since 10m pos-front` shows a clean build.

## What was done
- Root cause: public pages set `[style.--color-bg]` to the tenant page wash (e.g. `#1E22AA`). Secondary and calendar-nav controls used `background: var(--color-bg)` with dark `--color-text`, so they looked like black-on-blue.
- Added `--color-subtle` (fixed light chrome) and `--color-on-primary` (white) in `front/src/styles.scss`.
- Global `_buttons.scss`: primary uses `--color-on-primary` (+ SVG `currentColor`); secondary / ghost / icon hover use `--color-subtle` so branding wash does not paint controls.
- Public-facing overrides: `book.component.scss`, `reservation-week-slot-grid.component.scss` (cal-nav + summary), `menu.component.scss` secondary, language-picker hover.
- Documented tokens in `docs/0028-tenant-public-branding.md`.

## Testing instructions
1. Open `http://127.0.0.1:4202/book/1` with tenant 1 (RAL5002 blue page background).
2. Calendar month **‹** / **›** must show dark text on a light fill (not black on blue).
3. **Open in Google Maps** / **OpenStreetMap** must show dark text on a light fill.
4. **Book table** (primary) must show white text on blue primary.
5. Spot-check a staff primary button (e.g. dashboard / tables) still has white text on primary.
6. `docker logs --since 10m pos-front` — no Angular/TS build errors.
7. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
