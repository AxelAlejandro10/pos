# Allow disabling or resetting 2FA while logged in (#401)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/401
- **401**

## Status
- **Implemented** (password re-entry to disable OTP while logged in).
- **Follow-up (not in this slice):** tenant/platform **enforce 2FA** toggle so “disable” becomes reset/replace only — note on issue #401.

## Problem / goal
Users who are already logged in must enter a 2FA code to remove 2FA from their account. If they lose authenticator access, they can be locked out of disable/replace flows while still in a session (shift change / clock-out risk). Reporter wants either: (1) remove the OTP step when the session is authenticated, and/or (2) a tenant/platform toggle that enforces 2FA so “disable” becomes a **reset/replace** rather than a permanent off. Password re-prompt (Zoho-style) is an acceptable middle ground.

## High-level instructions for coder
- Map current Settings → Security disable-2FA API and UI (OTP required today). Prefer a small, clear change over a large redesign.
- Implement a safer logged-in disable/reset path: e.g. re-enter **password** (and/or recent-auth window) instead of requiring a working authenticator code when the user already has a valid session. Keep OTP required for disable when the request is not from a trusted logged-in session if that endpoint is public-facing.
- If product wants an **enforce 2FA** toggle: add only if existing tenant/security settings patterns make it cheap; otherwise ship disable/reset first and note enforce-toggle as follow-up on the issue.
- Do not weaken account security for attackers without a session: unauthenticated or cross-user disable must still require strong proof.
- i18n any new strings in `front/public/i18n/*.json`.
- Smoke: enable 2FA on a test user → while logged in, disable or reset without a working OTP (per chosen design) → can log in again. Check front/back logs for errors. See related closed work on 2FA copy (#377) for Settings Security UI context.
- If a design choice blocks coding (password vs no re-auth vs enforce toggle), leave **FEAT** and post one waiting comment per TASKS-README “Waiting for human”.

## What changed
- **API** `POST /users/me/otp/disable` now requires `{ "password": "…" }` (account password) instead of `{ "code": "…" }`. Still requires an authenticated session (`get_current_user`). Wrong password → 400 with `incorrect_actor_password`.
- **Settings → Security:** disable UI asks for password; `data-testid="otp-disable-password"` / `otp-disable-submit`.
- **Tests:** `back/tests/test_otp_disable_password.py`; Puppeteer `front/scripts/test-settings-otp-disable-password.mjs` (`npm run test:settings-otp-disable-password`).
- **i18n:** `SETTINGS.OTP_DISABLE_ENTER_PASSWORD`, `SETTINGS.OTP_DISABLE_FAILED` (removed `OTP_DISABLE_ENTER_CODE`).

## Testing instructions
1. Backend: `docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T back python3 -m pytest tests/test_otp_disable_password.py -q` → 4 passed.
2. UI smoke (app on 4202, owner/admin credentials):  
   `BASE_URL=http://127.0.0.1:4202 npm run test:settings-otp-disable-password --prefix front`  
   Expect: wrong password shows error; correct password disables OTP and restores Enable UI.
3. Manual: Settings → Security with OTP enabled → enter password → Disable OTP → status shows enable button; log out and log in without OTP prompt.
4. Confirm `docker logs --since 10m pos-front` has no TS/NG compile errors after the change.
5. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
