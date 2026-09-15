# Clarify RAL5002 (Azul) preset vs custom hex in `/settings`

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/367
- **367**

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
