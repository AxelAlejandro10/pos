# Allow changing colours of buttons / positive primary defaults (#370)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/370
- **370**

## Status
- **Implementation:** done (2026-09-14T15:27:22Z) → UNTESTED
- **Version:** 2.1.171

## Problem / goal
Primary actions (e.g. **Book table** on public booking) use colours that read as cancel/stop rather than confirm/next. Product guidance on the issue: primary confirm → **blue or green**; destructive → red; secondary → muted / outline / text link — not the same strong colour as primary. Prefer a safe OOBE default (blue primary, muted secondary). Also allow tenants to change button colours where branding settings already exist, without inventing a parallel theme system.

## High-level instructions for coder
- Find where public booking (and similar) primary / secondary button colours are set (tenant brand colour, RAL presets, CSS variables, or hard-coded classes). Issue screenshot shows a strong warm/red primary on Book table.
- Fix defaults so primary CTAs read as go/confirm (blue or green), and secondary actions (e.g. join waiting list) are quieter (link or muted/outline).
- If Settings already exposes brand / button colour, wire primary CTA styles to that path so tenants can change colours; do not add a second unrelated colour picker.
- Watch interaction with existing brand hex / RAL controls (related: #367) — changing primary should not fight or silently overwrite user hex without clear UI.
- Keep contrast and a11y; update i18n only if new labels are needed.
- Smoke: `/book/{tenantId}` (and any Settings colour path touched) — primary vs secondary colours match guidance; front build clean in `docker logs --since 10m pos-front`.

## What was implemented
- Added `Tenant.public_primary_color` (migration + public/settings API).
- Settings → Business profile: primary button colour picker + blue/green presets (separate from background / RAL5002).
- Public guest pages bind `--color-primary` via `resolvePublicPrimaryColor` (OOBE default `#2563EB`).
- `/book` waiting-list link uses muted text colour (not primary).
- Docs: `docs/0028-tenant-public-branding.md`, README branding row, CHANGELOG 2.1.171.

## Testing instructions

1. Open `http://127.0.0.1:4202/book/1` (or HAProxy port). Confirm **Book table** (submit) button is **blue** (`#2563EB` / `rgb(37, 99, 235)`), not terracotta/red.
2. Confirm **Join the waiting list** link under the button is muted gray, not the same blue fill as the primary button.
3. Sign in as owner → **Settings → Business profile**. Set **Public primary button colour** to green (`#16A34A`) or a custom hex; Save. Reload `/book/1` and confirm the submit button uses that colour. Clear the field (empty) and Save; confirm blue OOBE returns. Confirm **Public site background color** / RAL5002 still only changes page background, not this primary field.
4. Optional: spot-check `/waitlist/1`, `/delivery/1`, `/feedback/1` primary buttons follow the same token.
5. Front build: `docker logs --since 10m pos-front` has no `Application bundle generation failed` / TS errors.
6. Smoke: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
