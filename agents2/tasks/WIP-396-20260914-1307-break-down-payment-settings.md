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

## Test report

- **Date/time (UTC):** 2026-09-15T09:04:08Z → 2026-09-15T09:08:30Z
- **Log window:** `docker logs --since 30m pos-front` / `pos-back` (UTC)
- **Environment:** `docker-compose.yml` + `docker-compose.dev.yml`; `BASE_URL=http://127.0.0.1:4202`; branch `development`
- **What was tested:** Settings Payment / Delivery / Business Profile regrouping (#396) per Testing instructions 1–7

### Results

1. **Nav shows Delivery; no separate Integrations item** — **PASS** — Nav labels include Delivery; no standalone Integrations item (20 nav items).
2. **Payment Settings: currency / Stripe / Revolut / tips; no Delivery / Location Verification** — **PASS** — `#currency_code` present; page text includes Stripe, Revolut, tip; `#delivery_fee_cents` and `location_check_enabled` absent on payments.
3. **Delivery section + fee save/reload** — **PASS** — Fee/radius/postal + marketplace block present; fee `367` → `484` after Save + reload `?section=delivery` (then restored).
4. **Business Profile: Location Verification placement + save/reload** — **FAIL** — Block is at bottom of Business Profile (`?section=general`). Toggle Save returns PUT `/api/tenant/settings` 200 with `location_check_enabled: true` and GET confirms API value. After full reload UI always shows unchecked; radius fields hidden. Root cause: `loadSettings()` does not map `location_check_enabled`, `latitude`, `longitude`, or `location_radius_meters` into `formData` (`settings.component.ts` ~3750–3827).
5. **Deep link `?section=delivery-integrations`** — **PASS** — Opens Delivery section; Delivery nav item active.
6. **`npm run test:settings-vertical-nav`** — **PASS** — `>>> RESULT: Settings vertical nav smoke passed.`
7. **Front compile logs** — **PASS** — No TS/NG/bundle errors in `pos-front` logs for the window; no matching back errors.

### Overall: **FAIL**

Failed criterion: **4** (Location Verification value does not persist in UI after reload).

### Product owner feedback

Payment vs Delivery split looks correct and Delivery fee save works. Location Verification is in the right place, but staff cannot rely on the toggle after refresh because the form never reloads those fields from the API. Coder should hydrate `formData` from tenant settings (and keep them after save) before this ships.

### URLs tested

1. http://127.0.0.1:4202/login?tenant=1
2. http://127.0.0.1:4202/dashboard
3. http://127.0.0.1:4202/settings
4. http://127.0.0.1:4202/settings?section=payments
5. http://127.0.0.1:4202/settings?section=delivery
6. http://127.0.0.1:4202/settings?section=general
7. http://127.0.0.1:4202/settings?section=delivery-integrations
8. http://127.0.0.1:4202/settings?section=security (mobile layout via smoke script)

### Relevant log excerpts

```text
# Puppeteer smoke
>>> RESULT: Settings vertical nav smoke passed.

# Location save (API OK, UI reload broken)
PUT /api/tenant/settings → 200 ; request location_check_enabled=true ; response true
GET /api/tenant/settings after save → location_check_enabled=true
After UI reload → checkbox unchecked; .location-settings absent

# docker logs --since 30m pos-front / pos-back
(no compile/error lines matching error|TS|NG|exception|500)
```
