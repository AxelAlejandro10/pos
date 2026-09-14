# Fix 2FA key copy button in Settings → Security (#377)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/377
- **377**

## Status
- **Implemented** (010 feature coder) — Clipboard API + `execCommand` fallback; Copied / error feedback; smoke `test:settings-otp-copy`.
- Ready for tester (UNTESTED).

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
- [x] Copy on the 2FA secret control puts the displayed secret on the clipboard (or shows a clear error if the browser blocks it).
- [x] No regression of 2FA enable/verify/disable flow.
- [x] Front build has no new TS/Angular errors after the change.

## What changed
- `front/src/app/settings/settings.component.ts`: `copyOtpSecret()` now awaits Clipboard API, falls back to `document.execCommand('copy')` via a temporary textarea (LibreWolf/Firefox), flashes **Copied** on the button, and sets a translated error if both paths fail.
- i18n: `SETTINGS.OTP_SECRET_COPIED`, `SETTINGS.OTP_SECRET_COPY_FAILED` in all locale files.
- Smoke: `front/scripts/test-settings-otp-copy.mjs` + `npm run test:settings-otp-copy --prefix front`.

## Testing instructions

1. App up on HAProxy (e.g. `http://127.0.0.1:4202`).
2. Automated: `BASE_URL=http://127.0.0.1:4202 npm run test:settings-otp-copy --prefix front` (needs `LOGIN_*` / `DEMO_LOGIN_*`; user must **not** already have OTP enabled — script starts setup, copies, cancels).
3. Manual Chromium: Settings → Security → Enable OTP → Copy → paste into a text field; value must match the on-screen secret; button shows Copied briefly. Cancel without confirming if you do not want OTP on.
4. Manual LibreWolf/Firefox if available: same steps; if clipboard is blocked, confirm the error message appears (or that fallback still copies).
5. Confirm front logs have no new TS/Angular errors: `docker logs --since 10m pos-front | grep -iE 'error|TS[0-9]+'`.
6. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
