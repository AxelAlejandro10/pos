# Show currency symbol on public pages like `/public-menu/1` (#387)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/387
- **387**

## Status
- **Implemented** — public menu and delivery prices use shared `formatMoneyCents` (Intl symbol from tenant ISO currency), same approach as Products.

## Problem / goal
Public menu prices (e.g. `/public-menu/1`) do not show a currency symbol, while staff **Products** already shows a symbol (e.g. `£`). Guests should see currency consistent with the tenant’s selected currency.

## High-level instructions for coder
- Find how staff Products formats money (currency from tenant settings / ISO code). Reuse the same helper or pipe on public surfaces starting with **`/public-menu/:tenantId`**.
- Apply the same formatting to other public price surfaces that share the menu payload if trivial (e.g. delivery / book-adjacent menu links) — prefer one shared formatter; do not invent per-page formats.
- Respect tenant **Select currency** / country settings; do not hard-code `£` or `€`.
- Keep layout readable on mobile; symbol position follows locale convention used elsewhere in the app.
- Smoke: set tenant currency → open `/public-menu/{id}` → prices show the matching symbol like Products. Check `docker logs --since 10m pos-front`. Optional: note related public branding docs (`docs/0028-tenant-public-branding.md`) if formatting lives next to branding helpers.

## Implementation notes
- Added `formatMoneyCents` in `front/src/app/shared/currency-symbol.ts` (locale via `intlLocaleFromTranslate`, `currencyDisplay: 'symbol'`).
- `/public-menu/:tenantId` and delivery checkout product/total prices call that helper with `menu.currency` (ISO from `GET /public/tenants/{id}/menu`).
- Version **2.1.170**.

## Testing instructions

1. Ensure the stack is up (`http://127.0.0.1:4202`).
2. Open `/public-menu/1` (tenant with `currency_code` set, e.g. EUR). Confirm product prices show a **symbol** (e.g. `€9.50`), not a bare amount and not a trailing ISO code like `9.50 EUR`.
3. Optional: in Settings set currency to GBP, reload `/public-menu/1`, confirm `£` (or locale-equivalent) appears.
4. Open `/delivery/1` and confirm menu line prices (and cart totals) also use the same symbol style.
5. Check front build: `docker logs --since 10m pos-front` — no TS/NG compile errors.
6. Optional smoke: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
