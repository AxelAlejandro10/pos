# Default SMTP From name to Business Name

## Status
**UNTESTED** — implementation complete; awaiting tester.

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/366
- **366**

## Problem / goal
In **Settings → Email (SMTP)**, **From name** should default to the tenant **Business Name** when empty. That reduces onboarding friction for out-of-box setup.

## High-level instructions for coder
- Locate SMTP / email settings UI and the persisted **From name** field (Settings).
- When **From name** is empty (new tenant or unset), show/use **Business Name** as the default for outbound mail identity.
- Do not overwrite a value the user already saved. Only fill empty / never-set cases (and document if UI placeholder vs saved default differs).
- Ensure save + send paths use the effective From name (Business Name fallback when blank).
- Smoke: Settings → Email (SMTP) with empty From name shows Business Name as default; saving still works; front build clean in `docker logs --since 10m pos-front`.

## Implementation notes
- **UI:** Empty From name stays empty in the DB. Placeholder shows Business Name (`formData.name`). Hint explains leave-blank behaviour. Saved From name is never overwritten on load.
- **Send path:** `_effective_from_name()` in `back/app/email_service.py`: saved `email_from_name` → `tenant.name` → global `EMAIL_FROM_NAME`.
- **Docs:** `docs/0056-gmail-setup.md` notes the default.
- **Tests:** `back/tests/test_email_from_name_default.py` (4 passed).

## Testing instructions

1. **Unit:** From repo root:
   `docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T back python3 -m pytest tests/test_email_from_name_default.py -q`
   Expect 4 passed.

2. **UI:** Log in as owner/admin → **Settings → Email (SMTP)**.
   - Clear **From name** (or leave empty) and confirm the placeholder shows the tenant **Business Name** (same as Settings → Business).
   - Confirm the hint says leave blank to use Business Name.
   - Save with From name empty; reload Settings → Email; field still empty; placeholder still Business Name.
   - Set a custom From name, save, reload; custom value remains (not replaced by Business Name).

3. **Front build:** `docker logs --since 10m pos-front` — no TS/NG build errors; bundle generation complete.

4. **Smoke (optional):** `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`
