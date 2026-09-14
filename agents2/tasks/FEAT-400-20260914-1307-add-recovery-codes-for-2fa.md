# Add recovery codes for 2FA (#400)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/400
- **400**

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
