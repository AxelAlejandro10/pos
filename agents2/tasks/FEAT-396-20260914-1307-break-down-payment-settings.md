# Break down Payment Settings into further config areas (#396)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/396
- **396**
- **Related:** https://github.com/satisfecho/pos/issues/395 (vertical settings menu — coordinate; do not block if #395 is not done)

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
