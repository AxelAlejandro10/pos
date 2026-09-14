# Break down Payment Settings into further config areas (#396)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/396
- **396**
- **Related:** https://github.com/satisfecho/pos/issues/395 (vertical settings menu — coordinate; do not block if #395 is not done)

## Status
- **WIP → UNTESTED** after implementation (2026-09-14).
- Shipped with vertical nav from #395: new **Delivery** nav section; no human IA gate needed (matched issue screenshots).

## Problem / goal
`/settings` → **Payment Settings** mixes too many concerns. Split into clearer areas (section dividers or dedicated tabs/panels), similar to Invoice Ninja “Basic Settings” style grouping. Issue screenshots show intent:
- Move **Satisfecho Delivery** (and delivery marketplace integrations from Integrations) under a **Delivery** section/group.
- Move **Location Verification** toward **Business Profile** if that fits existing settings structure.
- Keep payment/gateway fields in a tighter Payment area.

## High-level instructions for coder
- Inventory current Settings payment / delivery / integrations / business-profile panels and routing (hash/tab ids if any; see #365 for anchors). Prefer regrouping existing UI over new APIs.
- Implement clear section grouping or sub-areas for Payment vs Delivery vs related items per issue screenshots. Preserve existing save behaviour and tenant scoping.
- If #395 (vertical menu) lands first, place the new groups in that nav; if not, use section headers/dividers inside the current Payment tab so the IA improves either way.
- i18n any new section labels in `front/public/i18n/*.json`.
- Smoke: open `/settings`, confirm Payment / Delivery / Location Verification placement, save a field in each moved group, reload. Check front logs for compile errors.
- Large IA debate (exact section names) → one waiting comment and leave **FEAT** if blocked; otherwise ship a sensible default matching the issue images.

## Implementation notes
- Added Settings section id `delivery` (nav label `SETTINGS.DELIVERY_TAB`).
- Moved Satisfecho Delivery fee/radius/postal fields into Delivery; embedded marketplace integrations under the same section.
- Moved Location Verification into Business Profile (`general`).
- Removed those blocks from Payment Settings; tightened payment subtitle copy.
- Alias: `?section=delivery-integrations` → Delivery.

## Testing instructions

1. Open `/settings` (logged in as tenant staff/owner). Confirm vertical nav shows **Delivery** (not a separate “Integrations” item).
2. Open **Payment Settings**: currency / Stripe / Revolut / tips present; **no** Satisfecho Delivery fields; **no** Location Verification toggle.
3. Open **Delivery**: Satisfecho fee/radius/postal fields + marketplace integrations list. Change delivery fee, Save Changes, reload `?section=delivery` — value persists.
4. Open **Business Profile**: Location Verification at bottom. Toggle or edit radius, Save, reload `?section=general` — value persists.
5. Deep link `/settings?section=delivery-integrations` should open Delivery (active nav + delivery section).
6. Run: `BASE_URL=http://127.0.0.1:4202 npm run test:settings-vertical-nav --prefix front`
7. Check `docker logs --since 10m pos-front` for compile errors.
