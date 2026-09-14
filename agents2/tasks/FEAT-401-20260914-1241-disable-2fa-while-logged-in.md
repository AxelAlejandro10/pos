# Allow disabling or resetting 2FA while logged in (#401)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/401
- **401**

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
