# Add i18n for USERS.ROLES.PLATFORM_OPERATOR

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/409
- **409**

## Problem / goal
The UI builds role labels as `USERS.ROLES.${role}` (sidebar, users list, working plan). Role `platform_operator` resolves to `USERS.ROLES.PLATFORM_OPERATOR`, but that key is missing under `USERS.ROLES` in locale JSON. Guests/staff see the raw key instead of a translated role name.

## High-level instructions for coder
- Add `USERS.ROLES.PLATFORM_OPERATOR` to **all** shipped files under `front/public/i18n/*.json` (same object as existing `OWNER`, `ADMIN`, `COURIER`, etc.).
- Use a clear short label (e.g. English: "Platform operator"); keep tone aligned with other role strings.
- Do not invent new UI code paths unless a locale file is missing the whole `USERS.ROLES` block — reuse the existing `USERS.ROLES.${role}` pattern in `users.component.ts`, `sidebar.component.ts`, and `working-plan.component.ts`.
- Follow `.cursor/rules/angular-ngx-translate.mdc`: keep locale objects in sync; run `python3 scripts/check-i18n-locale-parity.py`.
- Smoke: open Users (or any screen that shows a platform operator role) and confirm the translated label; check `docker logs --since 10m pos-front` for a clean build.
