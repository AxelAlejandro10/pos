# Clarify RAL5002 (Azul) preset vs custom hex in `/settings`

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/367
- **367**

## Status
- **Implemented** (010 feature coder) — 2026-09-15

## Problem / goal
On `/settings`, the **RAL5002 (AZUL)** control appears to overwrite the user’s custom hex for public background colour. The reporter is unsure what the button is for. Goal: make the preset act as an optional one-click fill (not a silent overwrite of saved intent), and make the purpose obvious in the UI.

## High-level instructions for coder
- Locate the public background colour controls in settings (colour input + hex field + RAL5002 preset button that sets `#1E22AA`).
- Confirm current behaviour: preset click replaces `public_background_color` in the form; save persists that value. Decide UX that matches product intent:
  - Preset is a **helper** that applies `#1E22AA` only when the user clicks it (keep that), **and**
  - Label / help text must state it is a preset for public page background, not a separate “mode” that locks the field.
- If the colour picker and hex field fight each other (one overwrites the other on every change), fix so both stay in sync without wiping a just-typed hex until the user chooses the preset or another colour.
- Do not change unrelated branding fields (logo, header background) unless they share the same broken binding.
- i18n: update `SETTINGS.PRESET_RAL5002` / add a short hint key if needed (en + es at minimum per project i18n rules).
- Smoke: set a custom hex → save → reload → value kept; click RAL5002 → field becomes `#1E22AA` → save → reload; front build clean in `docker logs --since 10m pos-front`.

## What changed
- Settings Business profile: preset button label is **Apply RAL5002 (#1E22AA)**; title + field hint state it is optional and does not lock the field.
- Colour picker only binds valid `#RRGGBB`; incomplete hex typing no longer feeds the picker; blur normalizes hex; preset applies via `applyPublicBackgroundRal5002Preset()`.
- i18n: `SETTINGS.PRESET_RAL5002`, `SETTINGS.PRESET_RAL5002_TITLE`, `SETTINGS.PUBLIC_BACKGROUND_COLOR_HINT` in all locales.
- Doc: `docs/0028-tenant-public-branding.md` wording aligned.

## Testing instructions
1. Sign in as owner/admin → **Settings → Business profile**.
2. Set **Public site background color** hex to a custom value (e.g. `#C45C26`) → **Save changes** → reload Settings → hex still `#C45C26`.
3. Confirm button text is like **Apply RAL5002 (#1E22AA)** and hint says the preset only changes the value on click.
4. Click the preset → hex becomes `#1E22AA` → Save → reload → still `#1E22AA`.
5. While typing a partial hex, the colour picker must not wipe the text field until you finish/blur or click the preset.
6. Optional automated smoke (repo root, app on 4202): `BASE_URL=http://127.0.0.1:4202 node tmp/test-settings-ral5002-smoke.mjs`
7. Front build: `docker logs --since 10m pos-front` shows no TS/NG compile errors.
