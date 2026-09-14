# Add recovery codes for 2FA (#400)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/400
- **400**

## Status
- **WIP → UNTESTED:** Implemented recovery codes for all OTP users (same scope as existing `/users/me/otp/*`; no Owner-only gate). Format: 8 codes `XXXX-XXXX`, SHA-256 at rest. Show once after enable/regenerate; login accepts TOTP or unused recovery code.

## Problem / goal
Owners (and possibly other roles) need **one-time recovery codes** when they lose authenticator access. Today disable/reset while logged in uses account password (#401). Recovery codes cover lockout when the session is gone (new device / lost phone). Focus on **Owner** first if role scope must stay small.

## High-level instructions for coder
- Map current staff OTP setup/verify/disable flow (`Settings` → Security, `/users/me/otp/*`, `docs/SECURITY-REVIEW.md` OTP notes). Prefer a small slice over a large redesign.
- Add generation + secure storage of single-use recovery codes when 2FA is enabled (or on demand regenerate with re-auth). Show codes **once**; allow download/copy; require confirm that the user saved them.
- At login OTP step, accept either a TOTP code or an unused recovery code; mark used codes consumed. Do not log full codes.
- Scope: start with **Owner** (issue intent); extend to other staff roles only if existing OTP already applies to them and the change stays small.
- i18n any new strings in `front/public/i18n/*.json`.
- Smoke: enable 2FA → save recovery codes → log out → log in with a recovery code → that code cannot be reused. Check front/back logs. Related: #401 password disable while logged in; #377 OTP copy.
- If product must decide “Owner only vs all OTP users” or code count/format, leave **FEAT** and post one waiting comment per TASKS-README “Waiting for human”.

## Implementation notes
- Migration `20260914132443_user_otp_recovery_codes.sql` + model `UserOtpRecoveryCode`.
- Helpers: `back/app/otp_recovery.py`.
- API: confirm returns `recovery_codes`; `POST /users/me/otp/recovery-codes/regenerate` (password); status includes `recovery_codes_remaining`; `POST /token/otp` accepts recovery codes.
- UI: Settings recovery panel (copy/download/confirm); login OTP field accepts recovery format.
- Decision: apply to **all OTP users** (OTP endpoints had no role gate); 8 codes `XXXX-XXXX`.

## Testing instructions

### Automated
1. Backend: `docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T back python3 -m pytest tests/test_otp_recovery_codes.py -q`
2. Smoke (app up on 4202, demo credentials): `BASE_URL=http://127.0.0.1:4202 npm run test:otp-recovery-codes --prefix front`
3. Expect smoke: recovery codes shown → login with one code succeeds → reuse rejected.

### Manual
1. Settings → Security → Enable OTP → confirm TOTP → save shown recovery codes (copy or download) → check “I have saved…” → Continue.
2. Log out. Log in with password → at OTP step enter one recovery code (`XXXX-XXXX`) → reach dashboard.
3. Log out again; same recovery code must fail. Authenticator 6-digit code still works.
4. While logged in with OTP on: regenerate codes with account password; old unused codes must stop working.
5. Check `docker logs --since 10m pos-front` and `pos-back` for errors; ensure logs do not print full recovery codes.
