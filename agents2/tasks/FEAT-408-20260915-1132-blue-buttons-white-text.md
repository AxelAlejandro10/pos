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
