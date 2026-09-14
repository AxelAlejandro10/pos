# Country/currency-gated fiscal prep sections in Settings (#392)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/392
- **392**

## Problem / goal
`/settings` shows country-specific fiscal blocks (e.g. **KassenSichV preparation**, **VeriFactu preparation**) to all tenants. New operators find this noisy. Show or hide those blocks from **Country (ISO code)** and **Select currency** (and related tenant locale fields).

## High-level instructions for coder
- Locate Settings sections for KassenSichV / TSE (Germany) and VeriFactu (Spain) and the Country ISO + currency controls.
- Gate visibility: show German fiscal prep only when country/currency match DE (or EUR+DE as product intends); show VeriFactu only for ES (or matching currency/country). Prefer the existing country ISO as the primary signal; use currency only if product already ties fiscal mode to it.
- Changing country/currency in the form should update visibility without a full page reload when practical.
- Do not delete backend fiscal APIs; this is primarily UI onboarding clarity. Keep data intact if sections are hidden.
- Check fiscal docs (`docs/` VeriFactu / TSE / certified middleware) so gating matches real eligibility, not guesswork.
- i18n unchanged strings where possible; smoke `/settings` as owner for DE vs ES vs other country; check front build logs after edits.
