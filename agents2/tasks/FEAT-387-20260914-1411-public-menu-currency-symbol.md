# Show currency symbol on public pages like `/public-menu/1` (#387)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/387
- **387**

## Problem / goal
Public menu prices (e.g. `/public-menu/1`) do not show a currency symbol, while staff **Products** already shows a symbol (e.g. `£`). Guests should see currency consistent with the tenant’s selected currency.

## High-level instructions for coder
- Find how staff Products formats money (currency from tenant settings / ISO code). Reuse the same helper or pipe on public surfaces starting with **`/public-menu/:tenantId`**.
- Apply the same formatting to other public price surfaces that share the menu payload if trivial (e.g. delivery / book-adjacent menu links) — prefer one shared formatter; do not invent per-page formats.
- Respect tenant **Select currency** / country settings; do not hard-code `£` or `€`.
- Keep layout readable on mobile; symbol position follows locale convention used elsewhere in the app.
- Smoke: set tenant currency → open `/public-menu/{id}` → prices show the matching symbol like Products. Check `docker logs --since 10m pos-front`. Optional: note related public branding docs (`docs/0028-tenant-public-branding.md`) if formatting lives next to branding helpers.
