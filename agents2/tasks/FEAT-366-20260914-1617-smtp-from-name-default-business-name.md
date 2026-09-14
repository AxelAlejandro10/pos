# Default SMTP From name to Business Name

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
