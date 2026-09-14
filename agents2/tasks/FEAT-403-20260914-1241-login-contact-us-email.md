# Change login footer Contact us email (#403)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/403
- **403**

## Problem / goal
The login page footer **Contact us** link uses `mailto:hello@satisfecho.de` (`front/src/app/auth/login.component.ts`). Self-hosted / staff users who need login help should reach a support inbox, not a general marketing address. Issue title asks to change that address; body does not name the replacement — prefer **`support@satisfecho.de`** (already used for Satisfecho support access / Users flow) unless a later human comment on #403 names a different address.

## High-level instructions for coder
- Update the login footer **Contact us** `mailto:` to the support address (default target: `support@satisfecho.de`). Keep `data-testid="login-contact-us"`.
- Check whether landing / other public footers should stay on `hello@satisfecho.de` (docs/tests currently expect that on landing). **Do not** silently change landing unless the issue or product owner asks; scope this task to **login** unless #403 clearly includes more.
- Update any login-specific smoke or docs that assert the old mailto (landing tests in `docs/testing.md` may stay on `hello@satisfecho.de`).
- Smoke: open `/login` → Contact us shows the new mailto; no front compile errors in `docker logs --since 10m pos-front`.
