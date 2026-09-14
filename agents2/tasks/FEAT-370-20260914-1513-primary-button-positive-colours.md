# Allow changing colours of buttons / positive primary defaults (#370)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/370
- **370**

## Problem / goal
Primary actions (e.g. **Book table** on public booking) use colours that read as cancel/stop rather than confirm/next. Product guidance on the issue: primary confirm → **blue or green**; destructive → red; secondary → muted / outline / text link — not the same strong colour as primary. Prefer a safe OOBE default (blue primary, muted secondary). Also allow tenants to change button colours where branding settings already exist, without inventing a parallel theme system.

## High-level instructions for coder
- Find where public booking (and similar) primary / secondary button colours are set (tenant brand colour, RAL presets, CSS variables, or hard-coded classes). Issue screenshot shows a strong warm/red primary on Book table.
- Fix defaults so primary CTAs read as go/confirm (blue or green), and secondary actions (e.g. join waiting list) are quieter (link or muted/outline).
- If Settings already exposes brand / button colour, wire primary CTA styles to that path so tenants can change colours; do not add a second unrelated colour picker.
- Watch interaction with existing brand hex / RAL controls (related: #367) — changing primary should not fight or silently overwrite user hex without clear UI.
- Keep contrast and a11y; update i18n only if new labels are needed.
- Smoke: `/book/{tenantId}` (and any Settings colour path touched) — primary vs secondary colours match guidance; front build clean in `docker logs --since 10m pos-front`.
