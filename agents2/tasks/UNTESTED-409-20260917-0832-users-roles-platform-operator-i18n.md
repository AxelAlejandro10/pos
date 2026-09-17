# Add i18n for USERS.ROLES.PLATFORM_OPERATOR

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/409
- **409**

## Status
- **Implemented:** 2026-09-17T08:36:00Z
- Added `USERS.ROLES.PLATFORM_OPERATOR` to all 10 locale files under `front/public/i18n/*.json`.
- Labels match existing `PLATFORM_AUTH.TITLE` per locale (e.g. en: "Platform operator").
- No component changes; existing `USERS.ROLES.${role}` lookups pick up the key.
- `python3 scripts/check-i18n-locale-parity.py`: bg/ca/de/es/fr/hi/ur/zh-CN OK for this key; `ar.json` still has pre-existing missing keys unrelated to this change (PLATFORM_OPERATOR is present in ar).

## Problem / goal
The UI builds role labels as `USERS.ROLES.${role}` (sidebar, users list, working plan). Role `platform_operator` resolves to `USERS.ROLES.PLATFORM_OPERATOR`, but that key is missing under `USERS.ROLES` in locale JSON. Guests/staff see the raw key instead of a translated role name.

## High-level instructions for coder
- Add `USERS.ROLES.PLATFORM_OPERATOR` to **all** shipped files under `front/public/i18n/*.json` (same object as existing `OWNER`, `ADMIN`, `COURIER`, etc.).
- Use a clear short label (e.g. English: "Platform operator"); keep tone aligned with other role strings.
- Do not invent new UI code paths unless a locale file is missing the whole `USERS.ROLES` block — reuse the existing `USERS.ROLES.${role}` pattern in `users.component.ts`, `sidebar.component.ts`, and `working-plan.component.ts`.
- Follow `.cursor/rules/angular-ngx-translate.mdc`: keep locale objects in sync; run `python3 scripts/check-i18n-locale-parity.py`.
- Smoke: open Users (or any screen that shows a platform operator role) and confirm the translated label; check `docker logs --since 10m pos-front` for a clean build.

## Testing instructions

1. Confirm `USERS.ROLES.PLATFORM_OPERATOR` exists in every `front/public/i18n/*.json` (value aligned with `PLATFORM_AUTH.TITLE`).
2. Optional: `python3 -c "import json,glob; [print(p, json.load(open(p))['USERS']['ROLES']['PLATFORM_OPERATOR']) for p in sorted(glob.glob('front/public/i18n/*.json'))]"` from repo root — all 10 must print a label, not KeyError.
3. With the app up: hard-refresh, open Users (or Working plan) for a user with role `platform_operator`; the UI must show the translated label (e.g. "Platform operator" in en), not `USERS.ROLES.PLATFORM_OPERATOR`.
4. `docker logs --since 10m pos-front` — no new Angular build errors from this change.
5. Smoke already run by coder: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front` (pass).
