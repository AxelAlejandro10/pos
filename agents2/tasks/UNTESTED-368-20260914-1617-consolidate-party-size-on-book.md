# Consolidate Party size labels on `/book/`

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/368
- **368**

## Status
- **WIP → UNTESTED:** 2026-09-14T16:35:00Z
- Implemented: removed duplicate **Party size:** from `reservation-week-slot-grid` summary; form field label remains the single visible control name on `/book` and staff reservation modal.

## Problem / goal
On the public booking form (`/book/`), **Party size** appears twice with nearly the same wording (`Party size:` and `Party size`). That is redundant and confusing. Screenshots in the issue show both labels in the guest-count UI.

## High-level instructions for coder
- Open `/book/{tenantId}` (e.g. `/book/1`) and find both **Party size** labels in the party-size control.
- Keep **one** clear label (or accessible name) for the control. Remove the duplicate visible text.
- Check i18n keys for both strings; reuse one key or drop the unused key if nothing else references it.
- Keep behaviour the same (guest count still works; validation and submit unchanged).
- Smoke: `/book/1` shows a single party-size label; front build clean in `docker logs --since 10m pos-front`.

## What changed
- `front/src/app/shared/reservation-week-slot-grid.component.html`: drop `RESERVATIONS.PARTY_SIZE` from the week summary row (parent form already labels `#book-party` / `#res-modal-party`).
- `CHANGELOG.md`: Fixed entry for #368.
- Same i18n key still used for the form label, success screen, waitlist, etc. — no unused key to remove.

## Testing instructions

1. Confirm front build is clean: `docker logs --since 10m pos-front` — no `ERROR` / `Application bundle generation failed`.
2. Open `http://127.0.0.1:4202/book/1` (English UI).
3. In the booking form, confirm **exactly one** control label **Party size** (on the number input). The week-grid summary must **not** show a second **Party size:** line (Service / Date / Time slot may remain).
4. Change party size; confirm the calendar still reloads (capacity uses party size).
5. Optional: staff **Reservations** → New — same single **Party size** label above the grid, no duplicate in the summary.
6. Smoke: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front` (or `node front/scripts/debug-reservations-public.mjs` for a fuller book flow).
