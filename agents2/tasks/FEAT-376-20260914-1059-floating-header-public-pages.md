# Add floating header on public pages (#376)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/376
- **376**
- Related: https://github.com/satisfecho/pos/issues/364 (public nav/tabs — coordinate; do not duplicate two competing chrome systems)

## Problem / goal
Public pages such as `/book/1` lose branding and cross-links while the guest scrolls. Add a **floating / sticky header** that stays visible and shows tenant branding plus links to other public surfaces (menu, waitlist, delivery, loyalty as applicable).

## High-level instructions for coder
- Inspect public book / menu / waitlist / delivery shells and any existing public branding helpers (`docs/0028-tenant-public-branding.md`, `docs/0010` / `docs/0011` for booking).
- Add one sticky header pattern reused across the main public guest pages (at least `/book/{tenantId}`; extend to siblings where the same chrome fits).
- Header must stay visible while scrolling; include branding and clear links to other public pages for that tenant.
- Keep mobile usable (no huge overlap with form CTAs; respect safe areas). Prefer tenant branding over platform marketing chrome on tenant-scoped URLs.
- Align with #364 if nav/tabs land in the same pass — one coherent public chrome, not two stacked bars.
- i18n for new user-visible strings; check `docker logs --since 10m pos-front` after edits.
- Smoke: open `/book/1`, scroll the form, confirm header stays visible and links resolve; quick check of `/menu` or delivery public entry if touched.

## Acceptance criteria
- [ ] On `/book/{tenantId}` (and other public pages touched), a sticky header with branding remains visible while scrolling.
- [ ] Header links reach other relevant public pages for the same tenant.
- [ ] Mobile layout remains usable; no permanent cover of primary submit CTAs.
- [ ] Front build clean; no broken public booking smoke if booking UI changed.
