# Country/currency-gated fiscal prep sections in Settings (#392)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/392
- **392**

## Status
- **WIP → UNTESTED** by agent 010 (feature coder).
- Implemented: Settings → Payments gates VeriFactu (ES) and TSE/KassenSichV (DE) by Country ISO; modes already on stay visible.

## Problem / goal
`/settings` shows country-specific fiscal blocks (e.g. **KassenSichV preparation**, **VeriFactu preparation**) to all tenants. New operators find this noisy. Show or hide those blocks from **Country (ISO code)** and **Select currency** (and related tenant locale fields).

## High-level instructions for coder
- Locate Settings sections for KassenSichV / TSE (Germany) and VeriFactu (Spain) and the Country ISO + currency controls.
- Gate visibility: show German fiscal prep only when country/currency match DE (or EUR+DE as product intends); show VeriFactu only for ES (or matching currency/country). Prefer the existing country ISO as the primary signal; use currency only if product already ties fiscal mode to it.
- Changing country/currency in the form should update visibility without a full page reload when practical.
- Do not delete backend fiscal APIs; this is primarily UI onboarding clarity. Keep data intact if sections are hidden.
- Check fiscal docs (`docs/` VeriFactu / TSE / certified middleware) so gating matches real eligibility, not guesswork.
- i18n unchanged strings where possible; smoke `/settings` as owner for DE vs ES vs other country; check front build logs after edits.

## Implementation notes
- Primary signal: `formData.country_code` (Business profile). Fallback: `fiscal_country` when country empty (`docs/0072`).
- Currency is **not** used alone (EUR is multi-country; regimes are ES vs DE per `docs/0074`).
- If `fiscal_mode` / `tse_mode` is already `test` or `live`, the matching block stays visible so operators can turn it off.
- Docs: `docs/0072-tse-fiscal-compliance.md`, `docs/0018-verifactu-fiscal-invoicing.md`, `CHANGELOG` Unreleased.

## Testing instructions

1. Log in as owner/admin for tenant 1. Open `/settings`.
2. **Business profile:** set **Country (ISO code)** to `ES`. Open **Payments**.
   - Expect VeriFactu / Spain fiscal invoicing block visible.
   - Expect German TSE block **hidden** unless `tse_mode` was already test/live (set TSE to Off in-form first if needed).
3. Set Country to `DE`. Open Payments.
   - Expect TSE / KassenSichV block visible.
   - Expect VeriFactu **hidden** unless `fiscal_mode` was already test/live.
4. Set Country to `FR` (or other non-ES/DE). Open Payments.
   - Expect **neither** fiscal prep block when both modes are Off.
5. Optional: with TSE still `test` on the tenant, confirm the TSE block remains visible even if Country is `ES` (manage existing config).
6. Confirm Save still persists fiscal fields; hiding a section must not wipe stored values.
7. Check `docker logs --since 10m pos-front` for compile errors after the Settings change.
8. Optional script (repo `tmp/`): `HEADLESS=1 BASE_URL=http://127.0.0.1:4202 node tmp/test-settings-fiscal-country-gate.mjs` (needs `DEMO_LOGIN_*`).
