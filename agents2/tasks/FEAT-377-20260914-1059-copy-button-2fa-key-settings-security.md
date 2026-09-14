# Fix 2FA key copy button in Settings → Security (#377)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/377
- **377**

## Problem / goal
In **Settings → Security**, the **Copy** control for the 2FA (TOTP) secret does not copy the key. Reported in **LibreWolf** (other browsers not confirmed). Staff cannot reliably copy the shared secret into an authenticator app.

## High-level instructions for coder
- Find the Settings → Security 2FA UI (secret display + Copy control) and the handler that should write the secret to the clipboard.
- Fix copy so the TOTP secret lands on the clipboard when Copy is used (Clipboard API and/or a proven fallback for strict browsers).
- Do not log or persist the secret beyond what setup already needs; never put secrets into task files or commits.
- Verify in Chromium and, if practical, LibreWolf/Firefox; show clear success/failure feedback to the user.
- After edits, check `docker logs --since 10m pos-front` for Angular/TS build errors.
- Smoke: open Settings → Security with 2FA setup visible; click Copy; paste into a text field and confirm the secret matches the on-screen value.

## Acceptance criteria
- [ ] Copy on the 2FA secret control puts the displayed secret on the clipboard (or shows a clear error if the browser blocks it).
- [ ] No regression of 2FA enable/verify/disable flow.
- [ ] Front build has no new TS/Angular errors after the change.
