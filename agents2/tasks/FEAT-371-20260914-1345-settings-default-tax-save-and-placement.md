# Fix Default tax (IVA) save and placement in Settings (#371)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/371
- **371**

## Problem / goal
In Settings → **Contact Information**, changing **Default tax (IVA)** (e.g. from 10% to 0%) does not persist; the UI reverts to 10%. The control also feels out of place on Contact Information and should live on a money-related settings area when practical.

## High-level instructions for coder
- Trace how default tax / IVA is loaded and saved (tenant settings API + Settings Contact UI). Fix persistence so a changed rate survives reload and re-open of Settings.
- Confirm whether the field maps to an existing backend setting; wire save/PATCH correctly and avoid silent no-ops.
- Move or duplicate the control into a money-related Settings section if one already exists (payments / fiscal / tax); keep a single source of truth — do not leave two conflicting editors.
- Keep tenant scoping and authorization intact.
- i18n if labels move; smoke: change default tax → save → reload Settings → value sticks. Existing Puppeteer `test:settings-contact-tax` may need update if the control leaves Contact. Check `docker logs --since 10m pos-front` and `pos-back`.
- Reference: `docs/testing.md` (Settings contact tax), VeriFactu / fiscal docs only if tax defaults already live there.
